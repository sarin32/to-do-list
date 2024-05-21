import jwt from 'jsonwebtoken';
import { SECRET_TOKEN } from '../config/index.js';

/**
 * Generates a JWT token.
 */
export function generateSignature(payload, expiresIn) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, SECRET_TOKEN, { expiresIn }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
}

/**
 * Validates a JWT token.
 */
export function validateSignature(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET_TOKEN, (err, payload) => {
      if (err) {
        if (err instanceof jwt.TokenExpiredError) {
          resolve({ tokenExpired: true });
        } else if (err instanceof jwt.JsonWebTokenError) {
          resolve({ invalidToken: true });
        } else {
          reject(err);
        }
      } else {
        resolve({ payload });
      }
    });
  });
}
