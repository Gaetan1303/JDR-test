import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatGridListModule
],
  template: `
    <div class="dashboard-container">
      <div class="header">
        <h1>Menu principal</h1>
        <p>Bienvenue dans l'univers de Légende des 5 Anneaux</p>
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

        <mat-card class="menu-card" routerLink="/multiplayer">
          <mat-card-header>
            <mat-card-title>Multijoueur local</mat-card-title>
            <mat-card-subtitle>Salon, chat et dés (sans serveur)</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Créez une salle en tant que MJ, rejoignez comme joueur, discutez et lancez des dés via BroadcastChannel.</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" routerLink="/multiplayer">
              Ouvrir le multijoueur
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

        <mat-card class="menu-card" routerLink="/play-character">
          <mat-card-header>
            <mat-card-title>Jouer un personnage</mat-card-title>
            <mat-card-subtitle>Mode hors ligne</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Vivez des événements aléatoires, réalisez des missions et progressez avec votre personnage en mode solo.</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" routerLink="/play-character">
              Jouer en solo
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
      min-height: 100vh;
  background: linear-gradient(to bottom, rgba(139, 26, 26, 0.2) 0%, rgba(107, 15, 15, 0.3) 50%, rgba(139, 26, 26, 0.2) 100%),
  url('assets/images/background.png');
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      position: relative;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
  background-image: url('assets/images/background2.png');
        background-size: cover;
        background-position: center;
        opacity: 0.08;
        pointer-events: none;
      }
    }

    .header {
      text-align: center;
      margin-bottom: 60px;
      padding: 40px 20px;
      background: linear-gradient(135deg, rgba(139, 69, 19, 0.4) 0%, rgba(101, 67, 33, 0.3) 100%);
      border-radius: 8px;
      border: 2px solid rgba(212, 175, 55, 0.3);
      box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.6),
        inset 0 1px 0 rgba(255, 255, 255, 0.1),
        0 0 40px rgba(212, 175, 55, 0.1);
      position: relative;
    }

    .header h1 {
  color: #1c1c1c;
      margin-bottom: 16px;
      font-size: 3rem;
      font-weight: 700;
      text-shadow: 
        0 2px 10px rgba(0, 0, 0, 0.8),
        0 0 30px rgba(212, 175, 55, 0.4);
      letter-spacing: 2px;
      font-family: 'Cinzel', serif, 'Georgia', serif;
    }

    .header p {
      color: #d4af37;
      font-size: 1.3rem;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
      font-style: italic;
    }

    .menu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
      gap: 32px;
      padding-bottom: 40px;
    }

    .menu-card {
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      height: 280px;
      display: flex;
      flex-direction: column;
      background: linear-gradient(145deg, rgba(58, 38, 24, 0.95) 0%, rgba(40, 26, 16, 0.95) 100%);
      border: 2px solid rgba(139, 69, 19, 0.6);
      border-radius: 12px;
      box-shadow: 
        0 10px 30px rgba(0, 0, 0, 0.7),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
      position: relative;
      overflow: hidden;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.1), transparent);
        transition: left 0.6s;
      }
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #8b4513, #d4af37, #8b4513);
        transform: scaleX(0);
        transition: transform 0.4s;
      }
    }

    .menu-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 
        0 20px 50px rgba(0, 0, 0, 0.9),
        0 0 60px rgba(212, 175, 55, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      border-color: #d4af37;
      
      &::before {
        left: 100%;
      }
      
      &::after {
        transform: scaleX(1);
      }
    }

    .menu-card mat-card-header {
      background: linear-gradient(135deg, rgba(139, 69, 19, 0.4), rgba(101, 67, 33, 0.3));
      margin: -16px -16px 16px -16px;
      padding: 20px;
      border-bottom: 1px solid rgba(212, 175, 55, 0.3);
    }

    .menu-card mat-card-content {
      flex-grow: 1;
      color: #e0d5c7;
      
    }

    .menu-card mat-card-actions {
      margin-top: auto;
      padding: 12px 20px 20px;
      background: linear-gradient(135deg, rgba(139, 69, 19, 0.4), rgba(101, 67, 33, 0.3));
      border-top: 1px solid rgba(212, 175, 55, 0.3);
      
      button {
        /* Fond retiré pour ne pas masquer le texte */
        background: none !important;
        background-color: transparent !important;
        color: var(--red-primary, #6b3e2e) !important;
        border: 1px solid #b8925e;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        box-shadow: none;
        transition: all 0.2s ease;
        
        &:hover {
          background: rgba(200, 170, 110, 0.15);
          box-shadow: none;
          transform: translateY(-1px);
        }
      }
    }

    .menu-card mat-card-title {
  color: #1c1c1c;
      font-size: 1.4rem;
      font-weight: 700;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
    }

    .menu-card mat-card-subtitle {
      color: #d4af37;
      font-size: 1rem;
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
    }

    .menu-card p {
      line-height: 1.6;
      color: #c9b8a0;
      font-size: 0.95rem;
    }

    @media (max-width: 768px) {
      .menu-grid {
        grid-template-columns: 1fr;
        gap: 24px;
      }
      
      .dashboard-container {
        padding: 16px;
      }
      
      .header h1 {
        font-size: 2rem;
      }
      
      .menu-card {
        height: auto;
        min-height: 260px;
      }
    }
  `]
})
export class Dashboard {}