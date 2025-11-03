export interface ClanTechnique {
  name: string;
  clan: string;
  type: 'technique' | 'kata';
  rank: number;
  description: string;
  effect: string;
  mastery?: string;
}

export const CLAN_TECHNIQUES: ClanTechnique[] = [
  // Techniques de Clan Crabe
  {
    name: 'Frappe Dévastatrice',
    clan: 'Crabe',
    type: 'technique',
    rank: 1,
    description: 'Technique emblématique du Crabe pour détruire les ennemis.',
    effect: '+1k0 aux dégâts avec les armes lourdes. Peut ignorer 5 points d\'Armure.',
    mastery: 'Force'
  },
  {
    name: 'Mur de Jade',
    clan: 'Crabe',
    type: 'technique',
    rank: 2,
    description: 'Défense inébranlable comme le Mur Kaiu.',
    effect: '+10 en ND pour être Touché en posture de défense totale.',
    mastery: 'Constitution'
  },

  // Techniques de Clan Grue
  {
    name: 'Coup de l\'Aile',
    clan: 'Grue',
    type: 'technique',
    rank: 1,
    description: 'Attaque rapide et précise de la Grue.',
    effect: '+1k1 au premier jet d\'attaque de chaque combat.',
    mastery: 'Agilité'
  },
  {
    name: 'Danse des Grues',
    clan: 'Grue',
    type: 'technique',
    rank: 2,
    description: 'Mouvement gracieux qui désoriente l\'adversaire.',
    effect: 'Peut esquiver une attaque par round sans dépenser d\'action.',
    mastery: 'Réflexes'
  },

  // Techniques de Clan Dragon
  {
    name: 'Frappe du Vent et de la Foudre',
    clan: 'Dragon',
    type: 'technique',
    rank: 1,
    description: 'Combat à deux armes emblématique du Dragon.',
    effect: 'Combat à deux armes sans pénalités. +1k0 aux dégâts avec katana et wakizashi.',
    mastery: 'Agilité'
  },
  {
    name: 'Méditation du Vide',
    clan: 'Dragon',
    type: 'technique',
    rank: 2,
    description: 'Connexion profonde avec le Vide.',
    effect: 'Peut dépenser un point de Vide pour relancer n\'importe quel jet.',
    mastery: 'Vide'
  },

  // Techniques de Clan Lion
  {
    name: 'Rugissement du Lion',
    clan: 'Lion',
    type: 'technique',
    rank: 1,
    description: 'Cri de guerre intimidant du Lion.',
    effect: 'Les ennemis dans un rayon de 10m doivent réussir un jet de Volonté ND 20 ou être intimidés (-1k1 pendant 1 round).',
    mastery: 'Volonté'
  },
  {
    name: 'Tactique du Général Akodo',
    clan: 'Lion',
    type: 'technique',
    rank: 2,
    description: 'Maîtrise tactique légendaire.',
    effect: '+2k0 en Initiative. Peut donner un bonus de +5 en ND d\'Armure à tous les alliés à 20m.',
    mastery: 'Intelligence'
  },

  // Techniques de Clan Phénix
  {
    name: 'Flamme Intérieure',
    clan: 'Phénix',
    type: 'technique',
    rank: 1,
    description: 'Canalisation de l\'énergie élémentaire.',
    effect: 'Peut lancer un sort de niveau 1 sans dépenser de round de lancement.',
    mastery: 'Intelligence'
  },
  {
    name: 'Ailes du Phénix',
    clan: 'Phénix',
    type: 'technique',
    rank: 2,
    description: 'Maîtrise des éléments pour la protection.',
    effect: 'Résistance +10 contre tous les sorts et effets magiques.',
    mastery: 'Vide'
  },

  // Techniques de Clan Scorpion
  {
    name: 'Dard Empoisonné',
    clan: 'Scorpion',
    type: 'technique',
    rank: 1,
    description: 'Attaque furtive et mortelle.',
    effect: 'Les attaques de surprise infligent +2k1 dégâts. Bonus de +1k0 avec les armes légères.',
    mastery: 'Agilité'
  },
  {
    name: 'Masque d\'Illusion',
    clan: 'Scorpion',
    type: 'technique',
    rank: 2,
    description: 'Art de la tromperie perfectionné.',
    effect: '+3k0 aux jets de Discrétion et Déguisement. Les ennemis ont -1k1 pour détecter les mensonges.',
    mastery: 'Intelligence'
  },

  // Techniques de Clan Licorne
  {
    name: 'Charge de la Licorne',
    clan: 'Licorne',
    type: 'technique',
    rank: 1,
    description: 'Charge dévastatrice à cheval.',
    effect: '+3k1 aux dégâts lors d\'une charge à cheval. Renverse automatiquement les cibles de taille humaine.',
    mastery: 'Force'
  },
  {
    name: 'Maîtrise du Moto',
    clan: 'Licorne',
    type: 'technique',
    rank: 2,
    description: 'Combat monté légendaire.',
    effect: 'Combat à cheval sans aucune pénalité. +2k0 en Équitation.',
    mastery: 'Agilité'
  }
];

export const KATA: ClanTechnique[] = [
  // Kata universels - Rang 1
  {
    name: 'Frappe Précise',
    clan: 'Universel',
    type: 'kata',
    rank: 1,
    description: 'Kata enseignant la précision au combat.',
    effect: 'Peut convertir 2 points de dégâts en +5 au jet d\'attaque.',
    mastery: 'Perception'
  },
  {
    name: 'Esprit de Fer',
    clan: 'Universel',
    type: 'kata',
    rank: 1,
    description: 'Kata renforçant la volonté.',
    effect: '+1k0 à tous les jets de Volonté. Immunité contre la Peur de rang 1.',
    mastery: 'Volonté'
  },
  {
    name: 'Mouvement Fluide',
    clan: 'Universel',
    type: 'kata',
    rank: 1,
    description: 'Kata améliorant la mobilité.',
    effect: 'Peut se déplacer de 1,5m supplémentaire par round sans dépenser d\'action.',
    mastery: 'Agilité'
  },
  {
    name: 'Défense du Samouraï',
    clan: 'Universel',
    type: 'kata',
    rank: 1,
    description: 'Kata défensif fondamental.',
    effect: '+5 au ND d\'Armure contre la première attaque de chaque round.',
    mastery: 'Réflexes'
  },

  // Kata universels - Rang 2
  {
    name: 'Frappe Foudroyante',
    clan: 'Universel',
    type: 'kata',
    rank: 2,
    description: 'Kata pour frapper avec une vitesse surhumaine.',
    effect: 'Une fois par combat, peut effectuer une attaque supplémentaire en Action Simple.',
    mastery: 'Réflexes'
  },
  {
    name: 'Endurance du Guerrier',
    clan: 'Universel',
    type: 'kata',
    rank: 2,
    description: 'Kata renforçant la résistance.',
    effect: 'Peut ignorer les pénalités de blessures pendant 3 rounds. Utilisable une fois par jour.',
    mastery: 'Constitution'
  },
  {
    name: 'Œil du Faucon',
    clan: 'Universel',
    type: 'kata',
    rank: 2,
    description: 'Kata améliorant la perception au combat.',
    effect: '+2k0 aux jets d\'attaque à distance. Portée doublée.',
    mastery: 'Perception'
  },
  {
    name: 'Concentration Absolue',
    clan: 'Universel',
    type: 'kata',
    rank: 2,
    description: 'Kata de méditation en combat.',
    effect: 'Peut méditer 1 round pour regagner 2 points de Vide (max = Vide de base).',
    mastery: 'Vide'
  }
];
