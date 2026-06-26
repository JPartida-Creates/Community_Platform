import { PasswordService } from './password.service';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(() => {
    service = new PasswordService();
  });

  it('hashes and verifies a password', () => {
    const hash = service.hashPassword('MySecure123!');
    expect(hash).toContain(':');
    expect(service.comparePassword('MySecure123!', hash)).toBe(true);
    expect(service.comparePassword('WrongPassword', hash)).toBe(false);
  });

  it('rejects weak passwords', () => {
    expect(service.validatePasswordStrength('short').valid).toBe(false);
    expect(service.validatePasswordStrength('nouppercase1!').valid).toBe(false);
    expect(service.validatePasswordStrength('NOLOWERCASE1!').valid).toBe(false);
    expect(service.validatePasswordStrength('NoNumber!').valid).toBe(false);
    expect(service.validatePasswordStrength('Valid1Pass').valid).toBe(true);
  });
});
