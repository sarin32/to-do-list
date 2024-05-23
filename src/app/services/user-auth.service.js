import {
  LOGIN_TOKEN_LIFETIME,
} from '../config/index.js';
import { userRepository } from '../database/index.js';
import { AuthorizationError, ConflictError } from '../errors/index.js';
import {
  hashPassword,
  validatePassword,
  generateSignature,
} from '../utils/index.js';


export async function signup({ email, name, password }) {
  const hashedPassword = await hashPassword(password);

  const isUserExists = await userRepository.isUserExistsWithEmail({ email });
  if (isUserExists) throw new ConflictError('An account with this email id already exists');

  const { id } = await userRepository.createUser({
    email,
    name,
    password: hashedPassword,
  });

  return {
    userId: id,
    token: await generateLoginToken({ isVerified: false, userId: id }),
  };
}


export async function signIn({ email, password }) {
  const user = await userRepository.findUserByEmail({ email });
  if (!user) throw new AuthorizationError('Invalid Credentials');

  const isValidPassword = await validatePassword(
    password,
    user.password,
  );
  if (!isValidPassword) throw new AuthorizationError('Invalid Credentials');

  return {
    userId: user._id,
    token: await generateLoginToken({
      isVerified: true,
      userId: user._id,
    }),
  };
}

export async function generateLoginToken({ isVerified, userId }) {
  const payload = {
    userId,
    isVerified,
  };
  const token = await generateSignature(payload, LOGIN_TOKEN_LIFETIME);
  return `Bearer ${token}`;
}
