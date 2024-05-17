import { MongoClient } from 'mongodb';
//TODO implement config files
const CNX_STRING = 'mongodb+srv://backend:AWeUVAgL9PnmDmA7@cluster0.xemdnuj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'ADI'
const mongoClient = new MongoClient(CNX_STRING);
await mongoClient.connect();

export const mongoDatabase = mongoClient.db(DB_NAME)
