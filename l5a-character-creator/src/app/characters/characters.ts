import { Component, signal, inject, OnInit } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { CharacterService } from '../services/character.service';
import { Character, Equipment } from '../models/character.model';

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [
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

      @if (savedCharacters().length > 0) {
        <div class="characters-grid">
          @for (character of savedCharacters(); track character.id) {
            <mat-card class="character-card">
              <mat-card-header>
                <mat-card-title>{{ character.name || 'Sans nom' }}</mat-card-title>
                <mat-card-subtitle>{{ character.clan }} - {{ character.school }}</mat-card-subtitle>
              </mat-card-header>
              
              <mat-card-content>
                <div class="character-info">
                  <div class="rings-summary">
                    <h4>Anneaux</h4>
                    <mat-chip-set>
                      <mat-chip>Terre: {{ getRingValue(character, 'terre') }}</mat-chip>
                      <mat-chip>Eau: {{ getRingValue(character, 'eau') }}</mat-chip>
                      <mat-chip>Air: {{ getRingValue(character, 'air') }}</mat-chip>
                      <mat-chip>Feu: {{ getRingValue(character, 'feu') }}</mat-chip>
                      <mat-chip>Vide: {{ character.rings.vide || 2 }}</mat-chip>
                    </mat-chip-set>
                  </div>

                  <mat-divider></mat-divider>

                  <div class="stats-summary">
                    <p><strong>Honneur:</strong> {{ character.honor || 0 }}</p>
                    <p><strong>Points de Vide:</strong> {{ character.voidPoints || character.rings.vide || 2 }}</p>
                    <p><strong>XP disponibles:</strong> {{ getAvailableXP(character) }}</p>
                  </div>

                  @if (character.equipment) {
                    <div class="equipment-summary">
                      <h4>Équipement</h4>
                      @if (character.equipment.weapons && character.equipment.weapons.length) {
                        <p>
                          <strong>Armes:</strong> {{ character.equipment.weapons.length }}
                        </p>
                      }
                      @if (character.equipment.armor) {
                        <p>
                          <strong>Armure:</strong> {{ getArmorName(character.equipment.armor) }}
                        </p>
                      }
                    </div>
                  }

                  @if (character.spells && character.spells.length) {
                    <div class="spells-summary">
                      <h4>Sorts</h4>
                      <p>{{ character.spells.length }} sorts connus</p>
                    </div>
                  }

                  @if (character.allies?.length) {
                    <div class="allies-summary">
                      <h4>Alliés</h4>
                      @for (ally of character.allies; track ally.name) {
                        <p class="npc-item">
                          <strong>{{ ally.name }}</strong> ({{ ally.clan }})<br>
                          <span class="npc-desc">{{ ally.description }}</span>
                        </p>
                      }
                    </div>
                  }

                  @if (character.enemies?.length) {
                    <div class="enemies-summary">
                      <h4>Ennemis</h4>
                      @for (enemy of character.enemies; track enemy.name) {
                        <p class="npc-item">
                          <strong>{{ enemy.name }}</strong> ({{ enemy.clan }})<br>
                          <span class="npc-desc">{{ enemy.description }}</span>
                        </p>
                      }
                    </div>
                  }
                </div>
              </mat-card-content>
              
              <mat-card-actions>
                <button mat-button (click)="openSheet(character)">Voir la fiche</button>
                <button mat-button (click)="loadCharacter(character)">Modifier</button>
                <button mat-button (click)="duplicateCharacter(character)">Dupliquer</button>
                <button mat-button color="warn" (click)="deleteCharacter(character)">Supprimer</button>
              </mat-card-actions>
            </mat-card>
          }
        </div>
      }

      @if (savedCharacters().length === 0) {
        <div class="empty-state">
          <h2>Aucun personnage créé</h2>
          <p>Commencez par créer votre premier personnage pour Légende des 5 Anneaux</p>
          <button mat-raised-button color="primary" routerLink="/character-creator">
            Créer mon premier personnage
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .characters-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
      
      &::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(to bottom, rgba(139, 26, 26, 0.2) 0%, rgba(107, 15, 15, 0.3) 100%),
                    url('assets/images/background2.png');
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
        z-index: -1;
        opacity: 0.6;
      }
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
    .spells-summary p,
    .allies-summary p,
    .enemies-summary p {
      margin: 8px 0;
    }

    .allies-summary h4 {
      color: #4caf50 !important;
    }

    .enemies-summary h4 {
      color: #f44336 !important;
    }

    .npc-item {
      padding: 8px;
      margin: 4px 0;
      background: rgba(0, 0, 0, 0.02);
      border-radius: 4px;
      border-left: 3px solid #ddd;
    }

    .allies-summary .npc-item {
      border-left-color: #4caf50;
    }

    .enemies-summary .npc-item {
      border-left-color: #f44336;
    }

    .npc-desc {
      font-size: 0.9em;
      font-style: italic;
      color: #666;
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
      
      .header h1 {
        font-size: 1.8rem;
      }
      
      .header p {
        font-size: 1rem;
      }
    }
    
    @media (max-width: 480px) {
      .characters-grid {
        gap: 16px;
      }
      
      .character-card {
        mat-card-title {
          font-size: 1.1rem;
        }
        
        mat-card-subtitle {
          font-size: 0.9rem;
        }
      }
    }
  `]
})
export class Characters implements OnInit {
  characterService = inject(CharacterService);
  private router = inject(Router);
  
  // Signal pour les personnages sauvegardés
  savedCharacters = signal<Character[]>([]);

  ngOnInit() {
    this.loadSavedCharacters();
  }

  loadSavedCharacters() {
    // Chargement depuis localStorage avec la clé 'myCharacters'
    const saved = localStorage.getItem('myCharacters');
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
    this.router.navigate(['/character-creator']);
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
    localStorage.setItem('myCharacters', JSON.stringify(this.savedCharacters()));
  }

  // Ouvre la fiche en s'assurant que l'ID existe et est persisté
  openSheet(character: Character) {
    let char = character;
    if (!char.id) {
      // Génère un ID puis persiste la liste avec cet ID
      char = { ...character, id: Date.now().toString() } as Character;
      const updated = this.savedCharacters().map(c => (c === character ? char : c));
      this.savedCharacters.set(updated);
      this.saveCharacters();
    }
    this.router.navigate(['/character-sheet', char.id]);
  }

  debugCharacter(character: Character) {
    console.log('[DEBUG] Personnage:', character.name);
    console.log('[DEBUG] ID:', character.id);
    console.log('[DEBUG] Type ID:', typeof character.id);
    console.log('[DEBUG] Clan:', character.clan);
    console.log('[DEBUG] Ecole:', character.school);
    console.log('[DEBUG] URL serait:', `/character-sheet/${character.id}`);
    alert(`DEBUG:\nNom: ${character.name}\nID: ${character.id}\nType: ${typeof character.id}`);
  }

  getAvailableXP(character: Character): number {
    const baseXP = 40;
    const advantageCost = character.advantages?.reduce((sum, adv) => sum + (adv.cost || 0), 0) || 0;
    const disadvantageGain = character.disadvantages?.reduce((sum, dis) => sum + (dis.xpGain || 0), 0) || 0;
    const spentXP = character.spentExperiencePoints || 0;
    
    return baseXP - advantageCost + disadvantageGain - spentXP;
  }

  getArmorName(armor: Equipment | Equipment[] | undefined): string {
    if (!armor) return 'Aucune';
    if (Array.isArray(armor)) {
      return armor.length > 0 ? armor[0].name : 'Aucune';
    }
    return armor.name;
  }

  // Calcul dynamique des anneaux basé sur les traits (comme sur la fiche)
  getRingValue(character: Character, ring: string): number {
    if (ring === 'vide') {
      return character.rings?.vide || 2;
    }

    const traits = character.traits;
    if (!traits) return character.rings?.[ring as keyof typeof character.rings] || 2;

    const ringMap: Record<string, [string, string]> = {
      terre: ['constitution', 'volonte'],
      eau: ['force', 'perception'],
      air: ['reflexes', 'intuition'],
      feu: ['agilite', 'intelligence']
    };

    const pair = ringMap[ring];
    if (pair) {
      const val1 = (traits as any)[pair[0]] || 2;
      const val2 = (traits as any)[pair[1]] || 2;
      return Math.min(val1, val2);
    }

    return character.rings?.[ring as keyof typeof character.rings] || 2;
  }
}