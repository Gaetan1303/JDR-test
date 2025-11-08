import { Component, signal, computed, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { CharacterService } from '../services/character.service';
import { Character } from '../models/character.model';
import { JetService, JetResult } from '../services/jet.service';
import { EventService, RandomEvent } from '../services/event.service';


@Component({
  selector: 'app-play-character',
  standalone: true,
  imports: [
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule
],
  templateUrl: './play-character.html',
  styleUrls: ['./play-character.scss']
})
export class PlayCharacter implements OnInit {

  selectedEventCategory: string = 'random';
  characters = signal<Character[]>([]);
  selectedCharacter = signal<Character | null>(null);
  currentEvent = signal<RandomEvent | null>(null);
  eventHistory = signal<RandomEvent[]>([]);
  diceResult = signal<number | null>(null);
  isRolling = signal<boolean>(false);
  jetResult = signal<JetResult | null>(null);
  canPlayEvent = computed(() => this.selectedCharacter() !== null && this.currentEvent() === null);
  canRollDice = computed(() => this.currentEvent() !== null && this.diceResult() === null);


  isKeptDie(idx: number): boolean {
    const jet = this.jetResult();
    if (!jet) return false;
    const value = jet.des[idx];
    let occur = 0;
    for (let i = 0; i <= idx; i++) {
      if (jet.des[i] === value) occur++;
    }
    let kept = 0;
    for (let i = 0; i < jet.gardes.length; i++) {
      if (jet.gardes[i] === value) kept++;
      if (kept === occur) return true;
    }
    return false;
  }

  constructor(
    private characterService: CharacterService,
    private router: Router,
    private jetService: JetService,
    private eventService: EventService
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

  generateRandomEvent(category: string = 'random') {
    if (!this.canPlayEvent()) return;
    const event = this.eventService.getRandomEvent(category);
    if (event) {
      this.currentEvent.set(event);
      this.diceResult.set(null);
    }
  }

  rollDice() {
    const event = this.currentEvent();
    const char = this.selectedCharacter();
    if (!event || !char) return;

    this.isRolling.set(true);

    // Récupérer la valeur de l'anneau et de la compétence associée à l'événement
    const traitKey = event.trait.toLowerCase() as keyof typeof char.traits;
    const anneau = char.traits[traitKey] || 0;
    const skill = char.skills.find(s => s.name.toLowerCase() === (event.skill || '').toLowerCase());
    const competence = skill ? skill.rank : 0;

    setTimeout(() => {
      let result;
      if (competence > 0) {
        result = this.jetService.jetCompetence(anneau, competence);
      } else {
        result = this.jetService.jetSansCompetence(anneau);
      }
      this.jetResult.set(result);
      this.diceResult.set(result.total);
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

  // Réinitialiser l'événement actuel et le résultat du jet
  this.currentEvent.set(null);
  this.diceResult.set(null);
  this.jetResult.set(null);

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
