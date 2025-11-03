import { Equipment } from '../models/character.model';

export const WEAPONS: Equipment[] = [
  // Armes de base
  {
    name: 'Katana',
    type: 'weapon',
    category: 'Épée',
    damage: '3k2',
    reach: 1,
    TN: 15,
    cost: '10',
    description: 'L\'épée classique du samurai, symbole de son statut et de son honneur',
    special: 'Peut être utilisé à deux mains pour +1k1 aux dégâts'
  },
  {
    name: 'Wakizashi',
    type: 'weapon',
    category: 'Épée courte',
    damage: '2k2',
    reach: 1,
    TN: 20,
    cost: '6',
    description: 'Épée courte accompagnant le katana, portée par tous les samurai',
    special: 'Peut être utilisé en combat à deux armes'
  },
  {
    name: 'Tanto',
    type: 'weapon',
    category: 'Dague',
    damage: '1k2',
    reach: 0,
    TN: 25,
    cost: '2',
    description: 'Dague utilisée pour les situations intimes ou le seppuku',
    special: 'Peut être lancé (Portée 20 mètres)'
  },
  {
    name: 'Tetsubo',
    type: 'weapon',
    category: 'Massue',
    damage: '3k3',
    reach: 2,
    TN: 10,
    cost: '8',
    description: 'Massue de fer hérissée de pointes, favorite du Clan du Crabe',
    special: 'Ignore 5 points de réduction d\'armure'
  },
  {
    name: 'Yari',
    type: 'weapon',
    category: 'Lance',
    damage: '2k2',
    reach: 3,
    cost: '4',
    TN: 15,
    description: 'Lance de combat utilisée par l\'infanterie',
    special: 'Bonus +1k0 contre la cavalerie'
  },
  {
    name: 'Naginata',
    type: 'weapon',
    category: 'Arme d\'hast',
    damage: '3k2',
    reach: 2,
    TN: 15,
    cost: '6',
    description: 'Lame courbe montée sur un long manche',
    special: 'Peut faucher plusieurs adversaires'
  },
  {
    name: 'Bo',
    type: 'weapon',
    category: 'Bâton',
    damage: '2k1',
    reach: 2,
    TN: 15,
    cost: '1',
    description: 'Bâton de combat simple mais efficace',
    special: 'Peut être utilisé défensivement (+5 ND)'
  },
  {
    name: 'Yumi',
    type: 'weapon',
    category: 'Arc',
    damage: '2k2',
    reach: 250,
    TN: 25,
    cost: '3',
    description: 'Arc long asymétrique traditionnel japonais',
    special: 'Nécessite des flèches (20 au carquois)'
  },
  {
    name: 'Hankyū',
    type: 'weapon',
    category: 'Arc court',
    damage: '2k1',
    reach: 150,
    TN: 20,
    description: 'Arc court pour le combat à cheval',
    special: 'Peut être utilisé à cheval sans pénalité'
  },

  // Armes spécialisées
  {
    name: 'Cimeterre',
    type: 'weapon',
    category: 'Épée étrangère',
    damage: '3k2',
    reach: 1,
    TN: 20,
    description: 'Épée courbe du Clan de la Licorne',
    special: 'Bonus +1k0 en combat monté'
  },
  {
    name: 'Kama',
    type: 'weapon',
    category: 'Faucille',
    damage: '1k2',
    reach: 1,
    TN: 20,
    description: 'Faucille agricole détournée en arme',
    special: 'Peut désarmer (jet opposé)'
  },
  {
    name: 'Tessen',
    type: 'weapon',
    category: 'Éventail de guerre',
    damage: '1k1',
    reach: 1,
    TN: 30,
    description: 'Éventail de fer utilisé par les courtisans',
    special: 'Peut parer (+3 ND), dissimulable'
  }
];

