import { Clan } from '../models/character.model';

export const CLANS: Clan[] = [
  {
    name: 'Clan du Crabe',
    description: 'Gardiens de la Muraille de Kaiu, défenseurs contre les Terres Souillées',
    families: [
      {
        name: 'Hida',
        clan: 'Clan du Crabe',
        traitBonus: 'constitution',
        description: 'Famille dirigeante du Clan du Crabe, connue pour sa force et sa résilience'
      },
      {
        name: 'Hiruma',
        clan: 'Clan du Crabe',
        traitBonus: 'agilite',
        description: 'Éclaireurs et pisteurs, experts des Terres Souillées'
      },
      {
        name: 'Kaiu',
        clan: 'Clan du Crabe',
        traitBonus: 'intelligence',
        description: 'Ingénieurs et architectes, bâtisseurs de la grande muraille'
      },
      {
        name: 'Kuni',
        clan: 'Clan du Crabe',
        traitBonus: 'volonte',
        description: 'Chasseurs de sorciers et experts de la magie'
      },
      {
        name: 'Toritaka',
        clan: 'Clan du Crabe',
        traitBonus: 'perception',
        description: 'Anciens du Clan du Faucon, spécialistes des esprits'
      }
    ],
    schools: []
  },
  {
    name: 'Clan de la Grue',
    description: 'Maîtres de la cour, artistes et diplomates de l\'Empire',
    families: [
      {
        name: 'Doji',
        clan: 'Clan de la Grue',
        traitBonus: 'intuition',
        description: 'Famille dirigeante, maîtres de la courtoisie et de l\'art'
      },
      {
        name: 'Kakita',
        clan: 'Clan de la Grue',
        traitBonus: 'agilite',
        description: 'Duellistes légendaires et artistes accomplis'
      },
      {
        name: 'Asahina',
        clan: 'Clan de la Grue',
        traitBonus: 'perception',
        description: 'Pacifistes et maîtres de la magie shugenja'
      },
      {
        name: 'Daidoji',
        clan: 'Clan de la Grue',
        traitBonus: 'intelligence',
        description: 'Guerriers pragmatiques et tacticiens'
      }
    ],
    schools: []
  },
  {
    name: 'Clan du Dragon',
    description: 'Mystiques et philosophes, gardiens des montagnes du nord',
    families: [
      {
        name: 'Mirumoto',
        clan: 'Clan du Dragon',
        traitBonus: 'agilite',
        description: 'Famille dirigeante, maîtres du combat à deux sabres'
      },
      {
        name: 'Agasha',
        clan: 'Clan du Dragon',
        traitBonus: 'intelligence',
        description: 'Alchimistes et forgerons, maîtres de la magie du feu'
      },
      {
        name: 'Kitsuki',
        clan: 'Clan du Dragon',
        traitBonus: 'perception',
        description: 'Enquêteurs et magistrats, experts de la logique'
      },
      {
        name: 'Tamori',
        clan: 'Clan du Dragon',
        traitBonus: 'volonte',
        description: 'Mystiques tatoués, anciens du Clan du Phénix'
      }
    ],
    schools: []
  },
  {
    name: 'Clan du Lion',
    description: 'Bras droit de l\'Empereur, maîtres de la guerre et de l\'honneur',
    families: [
      {
        name: 'Akodo',
        clan: 'Clan du Lion',
        traitBonus: 'intelligence',
        description: 'Famille dirigeante, stratèges et tacticiens militaires'
      },
      {
        name: 'Ikoma',
        clan: 'Clan du Lion',
        traitBonus: 'volonte',
        description: 'Conteurs et historiens, gardiens des traditions'
      },
      {
        name: 'Kitsu',
        clan: 'Clan du Lion',
        traitBonus: 'volonte',
        description: 'Communicants avec les ancêtres, shugenja spiritualistes'
      },
      {
        name: 'Matsu',
        clan: 'Clan du Lion',
        traitBonus: 'agilite',
        description: 'Guerriers féroces, maîtres du combat rapproché'
      }
    ],
    schools: []
  },
  {
    name: 'Clan du Phénix',
    description: 'Maîtres de la magie et gardiens des secrets élémentaires',
    families: [
      {
        name: 'Isawa',
        clan: 'Clan du Phénix',
        traitBonus: 'intelligence',
        description: 'Famille dirigeante, plus puissants shugenja de l\'Empire'
      },
      {
        name: 'Shiba',
        clan: 'Clan du Phénix',
        traitBonus: 'volonte',
        description: 'Gardiens des Isawa, bushi honorables et dévoués'
      },
      {
        name: 'Asako',
        clan: 'Clan du Phénix',
        traitBonus: 'perception',
        description: 'Érudits et courtisans, gardiens du savoir'
      }
    ],
    schools: []
  },
  {
    name: 'Clan du Scorpion',
    description: 'Main gauche de l\'Empereur, maîtres de l\'intrigue et de l\'espionnage',
    families: [
      {
        name: 'Bayushi',
        clan: 'Clan du Scorpion',
        traitBonus: 'agilite',
        description: 'Famille dirigeante, maîtres de la manipulation et de l\'intrigue'
      },
      {
        name: 'Shosuro',
        clan: 'Clan du Scorpion',
        traitBonus: 'intuition',
        description: 'Acteurs, espions et assassins'
      },
      {
        name: 'Soshi',
        clan: 'Clan du Scorpion',
        traitBonus: 'intelligence',
        description: 'Shugenja et courtisans, maîtres de la magie de l\'air'
      },
      {
        name: 'Yogo',
        clan: 'Clan du Scorpion',
        traitBonus: 'volonte',
        description: 'Gardiens maudits, protecteurs contre la corruption'
      }
    ],
    schools: []
  },
  {
    name: 'Clan de la Licorne',
    description: 'Explorateurs revenus des terres barbares, maîtres de la cavalerie',
    families: [
      {
        name: 'Shinjo',
        clan: 'Clan de la Licorne',
        traitBonus: 'intuition',
        description: 'Famille dirigeante, explorateurs et cavaliers'
      },
      {
        name: 'Utaku',
        clan: 'Clan de la Licorne',
        traitBonus: 'reflexes',
        description: 'Cavaliers d\'élite, maîtres des chevaux de guerre'
      },
      {
        name: 'Moto',
        clan: 'Clan de la Licorne',
        traitBonus: 'constitution',
        description: 'Guerriers des steppes, combattants brutaux'
      },
      {
        name: 'Ide',
        clan: 'Clan de la Licorne',
        traitBonus: 'intuition',
        description: 'Diplomates et négociants, médiateurs'
      },
      {
        name: 'Iuchi',
        clan: 'Clan de la Licorne',
        traitBonus: 'volonte',
        description: 'Shugenja nomades, maîtres de la magie étrangère'
      }
    ],
    schools: []
  }
];