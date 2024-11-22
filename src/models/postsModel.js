import 'dotenv/config';
import { ObjectId } from "mongodb";
import connection from "../config/dbConfig.js";

export default class PostsModel {
    async getPosts() {
        const db = connection.db('instabytes');
        const collection = db.collection('posts');

        return collection.find().toArray();
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
}
