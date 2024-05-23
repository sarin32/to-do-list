import {
  VERIFICATION_MAX_RESEND_INTERVAL,
  VERIFICATION_MAX_TRIES,
} from '../config/index.js';
import { emailVerificationRepository } from '../database/index.js';
import { AuthorizationError, ConflictError, ForbiddenError } from '../errors/index.js';
import { generateRandomString, generateTemplate, emailUtil } from '../utils/index.js';
import * as userAuthService from './user-auth.service.js'
import * as userService from './user.service.js'

export async function sendEmailForVerification({ userId }) {
  const user = await userService.getUserInfo({ userId });

  const existingVerification = await emailVerificationRepository.getEmailVerification({
    userId: user._id,
  });

  if (existingVerification) {
    const timeSinceLastSend = Date.now() - existingVerification.lastSendTime.getTime();

    if (timeSinceLastSend < VERIFICATION_MAX_RESEND_INTERVAL) {
      throw new ForbiddenError(
        `Resend request is not allowed within ${VERIFICATION_MAX_RESEND_INTERVAL} seconds of the previous request`
      );
    }

    if (existingVerification.verificationTry >= VERIFICATION_MAX_TRIES) {
      throw new ForbiddenError(
        'Email verification tries have been exhausted'
      );
    }

    await emailVerificationRepository.updateVerificationById({
      id: existingVerification._id,
      incrementVerificationTry: true,
    });

    await sendEmailVerificationEmail({
      emailId: user.email,
      otp: existingVerification.otp,
    });
  } else {
    const otp = generateRandomString(6, { includeNumbers: true });

    await emailVerificationRepository.createEmailVerification({
      email: user.email,
      otp,
      userId: user._id,
    });

    await sendEmailVerificationEmail({
      emailId: user.email,
      otp,
    });
  }
}

export async function verifyEmailVerificationOTP({ otp, userId }) {
  const verification = await emailVerificationRepository.getEmailVerification({
    userId,
  });

  if (!verification)
    throw new ConflictError('No verification process has been initiated');

  if (verification.otp !== otp) throw new AuthorizationError('Invalid OTP');

  await userService.markUserAsVerified({ userId });

  return {
    userId: userId,
    token: await userAuthService.generateLoginToken({
      isVerified: true,
      userId: userId,
    }),
  };
}

export async function sendEmailVerificationEmail({ otp, emailId }) {
  const body = await generateTemplate('email-verification', { otp });
  await emailUtil.sendEmail({
    to: emailId,
    subject: 'OTP for your email verification',
    html: body,
    senderName: 'ClearList ADMIN',
  });
}
