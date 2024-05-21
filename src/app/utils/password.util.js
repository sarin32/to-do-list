import bcrypt from 'bcrypt';

/**
 * Generates a salt for hashing.
 */
async function generateSalt() {
  return await bcrypt.genSalt();
}

/**
 * Hashes a password with a given salt.
 */
export async function hashPassword(password) {
  return await bcrypt.hash(password, await generateSalt());
}

/**
 * Validates a password against a saved hash.
 */
export async function validatePassword(enteredPassword, savedPassword) {
  return await bcrypt.compare(enteredPassword, savedPassword);
}
