import { Injectable } from '@angular/core';

export interface RandomEvent {
  id: string;
  title: string;
  description: string;
  type: 'social' | 'combat' | 'exploration' | 'craft' | 'magie' | 'religieux' | 'commerce' | 'entrainement';
  difficulty: number;
  trait: string;
  skill?: string;
  rewards: {
    honor?: number;
    gold?: number;
    items?: string[];
  };
  consequences?: string;
}

@Injectable({ providedIn: 'root' })
export class EventService {
  private events: RandomEvent[] = [
    // Magie
    {
      id: 'evt_magie_rituel',
      title: 'Rituel perturbé',
      description: 'Un rituel magique tourne mal, provoquant des effets imprévus ou l’apparition d’un phénomène surnaturel.',
      type: 'magie',
      difficulty: 15,
      trait: 'Intelligence',
      skill: 'Spellcraft', 
      rewards: { items: ['Artefact magique'] },
      consequences: 'Succès : Artefact maîtrisé | Échec : Effet magique aléatoire'
    },
    // Religieux
    {
      id: 'evt_religieux_kami',
      title: 'Offrande aux esprits',
      description: 'Vous êtes invité à participer à une cérémonie pour honorer les esprits locaux.',
      type: 'religieux',
      difficulty: 12,
      trait: 'Intuition',
      skill: 'Théologie',
      rewards: { honor: 2 },
      consequences: 'Succès : Bénédiction | Échec : Aucun effet'
    },
    // Commerce
    {
      id: 'evt_commerce_marche',
      title: 'Marché animé',
      description: 'Vous négociez un achat important dans un marché bondé.',
      type: 'commerce',
      difficulty: 13,
      trait: 'Intelligence',
      skill: 'Commerce',
      rewards: { gold: 20 },
      consequences: 'Succès : Bonne affaire | Échec : Perte d’argent'
    },
    // Entraînement
    {
      id: 'evt_entrainement_dojo',
      title: 'Séance d’entraînement',
      description: 'Vous participez à une séance d’entraînement intense dans un dojo.',
      type: 'entrainement',
      difficulty: 11,
      trait: 'Force',
      skill: 'Athlétisme',
      rewards: { honor: 1 },
      consequences: 'Succès : Progrès personnel | Échec : Fatigue temporaire'
    },
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

  getRandomEvent(category: string = 'random'): RandomEvent | null {
    let events = this.events;
    if (category && category !== 'random') {
      events = this.events.filter(e => e.type === category);
    }
    if (events.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * events.length);
    return events[randomIndex];
  }
}
