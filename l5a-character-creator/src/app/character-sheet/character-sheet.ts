import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { Character, Equipment, NPC } from '../models/character.model';
import { CharacterService } from '../services/character.service';
import { ADVANTAGES, DISADVANTAGES } from '../data/advantages-disadvantages.data';
import { SPELLS } from '../data/spells.data';
import { MAHO_SPELLS } from '../data/maho.data';
import { KIHO } from '../data/kiho.data';

@Component({
  selector: 'app-character-sheet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatChipsModule,
    MatDividerModule,
    MatListModule
  ],
  styleUrl: './character-sheet.scss',
  template: `
    <div class="character-sheet-container" *ngIf="character()">
      <div class="sheet-header">
        <button mat-raised-button routerLink="/characters" class="back-button">
          ← Retour
        </button>
        <div class="header-info">
          <h1>{{ character()?.name }}</h1>
          <p class="character-subtitle">{{ character()?.clan }} - {{ character()?.school }}</p>
        </div>
        <div class="xp-display">
          <button mat-raised-button color="primary" (click)="showXpDialog = true">
            Ajouter XP
          </button>
          <div class="xp-info">
            <span class="xp-total">XP Total: {{ character()?.totalExperiencePoints || 0 }}</span>
            <span class="xp-available">XP Disponible: {{ character()?.experiencePoints || 0 }}</span>
          </div>
        </div>
      </div>

      <!-- Dialog pour ajouter de l'XP -->
      <div class="xp-dialog-overlay" *ngIf="showXpDialog" (click)="showXpDialog = false">
        <div class="xp-dialog" (click)="$event.stopPropagation()">
          <h2>Ajouter de l'Expérience</h2>
          <p>Session de jeu terminée ? Ajoutez les XP gagnés !</p>
          <div class="xp-input-group">
            <label>XP gagnés lors de cette session :</label>
            <input type="number" [(ngModel)]="xpToAdd" min="0" placeholder="Ex: 3">
          </div>
          <div class="dialog-actions">
            <button mat-button (click)="showXpDialog = false">Annuler</button>
            <button mat-raised-button color="primary" (click)="addExperience()">Ajouter</button>
          </div>
        </div>
      </div>

      <mat-tab-group class="character-tabs" animationDuration="300ms">
        <!-- Onglet: Fiche Officielle -->
        <mat-tab label="Fiche Officielle">
          <div class="tab-content">
            <!-- Page 1 : Informations principales et anneaux -->
      <div class="sheet-page page-1">
        <div class="sheet-top">
          <div class="identity-section">
            <div class="field-group">
              <label>NOM</label>
              <div class="field-value">{{ character()?.name }}</div>
            </div>
            <div class="field-group">
              <label>PRÉNOM</label>
              <div class="field-value">{{ character()?.name }}</div>
            </div>
          </div>

          <div class="clan-school-section">
            <div class="field-group">
              <label>CLAN</label>
              <div class="field-value">{{ character()?.clan }}</div>
            </div>
            <div class="field-group">
              <label>ÉCOLE</label>
              <div class="field-value">{{ character()?.school }}</div>
            </div>
            <div class="field-group">
              <label>RANG DE RÉPUTATION</label>
              <div class="field-value">1.0</div>
            </div>
          </div>
        </div>

        <div class="rings-section">
          <h2 class="rings-title">⚫ Les Cinq Anneaux ⚫</h2>
          <div class="rings-display">
            <!-- Anneau de Feu -->
            <div class="ring-item feu-ring">
              <div class="ring-icon-large feu">
                <span class="ring-kanji">火</span>
                <div class="ring-value-circle">{{ getRingValue('feu') }}</div>
              </div>
              <h3 class="ring-name">Feu</h3>
              <div class="ring-traits-grid">
                <div class="trait-card">
                  <span class="trait-label">Agilité</span>
                  <span class="trait-value-big">{{ character()?.traits?.agilite || 2 }}</span>
                </div>
                <div class="trait-card">
                  <span class="trait-label">Intelligence</span>
                  <span class="trait-value-big">{{ character()?.traits?.intelligence || 2 }}</span>
                </div>
              </div>
            </div>

            <!-- Anneau d'Air -->
            <div class="ring-item air-ring">
              <div class="ring-icon-large air">
                <span class="ring-kanji">風</span>
                <div class="ring-value-circle">{{ getRingValue('air') }}</div>
              </div>
              <h3 class="ring-name">Air</h3>
              <div class="ring-traits-grid">
                <div class="trait-card">
                  <span class="trait-label">Réflexes</span>
                  <span class="trait-value-big">{{ character()?.traits?.reflexes || 2 }}</span>
                </div>
                <div class="trait-card">
                  <span class="trait-label">Intuition</span>
                  <span class="trait-value-big">{{ character()?.traits?.intuition || 2 }}</span>
                </div>
              </div>
            </div>

            <!-- Anneau de Vide (centre) -->
            <div class="ring-item vide-ring center-ring">
              <div class="ring-icon-large vide">
                <span class="ring-kanji">空</span>
                <div class="ring-value-circle large">{{ character()?.rings?.vide || 2 }}</div>
              </div>
              <h3 class="ring-name">Vide</h3>
              <div class="void-points-display">
                <label>Points de Vide</label>
                <div class="points-boxes">
                  <div class="point-box" 
                       *ngFor="let point of getVoidPointsArray()" 
                       [class.filled]="true">
                    ⚫
                  </div>
                </div>
              </div>
            </div>

            <!-- Anneau de Terre -->
            <div class="ring-item terre-ring">
              <div class="ring-icon-large terre">
                <span class="ring-kanji">地</span>
                <div class="ring-value-circle">{{ getRingValue('terre') }}</div>
              </div>
              <h3 class="ring-name">Terre</h3>
              <div class="ring-traits-grid">
                <div class="trait-card">
                  <span class="trait-label">Constitution</span>
                  <span class="trait-value-big">{{ character()?.traits?.constitution || 2 }}</span>
                </div>
                <div class="trait-card">
                  <span class="trait-label">Volonté</span>
                  <span class="trait-value-big">{{ character()?.traits?.volonte || 2 }}</span>
                </div>
              </div>
            </div>

            <!-- Anneau d'Eau -->
            <div class="ring-item eau-ring">
              <div class="ring-icon-large eau">
                <span class="ring-kanji">水</span>
                <div class="ring-value-circle">{{ getRingValue('eau') }}</div>
              </div>
              <h3 class="ring-name">Eau</h3>
              <div class="ring-traits-grid">
                <div class="trait-card">
                  <span class="trait-label">Force</span>
                  <span class="trait-value-big">{{ character()?.traits?.force || 2 }}</span>
                </div>
                <div class="trait-card">
                  <span class="trait-label">Perception</span>
                  <span class="trait-value-big">{{ character()?.traits?.perception || 2 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="skills-section">
          <h3>COMPÉTENCES NOBLES</h3>
          <div class="skills-list">
            <div class="skill-item" *ngFor="let skill of getNobleSkills()">
              <span class="skill-name">{{ skill.name }}</span>
              <div class="skill-boxes">
                <div class="skill-box" *ngFor="let rank of [1,2,3,4,5,6,7,8,9,10]" 
                     [class.filled]="rank <= skill.rank"></div>
              </div>
            </div>
          </div>

          <h3>COMPÉTENCES MARCHANDS</h3>
          <div class="skills-list">
            <div class="skill-item" *ngFor="let skill of getMerchantSkills()">
              <span class="skill-name">{{ skill.name }}</span>
              <div class="skill-boxes">
                <div class="skill-box" *ngFor="let rank of [1,2,3,4,5,6,7,8,9,10]" 
                     [class.filled]="rank <= skill.rank"></div>
              </div>
            </div>
          </div>

          <h3>BUGEI (COMPÉTENCES MARTIALES)</h3>
          <div class="skills-list">
            <div class="skill-item" *ngFor="let skill of getBugeiSkills()">
              <span class="skill-name">{{ skill.name }}</span>
              <div class="skill-boxes">
                <div class="skill-box" *ngFor="let rank of [1,2,3,4,5,6,7,8,9,10]" 
                     [class.filled]="rank <= skill.rank"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="combat-section">
          <div class="wounds-section">
            <h3>BLESSURES</h3>
            <div class="wound-levels">
              <div class="wound-level">
                <span>Indemne (+0)</span>
                <div class="wound-boxes">
                  <div class="wound-box" *ngFor="let box of getWoundBoxes('healthy')"></div>
                </div>
              </div>
              <div class="wound-level">
                <span>Égratigné (+3)</span>
                <div class="wound-boxes">
                  <div class="wound-box" *ngFor="let box of getWoundBoxes('nicked')"></div>
                </div>
              </div>
              <div class="wound-level">
                <span>Blessé (+5)</span>
                <div class="wound-boxes">
                  <div class="wound-box" *ngFor="let box of getWoundBoxes('grazed')"></div>
                </div>
              </div>
              <div class="wound-level">
                <span>Grièvement Blessé (+10)</span>
                <div class="wound-boxes">
                  <div class="wound-box" *ngFor="let box of getWoundBoxes('hurt')"></div>
                </div>
              </div>
              <div class="wound-level">
                <span>Estropié (+15)</span>
                <div class="wound-boxes">
                  <div class="wound-box" *ngFor="let box of getWoundBoxes('injured')"></div>
                </div>
              </div>
              <div class="wound-level">
                <span>Handicapé (+20)</span>
                <div class="wound-boxes">
                  <div class="wound-box" *ngFor="let box of getWoundBoxes('crippled')"></div>
                </div>
              </div>
              <div class="wound-level">
                <span>Mourant (+40)</span>
                <div class="wound-boxes">
                  <div class="wound-box" *ngFor="let box of getWoundBoxes('down')"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="initiative-section">
            <h3>ND POUR ÊTRE TOUCHÉ</h3>
            <div class="nd-value">{{ getTN() }}</div>
            
            <h3>INITIATIVE ACTUELLE</h3>
            <div class="initiative-value">{{ getInitiative() }}</div>
          </div>
        </div>
      </div>

      <!-- Page 2 : Équipement et arsenal -->
      <div class="sheet-page page-2">
        <div class="equipment-header">
          <h2>ÉQUIPEMENT</h2>
          <div class="money-section">
            <label>Koku:</label>
            <span class="money-value">{{ character()?.equipment?.koku || 0 }}</span>
            <label>Bu:</label>
            <span class="money-value">0</span>
            <label>Zeni:</label>
            <span class="money-value">0</span>
          </div>
        </div>

        <div class="equipment-list">
          <div class="equipment-item" *ngFor="let item of getAllEquipment()">
            {{ item.name }}
          </div>
        </div>

        <div class="arsenal-section">
          <h3>ARSENAL</h3>
          <div class="weapons-list">
            <div class="weapon-item" *ngFor="let weapon of character()?.equipment?.weapons">
              <span class="weapon-name">{{ weapon.name }}</span>
              <span class="weapon-damage">{{ weapon.damage }}</span>
            </div>
          </div>

          <div class="armor-info" *ngIf="character()?.equipment?.armor">
            <h4>Armure</h4>
            <p>{{ getArmorName(character()?.equipment?.armor) }}</p>
            <p>Réduction: {{ getArmorReduction(character()?.equipment?.armor) }}</p>
          </div>
        </div>

        <div class="advantages-disadvantages">
          <div class="advantages-section">
            <h3>AVANTAGES</h3>
            <div class="adv-list">
              <div class="adv-item" *ngFor="let advId of character()?.selectedAdvantages">
                <span class="adv-name">{{ getAdvantageName(advId) }}</span>
                <span class="adv-cost">{{ getAdvantageCost(advId) }} XP</span>
              </div>
            </div>
          </div>

          <div class="disadvantages-section">
            <h3>DÉSAVANTAGES</h3>
            <div class="dis-list">
              <div class="dis-item" *ngFor="let disId of character()?.selectedDisadvantages">
                <span class="dis-name">{{ getDisadvantageName(disId) }}</span>
                <span class="dis-gain">+{{ getDisadvantageGain(disId) }} XP</span>
              </div>
            </div>
          </div>
        </div>

        <div class="glory-honor-status">
          <div class="stat-track">
            <label>GLOIRE</label>
            <div class="track-boxes">
              <div class="track-box" *ngFor="let box of [1,2,3,4,5,6,7,8,9,10]" 
                   [class.filled]="box <= (character()?.glory || 1)"></div>
            </div>
          </div>

          <div class="stat-track">
            <label>HONNEUR</label>
            <div class="track-boxes">
              <div class="track-box" *ngFor="let box of [1,2,3,4,5,6,7,8,9,10]" 
                   [class.filled]="box <= (character()?.honor || 5.5)"></div>
            </div>
          </div>

          <div class="stat-track">
            <label>STATUT</label>
            <div class="track-boxes">
              <div class="track-box" *ngFor="let box of [1,2,3,4,5,6,7,8,9,10]" 
                   [class.filled]="box <= (character()?.status || 1)"></div>
            </div>
          </div>

          <div class="stat-track" *ngIf="character()?.taint && character()!.taint! > 0">
            <label>SOUILLURE DE L'OUTREMONDE</label>
            <div class="track-boxes taint">
              <div class="track-box" *ngFor="let box of [1,2,3,4,5,6,7,8,9,10]" 
                   [class.filled]="box <= (character()?.taint || 0)"></div>
            </div>
          </div>
        </div>

        <div class="techniques-section">
          <h3>TECHNIQUES, SORTS, KATA, KIHO, POUVOIRS DE L'OUTREMONDE</h3>
          <div class="techniques-list">
            <div class="technique-item" *ngFor="let spell of character()?.spells">
              {{ spell }}
            </div>
            <div class="technique-item" *ngFor="let kiho of character()?.kiho">
              {{ kiho }}
            </div>
          </div>
        </div>

        <div class="xp-section">
          <h3>POINTS D'EXPÉRIENCE</h3>
          <div class="xp-display">
            <div class="xp-item">
              <label>TOTAL</label>
              <span>{{ getTotalXP() }}</span>
            </div>
            <div class="xp-item">
              <label>NON DÉPENSÉ</label>
              <span>{{ getAvailableXP() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </mat-tab>

    <!-- Onglet: Background & Histoire -->
    <mat-tab label="Histoire & Relations">
      <div class="tab-content background-tab">
        <mat-card>
          <mat-card-header>
            <mat-card-title>
              Background du Personnage
            </mat-card-title>
          </mat-card-header>
          <mat-card-actions class="card-actions">
            <button mat-raised-button 
                    color="primary" 
                    (click)="toggleEditMode()"
                    [title]="editMode ? 'Sauvegarder' : 'Modifier'">
              {{ editMode ? '💾 Sauvegarder' : '✏️ Modifier' }}
            </button>
          </mat-card-actions>
          <mat-card-content>
            <div class="background-section">
              <h3>Objectif</h3>
              <textarea *ngIf="editMode" 
                        [(ngModel)]="editableCharacter.objective"
                        class="edit-textarea"
                        rows="3"></textarea>
              <p *ngIf="!editMode">{{ character()?.objective || 'Aucun objectif defini' }}</p>
            </div>
            <mat-divider></mat-divider>
            <div class="background-section">
              <h3>Personnalite</h3>
              <textarea *ngIf="editMode" 
                        [(ngModel)]="editableCharacter.personality"
                        class="edit-textarea"
                        rows="4"></textarea>
              <p *ngIf="!editMode">{{ character()?.personality || 'Aucune personnalite definie' }}</p>
            </div>
            <mat-divider></mat-divider>
            <div class="background-section">
              <h3>Histoire</h3>
              <textarea *ngIf="editMode" 
                        [(ngModel)]="editableCharacter.background"
                        class="edit-textarea"
                        rows="8"></textarea>
              <p class="background-text" *ngIf="!editMode">{{ character()?.background || 'Aucune histoire definie' }}</p>
            </div>
            
            <mat-divider></mat-divider>
            
            <!-- Alliés -->
            <div class="background-section">
              <h3>
                Alliés
                <button mat-raised-button 
                        (click)="forceGenerateAllies()"
                        title="Générer un allié">
                  +
                </button>
              </h3>
              <div class="npc-list" *ngIf="character()?.allies && character()!.allies!.length > 0">
                <mat-card class="npc-card ally-card" *ngFor="let ally of character()?.allies; let i = index">
                  <mat-card-header>
                    <mat-card-title *ngIf="!editMode">{{ ally.name }}</mat-card-title>
                    <input *ngIf="editMode" 
                           [(ngModel)]="ally.name" 
                           class="edit-input"
                           placeholder="Nom de l'allié">
                    <mat-card-subtitle *ngIf="!editMode">{{ ally.clan }} - {{ ally.school || 'Ecole inconnue' }}</mat-card-subtitle>
                    <div *ngIf="editMode" class="edit-row">
                      <input [(ngModel)]="ally.clan" class="edit-input" placeholder="Clan">
                      <input [(ngModel)]="ally.school" class="edit-input" placeholder="École">
                    </div>
                  </mat-card-header>
                  <mat-card-content>
                    <p><strong>Relation:</strong> {{ ally.relationship }}</p>
                    <p class="npc-description" *ngIf="!editMode">{{ ally.description }}</p>
                    <textarea *ngIf="editMode" 
                              [(ngModel)]="ally.description"
                              class="edit-textarea"
                              rows="3"
                              placeholder="Description de la relation"></textarea>
                  </mat-card-content>
                  <mat-card-actions *ngIf="editMode">
                    <button mat-raised-button color="warn" (click)="removeNPC('allies', i)">
                      🗑️ Supprimer
                    </button>
                  </mat-card-actions>
                </mat-card>
              </div>
              <p *ngIf="!character()?.allies || character()!.allies!.length === 0" class="no-items">
                {{ editMode ? 'Aucun allié - Cliquez pour en ajouter' : 'Aucun allié pour le moment' }}
              </p>
              <button mat-raised-button *ngIf="editMode" (click)="addNPC('allies')" class="add-npc-btn">
                + Ajouter un allié
              </button>
            </div>
            
            <!-- Ennemis -->
            <div class="background-section">
              <h3>
                Ennemis
                <button mat-raised-button 
                        (click)="forceGenerateEnemies()" 
                        title="Générer un ennemi">
                  +
                </button>
              </h3>
              <div class="npc-list" *ngIf="character()?.enemies && character()!.enemies!.length > 0">
                <mat-card class="npc-card enemy-card" *ngFor="let enemy of character()?.enemies; let i = index">
                  <mat-card-header>
                    <mat-card-title *ngIf="!editMode">{{ enemy.name }}</mat-card-title>
                    <input *ngIf="editMode" 
                           [(ngModel)]="enemy.name" 
                           class="edit-input"
                           placeholder="Nom de l'ennemi">
                    <mat-card-subtitle *ngIf="!editMode">{{ enemy.clan }} - {{ enemy.school || 'Ecole inconnue' }}</mat-card-subtitle>
                    <div *ngIf="editMode" class="edit-row">
                      <input [(ngModel)]="enemy.clan" class="edit-input" placeholder="Clan">
                      <input [(ngModel)]="enemy.school" class="edit-input" placeholder="École">
                    </div>
                  </mat-card-header>
                  <mat-card-content>
                    <p><strong>Relation:</strong> {{ enemy.relationship }}</p>
                    <p class="npc-description" *ngIf="!editMode">{{ enemy.description }}</p>
                    <textarea *ngIf="editMode" 
                              [(ngModel)]="enemy.description"
                              class="edit-textarea"
                              rows="3"
                              placeholder="Description de la relation"></textarea>
                  </mat-card-content>
                  <mat-card-actions *ngIf="editMode">
                    <button mat-raised-button color="warn" (click)="removeNPC('enemies', i)">
                      🗑️ Supprimer
                    </button>
                  </mat-card-actions>
                </mat-card>
              </div>
              <p *ngIf="!character()?.enemies || character()!.enemies!.length === 0" class="no-items">
                {{ editMode ? 'Aucun ennemi - Cliquez pour en ajouter' : 'Aucun ennemi pour le moment' }}
              </p>
              <button mat-raised-button *ngIf="editMode" (click)="addNPC('enemies')" class="add-npc-btn">
                + Ajouter un ennemi
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </mat-tab>    <!-- Onglet: Équipement Détaillé -->
    <mat-tab label="Équipement">
      <div class="tab-content equipment-tab">
        <mat-card>
          <mat-card-header>
            <mat-card-title>
              Arsenal et Équipement
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="money-section">
              <h3>Richesses</h3>
              <div class="money-display">
                <div class="coin-item">
                  <strong>Koku:</strong> {{ character()?.equipment?.koku || 0 }}
                </div>
              </div>
            </div>

            <mat-divider></mat-divider>

            <div class="weapons-section">
              <h3>Armes ({{ character()?.equipment?.weapons?.length || 0 }})</h3>
              <div class="equipment-list">
                <div class="equipment-card" *ngFor="let weapon of character()?.equipment?.weapons">
                  <h4>{{ weapon.name }}</h4>
                  <div class="item-stats">
                    <span *ngIf="weapon.damage"><strong>Dégâts:</strong> {{ weapon.damage }}</span>
                    <span *ngIf="weapon.reach"><strong>Portée:</strong> {{ weapon.reach }}</span>
                    <span *ngIf="weapon.TN"><strong>TN:</strong> {{ weapon.TN }}</span>
                  </div>
                  <p class="item-description">{{ weapon.description }}</p>
                  <p class="item-special" *ngIf="weapon.special"><em>{{ weapon.special }}</em></p>
                </div>
                <p *ngIf="!character()?.equipment?.weapons?.length" class="no-items">Aucune arme</p>
              </div>
            </div>

            <mat-divider></mat-divider>

            <div class="armor-section">
              <h3>Armure</h3>
              <div class="equipment-list">
                <div class="equipment-card" *ngIf="character()?.equipment?.armor as armor">
                  <h4>{{ getArmorName(armor) }}</h4>
                  <div class="item-stats">
                    <span><strong>Réduction:</strong> {{ getArmorReduction(armor) }}</span>
                  </div>
                  <p class="item-description">{{ getArmorDescription(armor) }}</p>
                </div>
                <p *ngIf="!character()?.equipment?.armor" class="no-items">Aucune armure</p>
              </div>
            </div>

            <mat-divider></mat-divider>

            <div class="items-section">
              <h3>Objets & Outils ({{ character()?.equipment?.items?.length || 0 }})</h3>
              <div class="equipment-list">
                <div class="equipment-card" *ngFor="let item of character()?.equipment?.items">
                  <h4>{{ item.name }}</h4>
                  <div class="item-stats" *ngIf="item.cost">
                    <span><strong>Valeur:</strong> {{ item.cost }}</span>
                  </div>
                  <p class="item-description">{{ item.description }}</p>
                </div>
                <p *ngIf="!character()?.equipment?.items?.length" class="no-items">Aucun objet</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </mat-tab>

    <!-- Onglet: Notes du Joueur -->
    <mat-tab label="Notes">
      <div class="tab-content notes-tab">
        <mat-card>
          <mat-card-header>
            <mat-card-title>
              Notes Personnelles
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="notes-section">
              <textarea
                class="notes-textarea"
                [(ngModel)]="characterNotes"
                (blur)="saveNotes()"
                placeholder="Écrivez vos notes ici... (sauvegarde automatique)"
                rows="20"
              ></textarea>
              <div class="notes-info">
                <span>ℹ️ Les notes sont sauvegardées automatiquement</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </mat-tab>
  </mat-tab-group>
    </div>
  `,
  styles: [`
    .character-sheet-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      text-align: center;
      margin-bottom: 32px;
    }

    .header h1 {
      color: #d4af37;
      font-size: 2.5rem;
      margin: 16px 0 8px 0;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .character-subtitle {
      color: #ff6b6b;
      font-size: 1.2rem;
      margin: 0;
    }

    .tab-content {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }

    .rings-display {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }

    .ring-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px;
      background: rgba(212, 175, 55, 0.1);
      border-radius: 8px;
      min-width: 80px;
    }

    .ring-label {
      font-weight: bold;
      color: #d4af37;
      margin-bottom: 4px;
    }

    .ring-value {
      font-size: 1.5rem;
      color: #ff6b6b;
    }

    .traits-display {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .skills-card mat-chip {
      margin: 4px;
    }

    .school-skill {
      background-color: rgba(212, 175, 55, 0.2) !important;
    }

    .npc-info, .advantage-info, .disadvantage-info, .spell-info, .kiho-info, .equipment-info {
      width: 100%;
      padding: 12px 0;
    }

    .npc-info h4, .advantage-info h4, .disadvantage-info h4, .spell-info h4, .kiho-info h4, .equipment-info h4 {
      color: #d4af37;
      margin: 0 0 8px 0;
    }

    .npc-description, .equipment-description {
      font-style: italic;
      color: #ff9999;
      margin-top: 8px;
    }

    .xp-cost {
      color: #d4af37;
      font-weight: bold;
    }

    .xp-gain {
      color: #90ee90;
      font-weight: bold;
    }

    .enemies-card {
      border-left: 4px solid #ff6b6b;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .traits-display {
        grid-template-columns: 1fr;
      }

      .header h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class CharacterSheet implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private characterService = inject(CharacterService);
  
  character = signal<Character | null>(null);
  characterNotes = '';
  showXpDialog = false;
  xpToAdd = 0;
  editMode = false;
  editableCharacter: any = {
    objective: '',
    personality: '',
    background: ''
  };

  ngOnInit() {
    // Charger le personnage depuis les paramètres de route ou localStorage
    const characterId = this.route.snapshot.params['id'];
    if (characterId) {
      this.loadCharacterById(characterId);
    }
  }

  addExperience() {
    const char = this.character();
    if (!char || this.xpToAdd <= 0) return;

    // Ajouter l'XP au total et aux points disponibles
    const currentTotal = char.totalExperiencePoints || (char.experiencePoints + char.spentExperiencePoints);
    char.totalExperiencePoints = currentTotal + this.xpToAdd;
    char.experiencePoints += this.xpToAdd;

    // Sauvegarder les changements
    this.saveCharacter(char);

    // Réinitialiser et fermer le dialog
    this.xpToAdd = 0;
    this.showXpDialog = false;

    console.log('[CharacterSheet] XP ajoutés avec succès');
  }

  toggleEditMode() {
    const char = this.character();
    if (!char) return;

    if (this.editMode) {
      // Sauvegarder lors de la sortie du mode édition
      this.saveCharacter(char);
    }
    
    this.editMode = !this.editMode;
  }

  forceGenerateAllies() {
    const char = this.character();
    if (!char) return;

    console.log('[CharacterSheet] Force génération d\'un allié...');
    
    // Générer UN seul allié avec un vrai nom japonais
    const ally = this.characterService['generateRandomNPC']('Allié');
    
    console.log('[CharacterSheet] Allié généré:', ally);
    
    if (!char.allies) char.allies = [];
    char.allies.push(ally);
    
    this.character.set({...char});
    this.saveCharacter(char);
  }

  forceGenerateEnemies() {
    const char = this.character();
    if (!char) return;

    console.log('[CharacterSheet] Force génération d\'un ennemi...');
    
    // Générer UN seul ennemi avec un vrai nom japonais
    const enemy = this.characterService['generateRandomNPC']('Ennemi');
    
    console.log('[CharacterSheet] Ennemi généré:', enemy);
    
    if (!char.enemies) char.enemies = [];
    char.enemies.push(enemy);
    
    this.character.set({...char});
    this.saveCharacter(char);
  }

  addNPC(type: 'allies' | 'enemies') {
    const char = this.character();
    if (!char) return;

    const newNPC: NPC = {
      name: type === 'allies' ? 'Nouvel allié' : 'Nouvel ennemi',
      clan: 'Clan inconnu',
      relationship: type === 'allies' ? 'Allié' : 'Ennemi',
      description: type === 'allies' 
        ? 'Un allié loyal qui vous soutient dans vos aventures...' 
        : 'Un ennemi qui cherche à entraver vos plans...'
    };

    if (type === 'allies') {
      if (!char.allies) char.allies = [];
      char.allies.push(newNPC);
    } else {
      if (!char.enemies) char.enemies = [];
      char.enemies.push(newNPC);
    }

    this.character.set({...char});
  }

  removeNPC(type: 'allies' | 'enemies', index: number) {
    const char = this.character();
    if (!char) return;

    if (type === 'allies' && char.allies) {
      char.allies.splice(index, 1);
    } else if (type === 'enemies' && char.enemies) {
      char.enemies.splice(index, 1);
    }

    this.character.set({...char});
  }

  private saveCharacter(char: Character) {
    // Sauvegarder les modifications du mode édition
    if (this.editMode) {
      char.objective = this.editableCharacter.objective;
      char.personality = this.editableCharacter.personality;
      char.background = this.editableCharacter.background;
      this.editMode = false;
    }

    const saved = localStorage.getItem('myCharacters');
    if (saved) {
      try {
        const characters = JSON.parse(saved);
        const index = characters.findIndex((c: Character) => String(c.id) === String(char.id));
        if (index >= 0) {
          characters[index] = char;
          localStorage.setItem('myCharacters', JSON.stringify(characters));
          this.character.set(char);
        }
      } catch (error) {
        console.error('[CharacterSheet] Erreur lors de la sauvegarde:', error);
      }
    }
  }

  loadCharacterById(id: string) {
    console.log('[CharacterSheet] Recherche du personnage avec ID:', id);
    const saved = localStorage.getItem('myCharacters');
    if (saved) {
      try {
        const characters = JSON.parse(saved);
        console.log('[CharacterSheet] Personnages trouves dans localStorage:', characters.length);
        console.log('[CharacterSheet] Liste des IDs:', characters.map((c: Character) => c.id));
        
        // Convertir les deux en chaînes pour la comparaison
        const found = characters.find((c: Character) => String(c.id) === String(id));
        if (found) {
          console.log('[CharacterSheet] Personnage trouve:', found.name);
          this.character.set(found);
          this.characterNotes = found.notes || '';
          
          // Initialiser editableCharacter avec les valeurs actuelles
          this.editableCharacter = {
            objective: found.objective || '',
            personality: found.personality || '',
            background: found.background || ''
          };
        } else {
          console.error('[CharacterSheet] Personnage NON trouve avec ID:', id);
          console.log('[CharacterSheet] IDs disponibles:', characters.map((c: Character) => `${c.name} (${c.id})`));
          this.router.navigate(['/characters']);
        }
      } catch (error) {
        console.error('[CharacterSheet] Erreur lors du chargement du personnage:', error);
        this.router.navigate(['/characters']);
      }
    } else {
      console.error('[CharacterSheet] Aucun personnage dans localStorage');
      this.router.navigate(['/characters']);
    }
  }

  saveNotes() {
    const char = this.character();
    if (!char) return;

    const saved = localStorage.getItem('myCharacters');
    if (saved) {
      try {
        const characters = JSON.parse(saved);
        const index = characters.findIndex((c: Character) => c.id === char.id);
        if (index >= 0) {
          characters[index].notes = this.characterNotes;
          localStorage.setItem('myCharacters', JSON.stringify(characters));
        }
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des notes:', error);
      }
    }
  }

  // Méthodes helper pour le template
  getRingValue(ring: string): number {
    const char = this.character();
    if (!char || !char.rings) return 1;
    return char.rings[ring as keyof typeof char.rings] || 1;
  }

  getVoidPointsArray(): number[] {
    const char = this.character();
    if (!char || !char.rings) return [];
    return Array(char.rings.vide || 1).fill(0);
  }

  getNobleSkills() {
    const char = this.character();
    if (!char || !char.skills) return [];
    const nobleSkillIds = ['Calligraphie', 'Étiquette', 'Courtisan', 'Diplomatie', 'Sincérité', 'Cérémonie du thé'];
    return char.skills.filter(s => nobleSkillIds.includes(s.name));
  }

  getMerchantSkills() {
    const char = this.character();
    if (!char || !char.skills) return [];
    const merchantSkillIds = ['Commerce', 'Artisan', 'Artisanat', 'Représentation', 'Herboristerie'];
    return char.skills.filter(s => merchantSkillIds.includes(s.name));
  }

  getBugeiSkills() {
    const char = this.character();
    if (!char || !char.skills) return [];
    const bugeiSkillIds = ['Kenjutsu', 'Iaijutsu', 'Kyujutsu', 'Jiujutsu', 'Défense', 'Athlétisme', 'Chasse', 'Furtivité'];
    return char.skills.filter(s => bugeiSkillIds.includes(s.name));
  }

  getWoundBoxes(level: string): number[] {
    const char = this.character();
    if (!char) return [];
    const levels: { [key: string]: keyof typeof char.woundLevels } = {
      'healthy': 'healthy',
      'nicked': 'nicked',
      'grazed': 'grazed',
      'hurt': 'hurt',
      'injured': 'injured',
      'crippled': 'crippled',
      'down': 'down',
      'out': 'out'
    };
    const levelKey = levels[level];
    const woundValue = char.woundLevels[levelKey] || 0;
    return Array(Math.floor(woundValue / 2)).fill(0); // Division par 2 pour avoir le nombre de cases
  }

  getTN(): number {
    const char = this.character();
    if (!char || !char.traits) return 0;
    const reflexes = char.traits.reflexes || 1;
    return (reflexes * 5) + 5;
  }

  getInitiative(): string {
    const char = this.character();
    if (!char || !char.rings || !char.traits) return '0k0';
    const reflexes = char.traits.reflexes || 1;
    const insight = char.rings.vide || 1;
    return `${reflexes}k${insight}`;
  }

  getAllEquipment(): Equipment[] {
    const char = this.character();
    if (!char || !char.equipment) return [];
    const items: Equipment[] = [];
    
    // Armes
    if (char.equipment.weapons) {
      items.push(...char.equipment.weapons);
    }
    
    // Armure
    if (char.equipment.armor) {
      if (Array.isArray(char.equipment.armor)) {
        items.push(...char.equipment.armor);
      } else {
        items.push(char.equipment.armor);
      }
    }
    
    // Autres items
    if (char.equipment.items) {
      items.push(...char.equipment.items);
    }
    
    return items;
  }

  getTotalXP(): number {
    const char = this.character();
    if (!char) return 0;
    
    let total = 0;
    
    // XP pour les compétences
    if (char.skills) {
      char.skills.forEach(skill => {
        for (let i = 1; i <= skill.rank; i++) {
          total += i;
        }
      });
    }
    
    // XP pour les traits
    if (char.traits) {
      Object.values(char.traits).forEach(traitValue => {
        for (let i = 2; i <= traitValue; i++) {
          total += i * 2;
        }
      });
    }
    
    // XP pour les anneaux (vide)
    if (char.rings && char.rings.vide > 2) {
      for (let i = 3; i <= char.rings.vide; i++) {
        total += i * 6;
      }
    }
    
    return total;
  }

  getAvailableXP(): number {
    const char = this.character();
    if (!char) return 0;
    
    let startingXP = 40; // XP de départ standard
    const totalXP = this.getTotalXP();
    
    return startingXP - totalXP;
  }

  // Méthodes utilitaires pour récupérer les informations
  getAdvantageName(id: string): string {
    return ADVANTAGES.find(a => a.id === id)?.name || 'Inconnu';
  }

  getAdvantageDescription(id: string): string {
    return ADVANTAGES.find(a => a.id === id)?.description || '';
  }

  getAdvantageCost(id: string): number {
    return ADVANTAGES.find(a => a.id === id)?.cost || 0;
  }

  getDisadvantageName(id: string): string {
    return DISADVANTAGES.find(d => d.id === id)?.name || 'Inconnu';
  }

  getDisadvantageDescription(id: string): string {
    return DISADVANTAGES.find(d => d.id === id)?.description || '';
  }

  getDisadvantageGain(id: string): number {
    return DISADVANTAGES.find(d => d.id === id)?.xpGain || 0;
  }

  getSpellElement(name: string): string {
    const spell = SPELLS.find(s => s.name === name) || MAHO_SPELLS.find(s => s.name === name);
    return spell?.element || 'Inconnu';
  }

  getSpellMastery(name: string): number {
    const spell = SPELLS.find(s => s.name === name) || MAHO_SPELLS.find(s => s.name === name);
    return spell?.mastery || 0;
  }

  getSpellDescription(name: string): string {
    const spell = SPELLS.find(s => s.name === name) || MAHO_SPELLS.find(s => s.name === name);
    return spell?.description || '';
  }

  getKihoType(name: string): string {
    return KIHO.find(k => k.name === name)?.type || 'Inconnu';
  }

  getKihoElement(name: string): string {
    return KIHO.find(k => k.name === name)?.element || 'Inconnu';
  }

  getKihoDescription(name: string): string {
    return KIHO.find(k => k.name === name)?.description || '';
  }

  getArmorName(armor: Equipment | Equipment[] | undefined): string {
    if (!armor) return 'Aucune';
    if (Array.isArray(armor)) {
      return armor.length > 0 ? armor[0].name : 'Aucune';
    }
    return armor.name;
  }

  getArmorReduction(armor: Equipment | Equipment[] | undefined): number {
    if (!armor) return 0;
    if (Array.isArray(armor)) {
      return armor.length > 0 ? (armor[0].reduction || 0) : 0;
    }
    return armor.reduction || 0;
  }

  getArmorDescription(armor: Equipment | Equipment[] | undefined): string {
    if (!armor) return '';
    if (Array.isArray(armor)) {
      return armor.length > 0 ? armor[0].description : '';
    }
    return armor.description;
  }
}
