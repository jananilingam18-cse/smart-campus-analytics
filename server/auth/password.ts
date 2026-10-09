import crypto from 'node:crypto';

const KEY_LENGTH = 64;

export function hashPassword(password: string, providedSalt?: string): { hash: string; salt: string } {
  const salt = providedSalt || crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, KEY_LENGTH);
  return {
    hash: derivedKey.toString('hex'),
    salt
  };
}

export function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  const derivedKey = crypto.scryptSync(password, salt, KEY_LENGTH);
  const hashBuffer = Buffer.from(storedHash, 'hex');
  const derivedBuffer = derivedKey;
  if (hashBuffer.length !== derivedBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(hashBuffer, derivedBuffer);
}
