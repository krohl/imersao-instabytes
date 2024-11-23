import express from "express";
import multer from "multer";
import { createPost, getPosts, updatePost, uploadImage } from "../controllers/postController.js";
import cors from "cors";

const corsOptions = {
    origin: 'http://localhost:8000',
    optionsSuccessStatus: 200
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

const uploads = multer({ dest: "./uploads", storage })

const routes = (app) => {
    app.use(express.json());
    app.use(cors(corsOptions));

    app.get('/posts', getPosts);

    app.post('/posts', createPost);

    app.post('/upload', uploads.single('image'), uploadImage);

    app.put('/upload/:id', updatePost);
}

export default routes;
