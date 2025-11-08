import { Injectable, signal, computed } from '@angular/core';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface StoredUser extends AuthUser {
  password: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly USERS_KEY = 'l5a-users';
  private readonly SESSION_KEY = 'l5a-session';

  // URLs du backend Render
  private readonly BASE_URL = 'https://gm-l5r.onrender.com/api/auth';

  private _currentUser = signal<AuthUser | null>(this.loadSession());
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this._currentUser());

  // Inscription via backend
  async registerWithBackend(name: string, email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const result = await response.json();
      if (result.ok && result.user) {
        this._currentUser.set(result.user);
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(result.user));
        return { ok: true };
      } else {
        return { ok: false, error: result.error || 'Erreur d\'inscription' };
      }
    } catch (err) {
      return { ok: false, error: 'Erreur réseau ou serveur' };
    }
  }

  // Login
  login(email: string, password: string): { ok: boolean; error?: string } {
    const users = this.loadUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) return { ok: false, error: 'Identifiants invalides' };
    this.saveSession(user);
    return { ok: true };
  }

  // Connexion via backend
  async loginWithBackend(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();
      if (result.ok && result.user) {
        this._currentUser.set(result.user);
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(result.user));
        return { ok: true };
      } else {
        return { ok: false, error: result.error || 'Erreur de connexion' };
      }
    } catch (err) {
      return { ok: false, error: 'Erreur réseau ou serveur' };
    }
  }

  // Génération d'un token WebSocket
  async generateWsToken(): Promise<{ ok: boolean; token?: string; error?: string }> {
    try {
      const response = await fetch(`${this.BASE_URL}/ws-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const result = await response.json();
      if (result.ok && result.token) {
        return { ok: true, token: result.token };
      } else {
        return { ok: false, error: result.error || 'Erreur de génération du token' };
      }
    } catch (err) {
      return { ok: false, error: 'Erreur réseau ou serveur' };
    }
  }

  // Vérification d'un token WebSocket
  async verifyWsToken(token: string): Promise<{ ok: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.BASE_URL}/verify-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const result = await response.json();
      return result;
    } catch (err) {
      return { ok: false, error: 'Erreur réseau ou serveur' };
    }
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
