import jwt from 'jsonwebtoken';
import { SECRET_TOKEN } from '../config/index.js';

/**
 * Generates a JWT token.
 * 
 * @param {object} payload - The payload to encode in the token.
 * @param {number} expiresIn - The expiration time in seconds.
 * @returns {Promise<string>} - The generated token.
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
 * 
 * @param {string} token - The token to validate.
 * @returns {Promise<object>} - The decoded payload if valid, or an object indicating the error type.
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
