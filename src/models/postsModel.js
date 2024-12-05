import 'dotenv/config';
import { ObjectId } from "mongodb";
import connection from "../config/dbConfig.js";

export default class PostsModel {
    async getPosts() {
        const db = connection.db('instabytes');
        const collection = db.collection('posts');

        return collection.find().toArray();
    }

    async getPost(id) {
        const db = connection.db('instabytes');
        const collection = db.collection('posts');

        const objId = ObjectId.createFromHexString(id);
        return collection.findOne({ _id: objId });
    }

    async getPostsByUser(userId) {
        const db = connection.db('instabytes');
        const collection = db.collection('posts');

        return collection.find({ user_id: userId }).toArray();
    }

    async createPost(post) {
        const db = connection.db('instabytes');
        const collection = db.collection('posts');

        return collection.insertOne(post);
    }

    async updatePost(id, post) {
        const db = connection.db('instabytes');
        const collection = db.collection('posts');
        const objId = ObjectId.createFromHexString(id);
        return collection.updateOne({ _id: objId }, { $set: post });
    }

    async deletePost(id) {
        const db = connection.db('instabytes');
        const collection = db.collection('posts');
        const objId = ObjectId.createFromHexString(id);
        return collection.deleteOne({ _id: new ObjectId(objId) });
    }
}
