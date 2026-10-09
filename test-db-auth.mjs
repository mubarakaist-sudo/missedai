import assert from 'node:assert';
import {
  saveUserToDatabase,
  verifyUserCredentials,
  normalizePhone,
} from './src/utils/userDatabase.ts';

// Mock localStorage for node environment test
const storage = new Map();
globalThis.localStorage = {
  getItem: (key) => storage.get(key) || null,
  setItem: (key, val) => storage.set(key, String(val)),
  removeItem: (key) => storage.delete(key),
  clear: () => storage.clear(),
};

console.log('Testing User Database & Credential Verification...');

// 1. Phone Normalization
assert.strictEqual(normalizePhone('+1', '(555) 234-5678'), '+15552345678');
assert.strictEqual(normalizePhone('+91', '98765 43210'), '+919876543210');
console.log('✓ Phone normalization verified');

// 2. Sign Up: Save user with password
const newUser = {
  name: 'Sara Connor',
  countryCode: '+1',
  phoneNumber: '(415) 555-0199',
  fullPhoneNumber: '+1 (415) 555-0199',
  isWhatsAppVerified: true,
  aliases: ['Sara', 'Sara Connor', '@sara'],
};

const saved = saveUserToDatabase(newUser, 'StrongPass88!');
assert(saved.id, 'User must have an ID');
assert.strictEqual(saved.name, 'Sara Connor');
assert.strictEqual(saved.passwordHash, 'StrongPass88!');
console.log('✓ User saved to database');

// 3. Login Attempt 1: Non-existent phone number
const notFoundAttempt = verifyUserCredentials('+1', '(999) 000-0000', 'StrongPass88!');
assert.strictEqual(notFoundAttempt.success, false, 'Non-existent user must fail login');
assert(notFoundAttempt.error.includes('No account found'), 'Error should specify account not found');
console.log('✓ Non-existent account properly rejected:', notFoundAttempt.error);

// 4. Login Attempt 2: Correct phone, INCORRECT password
const wrongPassAttempt = verifyUserCredentials('+1', '(415) 555-0199', 'WrongPassword123');
assert.strictEqual(wrongPassAttempt.success, false, 'Incorrect password must fail login');
assert(wrongPassAttempt.error.includes('Incorrect password'), 'Error should specify incorrect password');
console.log('✓ Incorrect password properly rejected:', wrongPassAttempt.error);

// 5. Login Attempt 3: Correct phone, CORRECT password
const validAttempt = verifyUserCredentials('+1', '(415) 555-0199', 'StrongPass88!');
assert.strictEqual(validAttempt.success, true, 'Valid credentials must succeed');
assert.strictEqual(validAttempt.user.name, 'Sara Connor', 'Should return authenticated user profile');
console.log('✓ Valid login granted access to user profile:', validAttempt.user.name);

console.log('\n🎉 ALL USER DATABASE & AUTHENTICATION TESTS PASSED!');
