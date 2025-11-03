import { Advantage, Disadvantage } from '../models/character.model';

export const ADVANTAGES: Advantage[] = [
  // Avantages physiques
  {
    id: 'ambidextre',
    name: 'Ambidextre',
    cost: 2,
    category: 'Physique',
    description: 'Vous pouvez utiliser votre main non-dominante sans pénalité.'
  },
  {
    id: 'reflexes-rapides',
    name: 'Réflexes rapides',
    cost: 4,
    category: 'Physique',
    description: '+2 à votre Initiative.'
  },
  {
    id: 'resistance-poison',
    name: 'Résistance au poison',
    cost: 3,
    category: 'Physique',
    description: '+2k0 aux jets de résistance contre les poisons.'
  },
  {
    id: 'endurance',
    name: 'Endurance',
    cost: 4,
    category: 'Physique',
    description: '+2 dans votre total de Blessures.'
  },
  {
    id: 'forme-parfaite',
    name: 'Forme parfaite',
    cost: 3,
    category: 'Physique',
    description: '+1k0 aux jets d\'Athlétisme et de Performance.'
  },

  // Avantages mentaux
  {
    id: 'memoire-parfaite',
    name: 'Mémoire parfaite',
    cost: 6,
    category: 'Mental',
    description: 'Vous vous souvenez parfaitement de tout ce que vous avez vu ou entendu.'
  },
  {
    id: 'sens-du-danger',
    name: 'Sens du danger',
    cost: 4,
    category: 'Mental',
    description: '+2k0 aux jets d\'Initiative et de Perception pour détecter les embuscades.'
  },
  {
    id: 'calcul-mental',
    name: 'Calcul mental',
    cost: 2,
    category: 'Mental',
    description: '+1k0 aux jets de Commerce et d\'Investigation impliquant des calculs.'
  },
  {
    id: 'concentration',
    name: 'Concentration',
    cost: 3,
    category: 'Mental',
    description: '+1k0 aux jets de Méditation et aux jets pour maintenir un sort.'
  },

  // Avantages sociaux
  {
    id: 'status-superieur',
    name: 'Statut supérieur',
    cost: 6,
    category: 'Social',
    description: 'Votre statut social est supérieur à la normale pour votre école.'
  },
  {
    id: 'allies',
    name: 'Alliés',
    cost: 3,
    category: 'Social',
    description: 'Vous avez des alliés puissants qui peuvent vous aider.'
  },
  {
    id: 'contacts',
    name: 'Contacts',
    cost: 2,
    category: 'Social',
    description: 'Vous avez des contacts dans différentes couches de la société.'
  },
  {
    id: 'beaute-saisissante',
    name: 'Beauté saisissante',
    cost: 4,
    category: 'Social',
    description: '+1k0 aux jets sociaux avec les personnes attirées par votre apparence.'
  },

  // Avantages spirituels
  {
    id: 'faveur-des-fortunes',
    name: 'Faveur des Fortunes',
    cost: 5,
    category: 'Spirituel',
    description: 'Une fois par session, relancez un jet de dés.'
  },
  {
    id: 'clairvoyance',
    name: 'Clairvoyance',
    cost: 6,
    category: 'Spirituel',
    description: 'Vous pouvez parfois percevoir des événements futurs ou distants.'
  },
  {
    id: 'resistance-magie',
    name: 'Résistance à la magie',
    cost: 4,
    category: 'Spirituel',
    description: '+2k0 aux jets de résistance contre les sorts.'
  },

  // Avantages matériels
  {
    id: 'richesse',
    name: 'Richesse',
    cost: 5,
    category: 'Matériel',
    description: 'Vous disposez de ressources financières importantes. Vous commencez avec 50 koku supplémentaires.',
    grantedEquipment: [
      {
        name: 'Koku (Richesse)',
        type: 'item',
        category: 'Argent',
        cost: '50',
        description: '50 koku supplémentaires accordés par l\'avantage Richesse'
      }
    ]
  },
  {
    id: 'equipement-superieur',
    name: 'Équipement supérieur',
    cost: 3,
    category: 'Matériel',
    description: 'Vous possédez une armure de qualité exceptionnelle qui offre une meilleure protection.',
    grantedEquipment: [
      {
        name: 'Armure légère supérieure',
        type: 'armor',
        category: 'Armure',
        reduction: 3,
        TN: 20,
        cost: '20',
        description: 'Armure légère de qualité exceptionnelle',
        special: 'Réduction : 3 (au lieu de 2 pour l\'armure légère standard)'
      }
    ]
  },
  {
    id: 'ancestral-daisho',
    name: 'Daisho ancestral',
    cost: 4,
    category: 'Matériel',
    description: 'Vous possédez un daisho transmis de génération en génération. Ces armes de qualité exceptionnelle offrent +1k0 aux jets d\'attaque.',
    grantedEquipment: [
      {
        name: 'Katana ancestral',
        type: 'weapon',
        category: 'Épée',
        damage: '3k2',
        reach: 1,
        TN: 15,
        cost: '25',
        description: 'Katana ancestral de qualité exceptionnelle transmis de génération en génération',
        special: 'Peut être utilisé à deux mains pour +1k1 aux dégâts. +1k0 aux jets d\'attaque (qualité exceptionnelle)'
      },
      {
        name: 'Wakizashi ancestral',
        type: 'weapon',
        category: 'Épée courte',
        damage: '2k2',
        reach: 1,
        TN: 20,
        cost: '15',
        description: 'Wakizashi ancestral de qualité exceptionnelle accompagnant le katana',
        special: 'Peut être utilisé en combat à deux armes. +1k0 aux jets d\'attaque (qualité exceptionnelle)'
      }
    ]
  }
];

