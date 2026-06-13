import { describe, expect, it } from 'vitest';
import { validateEmail, validateForm, validatePassword } from './validators';

describe('validators', () => {
  it('accepts valid email addresses and rejects invalid email addresses', () => {
    expect(validateEmail('student@example.com')).toBe(true);
    expect(validateEmail('anas.zamir@university.edu')).toBe(true);

    expect(validateEmail('student')).toBe(false);
    expect(validateEmail('student@')).toBe(false);
    expect(validateEmail('student example@example.com')).toBe(false);
  });

  it('checks password length at the six-character boundary', () => {
    expect(validatePassword('12345')).toBe(false);
    expect(validatePassword('123456')).toBe(true);
  });

  it('returns field-level errors for required and invalid form data', () => {
    const errors = validateForm(
      { name: ' ', email: 'wrong-email', password: '123' },
      ['name', 'email', 'password'],
    );

    expect(errors).toEqual({
      name: 'name is required',
      email: 'Invalid email format',
      password: 'Password must be at least 6 characters',
    });
  });
});
