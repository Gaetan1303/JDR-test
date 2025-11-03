import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

import { SPELLS } from '../data/spells.data';
import { WEAPONS, ARMOR, ITEMS } from '../data/equipment.data';
import { SCHOOLS } from '../data/schools.data';
import { CLANS } from '../data/clans.data';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  template: `
    <div class="library-container">
      <div class="header">
        <h1>Bibliothèque L5A</h1>
        <p>Ressources complètes pour Légende des 5 Anneaux - 4e édition</p>
      </div>

      <mat-tab-group class="library-tabs">
        <!-- Onglet Sorts -->
        <mat-tab label="Sorts ({{ SPELLS.length }})">
          <div class="tab-content">
            <div class="search-bar">
              <mat-form-field appearance="outline">
                <mat-label>Rechercher un sort</mat-label>
                <input matInput [(ngModel)]="spellFilter" placeholder="Nom du sort...">
              </mat-form-field>
            </div>

            <div class="filter-chips">
              <mat-chip-set>
                <mat-chip 
                  *ngFor="let element of ['Tous', 'Air', 'Terre', 'Eau', 'Feu', 'Vide', 'Universels']"
                  [class.selected]="selectedSpellElement() === element"
                  (click)="selectedSpellElement.set(element)">
                  {{ element }}
                </mat-chip>
              </mat-chip-set>
            </div>

            <div class="items-grid">
              <mat-card *ngFor="let spell of filteredSpells()" class="item-card">
                <mat-card-header>
                  <mat-card-title>
                    {{ spell.name }}
                    <span *ngIf="spell.universal" class="universal-badge">[Universel]</span>
                  </mat-card-title>
                  <mat-card-subtitle>
                    Niveau {{ spell.mastery }} - {{ spell.element }}
                  </mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <div class="spell-stats">
                    <p><strong>Portée:</strong> {{ spell.range }}</p>
                    <p><strong>Zone:</strong> {{ spell.area }}</p>
                    <p><strong>Durée:</strong> {{ spell.duration }}</p>
                    <p *ngIf="spell.raises"><strong>Augmentations:</strong> {{ spell.raises }}</p>
                  </div>
                  <p class="description">{{ spell.description }}</p>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <!-- Onglet Équipement -->
        <mat-tab label="Équipement ({{ EQUIPMENT.length }})">
          <div class="tab-content">
            <div class="search-bar">
              <mat-form-field appearance="outline">
                <mat-label>Rechercher un équipement</mat-label>
                <input matInput [(ngModel)]="equipmentFilter" placeholder="Nom de l'équipement...">
              </mat-form-field>
            </div>

            <div class="filter-chips">
              <mat-chip-set>
                <mat-chip 
                  *ngFor="let type of ['Tous', 'weapon', 'armor', 'item', 'tool', 'clothing']"
                  [class.selected]="selectedEquipmentType() === type"
                  (click)="selectedEquipmentType.set(type)">
                  {{ getEquipmentTypeLabel(type) }}
                </mat-chip>
              </mat-chip-set>
            </div>

            <div class="items-grid">
              <mat-card *ngFor="let equipment of filteredEquipment()" class="item-card">
                <mat-card-header>
                  <mat-card-title>{{ equipment.name }}</mat-card-title>
                  <mat-card-subtitle>
                    {{ getEquipmentTypeLabel(equipment.type) }}
                    <span *ngIf="equipment.cost"> - {{ equipment.cost }} Koku</span>
                  </mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <div class="equipment-stats">
                    <p *ngIf="equipment.damage"><strong>Dégâts:</strong> {{ equipment.damage }}</p>
                    <p *ngIf="equipment.reach"><strong>Allonge:</strong> {{ equipment.reach }}</p>
                    <p *ngIf="equipment.TN"><strong>TN:</strong> {{ equipment.TN }}</p>
                    <p *ngIf="equipment.reduction"><strong>Réduction:</strong> {{ equipment.reduction }}</p>
                    <p *ngIf="equipment.weight"><strong>Poids:</strong> {{ equipment.weight }}</p>
                  </div>
                  <p class="description">{{ equipment.description }}</p>
                  <p *ngIf="equipment.special" class="special"><strong>Spécial:</strong> {{ equipment.special }}</p>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <!-- Onglet Écoles -->
        <mat-tab label="Écoles ({{ SCHOOLS.length }})">
          <div class="tab-content">
            <div class="search-bar">
              <mat-form-field appearance="outline">
                <mat-label>Rechercher une école</mat-label>
                <input matInput [(ngModel)]="schoolFilter" placeholder="Nom de l'école...">
              </mat-form-field>
            </div>

            <div class="filter-chips">
              <mat-chip-set>
                <mat-chip 
                  *ngFor="let type of ['Tous', 'bushi', 'shugenja', 'courtier', 'moine', 'ninja', 'artisan']"
                  [class.selected]="selectedSchoolType() === type"
                  (click)="selectedSchoolType.set(type)">
                  {{ getSchoolTypeLabel(type) }}
                </mat-chip>
              </mat-chip-set>
            </div>

            <div class="items-grid">
              <mat-card *ngFor="let school of filteredSchools()" class="item-card">
                <mat-card-header>
                  <mat-card-title>{{ school.name }}</mat-card-title>
                  <mat-card-subtitle>
                    {{ getSchoolTypeLabel(school.type) }} - {{ school.clan }}
                  </mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <div class="school-info">
                    <p><strong>Trait bonus:</strong> {{ school.traitBonus }}</p>
                    <p><strong>Honneur:</strong> {{ school.honor }}</p>
                    <p><strong>Compétences:</strong> {{ school.skills.join(', ') }}</p>
                  </div>
                  <p class="technique"><strong>Technique:</strong> {{ school.technique }}</p>
                  <div *ngIf="school.spellLimits" class="spell-limits">
                    <p><strong>Sorts autorisés:</strong> {{ school.spellLimits.rank1 }} rang 1, {{ school.spellLimits.rank2 }} rang 2</p>
                    <p *ngIf="school.spellLimits.affinity"><strong>Affinité:</strong> {{ school.spellLimits.affinity }}</p>
                    <p *ngIf="school.spellLimits.deficiency"><strong>Déficience:</strong> {{ school.spellLimits.deficiency }}</p>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <!-- Onglet Clans -->
        <mat-tab label="Clans ({{ CLANS.length }})">
          <div class="tab-content">
            <div class="items-grid">
              <mat-card *ngFor="let clan of CLANS" class="item-card clan-card">
                <mat-card-header>
                  <mat-card-title>{{ clan.name }}</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <p class="description">{{ clan.description }}</p>
                  <div class="clan-families">
                    <h4>Familles</h4>
                    <mat-chip-set>
                      <mat-chip *ngFor="let family of clan.families">
                        {{ family.name }}
                      </mat-chip>
                    </mat-chip-set>
                  </div>
                  <div class="clan-schools">
                    <h4>Écoles</h4>
                    <mat-chip-set>
                      <mat-chip *ngFor="let school of clan.schools">
                        {{ school.name }}
                      </mat-chip>
                    </mat-chip-set>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .library-container {
      padding: 24px;
      max-width: 1400px;
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
                    url('/assets/images/Monastere.png');
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
        z-index: -1;
        opacity: 0.5;
      }
    }

    .header {
      text-align: center;
      margin-bottom: 32px;
    }

    .header h1 {
      color: #1976d2;
      margin-bottom: 16px;
    }

    .header p {
      color: #666;
      font-size: 1.1rem;
    }

    .library-tabs {
      min-height: 600px;
    }

    .tab-content {
      padding: 24px 0;
    }

    .search-bar {
      margin-bottom: 24px;
    }

    .search-bar mat-form-field {
      width: 400px;
      max-width: 100%;
    }

    .filter-chips {
      margin-bottom: 24px;
    }

    .filter-chips mat-chip {
      margin-right: 8px;
      cursor: pointer;
    }

    .filter-chips mat-chip.selected {
      background-color: #1976d2;
      color: white;
    }

    .items-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 24px;
    }

    .item-card {
      height: fit-content;
    }

    .item-card mat-card-title {
      color: #1976d2;
    }

    .spell-stats, .equipment-stats, .school-info {
      margin-bottom: 16px;
    }

    .spell-stats p, .equipment-stats p, .school-info p {
      margin: 4px 0;
    }

    .description {
      font-style: italic;
      color: #555;
      line-height: 1.5;
    }

    .technique {
      font-style: italic;
      color: #333;
      line-height: 1.5;
      margin-top: 12px;
    }

    .special {
      color: #d32f2f;
      font-weight: 500;
      margin-top: 8px;
    }

    .universal-badge {
      background-color: #ffd700;
      color: #333;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: bold;
      margin-left: 8px;
    }

    .spell-limits {
      margin-top: 12px;
      padding: 8px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }

    .clan-card {
      min-height: 300px;
    }

    .clan-families, .clan-schools {
      margin-top: 16px;
    }

    .clan-families h4, .clan-schools h4 {
      margin: 8px 0;
      color: #1976d2;
    }

    @media (max-width: 1024px) {
      .items-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      }
    }

    @media (max-width: 768px) {
      .items-grid {
        grid-template-columns: 1fr;
      }
      
      .library-container {
        padding: 16px;
      }

      .search-bar mat-form-field {
        width: 100%;
      }
      
      .header h1 {
        font-size: 1.8rem;
      }
      
      .header p {
        font-size: 1rem;
      }
      
      .library-tabs {
        min-height: 400px;
      }
      
      .filter-chips mat-chip {
        font-size: 0.85rem;
        margin-bottom: 8px;
      }
    }
    
    @media (max-width: 480px) {
      .tab-content {
        padding: 12px 0;
      }
      
      .item-card {
        mat-card-title {
          font-size: 1rem;
        }
        
        mat-card-subtitle {
          font-size: 0.85rem;
        }
      }
      
      .clan-card {
        min-height: auto;
      }
    }
  `]
})
export class Library {
  // Données
  readonly SPELLS = SPELLS;
  readonly EQUIPMENT = [...WEAPONS, ...ARMOR, ...ITEMS];
  readonly SCHOOLS = SCHOOLS;
  readonly CLANS = CLANS;