export const ARMOR: Equipment[] = [
  {
    name: 'Pas d\'armure',
    type: 'armor',
    category: 'Aucune',
    TN: 5,
    reduction: 0,
    cost: '0',
    description: 'Aucune protection',
    special: ''
  },
  {
    name: 'Vêtements lourds',
    type: 'armor',
    category: 'Vêtements',
    TN: 5,
    reduction: 1,
    cost: '1',
    description: 'Vêtements épais offrant une protection minimale',
    special: 'Pas de pénalité'
  },
  {
    name: 'Armure de cuir',
    type: 'armor',
    category: 'Cuir',
    TN: 10,
    reduction: 2,
    cost: '3',
    description: 'Armure de cuir bouilli légère',
    special: 'Pénalité minime aux jets de Stealth'
  },
  {
    name: 'Armure de cuir renforcé',
    type: 'armor',
    category: 'Cuir renforcé',
    TN: 15,
    reduction: 3,
    cost: '5',
    description: 'Cuir avec plaques de métal',
    special: 'TN +5 pour Stealth'
  },
  {
    name: 'Cotte de mailles',
    type: 'armor',
    category: 'Mailles',
    TN: 20,
    reduction: 3,
    cost: '8',
    description: 'Armure de mailles métalliques',
    special: 'TN +10 pour Stealth, résiste aux armes perforantes'
  },
  {
    name: 'Armure de plaques légère',
    type: 'armor',
    category: 'Plaques légères',
    TN: 25,
    reduction: 4,
    cost: '20',
    description: 'Plaques de métal articulées',
    special: 'TN +15 pour Stealth et Athlétisme'
  },
  {
    name: 'Armure de plaques lourde',
    type: 'armor',
    category: 'Plaques lourdes',
    TN: 30,
    reduction: 5,
    cost: '40',
    description: 'Armure complète de samurai',
    special: 'TN +20 pour Stealth, +10 pour Athlétisme'
  },
  {
    name: 'Armure complète',
    type: 'armor',
    category: 'Complète',
    TN: 35,
    reduction: 6,
    cost: '80',
    description: 'Armure de guerre la plus protectrice',
    special: 'TN +25 pour Stealth, +15 pour Athlétisme, immunité aux projectiles légers'
  }
];

