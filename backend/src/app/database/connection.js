import { MongoClient } from 'mongodb';
import { DATABASE_TO_DO_LIST, DATABASE_SETTINGS } from '../config/index.js';

let client;

export const startConnection = async () => {
  if (!client) {
    client = new MongoClient(DATABASE_SETTINGS.URL, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
  }
};

export const getCollection = (collectionName) => {
  if (!client) {
    throw new Error("Client is not connected. Please call startConnection first.");
  }
  return client.db(DATABASE_TO_DO_LIST).collection(collectionName);
};

