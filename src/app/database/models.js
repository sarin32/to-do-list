import { COLLECTION_EMAIL_VERIFICATIONS, COLLECTION_USERS } from '../config/index.js';
import { getCollection } from './connection.js';

export const userModel = getCollection(COLLECTION_USERS);

export const emailVerificationModel = getCollection(COLLECTION_EMAIL_VERIFICATIONS);
