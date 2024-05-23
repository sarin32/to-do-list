import { AuthorizationError, BadRequestError } from '../../errors/index.js';
import { validateSignature, objectId } from '../../utils/index.js';

export async function tokenMiddleware(req, res, next) {
  try {

    const authToken = req.headers['authorization'];
    if (!authToken)
      throw new BadRequestError('Authorization header is not found');

    const token = authToken.split(' ').at(1);
    if (!token) throw new BadRequestError('Authorization header is invalid');

    const { invalidToken, payload, tokenExpired } = await validateSignature(token);

    if (tokenExpired) {
      throw new AuthorizationError('Authorization token expired');
    }

    if (invalidToken || !payload) {
      throw new AuthorizationError('Invalid Authorization token');
    }

    // Assert payload type to JwtPayload
    const { userId, isVerified } = payload;
    if (!userId || isVerified == undefined) {
      throw new AuthorizationError(
        'Invalid token payload'
      );
    }

    req.user = {
      userId: objectId(userId),
      isVerified
    };
    await next()
  } catch (error) {
    next(error)
  }

}
