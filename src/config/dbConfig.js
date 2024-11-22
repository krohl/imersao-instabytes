import { MongoClient } from 'mongodb';

async function connectDb(uri) {
    let mongoClient;

    try {
        mongoClient = new MongoClient(uri);
        console.log('Conectando ao cluster do banco de dados...');
        await mongoClient.connect();
        console.log('Conectado ao MongoDB Atlas com sucesso!');

        return mongoClient;
    } catch (erro) {
        console.error('Falha na conexão com o banco!', erro);
        process.exit();
    }
}

const connection = await connectDb(process.env.DB_URI);
export default connection;
