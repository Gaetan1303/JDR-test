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
  id: string;
  name: string;
  cost: number;
  description: string;
  category: 'Physique' | 'Mental' | 'Social' | 'Spirituel' | 'Matériel' | 'Comportemental';
}

export interface Disadvantage {
  id: string;
  name: string;
  xpGain: number;
  description: string;
  category: 'Physique' | 'Mental' | 'Social' | 'Spirituel' | 'Matériel' | 'Comportemental';
}

export interface Spell {
  name: string;
  element: 'Air' | 'Terre' | 'Eau' | 'Feu' | 'Vide' | 'Maho';
  mastery: number;
  range: string;
  area: string;
  duration: string;
  raises: string;
  description: string;
  universal?: boolean; // Si true, le sort peut être appris par tous les shugenjas
}

export interface Kiho {
  name: string;
  type: 'Interne' | 'Martial' | 'Mystique';
  element: 'Air' | 'Terre' | 'Eau' | 'Feu' | 'Vide';
  mastery: number; // Rang de maîtrise requis (1-5)
  duration: string;
  description: string;
  effect: string;
  activation?: string; // Comment activer le kiho
  ring?: 'Air' | 'Terre' | 'Eau' | 'Feu' | 'Vide'; // Anneau associé si différent de l'élément
}

export interface Equipment {
  name: string;
  type: 'weapon' | 'armor' | 'item' | 'tool' | 'clothing';
  category?: string;
  damage?: string;
  reach?: number;
  TN?: number; // TN pour toucher (armes) ou TN d'armure
  reduction?: number; // Réduction de dégâts (armures)
  weight?: number;
  cost?: string;
  description: string;
  special?: string; // Propriétés spéciales
}

export interface CharacterEquipment {
  weapons: Equipment[];
  armor?: Equipment | Equipment[]; // Peut être un seul objet ou un tableau
  items: Equipment[];
  koku: number; // Monnaie du personnage en Koku
}

export interface School {
  name: string;
  type: 'bushi' | 'shugenja' | 'courtier' | 'moine' | 'ninja' | 'artisan';
  clan: string;
  traitBonus: keyof Traits;
  skills: string[];
  technique: string;
  honor: number;
  outfit: string[];
  startingMoney: string;
  // Restrictions de sorts pour les shugenjas
  spellLimits?: {
    rank1: number; // Nombre de sorts de Rang 1 autorisés
    rank2: number; // Nombre de sorts de Rang 2 autorisés
    affinity?: string; // Élément d'affinité si applicable
    deficiency?: string; // Élément de déficience si applicable
  };
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
  id?: string; // ID unique pour la sauvegarde
  name: string;
  age: number;
  gender: string;
  avatar?: string | null; // URL ou base64 de l'image d'avatar
  
  // Clan et école
  clan: string;
  family: string;
  school: string;
  
  // Statistiques de base
  rings: Ring;
  traits: Traits;
  voidPoints?: number; // Points de Vide disponibles
  skills: Skill[];
  spells: string[]; // Noms des sorts sélectionnés
  techniques: string[]; // Noms des techniques de clan sélectionnées
  kata: string[]; // Noms des kata sélectionnés
  kiho: string[]; // Noms des kiho sélectionnés (pour les moines)
  
  // Avantages et désavantages
  advantages: Advantage[];
  disadvantages: Disadvantage[];
  selectedAdvantages: string[]; // IDs des avantages sélectionnés
  selectedDisadvantages: string[]; // IDs des désavantages sélectionnés
  
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
  equipment: CharacterEquipment;
  
  // Techniques de Clan
  clanTechniques: string[]; // Noms des techniques de clan/famille sélectionnées
  
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