import { Injectable } from '@nestjs/common';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

@Injectable()
export class PasswordService {
  hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const digest = scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${digest}`;
  }

  comparePassword(password: string, storedHash: string): boolean {
    const [salt, digest] = storedHash.split(':');
    if (!salt || !digest) return false;
    const actual = Buffer.from(digest, 'hex');
    const expected = scryptSync(password, salt, actual.length);
    return timingSafeEqual(actual, expected);
  }

  validatePasswordStrength(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (password.length < 8) errors.push('Password must be at least 8 characters long.');
    if (!/[A-Z]/.test(password)) errors.push('Password must contain one uppercase letter.');
    if (!/[a-z]/.test(password)) errors.push('Password must contain one lowercase letter.');
    if (!/[0-9]/.test(password)) errors.push('Password must contain one number.');
    return { valid: errors.length === 0, errors };
  }
}
