import { emailVerificationModel } from '../models.js';

export async function createEmailVerification({ email, otp, userId }) {
  const result = await emailVerificationModel.insertOne({
    userId,
    email,
    otp,
    lastSendTime: new Date(),
    verificationTry: 1,
  });

  if (!result.acknowledged) {
    throw new Error('Failed to create email verification');
  }

  return {
    id: result.insertedId,
  };
}

export async function getEmailVerification({ userId }) {
  const query = { userId };
  return await emailVerificationModel.findOne(query);
}

export async function updateVerificationById({ id, incrementVerificationTry, otp }) {
  const query = { _id: id };
  const update = {};

  if (incrementVerificationTry) {
    update.$inc = { verificationTry: 1 };
  }

  const set = {};
  if (otp) {
    set.otp = otp;
  }
  set.lastSendTime = new Date();
  update.$set = set;

  const result = await emailVerificationModel.updateOne(query, update);

  if (!result.acknowledged) throw new Error('Failed to update verification');
  if (result.modifiedCount < 1) throw new Error('Failed to update verification');
}
