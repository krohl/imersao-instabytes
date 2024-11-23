import fs from "fs";
import PostsModel from "../models/postsModel.js";
import generateDescriptionWithGemini from "../services/geminiService.js";

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
    const post = { description: '', image_url: req.file.originalname, alt: '' };
    try {
        const model = new PostsModel();
        const response = await model.createPost(post);
        const img = `uploads/${response.insertedId}.png`;
        fs.renameSync(req.file.path, img);
        res.status(201).json(response);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Error creating post!" });
    }
}

export async function updatePost(req, res) {
    const id = req.params.id;
    const url = `https://imersao-instabytes-222262699991.southamerica-east1.run.app/${id}.png`;
    try {
        const post = {
            description: await generateDescriptionWithGemini(fs.readFileSync(`uploads/${id}.png`)),
            image_url: url,
            alt: req.body.alt
        };
        const model = new PostsModel();
        const response = await model.updatePost(id, post);
        res.status(201).json(response);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Error creating post!" });
    }
}
