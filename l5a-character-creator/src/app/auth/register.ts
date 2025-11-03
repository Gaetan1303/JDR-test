import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <h1>Création de compte</h1>
        <form (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="full">
            <mat-label>Nom</mat-label>
            <input matInput [(ngModel)]="name" name="name" required>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Email</mat-label>
            <input matInput type="email" [(ngModel)]="email" name="email" required>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Mot de passe</mat-label>
            <input matInput type="password" [(ngModel)]="password" name="password" required>
          </mat-form-field>

          <div class="actions">
            <button mat-raised-button color="primary" type="submit">Créer</button>
            <a routerLink="/login">Déjà un compte ?</a>
          </div>

          <p class="error" *ngIf="error">{{ error }}</p>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container { display: flex; justify-content: center; padding: 24px; }
    .auth-card { width: 400px; }
    .full { width: 100%; }
    .actions { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; }
    .error { color: #d32f2f; margin-top: 12px; }
  `]
})
export class Register {
  private auth = inject(AuthService);
  private router = inject(Router);
  name = '';
  email = '';
  password = '';
  error = '';

  submit() {
    const res = this.auth.register(this.name.trim(), this.email.trim(), this.password);
    if (!res.ok) { this.error = res.error || 'Erreur lors de la création'; return; }
    this.router.navigateByUrl('/multiplayer');
  }
}
