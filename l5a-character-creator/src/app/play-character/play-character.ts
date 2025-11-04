import { Component, signal, computed, OnInit } from '@angular/core';

import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { CharacterService } from '../services/character.service';
import { Character } from '../models/character.model';

interface RandomEvent {
  id: string;
  title: string;
  description: string;
  type: 'social' | 'combat' | 'exploration' | 'craft';
  difficulty: number;
  trait: string; // Trait à utiliser pour le jet de dés
  skill?: string; // Compétence optionnelle
  rewards: {
    honor?: number;
    gold?: number;
    items?: string[];
  };
  consequences?: string;
}

@Component({
  selector: 'app-play-character',
  standalone: true,
  imports: [
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    MatChipsModule
],
  templateUrl: './play-character.html',
  styleUrls: ['./play-character.scss']
})
export class PlayCharacter implements OnInit {
  characters = signal<Character[]>([]);
  selectedCharacter = signal<Character | null>(null);
  currentEvent = signal<RandomEvent | null>(null);
  eventHistory = signal<RandomEvent[]>([]);
  diceResult = signal<number | null>(null);
  isRolling = signal<boolean>(false);
  
  canPlayEvent = computed(() => this.selectedCharacter() !== null && this.currentEvent() === null);
  canRollDice = computed(() => this.currentEvent() !== null && this.diceResult() === null);

  private randomEvents: RandomEvent[] = [
    {
      id: 'evt_duel',
      title: 'Défi en duel',
      description: 'Un samouraï vous défie en duel d\'honneur. Acceptez-vous le défi ?',
      type: 'combat',
      difficulty: 15,
      trait: 'Agilité',
      skill: 'Kenjutsu',
      rewards: { honor: 5 },
      consequences: 'Victoire : +5 Honneur | Défaite : -5 Honneur'
    },
    {
      id: 'evt_tea',
      title: 'Cérémonie du thé',
      description: 'Vous êtes invité à une prestigieuse cérémonie du thé avec un seigneur.',
      type: 'social',
      difficulty: 12,
      trait: 'Intelligence',
      skill: 'Étiquette',
      rewards: { honor: 3 },
      consequences: 'Succès : +3 Honneur | Échec : -2 Honneur'
    },
    {
      id: 'evt_craft_sword',
      title: 'Forger une lame',
      description: 'Un forgeron vous propose de l\'aider à créer une katana exceptionnelle.',
      type: 'craft',
      difficulty: 18,
      trait: 'Force',
      skill: 'Artisanat (Forgeron)',
      rewards: { items: ['Katana supérieure (+1k0)'] },
      consequences: 'Réussite : Katana améliorée | Échec : Temps perdu'
    },
    {
      id: 'evt_explore',
      title: 'Exploration des montagnes',
      description: 'Vous découvrez une grotte mystérieuse dans les montagnes. L\'explorez-vous ?',
      type: 'exploration',
      difficulty: 14,
      trait: 'Perception',
      skill: 'Investigation',
      rewards: { gold: 50, items: ['Artefact ancien'] },
      consequences: 'Succès : Artefact trouvé | Échec : Blessure mineure'
    },
    {
      id: 'evt_ronin',
      title: 'Ronin menaçant',
      description: 'Un groupe de ronins menace un village. Intervenez-vous ?',
      type: 'combat',
      difficulty: 16,
      trait: 'Réflexes',
      skill: 'Combat à mains nues',
      rewards: { honor: 4, gold: 30 },
      consequences: 'Victoire : +4 Honneur | Défaite : -3 Honneur, blessures'
    },
    {
      id: 'evt_poetry',
      title: 'Concours de poésie',
      description: 'Participez à un concours de poésie à la cour impériale.',
      type: 'social',
      difficulty: 13,
      trait: 'Intelligence',
      skill: 'Calligraphie',
      rewards: { honor: 2 },
      consequences: 'Succès : +2 Honneur | Échec : Aucune conséquence'
    },
    {
      id: 'evt_craft_armor',
      title: 'Réparer une armure',
      description: 'Votre armure nécessite des réparations. Trouvez un artisan ou réparez-la vous-même.',
      type: 'craft',
      difficulty: 12,
      trait: 'Intelligence',
      skill: 'Artisanat (Armurier)',
      rewards: {},
      consequences: 'Réussite : Armure réparée | Échec : Réparation coûteuse (-20 koku)'
    },
    {
      id: 'evt_ruins',
      title: 'Ruines anciennes',
      description: 'Vous trouvez les ruines d\'un temple oublié. Osez-vous y pénétrer ?',
      type: 'exploration',
      difficulty: 17,
      trait: 'Volonté',
      skill: 'Investigation',
      rewards: { items: ['Parchemin de sort', 'Or (100 koku)'] },
      consequences: 'Succès : Trésors anciens | Échec : Malédiction mineure'
    }
  ];

