import type { UserAccount } from '../types/index.ts';

export interface StoredUserAccount extends UserAccount {
  passwordHash: string; // Stored password
}

const STORAGE_KEY_USERS = 'missedit_users_db_v1';
const STORAGE_KEY_CURRENT_SESSION = 'missedit_current_session_v1';

export function normalizePhone(countryCode: string, rawPhone: string): string {
  const cleanCode = countryCode.replace(/\D/g, '');
  const cleanNum = rawPhone.replace(/\D/g, '');
  return `+${cleanCode}${cleanNum}`;
}

export function getStoredUsers(): StoredUserAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (!raw) {
      // Seed default account (Alex Rivera)
      const defaultUser: StoredUserAccount = {
        id: 'usr-seed-1',
        name: 'Alex Rivera',
        countryCode: '+1',
        phoneNumber: '(650) 492-8819',
        fullPhoneNumber: '+1 (650) 492-8819',
        passwordHash: 'Password123!',
        isWhatsAppVerified: true,
        aliases: ['Alex', 'Alex Rivera', '@Alex', '@arivera', 'Lead'],
        createdAt: 'Oct 2024',
      };
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify([defaultUser]));
      return [defaultUser];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveUserToDatabase(
  user: Omit<StoredUserAccount, 'id' | 'createdAt' | 'passwordHash'>,
  plainPassword: string
): StoredUserAccount {
  const users = getStoredUsers();
  const normalized = normalizePhone(user.countryCode, user.phoneNumber);

  // Check if existing user with normalized phone exists
  const existingIndex = users.findIndex(
    u => normalizePhone(u.countryCode, u.phoneNumber) === normalized
  );

  const newRecord: StoredUserAccount = {
    ...user,
    id: existingIndex >= 0 ? users[existingIndex].id : `usr-${Date.now()}`,
    passwordHash: plainPassword,
    createdAt: existingIndex >= 0 ? users[existingIndex].createdAt : new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  };

  if (existingIndex >= 0) {
    users[existingIndex] = newRecord;
  } else {
    users.push(newRecord);
  }

  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }

  return newRecord;
}

export function verifyUserCredentials(
  countryCode: string,
  rawPhone: string,
  passwordAttempt: string
): { success: boolean; user?: StoredUserAccount; error?: string } {
  const users = getStoredUsers();
  const normalizedAttempt = normalizePhone(countryCode, rawPhone);

  const matchedUser = users.find(
    u => normalizePhone(u.countryCode, u.phoneNumber) === normalizedAttempt
  );

  if (!matchedUser) {
    return {
      success: false,
      error: 'No account found with this WhatsApp number. Please create an account first.',
    };
  }

  if (matchedUser.passwordHash !== passwordAttempt) {
    return {
      success: false,
      error: 'Incorrect password. Please enter the password you created during sign up.',
    };
  }

  return {
    success: true,
    user: matchedUser,
  };
}

export function getSessionUser(): StoredUserAccount | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CURRENT_SESSION);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setSessionUser(user: StoredUserAccount | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY_CURRENT_SESSION, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_CURRENT_SESSION);
    }
  } catch (e) {
    console.warn('Failed to update session storage:', e);
  }
}

export function updateStoredUserAliases(userId: string, newAliases: string[]): void {
  const users = getStoredUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx >= 0) {
    users[idx].aliases = newAliases;
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  }
}
