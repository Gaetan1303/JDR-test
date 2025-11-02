import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatGridListModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="header">
        <h1>Menu Principal</h1>
        <p>Bienvenue dans l'univers de Légende des 5 Anneaux - 4e édition</p>
      </div>

      <div class="menu-grid">
        <mat-card class="menu-card" routerLink="/character-creator">
          <mat-card-header>
            <mat-card-title>Création de personnage</mat-card-title>
            <mat-card-subtitle>Créez votre samurai ou courtisan</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Suivez les étapes pour créer un personnage complet : clan, école, traits, compétences et équipement.</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" routerLink="/character-creator">
              Créer un personnage
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="menu-card" routerLink="/characters">
          <mat-card-header>
            <mat-card-title>Mes personnages</mat-card-title>
            <mat-card-subtitle>Gérez vos personnages créés</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Consultez, modifiez ou supprimez vos personnages existants.</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" routerLink="/characters">
              Voir mes personnages
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="menu-card" routerLink="/library">
          <mat-card-header>
            <mat-card-title>Bibliothèque</mat-card-title>
            <mat-card-subtitle>Ressources du jeu</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Consultez les sorts, équipements, règles et lore de l'univers L5A.</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" routerLink="/library">
              Accéder à la bibliothèque
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="menu-card" routerLink="/campaigns">
          <mat-card-header>
            <mat-card-title>Mes parties</mat-card-title>
            <mat-card-subtitle>Parties en cours</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Rejoignez vos parties en cours ou consultez l'historique de vos aventures.</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" routerLink="/campaigns">
              Voir mes parties
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="menu-card" routerLink="/game-master">
          <mat-card-header>
            <mat-card-title>Lancer une campagne</mat-card-title>
            <mat-card-subtitle>Outils de maître de jeu</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Créez et gérez vos propres campagnes, invitez des joueurs et menez des aventures épiques.</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" routerLink="/game-master">
              Devenir maître de jeu
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      text-align: center;
      margin-bottom: 48px;
    }

    .header h1 {
      color: #1976d2;
      margin-bottom: 16px;
    }

    .header p {
      color: #666;
      font-size: 1.1rem;
    }

    .menu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 24px;
    }

    .menu-card {
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      height: 240px;
      display: flex;
      flex-direction: column;
    }

    .menu-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.15);
    }

    .menu-card mat-card-content {
      flex-grow: 1;
    }

    .menu-card mat-card-actions {
      margin-top: auto;
    }

    .menu-card mat-card-title {
      color: #1976d2;
      font-size: 1.25rem;
    }

    .menu-card mat-card-subtitle {
      color: #666;
    }

    .menu-card p {
      line-height: 1.5;
      color: #333;
    }

    @media (max-width: 768px) {
      .menu-grid {
        grid-template-columns: 1fr;
      }
      
      .dashboard-container {
        padding: 16px;
      }
    }
  `]
})
export class Dashboard {}