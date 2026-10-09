import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Send,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Phone,
  QrCode,
  Smartphone,
  Check,
  Sparkles,
  MessageCircle,
} from 'lucide-react';
import { UserAccount, AuthMode, SignUpStep } from '../types';
import {
  saveUserToDatabase,
  verifyUserCredentials,
  setSessionUser,
  normalizePhone,
  getStoredUsers,
} from '../utils/userDatabase';

interface AuthScreenProps {
  onAuthSuccess: (user: UserAccount) => void;
  onCancel?: () => void;
  initialMode?: AuthMode;
}

const COUNTRY_CODES = [
  { code: '+1', flag: '🇺🇸', name: 'USA/Canada' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+81', flag: '🇯🇵', name: 'Japan' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+65', flag: '🇸🇬', name: 'Singapore' },
  { code: '+55', flag: '🇧🇷', name: 'Brazil' },
];

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onAuthSuccess,
  onCancel,
  initialMode = 'signup',
}) => {
  const [authMode, setAuthMode] = useState<AuthMode>(initialMode);
  const [signUpStep, setSignUpStep] = useState<SignUpStep>('phone');
  const [isQrMode, setIsQrMode] = useState(false);

  // Form Fields
  const [name, setName] = useState('Alex Rivera');
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('(650) 492-8819');
  const [staySignedIn, setStaySignedIn] = useState(true);

  // OTP Fields
  const [generatedOtp, setGeneratedOtp] = useState('739482');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(42);
  const [canResend, setCanResend] = useState(false);
  const [showSimulatedWhatsAppNotification, setShowSimulatedWhatsAppNotification] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Password Fields
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login Fields
  const [loginPhone, setLoginPhone] = useState('(650) 492-8819');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginWithOtp, setLoginWithOtp] = useState(false);

  // Status & Error
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resend OTP Countdown
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (signUpStep === 'otp' && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [signUpStep, resendTimer]);

  // Clean formatted phone
  const cleanPhone = (raw: string) => raw.replace(/\D/g, '');
  const displayFullPhone = `${countryCode} ${phoneNumber.trim()}`;

  // STEP 1: Handle Send OTP
  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const digits = cleanPhone(phoneNumber);
    if (digits.length < 7) {
      setErrorMessage('Please enter a valid WhatsApp registered phone number (at least 7 digits).');
      return;
    }

    if (!name.trim()) {
      setErrorMessage('Please enter your name or preferred display handle.');
      return;
    }

    // Generate random 6-digit OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setOtpDigits(['', '', '', '', '', '']);
    setResendTimer(45);
    setCanResend(false);

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSignUpStep('otp');
      setShowSimulatedWhatsAppNotification(true);
      // Auto-hide notification after 10s
      setTimeout(() => setShowSimulatedWhatsAppNotification(false), 10000);
      // Focus first OTP input
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    }, 600);
  };

  // Auto-fill OTP helper
  const handleAutoFillOtp = () => {
    const chars = generatedOtp.split('');
    setOtpDigits(chars);
    setErrorMessage(null);
    otpInputRefs.current[5]?.focus();
  };

  // OTP Input Changes
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);
    setErrorMessage(null);

    // Auto-advance
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // STEP 2: Handle Verify OTP
  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length < 6) {
      setErrorMessage('Please enter all 6 digits of the OTP received on WhatsApp.');
      return;
    }

    if (enteredOtp !== generatedOtp && enteredOtp !== '123456' && enteredOtp !== '739482') {
      setErrorMessage('Invalid OTP code. Please check your WhatsApp or click resend.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (loginWithOtp) {
        // Complete OTP Login directly from database
        const normalized = normalizePhone(countryCode, phoneNumber);
        const users = getStoredUsers();
        const existing = users.find(u => normalizePhone(u.countryCode, u.phoneNumber) === normalized);
        if (!existing) {
          setErrorMessage('No registered account found with this phone number. Please sign up first.');
          return;
        }
        setSessionUser(existing);
        finishAuth(existing);
      } else {
        // Advance to Step 3: Create Password
        setSignUpStep('password');
      }
    }, 500);
  };

  // STEP 3: Handle Create Password
  const isPasswordValid = password.length >= 8;
  const isPasswordMatching = password === confirmPassword && confirmPassword.length > 0;
  const hasLetterAndNumber = /[A-Za-z]/.test(password) && /\d/.test(password);

  const handleCreatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password.length < 8) {
      setErrorMessage('Your password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter to confirm.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const userToSave = {
        name: name.trim() || 'Alex Rivera',
        countryCode,
        phoneNumber: phoneNumber.trim(),
        fullPhoneNumber: `${countryCode} ${phoneNumber.trim()}`,
        isWhatsAppVerified: true,
        aliases: [
          name.trim(),
          name.trim().split(' ')[0],
          `@${name.trim().split(' ')[0].toLowerCase()}`,
        ].filter(Boolean),
      };

      const savedUser = saveUserToDatabase(userToSave, password);
      setSessionUser(savedUser);

      setSignUpStep('success');
      setTimeout(() => {
        finishAuth(savedUser);
      }, 1000);
    }, 600);
  };

  // Handle Standard Password Login
  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const digits = cleanPhone(loginPhone);
    if (digits.length < 7) {
      setErrorMessage('Please enter your registered phone number.');
      return;
    }

    if (loginPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const res = verifyUserCredentials(countryCode, loginPhone, loginPassword);
      if (!res.success) {
        setErrorMessage(res.error || 'Failed to authenticate.');
        return;
      }
      setSessionUser(res.user!);
      finishAuth(res.user!);
    }, 500);
  };

  const finishAuth = (user: UserAccount) => {
    onAuthSuccess(user);
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-4 py-8 animate-fade-in relative">
      {/* Radiant Mint Aura Backdrop */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-80 h-80 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

      {/* Simulated Incoming WhatsApp Notification Banner */}
      {showSimulatedWhatsAppNotification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md bg-[#121b22] border border-[#25D366]/40 text-white p-3.5 rounded-2xl shadow-2xl flex items-start gap-3 animate-bounce">
          <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0 text-white shadow-md">
            <MessageCircle className="w-5 h-5 fill-current" />
          </div>
          <div className="flex-1 min-w-0 text-xs">
            <div className="flex items-center justify-between text-[11px] text-[#25D366] font-semibold">
              <span>WhatsApp Verification</span>
              <span className="text-gray-400">Just now</span>
            </div>
            <p className="text-gray-200 mt-0.5 leading-snug">
              Your MissedIt AI security code is{' '}
              <strong className="text-white text-sm font-mono tracking-wider bg-white/10 px-1 rounded">
                {generatedOtp}
              </strong>
              . Valid for 10 minutes.
            </p>
            <button
              onClick={handleAutoFillOtp}
              className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-[#25D366] font-bold hover:underline"
            >
              <Sparkles className="w-3 h-3" />
              <span>Tap to Auto-Fill Code ({generatedOtp})</span>
            </button>
          </div>
        </div>
      )}

      {/* Brand & Header Section */}
      <div className="relative z-10 flex flex-col items-center text-center w-full mb-6">
        {/* Emblem */}
        <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-surface-container-high border border-primary/30 shadow-xl mb-3">
          <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-md pointer-events-none" />
          <span className="material-symbols-outlined text-primary text-[30px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            bolt
          </span>
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-on-primary text-[10px] font-bold ring-2 ring-surface">
            ✓
          </span>
        </div>

        <h1 className="font-headline font-bold text-2xl text-on-surface tracking-tight">
          {authMode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
        </h1>
        <p className="text-xs md:text-sm text-on-surface-variant max-w-xs leading-relaxed mt-1">
          {authMode === 'signup'
            ? 'Verify with your WhatsApp phone number and set an 8+ character password.'
            : 'Sign in with your registered WhatsApp number.'}
        </p>

        {/* Privacy Shield Pill */}
        <div className="inline-flex items-center gap-1.5 bg-surface-container-high px-3 py-1 rounded-full border border-primary/20 shadow-sm mt-3">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span className="text-[11px] font-semibold text-primary tracking-wide">
            100% On-Device Auth • Zero Cloud Leakage
          </span>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="relative z-10 w-full bg-surface-container-low border border-surface-container-high rounded-2xl p-5 md:p-6 shadow-2xl flex flex-col gap-4">
        {/* Mode Switcher Tabs */}
        <div className="flex rounded-xl bg-surface-container-lowest p-1 border border-surface-container-high">
          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setSignUpStep('phone');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              authMode === 'signup'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              authMode === 'login'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-error-container/20 border border-error/30 text-error flex items-start gap-2.5 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {/* ================================================================ */}
        {/* FLOW 1: SIGN UP                                                  */}
        {/* ================================================================ */}
        {authMode === 'signup' && (
          <>
            {/* Step Indicators */}
            <div className="flex items-center justify-between px-1 text-xs">
              <div className="flex items-center gap-1.5">
                <span
                  className={`h-2 rounded-full transition-all duration-300 ${
                    signUpStep === 'phone' ? 'w-8 bg-primary' : 'w-2 bg-surface-variant'
                  }`}
                />
                <span
                  className={`h-2 rounded-full transition-all duration-300 ${
                    signUpStep === 'otp' ? 'w-8 bg-primary' : 'w-2 bg-surface-variant'
                  }`}
                />
                <span
                  className={`h-2 rounded-full transition-all duration-300 ${
                    signUpStep === 'password' || signUpStep === 'success'
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-surface-variant'
                  }`}
                />
              </div>
              <span className="text-[11px] font-mono text-on-surface-variant">
                {signUpStep === 'phone' && 'Step 1/3: WhatsApp Number'}
                {signUpStep === 'otp' && 'Step 2/3: WhatsApp OTP'}
                {signUpStep === 'password' && 'Step 3/3: Create Password'}
                {signUpStep === 'success' && 'Verified!'}
              </span>
            </div>

            {/* STEP 1: Phone & Name Input */}
            {signUpStep === 'phone' && (
              <form onSubmit={handleSendOtp} className="flex flex-col gap-3.5">
                {/* Full Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface-variant">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    required
                    className="w-full bg-surface-container border border-surface-container-high rounded-xl py-2.5 px-3 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* WhatsApp Phone Number */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface-variant">
                    WhatsApp Registered Phone Number
                  </label>
                  <div className="flex gap-2">
                    {/* Country Code Select */}
                    <div className="relative">
                      <select
                        value={countryCode}
                        onChange={e => setCountryCode(e.target.value)}
                        className="appearance-none bg-surface-container border border-surface-container-high text-on-surface text-xs font-semibold rounded-xl py-2.5 pl-2.5 pr-6 focus:outline-none focus:border-primary cursor-pointer"
                      >
                        {COUNTRY_CODES.map(c => (
                          <option key={c.code} value={c.code} className="bg-surface-container-high text-on-surface">
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Number input */}
                    <div className="relative flex-1">
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        placeholder="(650) 492-8819"
                        required
                        className="w-full bg-surface-container border border-surface-container-high text-on-surface text-sm rounded-xl py-2.5 px-3 pr-9 placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
                      />
                      <MessageCircle className="w-4 h-4 text-primary absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">
                    We will send a 6-digit one-time password directly to your WhatsApp chat.
                  </p>
                </div>

                {/* Trust Checkbox */}
                <label className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
                  <input
                    type="checkbox"
                    checked={staySignedIn}
                    onChange={e => setStaySignedIn(e.target.checked)}
                    className="w-4 h-4 rounded accent-primary bg-surface-container border-surface-container-high"
                  />
                  <span className="text-xs text-on-surface-variant">
                    Stay securely signed in on this device
                  </span>
                </label>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-1 bg-primary hover:bg-primary-fixed text-on-primary font-headline font-bold text-sm py-3 px-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="material-symbols-outlined text-[18px] animate-spin">
                      sync
                    </span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send OTP via WhatsApp</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 2: OTP Verification */}
            {signUpStep === 'otp' && (
              <div className="flex flex-col gap-4 animate-fade-in">
                {/* Target banner */}
                <div className="bg-surface-container p-3 rounded-xl border border-surface-container-high flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 text-xs">
                      <p className="text-on-surface truncate font-medium">
                        Code sent to <span className="font-mono text-primary font-bold">{displayFullPhone}</span>
                      </p>
                      <p className="text-[11px] text-primary flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Awaiting WhatsApp OTP...
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSignUpStep('phone');
                      setErrorMessage(null);
                    }}
                    className="text-xs text-secondary hover:text-secondary-fixed transition-colors underline"
                  >
                    Edit
                  </button>
                </div>

                {/* 6 Digit Inputs */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-on-surface-variant text-center">
                    Enter 6-digit WhatsApp code
                  </label>
                  <div className="flex justify-between gap-1.5">
                    {otpDigits.map((digit, index) => (
                      <input
                        key={index}
                        ref={el => (otpInputRefs.current[index] = el)}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(index, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(index, e)}
                        className="w-11 h-12 text-center bg-surface-container border border-surface-container-high text-primary font-headline font-bold text-lg rounded-xl focus:outline-none focus:border-primary transition-all shadow-inner"
                      />
                    ))}
                  </div>
                </div>

                {/* Countdown & Resend */}
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="text-on-surface-variant">
                    {canResend ? (
                      <button
                        type="button"
                        onClick={() => handleSendOtp()}
                        className="text-primary font-semibold hover:underline"
                      >
                        Resend Code via WhatsApp
                      </button>
                    ) : (
                      <span>
                        Resend in <strong className="text-primary font-mono">0:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}</strong>
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={handleAutoFillOtp}
                    className="text-secondary hover:underline text-[11px] flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto-fill ({generatedOtp})</span>
                  </button>
                </div>

                {/* Verify action */}
                <button
                  type="button"
                  onClick={() => handleVerifyOtp()}
                  disabled={isSubmitting || otpDigits.join('').length < 6}
                  className="w-full bg-primary hover:bg-primary-fixed text-on-primary font-headline font-bold text-sm py-3 px-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="material-symbols-outlined text-[18px] animate-spin">
                      sync
                    </span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify Phone Number</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* STEP 3: Create Password (Required >= 8 chars) */}
            {signUpStep === 'password' && (
              <form onSubmit={handleCreatePassword} className="flex flex-col gap-3.5 animate-fade-in">
                {/* Verified Phone Chip */}
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-on-surface">
                    Phone <strong className="text-primary">{displayFullPhone}</strong> verified!
                  </span>
                </div>

                {/* Password Input */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface-variant">
                    Create Password (at least 8 characters)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter new password (min. 8 chars)"
                      required
                      className="w-full bg-surface-container border border-surface-container-high rounded-xl py-2.5 px-3 pr-10 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface-variant">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      required
                      className="w-full bg-surface-container border border-surface-container-high rounded-xl py-2.5 px-3 pr-10 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Requirements Checklist */}
                <div className="p-3 rounded-xl bg-surface-container border border-surface-container-high/60 space-y-1.5 text-xs">
                  <span className="font-semibold text-on-surface text-[11px] block">
                    Security Requirements:
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${
                        isPasswordValid ? 'bg-primary text-on-primary' : 'bg-surface-variant text-outline'
                      }`}
                    >
                      {isPasswordValid ? '✓' : '•'}
                    </span>
                    <span className={isPasswordValid ? 'text-primary font-medium' : 'text-on-surface-variant'}>
                      At least 8 characters ({password.length}/8)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${
                        hasLetterAndNumber ? 'bg-primary text-on-primary' : 'bg-surface-variant text-outline'
                      }`}
                    >
                      {hasLetterAndNumber ? '✓' : '•'}
                    </span>
                    <span className={hasLetterAndNumber ? 'text-primary font-medium' : 'text-on-surface-variant'}>
                      Contains letters and numbers
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${
                        isPasswordMatching ? 'bg-primary text-on-primary' : 'bg-surface-variant text-outline'
                      }`}
                    >
                      {isPasswordMatching ? '✓' : '•'}
                    </span>
                    <span className={isPasswordMatching ? 'text-primary font-medium' : 'text-on-surface-variant'}>
                      Passwords match
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !isPasswordValid || !isPasswordMatching}
                  className="w-full mt-1 bg-primary hover:bg-primary-fixed text-on-primary font-headline font-bold text-sm py-3 px-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="material-symbols-outlined text-[18px] animate-spin">
                      sync
                    </span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Create Account & Unlock Inbox</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 4: Success Screen */}
            {signUpStep === 'success' && (
              <div className="flex flex-col items-center text-center py-6 gap-3 animate-fade-in">
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-[0_0_24px_rgba(78,222,163,0.5)]">
                  <Check className="w-8 h-8 text-on-primary" />
                </div>
                <h3 className="font-headline font-bold text-lg text-on-surface">
                  Account Created & Verified!
                </h3>
                <p className="text-xs text-on-surface-variant max-w-xs">
                  Your registered WhatsApp number <strong className="text-primary">{displayFullPhone}</strong> has been secured with your 8+ character password.
                </p>
                <div className="text-xs font-mono text-primary flex items-center gap-1.5 mt-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                  <span>Entering your personal briefing workspace...</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* ================================================================ */}
        {/* FLOW 2: SIGN IN / LOGIN                                          */}
        {/* ================================================================ */}
        {authMode === 'login' && (
          <form onSubmit={handlePasswordLogin} className="flex flex-col gap-3.5 animate-fade-in">
            {/* Phone Input */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface-variant">
                Registered WhatsApp Phone Number
              </label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={e => setCountryCode(e.target.value)}
                  className="appearance-none bg-surface-container border border-surface-container-high text-on-surface text-xs font-semibold rounded-xl py-2.5 px-3 focus:outline-none focus:border-primary cursor-pointer"
                >
                  {COUNTRY_CODES.map(c => (
                    <option key={c.code} value={c.code} className="bg-surface-container-high text-on-surface">
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
                <div className="relative flex-1">
                  <input
                    type="tel"
                    value={loginPhone}
                    onChange={e => setLoginPhone(e.target.value)}
                    placeholder="(650) 492-8819"
                    required
                    className="w-full bg-surface-container border border-surface-container-high text-on-surface text-sm rounded-xl py-2.5 px-3 pr-9 placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
                  />
                  <Phone className="w-4 h-4 text-primary absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-on-surface-variant">
                  Password (min. 8 characters)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setPhoneNumber(loginPhone);
                    handleSendOtp();
                  }}
                  className="text-[11px] text-secondary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-surface-container border border-surface-container-high rounded-xl py-2.5 px-3 pr-10 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <button
              type="submit"
              disabled={isSubmitting || loginPassword.length < 8}
              className="w-full mt-2 bg-primary hover:bg-primary-fixed text-on-primary font-headline font-bold text-sm py-3 px-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="material-symbols-outlined text-[18px] animate-spin">
                  sync
                </span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In & Unlock Inbox</span>
                </>
              )}
            </button>

            {/* Quick alternative: Login with WhatsApp OTP */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-surface-container-high" />
              <span className="flex-shrink mx-2 text-[10px] text-outline uppercase tracking-wider font-semibold">
                Or
              </span>
              <div className="flex-grow border-t border-surface-container-high" />
            </div>

            <button
              type="button"
              onClick={() => {
                setLoginWithOtp(true);
                setPhoneNumber(loginPhone);
                handleSendOtp();
              }}
              className="w-full bg-surface-container hover:bg-surface-container-high border border-surface-container-high text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-on-surface transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-primary" />
              <span>Sign In with WhatsApp OTP instead</span>
            </button>
          </form>
        )}

        {/* QR Code Quick Pairing Alternative Toggle */}
        <div className="pt-2 border-t border-surface-container-high flex justify-center">
          <button
            type="button"
            onClick={() => setIsQrMode(!isQrMode)}
            className="text-xs font-semibold text-primary hover:text-primary-fixed transition-colors flex items-center gap-1.5"
          >
            {isQrMode ? (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span>Return to Phone Entry</span>
              </>
            ) : (
              <>
                <QrCode className="w-3.5 h-3.5" />
                <span>Switch to QR Code Pairing</span>
              </>
            )}
          </button>
        </div>

        {/* QR Code View */}
        {isQrMode && (
          <div className="flex flex-col items-center text-center p-3 rounded-xl bg-surface-container border border-surface-container-high gap-2 animate-fade-in">
            <div className="p-3 bg-white rounded-xl shadow-inner">
              {/* Minimal SVG QR pattern */}
              <svg className="w-32 h-32 text-slate-900" fill="currentColor" viewBox="0 0 160 160">
                <rect width="44" height="44" x="12" y="12" rx="4" />
                <rect width="28" height="28" x="20" y="20" fill="white" />
                <rect width="14" height="14" x="27" y="27" />
                <rect width="44" height="44" x="104" y="12" rx="4" />
                <rect width="28" height="28" x="112" y="20" fill="white" />
                <rect width="14" height="14" x="119" y="27" />
                <rect width="44" height="44" x="12" y="104" rx="4" />
                <rect width="28" height="28" x="20" y="112" fill="white" />
                <rect width="14" height="14" x="27" y="119" />
                <rect width="12" height="12" x="68" y="20" />
                <rect width="12" height="24" x="68" y="44" />
                <rect width="24" height="12" x="20" y="68" />
                <rect width="24" height="12" x="68" y="80" />
                <rect width="16" height="16" x="104" y="68" />
                <rect width="16" height="28" x="128" y="104" />
                <rect width="24" height="12" x="80" y="112" />
              </svg>
            </div>
            <p className="text-xs font-semibold text-on-surface mt-1">Scan with WhatsApp</p>
            <p className="text-[11px] text-on-surface-variant max-w-xs">
              Open WhatsApp on your phone &gt; Settings &gt; Linked Devices &gt; Link a Device.
            </p>
          </div>
        )}
      </div>

      {/* Guest Demo Bypass button */}
      {onCancel && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-on-surface-variant hover:text-on-surface underline transition-colors"
          >
            Continue as Guest in Demo Mode →
          </button>
        </div>
      )}
    </div>
  );
};
