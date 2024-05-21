/**
 * Generates a random string.
 */
export function generateRandomString(length, options = {includeChars:false,includeNumbers:false,includeSpecialChars:false}) {
  let characters = '';

  if (options.includeNumbers) {
    characters += '0123456789';
  }

  if (options.includeChars) {
    characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  }

  if (options.includeSpecialChars) {
    characters += '!@#$%^&*()-=_+[]{}|;:\'",.<>?/`~';
  }

  if (characters.length === 0) {
    throw new Error('At least one character set should be included.');
  }

  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result;
}

