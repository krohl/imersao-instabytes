import argon2 from 'argon2';
import fs from "fs";
import UsersModel from '../models/usersModel.js';
import generateToken from '../services/jwtService.js';
import StorageService from '../services/storageService.js';

export async function createUser(req, res) {
    try {
        const user = await new UsersModel().getUserByEmail(req.body.email);
        if (user) {
            res.status(409).json({ message: "Error creating user!" });
            return;
        }
        const hashedPassword = await argon2.hash(req.body.password, { secret: Buffer.from(process.env.SECRET) });
        const userData = {
            email: req.body.email,
            password: hashedPassword,
        };

        const response = await new UsersModel().createUser(userData);

        res.status(200).json(response);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            message: err.message,
        });
    }
};

export async function login(req, res) {
    try {
        const user = await new UsersModel().getUserByEmail(req.body.email);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const validPassword = await argon2.verify(user.password, req.body.password, { secret: Buffer.from(process.env.SECRET) });
        if (!validPassword) {
            res.status(401).json({ message: "Invalid password" });
            return;
        }

        const token = generateToken(user);
        res.status(200).json({ token });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            message: err.message,
        });
    }
}


export async function getUserProfileImage(req, res) {
    try {
        const storageService = new StorageService();
        const file = storageService.getFile(`${req.user.id}/logo.png`);
        const [fileExists] = await file.exists();

        const url = fileExists ? await storageService.getUrl('logo.png', req.user.id) : null;
        res.status(200).json({ url });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            message: err.message,
        });
    }
}


export async function setUserProfileImage(req, res) {
    try {
        const storageService = new StorageService();
        await storageService.uploadFile(req.file.path, `${req.user.id}/logo.png`);

        fs.unlink(req.file.path, (err) => { });

        res.status(200).json({ ok: true });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            message: err.message,
        });
    }
}
