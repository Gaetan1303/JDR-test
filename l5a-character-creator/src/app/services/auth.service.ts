import { Injectable, signal, computed } from '@angular/core';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface StoredUser extends AuthUser {
  password: string; // NOTE: stored in clear for local-only demo; do NOT use in production
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly USERS_KEY = 'l5a-users';
  private readonly SESSION_KEY = 'l5a-session';

  private _currentUser = signal<AuthUser | null>(this.loadSession());
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this._currentUser());

  // Register a new user
  register(name: string, email: string, password: string): { ok: boolean; error?: string } {
    const users = this.loadUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'Un compte existe déjà avec cet e-mail' };
    }
    const user: StoredUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      createdAt: new Date().toISOString()
    };
    users.push(user);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    // Auto-login
    this.saveSession(user);
    return { ok: true };
  }

  // Login
  login(email: string, password: string): { ok: boolean; error?: string } {
    const users = this.loadUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) return { ok: false, error: 'Identifiants invalides' };
    this.saveSession(user);
    return { ok: true };
  }

  logout() {
    localStorage.removeItem(this.SESSION_KEY);
    this._currentUser.set(null);
  }

  private loadUsers(): StoredUser[] {
    const raw = localStorage.getItem(this.USERS_KEY);
    if (!raw) return [];
    try { return JSON.parse(raw) as StoredUser[]; } catch { return []; }
  }

  private loadSession(): AuthUser | null {
    const raw = localStorage.getItem(this.SESSION_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw) as AuthUser; } catch { return null; }
  }

  private saveSession(user: StoredUser) {
    const session: AuthUser = { id: user.id, name: user.name, email: user.email };
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    this._currentUser.set(session);
  }
}
