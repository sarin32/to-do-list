import { BaseError } from '../../errors/index.js';
import { HttpStatusCode } from '../../config/index.js';

/**
 * Error handling middleware for Express 
 */
export async function errorMiddleware(err, req, res, next) {
  try {
    console.error(err)
    const body = {};
    if (err instanceof BaseError) {
      res.status(err.statusCode);
      body.message = err.message;
      if (err.errorCode) {
        body.errorCode = err.errorCode;
      }
    } else {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR);
      body.message = 'Something went wrong';
    }
    res.json(body);
  } catch (error) {
    console.error('Error in error middleware :', error);
  }
}