export const ITEMS: Equipment[] = [
  // Objets de base
  {
    name: 'Kimono',
    type: 'clothing',
    category: 'Vêtements',
    description: 'Vêtement traditionnel japonais',
    special: ''
  },
  {
    name: 'Kimono de soie',
    type: 'clothing',
    category: 'Vêtements de qualité',
    description: 'Kimono de grande qualité pour les occasions importantes',
    special: '+1k0 aux jets sociaux en cour'
  },
  {
    name: 'Sandales',
    type: 'clothing',
    category: 'Chaussures',
    description: 'Chaussures traditionnelles',
    special: ''
  },
  {
    name: 'Bottes',
    type: 'clothing',
    category: 'Chaussures',
    description: 'Bottes de cuir pour les voyages',
    special: 'Protection contre les terrains difficiles'
  },

  // Outils et équipements
  {
    name: 'Trousse de voyage',
    type: 'item',
    category: 'Équipement',
    description: 'Sac avec les nécessités de voyage (couverture, rations, gourde)',
    special: ''
  },
  {
    name: 'Kit de calligraphie',
    type: 'tool',
    category: 'Écriture',
    description: 'Pinceaux, encre et papier pour l\'écriture',
    special: 'Nécessaire pour la calligraphie et les sorts'
  },
  {
    name: 'Parchemins de sorts',
    type: 'item',
    category: 'Magie',
    description: 'Parchemins vierges pour noter les sorts',
    special: 'Permet de préparer des sorts'
  },
  {
    name: 'Matériel d\'artisanat',
    type: 'tool',
    category: 'Artisanat',
    description: 'Outils pour un artisanat spécifique',
    special: '+1k0 aux jets d\'Artisanat appropriés'
  },
  {
    name: 'Éventail',
    type: 'item',
    category: 'Accessoire',
    description: 'Éventail décoratif pour les courtisans',
    special: 'Peut servir de symbole de statut'
  },
  {
    name: 'Parfum',
    type: 'item',
    category: 'Luxe',
    description: 'Parfum raffiné pour séduire',
    special: '+1k0 aux jets de Temptation'
  },
  {
    name: 'Matériel de cérémonie du thé',
    type: 'tool',
    category: 'Cérémonie',
    description: 'Ustensiles pour la cérémonie du thé',
    special: 'Nécessaire pour les jets de compétence Thé'
  },
  {
    name: 'Jade',
    type: 'item',
    category: 'Protection',
    description: 'Pierre précieuse protégeant contre la Souillure',
    special: '+1k1 pour résister à la Souillure'
  },
  {
    name: 'Cristal de méditation',
    type: 'item',
    category: 'Spirituel',
    description: 'Cristal aidant à la méditation',
    special: '+1k0 aux jets de Méditation'
  },
  {
    name: 'Encens',
    type: 'item',
    category: 'Spirituel',
    description: 'Bâtons d\'encens pour les rituels',
    special: 'Aide aux rituels religieux'
  },
  {
    name: 'Amulette d\'ancêtre',
    type: 'item',
    category: 'Spirituel',
    description: 'Amulette bénie par les ancêtres',
    special: '+1k0 contre la peur'
  },
  {
    name: 'Corde',
    type: 'tool',
    category: 'Équipement',
    description: 'Corde de chanvre (30 mètres)',
    special: 'Utile pour l\'escalade et l\'exploration'
  },
  {
    name: 'Kit de survie',
    type: 'tool',
    category: 'Survie',
    description: 'Outils de base pour survivre en nature',
    special: '+1k0 aux jets de Survie'
  },
  {
    name: 'Lanterne',
    type: 'tool',
    category: 'Éclairage',
    description: 'Lanterne de papier avec chandelles',
    cost: '2',
    special: 'Éclaire dans un rayon de 10 mètres'
  },
  {
    name: 'Torche',
    type: 'tool',
    category: 'Éclairage',
    description: 'Torche en bois pour l\'éclairage',
    cost: '0.5',
    special: 'Éclaire dans un rayon de 8 mètres pendant 1 heure'
  },
  {
    name: 'Briquet à silex',
    type: 'tool',
    category: 'Utilitaire',
    description: 'Pierre à feu pour allumer un feu',
    cost: '1',
    special: 'Permet d\'allumer un feu en quelques minutes'
  },
  {
    name: 'Gourde',
    type: 'item',
    category: 'Utilitaire',
    description: 'Gourde en bambou pour transporter de l\'eau',
    cost: '1',
    special: 'Contient 1 litre d\'eau'
  },
  {
    name: 'Rations de voyage',
    type: 'item',
    category: 'Utilitaire',
    description: 'Nourriture séchée pour une semaine',
    cost: '3',
    special: 'Nourriture pour 7 jours'
  },
  {
    name: 'Couverture',
    type: 'item',
    category: 'Utilitaire',
    description: 'Couverture chaude pour dormir',
    cost: '2',
    special: 'Protection contre le froid la nuit'
  },
  {
    name: 'Tente',
    type: 'item',
    category: 'Utilitaire',
    description: 'Tente portative pour 2 personnes',
    cost: '8',
    special: 'Protection contre les éléments'
  },
  {
    name: 'Sac de couchage',
    type: 'item',
    category: 'Utilitaire',
    description: 'Sac de couchage en tissu matelassé',
    cost: '4',
    special: 'Confort pour dormir en extérieur'
  },
  {
    name: 'Miroir de poche',
    type: 'item',
    category: 'Utilitaire',
    description: 'Petit miroir de cuivre poli',
    cost: '3',
    special: 'Permet de voir autour des coins, signaler'
  },
  {
    name: 'Clous et marteau',
    type: 'tool',
    category: 'Utilitaire',
    description: 'Outils de base pour construction',
    cost: '2',
    special: 'Nécessaire pour construire des structures simples'
  },
  {
    name: 'Pelle',
    type: 'tool',
    category: 'Utilitaire',
    description: 'Pelle pour creuser',
    cost: '3',
    special: 'Permet de creuser efficacement'
  },
  {
    name: 'Filet de pêche',
    type: 'tool',
    category: 'Survie',
    description: 'Filet pour pêcher',
    cost: '5',
    special: '+1k1 aux jets de Survie (Pêche)'
  },
  {
    name: 'Pièges à gibier',
    type: 'tool',
    category: 'Survie',
    description: 'Set de 5 pièges pour attraper du petit gibier',
    cost: '4',
    special: '+1k0 aux jets de Survie (Chasse)'
  },
  {
    name: 'Boussole',
    type: 'tool',
    category: 'Navigation',
    description: 'Boussole magnétique pour s\'orienter',
    cost: '10',
    special: '+1k1 aux jets de Navigation'
  },
  {
    name: 'Carte régionale',
    type: 'item',
    category: 'Navigation',
    description: 'Carte détaillée d\'une région',
    cost: '6',
    special: '+1k0 aux jets de Navigation dans la région'
  },
  {
    name: 'Jumelles',
    type: 'tool',
    category: 'Observation',
    description: 'Longue-vue en bambou et verre',
    cost: '12',
    special: '+1k1 aux jets de Perception (vue) à distance'
  },
  {
    name: 'Trousse de premiers soins',
    type: 'tool',
    category: 'Médecine',
    description: 'Bandages, herbes médicinales et onguents',
    cost: '7',
    special: '+1k0 aux jets de Médecine pour soigner'
  },
  {
    name: 'Antidote universel',
    type: 'item',
    category: 'Médecine',
    description: 'Potion contre les poisons courants',
    cost: '15',
    special: '+2k0 pour résister aux poisons pendant 1 heure'
  },
  {
    name: 'Sake de qualité',
    type: 'item',
    category: 'Social',
    description: 'Bouteille de saké raffiné',
    cost: '5',
    special: 'Cadeau apprécié, +1k0 aux jets sociaux si offert'
  },
  {
    name: 'Papier et encre',
    type: 'tool',
    category: 'Écriture',
    description: 'Feuilles de papier et encre de base',
    cost: '2',
    special: 'Pour écrire des lettres ou prendre des notes'
  },
  {
    name: 'Outils de mineur',
    type: 'tool',
    category: 'Travail',
    description: 'Pioches et outils pour extraire les minerais',
    special: 'Nécessaire pour le travail de mine'
  },

  // Objets précieux
  {
    name: 'Cheval de guerre',
    type: 'item',
    category: 'Monture',
    description: 'Destrier de combat entraîné',
    special: 'Permet le combat monté, +2k0 en charge'
  },
  {
    name: 'Cheval',
    type: 'item',
    category: 'Monture',
    description: 'Cheval de voyage standard',
    special: 'Transport rapide sur longue distance'
  },

  // Munitions
  {
    name: 'Carquois et flèches',
    type: 'item',
    category: 'Munitions',
    description: 'Carquois avec 20 flèches',
    special: 'Nécessaire pour l\'usage des arcs'
  },
  
  // Monnaie
  {
    name: 'Koku (pièces)',
    type: 'item',
    category: 'Monnaie',
    description: 'Monnaie standard de l\'Empire',
    special: 'Pouvoir d\'achat'
  }
];

