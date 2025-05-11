import { User } from './types';

export class AuthService {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly USER_KEY = 'user_info';
  private static readonly JUST_LOGGED_IN_KEY = 'just_logged_in';

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  static setAuthData(token: string, user: User): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static setJustLoggedIn(value: boolean): void {
    localStorage.setItem(this.JUST_LOGGED_IN_KEY, value ? 'true' : 'false');
  }

  static isJustLoggedIn(): boolean {
    return localStorage.getItem(this.JUST_LOGGED_IN_KEY) === 'true';
  }

  static clearJustLoggedIn(): void {
    localStorage.removeItem(this.JUST_LOGGED_IN_KEY);
  }
} 