export const DISADVANTAGES: Disadvantage[] = [
  // Défauts physiques
  {
    id: 'handicap-physique',
    name: 'Handicap physique',
    xpGain: 4,
    category: 'Physique',
    description: 'Vous souffrez d\'un handicap physique qui vous pénalise.'
  },
  {
    id: 'mauvaise-sante',
    name: 'Mauvaise santé',
    xpGain: 3,
    category: 'Physique',
    description: '-1 dans votre total de Blessures.'
  },
  {
    id: 'petite-taille',
    name: 'Petite taille',
    xpGain: 2,
    category: 'Physique',
    description: '-1k0 aux jets d\'Intimidation, +1k0 aux jets de Discrétion.'
  },
  {
    id: 'albinos',
    name: 'Albinos',
    xpGain: 3,
    category: 'Physique',
    description: 'Vous êtes facilement reconnaissable et sensible au soleil.'
  },
  {
    id: 'maladroit',
    name: 'Maladroit',
    xpGain: 3,
    category: 'Physique',
    description: 'Vous avez tendance à faire tomber ou casser des objets.'
  },

  // Défauts mentaux
  {
    id: 'distrait',
    name: 'Distrait',
    xpGain: 3,
    category: 'Mental',
    description: '-1k0 aux jets de Perception et d\'Investigation.'
  },
  {
    id: 'phobie',
    name: 'Phobie',
    xpGain: 4,
    category: 'Mental',
    description: 'Vous avez une peur irrationnelle de quelque chose.'
  },
  {
    id: 'faible-volonte',
    name: 'Faible volonté',
    xpGain: 6,
    category: 'Mental',
    description: '-1k0 aux jets de résistance mentale et de Méditation.'
  },
  {
    id: 'compulsion',
    name: 'Compulsion',
    xpGain: 2,
    category: 'Mental',
    description: 'Vous devez accomplir un acte particulier régulièrement.'
  },
  {
    id: 'amnesia',
    name: 'Amnésie',
    xpGain: 4,
    category: 'Mental',
    description: 'Vous avez perdu une partie de vos souvenirs.'
  },

  // Défauts sociaux
  {
    id: 'status-inferieur',
    name: 'Statut inférieur',
    xpGain: 6,
    category: 'Social',
    description: 'Votre statut social est inférieur à la normale.'
  },
  {
    id: 'enemies',
    name: 'Ennemis',
    xpGain: 3,
    category: 'Social',
    description: 'Vous avez des ennemis qui cherchent à vous nuire.'
  },
  {
    id: 'mauvaise-reputation',
    name: 'Mauvaise réputation',
    xpGain: 4,
    category: 'Social',
    description: 'Vous êtes mal vu par certains groupes de la société.'
  },
  {
    id: 'obligations',
    name: 'Obligations',
    xpGain: 2,
    category: 'Social',
    description: 'Vous avez des obligations qui limitent votre liberté d\'action.'
  },
  {
    id: 'naif',
    name: 'Naïf',
    xpGain: 4,
    category: 'Social',
    description: '-2k0 aux jets pour détecter les mensonges ou les tromperies.'
  },

  // Défauts spirituels
  {
    id: 'maudit',
    name: 'Maudit',
    xpGain: 6,
    category: 'Spirituel',
    description: 'Vous êtes affecté par une malédiction spirituelle.'
  },
  {
    id: 'maho-tsukai',
    name: 'Maho-Tsukai (Pratiquant de Magie Noire)',
    xpGain: 0,
    category: 'Spirituel',
    description: 'Vous avez choisi la voie interdite du Maho (magie de sang). Vous commencez avec 2 points de Souillure et pouvez apprendre des sorts Maho. ATTENTION : Si découvert, vous serez chassé et exécuté. Ce désavantage donne accès aux sorts Maho lors de la création du personnage.'
  },
  {
    id: 'souille',
    name: 'Souillé',
    xpGain: 5,
    category: 'Spirituel',
    description: 'Vous portez une souillure spirituelle.'
  },
  {
    id: 'malchance',
    name: 'Malchance',
    xpGain: 5,
    category: 'Spirituel',
    description: 'Une fois par session, le MJ peut vous faire relancer un jet réussi.'
  },
  {
    id: 'insensible-kami',
    name: 'Insensible aux kami',
    xpGain: 4,
    category: 'Spirituel',
    description: '-1k0 aux jets liés aux interactions spirituelles.'
  },

  // Défauts comportementaux
  {
    id: 'colere',
    name: 'Colère',
    xpGain: 3,
    category: 'Comportemental',
    description: 'Vous avez du mal à contrôler votre colère.'
  },
  {
    id: 'honneur-excessif',
    name: 'Honneur excessif',
    xpGain: 2,
    category: 'Comportemental',
    description: 'Vous suivez Bushido de manière si stricte que cela vous cause des problèmes.'
  },
  {
    id: 'impulsif',
    name: 'Impulsif',
    xpGain: 2,
    category: 'Comportemental',
    description: 'Vous agissez souvent sans réfléchir.'
  },
  {
    id: 'cruel',
    name: 'Cruel',
    xpGain: 3,
    category: 'Comportemental',
    description: 'Vous prenez plaisir à infliger de la souffrance.'
  },
  {
    id: 'soft-hearted',
    name: 'Cœur tendre',
    xpGain: 2,
    category: 'Comportemental',
    description: 'Vous avez du mal à faire du mal ou à voir souffrir.'
  }
];