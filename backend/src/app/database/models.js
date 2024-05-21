import { COLLECTION_EMAIL_VERIFICATIONS, COLLECTION_USERS } from '../config';
import { getCollection } from './connection.js';


export const userModel = getCollection(COLLECTION_USERS);

export const emailVerificationModal = getCollection(COLLECTION_EMAIL_VERIFICATIONS);
