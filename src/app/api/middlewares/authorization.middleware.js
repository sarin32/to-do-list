import { ForbiddenError } from '../../errors/index.js';

/**
 * authorization middleware which is aware of it's context
 * pass option of verification status required to get the dezired middleware behaviour
 * Can be enhanced in future for enhanced role based access
 */
export function authorizationMiddleware({ isVerified = true } = { isVerified: true }) {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.userId || req.user.isVerified != isVerified) {
        throw new ForbiddenError('You do not have access to this resource')
      }
      await next()
    } catch (error) {
      next(error)
    }
  }
}
