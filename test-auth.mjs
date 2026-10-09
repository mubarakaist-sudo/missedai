import assert from 'node:assert';

console.log('Testing MissedIt AI WhatsApp Authentication & Password Validation...');

// 1. Phone number validation
function isValidPhoneNumber(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

assert(isValidPhoneNumber('(650) 492-8819'), 'Valid US phone should pass');
assert(isValidPhoneNumber('+91 9876543210'), 'Valid Indian phone should pass');
assert(!isValidPhoneNumber('123'), 'Too short phone number should fail');
console.log('✓ Phone number validation passed');

// 2. OTP format validation (6 digits)
function isValidOtp(otp) {
  return /^\d{6}$/.test(otp);
}

assert(isValidOtp('739482'), '6-digit OTP should be valid');
assert(!isValidOtp('12345'), '5-digit OTP should be invalid');
assert(!isValidOtp('abcdef'), 'Non-numeric OTP should be invalid');
console.log('✓ WhatsApp OTP format validation passed');

// 3. Password requirements (must contain at least 8 characters)
function validatePassword(password, confirmPassword) {
  const isLengthValid = password.length >= 8;
  const isMatching = password === confirmPassword && confirmPassword.length > 0;
  const hasLetterAndNumber = /[A-Za-z]/.test(password) && /\d/.test(password);
  return {
    isValid: isLengthValid && isMatching,
    isLengthValid,
    isMatching,
    hasLetterAndNumber,
  };
}

assert(!validatePassword('short7', 'short7').isLengthValid, 'Password < 8 characters must fail');
assert(validatePassword('secret123', 'secret123').isLengthValid, 'Password >= 8 characters must pass length check');
assert(validatePassword('secret123', 'secret123').isValid, 'Matching >= 8 char password must be valid');
assert(!validatePassword('secret123', 'different456').isMatching, 'Mismatched passwords must fail');
console.log('✓ Password length (>= 8 characters) and matching validation passed');

console.log('\n🎉 ALL AUTHENTICATION UNIT TESTS PASSED!');
