import fs from "fs";
import PostsModel from "../models/postsModel.js";
import { generateDescriptionWithGemini } from "../services/geminiService.js";
import StorageService from "../services/storageService.js";

export async function getPosts(req, res) {
    const storageService = new StorageService();
    const model = new PostsModel();
    const posts = await model.getPostsByUser(req.user.id);

    for (const post of posts) {
        const fileName = `${post._id.toHexString()}.${post.ext}`;
        post.image_url = await storageService.getUrl(fileName, req.user.id);
    };

    res.status(200).json(posts);
}

export async function uploadImage(req, res) {
    try {
        const extArray = req.file.mimetype.split("/");
        const extension = extArray[extArray.length - 1];

        let post = { description: '', image_url: req.file.originalname, alt: '', ext: extension, user_id: req.user.id };
        const model = new PostsModel();
        const response = await model.createPost(post);
        const fileName = `${response.insertedId}.${extension}`;

        const storageService = new StorageService();
        await storageService.uploadFile(req.file.path, `${req.user.id}/${fileName}`);

        const id = response.insertedId;

        const url = `${id}.${extension}`;
        const description = req.body.description || await generateDescriptionWithGemini(fs.readFileSync(req.file.path));
        post = {
            description: description,
            image_url: url,
            alt: description,
        };
        await model.updatePost(id.toHexString(), post);

        fs.unlink(req.file.path, (err) => { });

        res.status(201).json(response);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Error creating post!" });
    }
}

export async function updatePost(req, res) {
    try {
        const model = new PostsModel();
        const id = req.params.id;

        const ext = (await model.getPost(id)).ext;
        const url = `${id}.${ext}`;
        const description = req.body.description || await generateDescriptionWithGemini(fs.readFileSync(`uploads/${id}.${ext}`));
        const post = {
            description: description,
            image_url: url,
            alt: description,
        };
        const response = await model.updatePost(id, post);
        res.status(201).json(response);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Error updating post!" });
    }
}

export async function deletePost(req, res) {
    try {
        const model = new PostsModel();
        const id = req.params.id;
        const ext = (await model.getPost(id)).ext;
        const response = await model.deletePost(id);

        const storageService = new StorageService();
        await storageService.deleteFile(`${req.user.id}/${id}.${ext}`);

        res.status(201).json(response);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Error deleting post!" });
    }
}
