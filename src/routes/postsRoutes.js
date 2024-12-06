import cors from "cors";
import express from "express";
import multer from "multer";
import { deletePost, getPosts, updatePost, uploadImage } from "../controllers/postController.js";
import { getUserProfileInfo, login, setUserProfileImage } from "../controllers/usersController.js";
import authenticateToken from "../middleware/authMiddleware.js";

const corsOptions = {
    origin: ['http://localhost:8000', 'http://localhost:4200', 'https://frontend-instabytes.vercel.app'],
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

    app.get('/posts', authenticateToken, getPosts);

    app.delete('/posts/:id', authenticateToken, deletePost);

    app.post('/upload', authenticateToken, uploads.single('image'), uploadImage);

    app.put('/upload/:id', authenticateToken, updatePost);

    // app.post('/cadastrar', createUser);

    app.post('/login', login);

    app.get('/user/profile/info', authenticateToken, getUserProfileInfo);

    app.post('/user/profile/image', authenticateToken, uploads.single('image'), setUserProfileImage);
}

export default routes;
