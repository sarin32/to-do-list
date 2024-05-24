import { Collection, MongoClient } from 'mongodb';
import { DATABASE_TO_DO_LIST, DATABASE_SETTINGS } from '../config/index.js';

let client;

const createClient = () => {
  client = new MongoClient(DATABASE_SETTINGS.URL);
}

createClient()

export const startConnection = async () => {
  if (!client) {
    await client.connect();
  }
};

/**
 * 
 * @param {string} collectionName 
 * @returns {Collection}
 */
export const getCollection = collectionName => {
  return client.db(DATABASE_TO_DO_LIST).collection(collectionName);
};
