import { MongoClient } from 'mongodb';
import config from '../config/config';

const mongoClient = new MongoClient(config.CNX_STRING);
await mongoClient.connect();

export const mongoDatabase = mongoClient.db(config.DB_NAME)
