import { Router } from "express";
import {
  getSelfInfo,
  sendEmailForVerification,
  signIn,
  signUp,
  verifyEmailVerificationOTP,
} from '../controllers/user.controller.js';
import { tokenMiddleware } from "../middlewares/token.middleware.js";
import { authorizationMiddleware } from "../middlewares/authorization.middleware.js";

const nonVerifiedUserAuthMiddleware = authorizationMiddleware({ isVerified: false })
const verifiedUserAuthMiddleware = authorizationMiddleware()

const router = Router()

router.post(
  '/signup',
  signUp
);

router.post(
  '/signin',
  signIn
);

router.post(
  '/sendEmailForVerification',
  tokenMiddleware,
  nonVerifiedUserAuthMiddleware,
  sendEmailForVerification
);

router.post(
  '/verifyEmailVerificationOTP',
  tokenMiddleware,
  nonVerifiedUserAuthMiddleware,
  verifyEmailVerificationOTP
);

router.get(
  '/self',
  tokenMiddleware,
  verifiedUserAuthMiddleware,
  getSelfInfo
);

export default router;
