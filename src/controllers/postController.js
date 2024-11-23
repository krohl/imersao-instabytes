import fs from "fs";
import PostsModel from "../models/postsModel.js";
import { generateDescriptionWithGemini } from "../services/geminiService.js";

export async function getPosts(req, res) {
    const model = new PostsModel();
    res.status(200).json(await model.getPosts());
}

export async function createPost(req, res) {
    const post = req.body;
    try {
        const model = new PostsModel();
        const response = await model.createPost(post);
        res.status(201).json(response);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Error creating post!" });
    }
}

export async function uploadImage(req, res) {
    try {
        const extArray = req.file.mimetype.split("/");
        const extension = extArray[extArray.length - 1];

        const post = { description: '', image_url: req.file.originalname, alt: '', ext: extension };
        const model = new PostsModel();
        const response = await model.createPost(post);

        const img = `uploads/${response.insertedId}.${extension}`;
        fs.renameSync(req.file.path, img);

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
        const url = `http://localhost:3000/${id}.${ext}`;
        const description = await generateDescriptionWithGemini(fs.readFileSync(`uploads/${id}.${ext}`));
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