  // Filtres
  spellFilter = '';
  equipmentFilter = '';
  schoolFilter = '';

  // Sélections de filtres
  selectedSpellElement = signal('Tous');
  selectedEquipmentType = signal('Tous');
  selectedSchoolType = signal('Tous');

  // Computed pour les listes filtrées
  filteredSpells = computed(() => {
    let spells = this.SPELLS;

    // Filtre par texte
    if (this.spellFilter) {
      spells = spells.filter(spell => 
        spell.name.toLowerCase().includes(this.spellFilter.toLowerCase()) ||
        spell.description.toLowerCase().includes(this.spellFilter.toLowerCase())
      );
    }

    // Filtre par élément
    const element = this.selectedSpellElement();
    if (element !== 'Tous') {
      if (element === 'Universels') {
        spells = spells.filter(spell => spell.universal);
      } else {
        spells = spells.filter(spell => spell.element === element && !spell.universal);
      }
    }

    return spells;
  });

  filteredEquipment = computed(() => {
    let equipment = this.EQUIPMENT;

    // Filtre par texte
    if (this.equipmentFilter) {
      equipment = equipment.filter(eq => 
        eq.name.toLowerCase().includes(this.equipmentFilter.toLowerCase()) ||
        eq.description.toLowerCase().includes(this.equipmentFilter.toLowerCase())
      );
    }

    // Filtre par type
    const type = this.selectedEquipmentType();
    if (type !== 'Tous') {
      equipment = equipment.filter(eq => eq.type === type);
    }

    return equipment;
  });

  filteredSchools = computed(() => {
    let schools = this.SCHOOLS;

    // Filtre par texte
    if (this.schoolFilter) {
      schools = schools.filter(school => 
        school.name.toLowerCase().includes(this.schoolFilter.toLowerCase()) ||
        school.clan.toLowerCase().includes(this.schoolFilter.toLowerCase()) ||
        school.technique.toLowerCase().includes(this.schoolFilter.toLowerCase())
      );
    }

    // Filtre par type
    const type = this.selectedSchoolType();
    if (type !== 'Tous') {
      schools = schools.filter(school => school.type === type);
    }

    return schools;
  });

  getEquipmentTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'Tous': 'Tous',
      'weapon': 'Armes',
      'armor': 'Armures',
      'item': 'Objets',
      'tool': 'Outils',
      'clothing': 'Vêtements'
    };
    return labels[type] || type;
  }

  getSchoolTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'Tous': 'Tous',
      'bushi': 'Bushi',
      'shugenja': 'Shugenja',
      'courtier': 'Courtisan',
      'moine': 'Moine',
      'ninja': 'Ninja',
      'artisan': 'Artisan'
    };
    return labels[type] || type;
  }
}