import { Component, signal, computed } from '@angular/core';

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
        <p>Ressources complètes pour Légende des 5 Anneaux</p>
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
                @for (element of spellElements(); track element) {
                  <mat-chip 
                    [class.selected]="selectedSpellElement() === element"
                    (click)="selectedSpellElement.set(element)">
                    {{ element }}
                  </mat-chip>
                }
              </mat-chip-set>
            </div>

            <div class="items-grid">
              @for (spell of filteredSpells(); track spell.name) {
                <mat-card class="item-card">
                  <mat-card-header>
                    <mat-card-title>
                      {{ spell.name }}
                      @if (spell.universal) {
                        <span class="universal-badge">[Universel]</span>
                      }
                    </mat-card-title>
                    <mat-card-subtitle>
                      <div class="spell-badges">
                        <span class="element-badge" [attr.data-element]="spell.element.toLowerCase()">
                          {{ spell.element }}
                        </span>
                        <span class="mastery-badge" [attr.data-mastery]="spell.mastery">
                          Rang {{ spell.mastery }}
                        </span>
                      </div>
                    </mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="spell-stats">
                      <p><strong>Portée:</strong> {{ spell.range }}</p>
                      <p><strong>Zone:</strong> {{ spell.area }}</p>
                      <p><strong>Durée:</strong> {{ spell.duration }}</p>
                      @if (spell.raises) {
                        <p><strong>Augmentations:</strong> {{ spell.raises }}</p>
                      }
                    </div>
                    <p class="description">{{ spell.description }}</p>
                  </mat-card-content>
                </mat-card>
              }
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
                @for (type of equipmentTypes(); track type) {
                  <mat-chip 
                    [class.selected]="selectedEquipmentType() === type"
                    (click)="selectedEquipmentType.set(type)">
                    {{ getEquipmentTypeLabel(type) }}
                  </mat-chip>
                }
              </mat-chip-set>
            </div>

            <div class="items-grid">
              @for (equipment of filteredEquipment(); track equipment.name) {
                <mat-card class="item-card">
                  <mat-card-header>
                    <mat-card-title>{{ equipment.name }}</mat-card-title>
                    <mat-card-subtitle>
                      {{ getEquipmentTypeLabel(equipment.type) }}
                      @if (equipment.cost) {
                        <span> - {{ equipment.cost }} Koku</span>
                      }
                    </mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="equipment-stats">
                      @if (equipment.damage) {
                        <p><strong>Dégâts:</strong> {{ equipment.damage }}</p>
                      }
                      @if (equipment.reach) {
                        <p><strong>Allonge:</strong> {{ equipment.reach }}</p>
                      }
                      @if (equipment.TN) {
                        <p><strong>TN:</strong> {{ equipment.TN }}</p>
                      }
                      @if (equipment.reduction) {
                        <p><strong>Réduction:</strong> {{ equipment.reduction }}</p>
                      }
                      @if (equipment.weight) {
                        <p><strong>Poids:</strong> {{ equipment.weight }}</p>
                      }
                    </div>
                    <p class="description">{{ equipment.description }}</p>
                    @if (equipment.special) {
                      <p class="special"><strong>Spécial:</strong> {{ equipment.special }}</p>
                    }
                  </mat-card-content>
                </mat-card>
              }
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
                @for (type of schoolTypes(); track type) {
                  <mat-chip 
                    [class.selected]="selectedSchoolType() === type"
                    (click)="selectedSchoolType.set(type)">
                    {{ getSchoolTypeLabel(type) }}
                  </mat-chip>
                }
              </mat-chip-set>
            </div>

            <div class="items-grid">
              @for (school of filteredSchools(); track school.name) {
                <mat-card class="item-card">
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
                    @if (school.spellLimits) {
                      <div class="spell-limits">
                        <p><strong>Sorts autorisés:</strong> {{ school.spellLimits.rank1 }} rang 1, {{ school.spellLimits.rank2 }} rang 2</p>
                        @if (school.spellLimits.affinity) {
                          <p><strong>Affinité:</strong> {{ school.spellLimits.affinity }}</p>
                        }
                        @if (school.spellLimits.deficiency) {
                          <p><strong>Déficience:</strong> {{ school.spellLimits.deficiency }}</p>
                        }
                      </div>
                    }
                  </mat-card-content>
                </mat-card>
              }
            </div>
          </div>
        </mat-tab>

        <!-- Onglet Clans -->
        <mat-tab label="Clans ({{ CLANS.length }})">
          <div class="tab-content">
            <div class="items-grid">
              @for (clan of clansArray(); track clan.name) {
                <mat-card class="item-card clan-card">
                  <mat-card-header>
                    <mat-card-title>{{ clan.name }}</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <p class="description">{{ clan.description }}</p>
                    <div class="clan-families">
                      <h4>Familles</h4>
                      <mat-chip-set>
                        @for (family of clan.families; track family.name) {
                          <mat-chip>
                            {{ family.name }}
                          </mat-chip>
                        }
                      </mat-chip-set>
                    </div>
                    <div class="clan-schools">
                      <h4>Écoles</h4>
                      <mat-chip-set>
                        @for (school of clan.schools; track school.name) {
                          <mat-chip>
                            {{ school.name }}
                          </mat-chip>
                        }
                      </mat-chip-set>
                    </div>
                  </mat-card-content>
                </mat-card>
              }
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    ::ng-deep .library-tabs .mat-mdc-tab-label {
      color: #FFD700 !important;
      font-weight: bold;
      font-size: 1.1em;
      letter-spacing: 0.5px;
    }
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
                    url('/src/styles/assets/images/Monastere.png');
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

    .spell-badges {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 4px;
    }

    .element-badge {
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: inline-block;
    }

    .element-badge[data-element="air"] {
      background: linear-gradient(135deg, #e3f2fd 0%, #90caf9 100%);
      color: #0d47a1;
      border: 1px solid #64b5f6;
    }

    .element-badge[data-element="terre"] {
      background: linear-gradient(135deg, #efebe9 0%, #bcaaa4 100%);
      color: #3e2723;
      border: 1px solid #8d6e63;
    }

    .element-badge[data-element="eau"] {
      background: linear-gradient(135deg, #e0f7fa 0%, #80deea 100%);
      color: #006064;
      border: 1px solid #4dd0e1;
    }

    .element-badge[data-element="feu"] {
      background: linear-gradient(135deg, #ffebee 0%, #ef9a9a 100%);
      color: #b71c1c;
      border: 1px solid #e57373;
    }

    .element-badge[data-element="vide"] {
      background: linear-gradient(135deg, #f3e5f5 0%, #ce93d8 100%);
      color: #4a148c;
      border: 1px solid #ba68c8;
    }

    .mastery-badge {
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
      display: inline-block;
    }

    .mastery-badge[data-mastery="1"] {
      background-color: #e8f5e9;
      color: #2e7d32;
      border: 1px solid #66bb6a;
    }

    .mastery-badge[data-mastery="2"] {
      background-color: #fff3e0;
      color: #e65100;
      border: 1px solid #fb8c00;
    }

    .mastery-badge[data-mastery="3"] {
      background-color: #fce4ec;
      color: #c2185b;
      border: 1px solid #ec407a;
    }

    .mastery-badge[data-mastery="4"] {
      background-color: #ede7f6;
      color: #5e35b1;
      border: 1px solid #7e57c2;
    }

    .mastery-badge[data-mastery="5"] {
      background-color: #e0e0e0;
      color: #424242;
      border: 1px solid #757575;
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

  // Computed pour les tableaux de filtres
  spellElements = computed(() => ['Tous', 'Air', 'Terre', 'Eau', 'Feu', 'Vide', 'Universels']);
  equipmentTypes = computed(() => ['Tous', 'weapon', 'armor', 'item', 'tool', 'clothing']);
  schoolTypes = computed(() => ['Tous', 'bushi', 'shugenja', 'courtier', 'moine', 'ninja', 'artisan']);
  clansArray = computed(() => this.CLANS);

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