// Fonction utilitaire pour obtenir les équipements par école
export function getSchoolStartingEquipment(schoolName: string): {
  weapons: Equipment[],
  armor: Equipment,
  items: Equipment[],
  koku: number
} {
  const result = {
    weapons: [] as Equipment[],
    armor: ARMOR[0], // Pas d'armure par défaut
    items: [] as Equipment[],
    koku: 100 // Argent de départ standard
  };

  // Équipements de base pour tous
  result.items.push(
    ITEMS.find(i => i.name === 'Kimono')!,
    ITEMS.find(i => i.name === 'Sandales')!,
    ITEMS.find(i => i.name === 'Trousse de voyage')!,
    ITEMS.find(i => i.name === 'Koku (pièces)')!
  );

  // Armes de base pour tous les samurai
  result.weapons.push(WEAPONS.find(w => w.name === 'Wakizashi')!);

  // Équipements spécifiques par école
  switch (schoolName) {
    case 'École de Bushi Hida':
      result.weapons.push(WEAPONS.find(w => w.name === 'Katana')!);
      result.weapons.push(WEAPONS.find(w => w.name === 'Tetsubo')!);
      result.armor = ARMOR.find(a => a.name === 'Armure de plaques lourde')!;
      result.koku = 75; // Clan du Crabe : plus d'argent
      break;

    case 'École de Bushi Kakita':
      result.weapons.push(WEAPONS.find(w => w.name === 'Katana')!);
      result.items[0] = ITEMS.find(i => i.name === 'Kimono de soie')!;
      result.items.push(
        ITEMS.find(i => i.name === 'Éventail')!,
        ITEMS.find(i => i.name === 'Matériel d\'artisanat')!
      );
      result.koku = 75; // École Kakita : clan de la Grue
      break;

    case 'École de Courtisan Doji':
      result.items[0] = ITEMS.find(i => i.name === 'Kimono de soie')!;
      result.items.push(
        ITEMS.find(i => i.name === 'Éventail')!,
        ITEMS.find(i => i.name === 'Parfum')!,
        ITEMS.find(i => i.name === 'Matériel de cérémonie du thé')!
      );
      result.koku = 100; // École Doji : clan de la Grue, très riche
      break;

    case 'École de Shugenja Kuni':
      result.weapons.push(WEAPONS.find(w => w.name === 'Katana')!);
      result.items.push(
        ITEMS.find(i => i.name === 'Kit de calligraphie')!,
        ITEMS.find(i => i.name === 'Parchemins de sorts')!,
        ITEMS.find(i => i.name === 'Jade')!
      );
      result.koku = 50;
      break;

    case 'École de Bushi Moto':
      result.weapons.push(WEAPONS.find(w => w.name === 'Cimeterre')!);
      result.weapons.push(WEAPONS.find(w => w.name === 'Hankyū')!);
      result.items[1] = ITEMS.find(i => i.name === 'Bottes')!;
      result.items.push(
        ITEMS.find(i => i.name === 'Cheval de guerre')!,
        ITEMS.find(i => i.name === 'Carquois et flèches')!
      );
      result.koku = 75;
      break;

    case 'École de Shugenja Iuchi':
      result.items[1] = ITEMS.find(i => i.name === 'Bottes')!;
      result.items.push(
        ITEMS.find(i => i.name === 'Kit de calligraphie')!,
        ITEMS.find(i => i.name === 'Parchemins de sorts')!,
        ITEMS.find(i => i.name === 'Cheval')!
      );
      result.koku = 50;
      break;

    // Clans mineurs
    case 'École de Bushi Ichiro':
      result.weapons.push(WEAPONS.find(w => w.name === 'Katana')!);
      result.items[1] = ITEMS.find(i => i.name === 'Bottes')!;
      result.items.push(
        ITEMS.find(i => i.name === 'Outils de mineur')!,
        ITEMS.find(i => i.name === 'Lanterne')!
      );
      result.koku = 50;
      break;

    case 'École de Bushi Tonbo':
      result.weapons.push(WEAPONS.find(w => w.name === 'Katana')!);
      result.items.push(
        ITEMS.find(i => i.name === 'Cristal de méditation')!,
        ITEMS.find(i => i.name === 'Encens')!
      );
      result.koku = 50;
      break;

    case 'École de Bushi Toritaka':
      result.weapons.push(WEAPONS.find(w => w.name === 'Katana')!);
      result.weapons.push(WEAPONS.find(w => w.name === 'Yumi')!);
      result.items.push(
        ITEMS.find(i => i.name === 'Carquois et flèches')!,
        ITEMS.find(i => i.name === 'Amulette d\'ancêtre')!
      );
      result.koku = 50;
      break;

    case 'École de Bushi Kitsune':
      result.weapons.push(WEAPONS.find(w => w.name === 'Katana')!);
      result.items.push(
        ITEMS.find(i => i.name === 'Corde')!,
        ITEMS.find(i => i.name === 'Kit de survie')!
      );
      result.koku = 50;
      break;

    case 'École de Bushi Usagi':
      result.weapons.push(WEAPONS.find(w => w.name === 'Katana')!);
      result.items[1] = ITEMS.find(i => i.name === 'Bottes')!;
      result.koku = 50;
      break;

    case 'École de Bushi Suzume':
      result.weapons.push(WEAPONS.find(w => w.name === 'Katana')!);
      result.items.push(ITEMS.find(i => i.name === 'Amulette d\'ancêtre')!);
      result.koku = 50;
      break;

    default:
      // École par défaut - bushi basique
      result.weapons.push(WEAPONS.find(w => w.name === 'Katana')!);
      result.koku = 50;
      break;
  }

  return result;
}