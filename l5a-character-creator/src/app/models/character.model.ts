export interface Ring {
  terre: number;
  eau: number;
  air: number;
  feu: number;
  vide: number;
}

export interface Traits {
  constitution: number;
  volonte: number;
  force: number;
  perception: number;
  reflexes: number;
  intuition: number;
  agilite: number;
  intelligence: number;
}

export interface Skill {
  name: string;
  rank: number;
  isSchoolSkill: boolean;
  trait: keyof Traits;
  emphasis?: string[];
}

export interface Advantage {
  name: string;
  cost: number;
  description: string;
  type: 'physical' | 'mental' | 'social' | 'spiritual';
}

export interface Disadvantage {
  name: string;
  pointsGained: number;
  description: string;
  type: 'physical' | 'mental' | 'social' | 'spiritual';
}

export interface School {
  name: string;
  type: 'bushi' | 'shugenja' | 'courtier' | 'monk' | 'ninja' | 'artisan';
  clan: string;
  traitBonus: keyof Traits;
  skills: string[];
  technique: string;
  honor: number;
  outfit: string[];
  startingMoney: string;
}

export interface Family {
  name: string;
  clan: string;
  traitBonus: keyof Traits;
  description: string;
}

export interface Clan {
  name: string;
  description: string;
  families: Family[];
  schools: School[];
}

export interface Character {
  // Informations de base
  name: string;
  age: number;
  gender: string;
  
  // Clan et école
  clan: string;
  family: string;
  school: string;
  
  // Statistiques de base
  rings: Ring;
  traits: Traits;
  skills: Skill[];
  
  // Avantages et désavantages
  advantages: Advantage[];
  disadvantages: Disadvantage[];
  
  // Points d'expérience
  experiencePoints: number;
  spentExperiencePoints: number;
  
  // Statistiques dérivées
  insight: number;
  initiative: number;
  
  // Statuts
  honor: number;
  glory: number;
  status: number;
  taint: number;
  
  // Niveaux de blessure
  woundLevels: {
    healthy: number;
    nicked: number;
    grazed: number;
    hurt: number;
    injured: number;
    crippled: number;
    down: number;
    out: number;
  };
  
  // Équipement
  equipment: string[];
  weapons: string[];
  armor: string[];
  money: number;
  
  // Éléments narratifs
  objective: string;
  personality: string;
  background: string;
}

export interface CharacterCreationStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}