  constructor(
    private characterService: CharacterService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCharacters();
  }

  loadCharacters() {
    const chars = this.characterService.getAllCharacters();
    this.characters.set(chars);
  }

  selectCharacter(character: Character) {
    this.selectedCharacter.set(character);
    this.currentEvent.set(null);
  }

  generateRandomEvent() {
    if (!this.canPlayEvent()) return;
    
    const randomIndex = Math.floor(Math.random() * this.randomEvents.length);
    const event = this.randomEvents[randomIndex];
    this.currentEvent.set(event);
    this.diceResult.set(null); // Réinitialiser le résultat du dé
  }

  rollDice() {
    const event = this.currentEvent();
    if (!event) return;

    this.isRolling.set(true);
    
    // Simuler un jet de dés (animation)
    setTimeout(() => {
      // Jet de dés L5R: lancer 2d10 et garder le meilleur (système simplifié)
      const roll1 = Math.floor(Math.random() * 10) + 1;
      const roll2 = Math.floor(Math.random() * 10) + 1;
      const result = Math.max(roll1, roll2);
      
      this.diceResult.set(result);
      this.isRolling.set(false);
    }, 1000);
  }

  resolveEvent() {
    const event = this.currentEvent();
    const char = this.selectedCharacter();
    const roll = this.diceResult();
    
    if (!event || !char || roll === null) return;

    const success = roll >= event.difficulty;

    // Appliquer les récompenses
    if (success && event.rewards) {
      if (event.rewards.honor) {
        char.honor = Math.min(10, (char.honor || 0) + event.rewards.honor);
      }
      // On pourrait aussi ajouter de l'or et des objets
    } else if (!success) {
      // Appliquer des pénalités en cas d'échec
      if (event.type === 'combat' || event.type === 'social') {
        char.honor = Math.max(0, (char.honor || 0) - 2);
      }
    }

    // Sauvegarder le personnage
    this.characterService.updateCharacter(char);

    // Ajouter à l'historique
    this.eventHistory.update(history => [...history, event]);

    // Réinitialiser l'événement actuel
    this.currentEvent.set(null);
    this.diceResult.set(null);

    // Recharger les personnages
    this.loadCharacters();
  }

  viewCharacter(character: Character) {
    let char = character;
    if (!char.id) {
      // Sécurise un ID et persiste la mise à jour
      char = { ...character, id: Date.now().toString() } as Character;
      const all = this.characterService.getAllCharacters();
      const idx = all.findIndex(c => c.name === character.name && c.clan === character.clan && c.school === character.school);
      if (idx >= 0) {
        all[idx] = char;
      } else {
        all.push(char);
      }
      localStorage.setItem('myCharacters', JSON.stringify(all));
      this.loadCharacters();
      this.selectedCharacter.set(char);
    }
    this.router.navigate(['/character-sheet', char.id]);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  getEventTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      social: 'Social',
      combat: 'Combat',
      exploration: 'Exploration',
      craft: 'Artisanat'
    };
    return labels[type] || type;
  }

  getEventTypeColor(type: string): string {
    const colors: { [key: string]: string } = {
      social: 'primary',
      combat: 'warn',
      exploration: 'accent',
      craft: ''
    };
    return colors[type] || '';
  }
}
