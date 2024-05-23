import {
  emailSchema,
  objectSchema,
  stringSchema,
  validateObject,
} from '../../utils/index.js';
import { BadRequestError } from '../../errors/index.js';
import { userService, emailVerificationService, userAuthService } from '../../services/index.js';

const signUpSchema = objectSchema({
  object: {
    name: stringSchema({ min: 3, max: 20 }),
    email: emailSchema(),
    password: stringSchema({ min: 6, max: 30 }),
  },
});

const signInSchema = objectSchema({
  object: {
    email: emailSchema(),
    password: stringSchema({ min: 6, max: 30 }),
  },
});

const verifyEmailVerificationOTPSchema = objectSchema({
  object: {
    otp: stringSchema({ min: 6, max: 6 }),
  },
});

export async function signUp(req, res, next) {
  try {
    const { error, value } = validateObject(signUpSchema, req.body);

    if (error) throw new BadRequestError(error.message);

    const { name, email, password } = value;
    const result = await userAuthService.signup({ name, email, password });
    res.json(result);

  } catch (error) {
    next(error)
  }
}

export async function signIn(req, res, next) {
  try {
    const { error, value } = validateObject(signInSchema, req.body);

    if (error) throw new BadRequestError(error.message);

    const { email, password } = value;
    const result = await userAuthService.signIn({ email, password });
    res.json(result);

  } catch (error) {
    next(error)

  }
}

export async function sendEmailForVerification(req, res, next) {
  try {

    const { userId } = req.user;

    const result = await emailVerificationService.sendEmailForVerification({ userId });
    res.json(result);
  } catch (error) {
    next(error)

  }
}

export async function verifyEmailVerificationOTP(req, res, next) {
  try {
    const { error, value } = validateObject(verifyEmailVerificationOTPSchema, req.body);

    if (error) throw new BadRequestError(error.message);

    const { userId } = req.user;
    const { otp } = value;
    const result = await emailVerificationService.verifyEmailVerificationOTP({ userId, otp });
    res.json(result);

  } catch (error) {
    next(error)
  }
}

export async function getSelfInfo(req, res, next) {
  try {
    const { userId } = req.user;
    const result = await userService.getUserInfo({ userId });
    res.json(result);

  } catch (error) {
    next(error)

  }
}
