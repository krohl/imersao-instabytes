import connection from "../config/dbConfig.js";
import { ObjectId } from "mongodb";

export default class UsersModel {
    async createUser(user) {
        const db = connection.db('instabytes');
        const collection = db.collection('users');
        return collection.insertOne(user);
    }

    async getUserByEmail(email) {
        const db = connection.db('instabytes');
        const collection = db.collection('users');
        return collection.findOne({ email: email });
    }

    async getUserById(id) {
        const db = connection.db('instabytes');
        const collection = db.collection('users');
        const objId = ObjectId.createFromHexString(id);
        return collection.findOne({ _id: objId });
    }
}
