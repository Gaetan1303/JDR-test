import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { CharacterService } from '../services/character.service';
import { Character } from '../models/character.model';

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule
  ],
  template: `
    <div class="characters-container">
      <div class="header">
        <h1>Mes Personnages</h1>
        <p>Gérez vos personnages créés pour Légende des 5 Anneaux</p>
        <button mat-raised-button color="primary" routerLink="/character-creator">
          Créer un nouveau personnage
        </button>
      </div>

      <div class="characters-grid" *ngIf="savedCharacters().length > 0">
        <mat-card *ngFor="let character of savedCharacters()" class="character-card">
          <mat-card-header>
            <mat-card-title>{{ character.name || 'Sans nom' }}</mat-card-title>
            <mat-card-subtitle>{{ character.clan }} - {{ character.school }}</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <div class="character-info">
              <div class="rings-summary">
                <h4>Anneaux</h4>
                <mat-chip-set>
                  <mat-chip>Terre: {{ character.rings?.terre || 2 }}</mat-chip>
                  <mat-chip>Eau: {{ character.rings?.eau || 2 }}</mat-chip>
                  <mat-chip>Air: {{ character.rings?.air || 2 }}</mat-chip>
                  <mat-chip>Feu: {{ character.rings?.feu || 2 }}</mat-chip>
                  <mat-chip>Vide: {{ character.rings?.vide || 2 }}</mat-chip>
                </mat-chip-set>
              </div>

              <mat-divider></mat-divider>

              <div class="stats-summary">
                <p><strong>Honneur:</strong> {{ character.honor || 0 }}</p>
                <p><strong>Points de Vide:</strong> {{ character.voidPoints || 0 }}</p>
                <p><strong>XP disponibles:</strong> {{ getAvailableXP(character) }}</p>
              </div>

              <div class="equipment-summary" *ngIf="character.equipment">
                <h4>Équipement</h4>
                <p *ngIf="character.equipment.weapons?.length">
                  <strong>Armes:</strong> {{ character.equipment.weapons.length }}
                </p>
                <p *ngIf="character.equipment.armor?.length">
                  <strong>Armures:</strong> {{ character.equipment.armor.length }}
                </p>
              </div>

              <div class="spells-summary" *ngIf="character.spells?.length">
                <h4>Sorts</h4>
                <p>{{ character.spells.length }} sorts connus</p>
              </div>
            </div>
          </mat-card-content>
          
          <mat-card-actions>
            <button mat-button (click)="loadCharacter(character)">Modifier</button>
            <button mat-button (click)="duplicateCharacter(character)">Dupliquer</button>
            <button mat-button color="warn" (click)="deleteCharacter(character)">Supprimer</button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div class="empty-state" *ngIf="savedCharacters().length === 0">
        <h2>Aucun personnage créé</h2>
        <p>Commencez par créer votre premier personnage pour Légende des 5 Anneaux</p>
        <button mat-raised-button color="primary" routerLink="/character-creator">
          Créer mon premier personnage
        </button>
      </div>
    </div>
  `,
  styles: [`
    .characters-container {
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
      margin-bottom: 24px;
    }

    .characters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
    }

    .character-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .character-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .character-info h4 {
      margin: 16px 0 8px 0;
      color: #1976d2;
    }

    .rings-summary mat-chip-set {
      margin-bottom: 16px;
    }

    .stats-summary p {
      margin: 8px 0;
    }

    .equipment-summary p,
    .spells-summary p {
      margin: 8px 0;
    }

    .empty-state {
      text-align: center;
      padding: 64px 24px;
    }

    .empty-state h2 {
      color: #666;
      margin-bottom: 16px;
    }

    .empty-state p {
      color: #999;
      font-size: 1.1rem;
      margin-bottom: 32px;
    }

    @media (max-width: 768px) {
      .characters-grid {
        grid-template-columns: 1fr;
      }
      
      .characters-container {
        padding: 16px;
      }
    }
  `]
})
export class Characters {
  characterService = inject(CharacterService);
  
  // Signal pour les personnages sauvegardés
  savedCharacters = signal<Character[]>([]);

  ngOnInit() {
    this.loadSavedCharacters();
  }

  loadSavedCharacters() {
    // Simulation de chargement depuis localStorage ou service
    const saved = localStorage.getItem('l5a-characters');
    if (saved) {
      try {
        const characters = JSON.parse(saved);
        this.savedCharacters.set(characters);
      } catch (error) {
        console.error('Erreur lors du chargement des personnages:', error);
      }
    }
  }

  loadCharacter(character: Character) {
    // Charger le personnage dans le service et rediriger vers l'éditeur
    this.characterService.loadCharacter(character);
    // Redirection vers l'éditeur (à implémenter)
  }

  duplicateCharacter(character: Character) {
    const duplicate = { 
      ...character, 
      name: `${character.name} (Copie)`,
      id: Date.now().toString() // Nouvel ID
    };
    
    const current = this.savedCharacters();
    this.savedCharacters.set([...current, duplicate]);
    this.saveCharacters();
  }

  deleteCharacter(character: Character) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le personnage "${character.name}" ?`)) {
      const current = this.savedCharacters();
      this.savedCharacters.set(current.filter(c => c !== character));
      this.saveCharacters();
    }
  }

  private saveCharacters() {
    localStorage.setItem('l5a-characters', JSON.stringify(this.savedCharacters()));
  }

  getAvailableXP(character: Character): number {
    const baseXP = 40;
    const advantageCost = character.advantages?.reduce((sum, adv) => sum + (adv.cost || 0), 0) || 0;
    const disadvantageGain = character.disadvantages?.reduce((sum, dis) => sum + (dis.xpGain || 0), 0) || 0;
    const spentXP = character.spentExperiencePoints || 0;
    
    return baseXP - advantageCost + disadvantageGain - spentXP;
  }
}