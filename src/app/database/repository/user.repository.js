import { userModel } from "../models.js";

export async function createUser({ email, name, password }) {
  const result = await userModel.insertOne({
    email,
    name,
    password,
    createdAt: new Date(),
    isVerified: false,
  });

  if (!result.acknowledged) {
    throw new Error('Failed to create user');
  }

  return {
    id: result.insertedId,
  };
}

export async function findUserByEmail({ email }) {
  const result = await userModel.findOne({ email, isVerified: true });
  return result;
}


export async function isUserExistsWithEmail({ email }) {
  const result = await userModel.findOne(
    { email, isVerified: true },
    { projection: { _id: 1 } }
  );
  return Boolean(result);
}

export async function findUserById({ id }) {
  const result = await userModel.findOne(
    { _id: id },
    { projection: { password: 0 } }
  );
  return result;
}

export async function markUserAsVerified({ userId }) {
  const response = await userModel.updateOne(
    { _id: userId },
    { $set: { isVerified: true } }
  );

  if (!response.acknowledged || response.modifiedCount !== 1) {
    throw new Error('Failed to update user data');
  }
}
