import { userRepository } from '../database/index.js';

export async function getUserInfo({ userId }) {
  const user = await userRepository.findUserById({ id: userId });

  if (!user) throw new Error('Invalid user id');

  return user;
}

export async function markUserAsVerified({ userId }) {
  await userRepository.markUserAsVerified({
    userId,
  });
}
