import { Kiho } from '../models/character.model';

export const KIHO: Kiho[] = [
  // KIHO DE L'AIR - Rang 1
  {
    name: 'Esprit du l\'Air',
    type: 'Interne',
    element: 'Air',
    mastery: 1,
    duration: '1 heure',
    description: 'Le moine peut se déplacer silencieusement et avec grâce.',
    effect: '+2k0 aux jets de Stealth et Athlétisme (sauts)',
    activation: 'Méditation de 5 minutes'
  },
  {
    name: 'Toucher du Vent',
    type: 'Martial',
    element: 'Air',
    mastery: 1,
    duration: 'Instantané',
    description: 'Le moine frappe avec la rapidité du vent.',
    effect: 'Une attaque supplémentaire gratuite par round pendant 3 rounds',
    activation: 'Action simple'
  },
  {
    name: 'Nuage Flottant',
    type: 'Mystique',
    element: 'Air',
    mastery: 1,
    duration: '10 minutes',
    description: 'Le corps du moine devient léger comme l\'air.',
    effect: 'Peut marcher sur l\'eau et ignorer les chutes (max 10m)',
    activation: 'Concentration (action simple)'
  },

  // KIHO DE L'AIR - Rang 2
  {
    name: 'Disparition du Vent',
    type: 'Mystique',
    element: 'Air',
    mastery: 2,
    duration: '5 minutes',
    description: 'Le moine devient invisible comme le vent.',
    effect: 'Devient invisible. +10k0 aux jets de Stealth. Attaquer rompt l\'effet.',
    activation: 'Méditation (1 round complet)'
  },
  {
    name: 'Poing du Vent',
    type: 'Martial',
    element: 'Air',
    mastery: 2,
    duration: 'Instantané',
    description: 'Un coup d\'une rapidité foudroyante.',
    effect: 'Attaque avant l\'Initiative. +2k2 aux dégâts.',
    activation: 'Action simple (1/combat)'
  },

  // KIHO DE LA TERRE - Rang 1
  {
    name: 'Esprit de la Terre',
    type: 'Interne',
    element: 'Terre',
    mastery: 1,
    duration: '1 heure',
    description: 'La résilience de la terre coule dans le moine.',
    effect: '+10 au TN d\'armure. Réduction de 2 points aux dégâts reçus.',
    activation: 'Méditation de 5 minutes'
  },
  {
    name: 'Poing de Pierre',
    type: 'Martial',
    element: 'Terre',
    mastery: 1,
    duration: '3 rounds',
    description: 'Les mains du moine deviennent dures comme la pierre.',
    effect: '+1k1 aux dégâts en combat sans armes. Les mains comptent comme armes en jade.',
    activation: 'Action simple'
  },
  {
    name: 'Toucher de la Terre',
    type: 'Mystique',
    element: 'Terre',
    mastery: 1,
    duration: 'Permanent',
    description: 'Le moine sent les vibrations dans la terre.',
    effect: 'Détecte les créatures dans un rayon de 10m par contact au sol',
    activation: 'Concentration (action simple)'
  },

  // KIHO DE LA TERRE - Rang 2
  {
    name: 'Frappe de la Montagne',
    type: 'Martial',
    element: 'Terre',
    mastery: 2,
    duration: 'Instantané',
    description: 'Une frappe avec le poids d\'une montagne.',
    effect: 'Attaque qui ignore la réduction d\'armure. +3k3 aux dégâts.',
    activation: 'Action complexe'
  },
  {
    name: 'Corps de Terre',
    type: 'Interne',
    element: 'Terre',
    mastery: 2,
    duration: '10 minutes',
    description: 'Le corps devient aussi résistant que la terre.',
    effect: 'Ignore les 2 premiers niveaux de blessure. Immunité au poison.',
    activation: 'Méditation (1 round complet)'
  },

  // KIHO DE L'EAU - Rang 1
  {
    name: 'Esprit de l\'Eau',
    type: 'Interne',
    element: 'Eau',
    mastery: 1,
    duration: '1 heure',
    description: 'Le moine coule comme l\'eau.',
    effect: '+2k0 aux jets de Défense et Jiujutsu',
    activation: 'Méditation de 5 minutes'
  },
  {
    name: 'Vague Tourbillonnante',
    type: 'Martial',
    element: 'Eau',
    mastery: 1,
    duration: '3 rounds',
    description: 'Les mouvements du moine deviennent fluides comme l\'eau.',
    effect: 'Peut effectuer des manœuvres de Désarmement et de Projection sans malus',
    activation: 'Action simple'
  },
  {
    name: 'Toucher de Clarté',
    type: 'Mystique',
    element: 'Eau',
    mastery: 1,
    duration: 'Instantané',
    description: 'Le toucher du moine purifie et guérit.',
    effect: 'Guérit 1k1 points de blessures + Anneau d\'Eau du moine',
    activation: 'Action simple (1/jour/personne)'
  },

  // KIHO DE L'EAU - Rang 2
  {
    name: 'Courant de l\'Eau',
    type: 'Martial',
    element: 'Eau',
    mastery: 2,
    duration: '5 rounds',
    description: 'Le moine se déplace avec la fluidité de l\'eau.',
    effect: 'Peut se déplacer à travers les ennemis sans provoquer d\'attaque. +15 TN d\'armure.',
    activation: 'Action simple'
  },
  {
    name: 'Purification de l\'Eau',
    type: 'Mystique',
    element: 'Eau',
    mastery: 2,
    duration: 'Instantané',
    description: 'Le moine purifie le corps et l\'esprit.',
    effect: 'Soigne tous les poisons et maladies. Guérit 2k2 points de vie.',
    activation: 'Méditation (5 minutes)'
  },

  // KIHO DU FEU - Rang 1
  {
    name: 'Esprit du Feu',
    type: 'Interne',
    element: 'Feu',
    mastery: 1,
    duration: '1 heure',
    description: 'La passion du feu brûle en le moine.',
    effect: '+2k0 aux jets d\'attaque et d\'intimidation',
    activation: 'Méditation de 5 minutes'
  },
  {
    name: 'Poing de Feu',
    type: 'Martial',
    element: 'Feu',
    mastery: 1,
    duration: '3 rounds',
    description: 'Les mains du moine s\'enflamment.',
    effect: 'Les attaques sans armes causent +1k1 dégâts de feu',
    activation: 'Action simple'
  },
  {
    name: 'Toucher de Flamme',
    type: 'Mystique',
    element: 'Feu',
    mastery: 1,
    duration: 'Instantané',
    description: 'Un toucher qui brûle de l\'intérieur.',
    effect: 'Jet d\'attaque sans armes. Si touché, inflige 2k2 dégâts internes (ignore armure)',
    activation: 'Action complexe'
  },

  // KIHO DU FEU - Rang 2
  {
    name: 'Tempête de Flammes',
    type: 'Martial',
    element: 'Feu',
    mastery: 2,
    duration: 'Instantané',
    description: 'Le moine crache des flammes.',
    effect: 'Attaque à distance (10m). 3k3 dégâts de feu à tous dans un cône de 3m.',
    activation: 'Action complexe'
  },
  {
    name: 'Furie Enflammée',
    type: 'Interne',
    element: 'Feu',
    mastery: 2,
    duration: '5 rounds',
    description: 'Le moine brûle de rage contrôlée.',
    effect: '+2k2 aux jets d\'attaque et de dégâts. -5 TN d\'armure.',
    activation: 'Action simple'
  },

  // KIHO DU VIDE - Rang 1
  {
    name: 'Esprit du Vide',
    type: 'Mystique',
    element: 'Vide',
    mastery: 1,
    duration: '1 heure',
    description: 'Le moine atteint un état de vide intérieur.',
    effect: 'Immunité à la Peur. +2k0 aux jets de Méditation et Divination',
    activation: 'Méditation de 10 minutes'
  },
  {
    name: 'Toucher du Vide',
    type: 'Martial',
    element: 'Vide',
    mastery: 1,
    duration: 'Instantané',
    description: 'Une frappe qui ignore les défenses matérielles.',
    effect: 'Attaque qui ignore toute réduction d\'armure et réduction naturelle',
    activation: 'Action complexe'
  },
  {
    name: 'Regard dans le Vide',
    type: 'Mystique',
    element: 'Vide',
    mastery: 1,
    duration: 'Concentration',
    description: 'Le moine perçoit au-delà du voile matériel.',
    effect: 'Peut voir les esprits, créatures invisibles et auras magiques',
    activation: 'Concentration (action simple)'
  },

  // KIHO DU VIDE - Rang 2
  {
    name: 'Méditation du Vide',
    type: 'Interne',
    element: 'Vide',
    mastery: 2,
    duration: '1 heure',
    description: 'Le moine devient un avec le vide.',
    effect: 'Récupère tous les Points de Vide dépensés. +10 TN contre magie.',
    activation: 'Méditation (30 minutes)'
  },
  {
    name: 'Frappe du Vide',
    type: 'Martial',
    element: 'Vide',
    mastery: 2,
    duration: 'Instantané',
    description: 'Une attaque qui frappe l\'essence même de l\'ennemi.',
    effect: 'Attaque qui cible directement les Anneaux de l\'adversaire. Réduit 1 Anneau de 1 rang pour 1 jour.',
    activation: 'Action complexe'
  },

  // KIHO DE RANG 3 (exemples)
  {
    name: 'Harmonie des Éléments',
    type: 'Mystique',
    element: 'Vide',
    mastery: 3,
    duration: '10 minutes',
    description: 'Le moine harmonise tous les éléments en lui.',
    effect: 'Peut utiliser un Kiho de chaque élément simultanément. +1k1 à tous les Anneaux.',
    activation: 'Méditation (1 heure)'
  },
  {
    name: 'Forme du Dragon',
    type: 'Martial',
    element: 'Feu',
    mastery: 3,
    duration: '5 rounds',
    description: 'Le moine canalise la puissance d\'un dragon.',
    effect: '+3k3 aux attaques et dégâts. Les attaques causent dégâts de feu supplémentaires (2k2).',
    activation: 'Action complexe'
  },
  {
    name: 'Esprit de la Montagne',
    type: 'Interne',
    element: 'Terre',
    mastery: 3,
    duration: '1 heure',
    description: 'Le moine devient immuable comme une montagne.',
    effect: 'Immunité au renversement et projection. Réduction 5 contre tous dégâts.',
    activation: 'Méditation (10 minutes)'
  },

  // KIHO DE RANG 4 (exemples)
  {
    name: 'Marche sur les Nuages',
    type: 'Mystique',
    element: 'Air',
    mastery: 4,
    duration: '30 minutes',
    description: 'Le moine peut marcher dans les airs.',
    effect: 'Peut voler à vitesse normale. Immunité aux chutes.',
    activation: 'Méditation (5 minutes)'
  },
  {
    name: 'Corps de Diamant',
    type: 'Interne',
    element: 'Terre',
    mastery: 4,
    duration: '10 rounds',
    description: 'Le corps du moine devient dur comme le diamant.',
    effect: 'Immunité à tous dégâts non-magiques. Réduction 10 contre dégâts magiques.',
    activation: 'Méditation (1 round complet)'
  },

  // KIHO DE RANG 5 (exemples)
  {
    name: 'Transcendance',
    type: 'Mystique',
    element: 'Vide',
    mastery: 5,
    duration: '1 minute',
    description: 'Le moine transcende les limites mortelles.',
    effect: 'Immunité totale à tous effets. Peut agir 2 fois par round. +5k5 à toutes actions.',
    activation: 'Méditation (1 jour)'
  },
  {
    name: 'Poing du Tsunami',
    type: 'Martial',
    element: 'Eau',
    mastery: 5,
    duration: 'Instantané',
    description: 'Une frappe avec la puissance d\'un tsunami.',
    effect: 'Attaque de zone (15m de rayon). 10k10 dégâts. Renverse tous les ennemis.',
    activation: 'Action complexe (1/jour)'
  }
];
