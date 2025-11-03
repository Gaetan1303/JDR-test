import { School } from '../models/character.model';

export const SCHOOLS: School[] = [
  // Écoles du Clan du Crabe
  {
    name: 'École de Bushi Hida',
    type: 'bushi',
    clan: 'Clan du Crabe',
    traitBonus: 'force',
    skills: ['Défense', 'Kenjutsu', 'Kyujutsu', 'Lore: Terres Souillées', 'Combat sans Armes'],
    technique: 'Voie du Crabe : +1k0 aux jets d\'attaque et de dégâts contre les créatures des Terres Souillées. Peut porter une armure lourde sans pénalité de TN.',
    honor: 6.5,
    outfit: ['Kimono', 'Sandales', 'Wakizashi', 'Katana ou Tetsubo', 'Armure lourde', 'Trousse de voyage', 'Koku'],
    startingMoney: '3d10'
  },
  {
    name: 'École de Shugenja Kuni',
    type: 'shugenja',
    clan: 'Clan du Crabe',
    traitBonus: 'volonte',
    skills: ['Calligraphie', 'Lore: Terres Souillées', 'Médecine', 'Spellcraft', 'Théologie'],
    technique: 'Chasse aux Sorciers : +1k1 pour résister à la magie maho et détecter les créatures souillées. Affinité : Terre, Déficience : Air',
    honor: 6.5,
    outfit: ['Kimono', 'Sandales', 'Wakizashi', 'Parchemins de sorts', 'Kit de calligraphie', 'Jade', 'Koku'],
    startingMoney: '2d10',
    spellLimits: {
      rank1: 3,
      rank2: 1,
      affinity: 'Terre',
      deficiency: 'Air'
    }
  },

  // Écoles du Clan de la Grue
  {
    name: 'École de Bushi Kakita',
    type: 'bushi',
    clan: 'Clan de la Grue',
    traitBonus: 'agilite',
    skills: ['Artisanat', 'Iaijutsu', 'Kenjutsu', 'Kyujutsu', 'Sincérité'],
    technique: 'Voie du Grue : +1k1 aux jets d\'Iaijutsu. En position de Défense Totale, le TN pour toucher augmente de +10.',
    honor: 7.5,
    outfit: ['Kimono de soie', 'Sandales', 'Wakizashi', 'Katana', 'Éventail', 'Matériel d\'artisanat', 'Koku'],
    startingMoney: '3d10'
  },
  {
    name: 'École de Courtisan Doji',
    type: 'courtier',
    clan: 'Clan de la Grue',
    traitBonus: 'intuition',
    skills: ['Courtoisie', 'Danse', 'Mode', 'Poésie', 'Sincérité', 'Thé'],
    technique: 'Grâce du Grue : +1k1 aux jets sociaux en cour. Les autres personnages doivent faire un jet de Volonté (TN 15) pour être impolis.',
    honor: 8.5,
    outfit: ['Kimono somptueux', 'Sandales', 'Wakizashi', 'Éventail', 'Parfum', 'Matériel de cérémonie du thé', 'Koku'],
    startingMoney: '4d10'
  },
  {
    name: 'École de Shugenja Asahina',
    type: 'shugenja',
    clan: 'Clan de la Grue',
    traitBonus: 'perception',
    skills: ['Calligraphie', 'Courtoisie', 'Divination', 'Médecine', 'Spellcraft'],
    technique: 'Cœur Paisible : Ne peut lancer de sorts offensifs. +1k1 aux sorts de guérison et de protection. Affinité : Air, Déficience : Feu',
    honor: 8.5,
    outfit: ['Kimono', 'Sandales', 'Wakizashi', 'Parchemins de sorts', 'Kit de calligraphie', 'Kit médical', 'Koku'],
    startingMoney: '3d10',
    spellLimits: {
      rank1: 3,
      rank2: 1,
      affinity: 'Air',
      deficiency: 'Feu'
    }
  },

  // Écoles du Clan du Dragon
  {
    name: 'École de Bushi Mirumoto',
    type: 'bushi',
    clan: 'Clan du Dragon',
    traitBonus: 'agilite',
    skills: ['Défense', 'Iaijutsu', 'Kenjutsu', 'Kyujutsu', 'Méditation'],
    technique: 'Voie du Dragon : Peut combattre avec deux armes sans pénalité. +1k0 aux jets d\'attaque quand il manie deux armes.',
    honor: 7.5,
    outfit: ['Kimono', 'Sandales', 'Wakizashi', 'Katana', 'Tanto', 'Armure légère', 'Koku'],
    startingMoney: '3d10'
  },
  {
    name: 'École de Shugenja Tamori',
    type: 'shugenja',
    clan: 'Clan du Dragon',
    traitBonus: 'volonte',
    skills: ['Artisanat : Tatouage', 'Jiujutsu', 'Lore : Éléments', 'Méditation', 'Spellcraft'],
    technique: 'Tatouages Mystiques : Peut tatouer des sorts sur sa peau. Un tatouage peut être activé une fois par jour sans dépenser de sorts. Affinité : Terre, Déficience : Air',
    honor: 7.5,
    outfit: ['Kimono simple', 'Sandales', 'Bo', 'Kit de tatouage', 'Parchemins de sorts', 'Jade', 'Koku'],
    startingMoney: '2d10',
    spellLimits: {
      rank1: 3,
      rank2: 1,
      affinity: 'Terre',
      deficiency: 'Air'
    }
  },

  // Écoles du Clan du Lion
  {
    name: 'École de Bushi Akodo',
    type: 'bushi',
    clan: 'Clan du Lion',
    traitBonus: 'intelligence',
    skills: ['Combat en Formation', 'Kenjutsu', 'Kyujutsu', 'Leadership', 'Lore : Histoire'],
    technique: 'Commandement : +1k1 aux jets d\'Initiative. Peut donner des ordres simples qui donnent +1k1 aux alliés dans un domaine.',
    honor: 8.5,
    outfit: ['Kimono', 'Sandales', 'Wakizashi', 'Katana', 'Yumi', 'Armure lourde', 'Koku'],
    startingMoney: '3d10'
  },
  {
    name: 'École de Shugenja Kitsu',
    type: 'shugenja',
    clan: 'Clan du Lion',
    traitBonus: 'volonte',
    skills: ['Calligraphie', 'Lore : Ancêtres', 'Lore : Histoire', 'Spellcraft', 'Théologie'],
    technique: 'Communion avec les Ancêtres : Peut parler avec les esprits ancestraux une fois par jour. +1k1 aux sorts impliquant les ancêtres. Affinité : Air, Déficience : Eau',
    honor: 8.5,
    outfit: ['Kimono traditionnel', 'Sandales', 'Wakizashi', 'Parchemins ancestraux', 'Encens', 'Kit de calligraphie', 'Koku'],
    startingMoney: '2d10',
    spellLimits: {
      rank1: 3,
      rank2: 1,
      affinity: 'Air',
      deficiency: 'Eau'
    }
  },

  // Écoles du Clan du Phénix
  {
    name: 'École de Shugenja Isawa',
    type: 'shugenja',
    clan: 'Clan du Phénix',
    traitBonus: 'intelligence',
    skills: ['Calligraphie', 'Lore : Théologie', 'Méditation', 'Spellcraft', 'Un Lore élémentaire'],
    technique: 'Maîtrise Élémentaire : Choisit un élément d\'affinité au Rang 1. +1k1 aux sorts de cet élément. Peut invoquer des kami sans sorts.',
    honor: 6.5,
    outfit: ['Robes de shugenja', 'Sandales', 'Wakizashi', 'Parchemins de sorts', 'Kit de calligraphie', 'Focus élémentaire', 'Koku'],
    startingMoney: '2d10',
    spellLimits: {
      rank1: 4,
      rank2: 2,
      affinity: 'Aucune' // L'école Isawa peut choisir son affinité
    }
  },
  {
    name: 'École de Bushi Shiba',
    type: 'bushi',
    clan: 'Clan du Phénix',
    traitBonus: 'volonte',
    skills: ['Défense', 'Kenjutsu', 'Kyujutsu', 'Méditation', 'Spellcraft'],
    technique: 'Protection Yojimbo : +1k1 aux jets de Défense quand il protège quelqu\'un. Peut dépenser un Point de Vide pour annuler une attaque réussie contre son protégé.',
    honor: 8.5,
    outfit: ['Kimono', 'Sandales', 'Wakizashi', 'Katana', 'Yari', 'Armure légère', 'Koku'],
    startingMoney: '3d10'
  },

  // Écoles du Clan du Scorpion
  {
    name: 'École de Bushi Bayushi',
    type: 'bushi',
    clan: 'Clan du Scorpion',
    traitBonus: 'agilite',
    skills: ['Défense', 'Iaijutsu', 'Kenjutsu', 'Kyujutsu', 'Tromperie'],
    technique: 'Voie du Scorpion : +1k0 aux jets d\'attaque contre les adversaires ayant un Honneur supérieur. Peut Feinter comme action simple.',
    honor: 5.5,
    outfit: ['Kimono', 'Sandales', 'Wakizashi', 'Katana', 'Masque', 'Armure légère', 'Koku'],
    startingMoney: '3d10'
  },
  {
    name: 'École de Courtisan Shosuro',
    type: 'courtier',
    clan: 'Clan du Scorpion',
    traitBonus: 'intuition',
    skills: ['Acting', 'Courtoisie', 'Jiujutsu', 'Stealth', 'Temptation', 'Tromperie'],
    technique: 'Masque du Scorpion : +1k1 aux jets de Tromperie et Acting. Peut changer d\'identité sociale en une scène.',
    honor: 4.5,
    outfit: ['Vêtements variés', 'Sandales', 'Wakizashi', 'Masques', 'Maquillage', 'Costumes', 'Koku'],
    startingMoney: '4d10'
  },

  // Écoles du Clan de la Licorne
  {
    name: 'École de Bushi Moto',
    type: 'bushi',
    clan: 'Clan de la Licorne',
    traitBonus: 'constitution',
    skills: ['Équitation', 'Kenjutsu', 'Kyujutsu', 'Lore : Gaijin', 'Combat sans Armes'],
    technique: 'Charge du Cheval : +1k1 aux jets d\'attaque et de dégâts lors d\'une charge à cheval. Peut attaquer après un mouvement de charge.',
    honor: 6.5,
    outfit: ['Vêtements de voyage', 'Bottes', 'Wakizashi', 'Cimeterre', 'Arc composite', 'Cheval de guerre', 'Koku'],
    startingMoney: '3d10'
  },
  {
    name: 'École de Shugenja Iuchi',
    type: 'shugenja',
    clan: 'Clan de la Licorne',
    traitBonus: 'intelligence',
    skills: ['Calligraphie', 'Divination', 'Équitation', 'Lore : Gaijin', 'Spellcraft'],
    technique: 'Magie Nomade : Peut lancer des sorts en se déplaçant sans pénalité. +1k0 aux sorts lancés en extérieur. Affinité : Feu, Déficience : Terre',
    honor: 6.5,
    outfit: ['Robes de voyage', 'Bottes', 'Wakizashi', 'Parchemins de sorts', 'Focus de voyage', 'Cheval', 'Koku'],
    startingMoney: '2d10',
    spellLimits: {
      rank1: 3,
      rank2: 1,
      affinity: 'Feu',
      deficiency: 'Terre'
    }
  },

  // Écoles des Clans Mineurs
  {
    name: 'École de Bushi Ichiro',
    type: 'bushi',
    clan: 'Clan du Blaireau',
    traitBonus: 'constitution',
    skills: ['Artisanat', 'Athlétisme', 'Défense', 'Kenjutsu', 'Commerce'],
    technique: 'Ténacité du Blaireau : +1k1 aux jets de Constitution. Peut ignorer les pénalités de fatigue pendant un nombre de rounds égal à son rang de Constitution.',
    honor: 6.0,
    outfit: ['Vêtements de travail', 'Bottes', 'Wakizashi', 'Katana', 'Outils de mineur', 'Lanterne', 'Koku'],
    startingMoney: '2d10'
  },
  {
    name: 'École de Bushi Tonbo',
    type: 'bushi', 
    clan: 'Clan de la Libellule',
    traitBonus: 'perception',
    skills: ['Défense', 'Kenjutsu', 'Kyujutsu', 'Méditation', 'Lore: Éléments'],
    technique: 'Vision de la Libellule : +1k1 aux jets de Perception et d\'Initiative. Peut voir les auras magiques.',
    honor: 7.0,
    outfit: ['Kimono simple', 'Sandales', 'Wakizashi', 'Katana', 'Cristal de méditation', 'Encens', 'Koku'],
    startingMoney: '2d10'
  },
  {
    name: 'École de Bushi Toritaka',
    type: 'bushi',
    clan: 'Clan du Faucon',
    traitBonus: 'perception',
    skills: ['Défense', 'Kenjutsu', 'Kyujutsu', 'Lore: Ancêtres', 'Chasse'],
    technique: 'Œil du Faucon : +1k1 aux jets de Kyujutsu. Peut communiquer avec les esprits des ancêtres une fois par jour.',
    honor: 6.5,
    outfit: ['Kimono de chasseur', 'Sandales', 'Wakizashi', 'Katana', 'Arc de chasse', 'Amulette d\'ancêtre', 'Koku'],
    startingMoney: '2d10'
  },
  {
    name: 'École de Bushi Kitsune',
    type: 'bushi',
    clan: 'Clan du Renard',
    traitBonus: 'agilite', 
    skills: ['Défense', 'Kenjutsu', 'Stealth', 'Lore: Forêt', 'Survie'],
    technique: 'Ruse du Renard : +1k1 aux jets de Stealth. Peut se déplacer en terrain difficile sans pénalité.',
    honor: 6.0,
    outfit: ['Vêtements de forestier', 'Sandales', 'Wakizashi', 'Katana', 'Corde', 'Kit de survie', 'Koku'],
    startingMoney: '2d10'
  },
  {
    name: 'École de Bushi Usagi',
    type: 'bushi',
    clan: 'Clan du Lièvre',
    traitBonus: 'reflexes',
    skills: ['Défense', 'Kenjutsu', 'Athlétisme', 'Stealth', 'Équitation'],
    technique: 'Rapidité du Lièvre : +1k1 aux jets d\'Initiative et de mouvement. Peut effectuer une action gratuite de mouvement.',
    honor: 6.0,
    outfit: ['Vêtements légers', 'Sandales', 'Wakizashi', 'Katana', 'Bottes de course', 'Sac léger', 'Koku'],
    startingMoney: '2d10'
  },
  {
    name: 'École de Bushi Suzume',
    type: 'bushi',
    clan: 'Clan du Moineau',
    traitBonus: 'intuition',
    skills: ['Défense', 'Kenjutsu', 'Courtoisie', 'Sincérité', 'Art de la Guerre'],
    technique: 'Humilité du Moineau : +1k1 aux jets de Sincérité. Les adversaires sous-estiment le personnage (+5 TN à leurs jets de Perception contre lui).',
    honor: 7.5,
    outfit: ['Kimono humble', 'Sandales', 'Wakizashi', 'Katana', 'Textes de stratégie', 'Amulette', 'Koku'],
    startingMoney: '2d10'
  },
  {
    name: 'École de Bushi Yoritomo',
    type: 'bushi',
    clan: 'Clan de la Mante',
    traitBonus: 'force',
    skills: ['Commerce', 'Kenjutsu', 'Kyujutsu', 'Navigation', 'Combat sans Armes'],
    technique: 'Tempête de la Mante : +1k1 aux jets d\'attaque en combat sans armes ou avec armes improvisées. Peut combattre sans pénalité sur un navire en mouvement.',
    honor: 5.5,
    outfit: ['Vêtements de marin', 'Bottes', 'Wakizashi', 'Katana ou Kama', 'Corde', 'Instruments de navigation', 'Koku'],
    startingMoney: '3d10'
  },

  // Moines
  {
    name: 'Ordre des Moines du Temple du Soleil',
    type: 'moine',
    clan: 'Clan du Dragon',
    traitBonus: 'agilite',
    skills: ['Athlétisme', 'Jiujutsu', 'Méditation', 'Lore: Théologie', 'Stealth'],
    technique: 'Voie de l\'Illumination : Peut apprendre 2 Kiho de Rang 1 à la création. +1k0 aux jets de Jiujutsu. Réduit le coût en XP des Kiho de 1 (minimum 1).',
    honor: 7.5,
    outfit: ['Robes de moine', 'Sandales', 'Bo', 'Chapelet de prière', 'Bol à aumônes', 'Textes sacrés', 'Koku'],
    startingMoney: '1d10'
  },
  {
    name: 'Ordre des Moines du Temple du Lotus',
    type: 'moine',
    clan: 'Clan du Dragon',
    traitBonus: 'volonte',
    skills: ['Défense', 'Jiujutsu', 'Méditation', 'Lore: Éléments', 'Théologie'],
    technique: 'Harmonie Élémentaire : Peut apprendre 2 Kiho de Rang 1 à la création (d\'éléments différents). +1k1 aux jets de Méditation. Bonus de +5 au TN pour résister aux effets magiques.',
    honor: 8.0,
    outfit: ['Robes monastiques', 'Sandales', 'Bo ou Tonfa', 'Encens', 'Cristaux de méditation', 'Textes élémentaires', 'Koku'],
    startingMoney: '1d10'
  },
  {
    name: 'Ordre des Moines du Dragon Tatouage',
    type: 'moine',
    clan: 'Clan du Dragon',
    traitBonus: 'constitution',
    skills: ['Artisanat: Tatouage', 'Jiujutsu', 'Méditation', 'Lore: Éléments', 'Combat sans Armes'],
    technique: 'Tatouages Mystiques de Togashi : Peut apprendre 2 Kiho de Rang 1. Les tatouages magiques donnent +1k0 aux jets de l\'élément correspondant. Peut activer un Kiho sans dépense d\'action une fois par jour.',
    honor: 7.0,
    outfit: ['Robes simples', 'Sandales', 'Bo', 'Kit de tatouage', 'Encre sacrée', 'Outils de méditation', 'Koku'],
    startingMoney: '1d10'
  },
  // Clan de l'Araignée
  {
    name: 'École de Bushi Daigotsu',
    type: 'bushi',
    clan: 'Clan de l\'Araignée',
    traitBonus: 'agilite',
    skills: ['Kenjutsu', 'Defense', 'Lore: Shadowlands', 'Stealth', 'Intimidation', 'Jiujutsu', 'Athletics'],
    technique: 'Voie de la Souillure : Lorsque vous tuez un adversaire au combat, vous gagnez 1 point de Souillure et vous pouvez immédiatement effectuer une attaque supplémentaire contre un adversaire à portée. Vous ajoutez votre Rang de Souillure à tous vos jets d\'Intimidation.',
    honor: 4.5,
    outfit: ['Armure légère', 'Daisho', 'Arc ou Arme lourde', 'Vêtements de voyage sombres', 'Koku'],
    startingMoney: '3d10'
  },
  {
    name: 'École de Shugenja Daigotsu',
    type: 'shugenja',
    clan: 'Clan de l\'Araignée',
    traitBonus: 'volonte',
    skills: ['Calligraphie: Maho', 'Lore: Shadowlands', 'Lore: Souillure', 'Meditation', 'Spellcraft'],
    technique: 'Maître du Sang : Vous connaissez 3 sorts de Maho en plus de vos sorts de départ. Vous pouvez lancer des sorts de Maho sans parchemin. Lorsque vous lancez un sort de Maho, vous gagnez +1k1 au jet de lancement mais prenez 1 point de Souillure.',
    honor: 4.0,
    outfit: ['Robes sombres', 'Wakizashi', 'Couteau de sacrifice', 'Parchemins de Maho', 'Kit de voyage', 'Koku'],
    startingMoney: '2d10'
  },
  {
    name: 'École de Courtisan Susumu',
    type: 'courtier',
    clan: 'Clan de l\'Araignée',
    traitBonus: 'intelligence',
    skills: ['Courtier', 'Etiquette', 'Sincerity', 'Temptation', 'Lore: Underworld', 'Investigation', 'Acting'],
    technique: 'Masque de la Vérité : Vous pouvez utiliser Sincerity à la place de Investigation pour détecter les mensonges. Vous gagnez un bonus de +2k0 aux jets de Temptation contre les personnes que vous avez identifiées comme ayant un Désavantage (désir, peur, etc.). Une fois par session, vous pouvez mentir sans que cela soit détecté magiquement.',
    honor: 5.0,
    outfit: ['Kimono élégant sombre', 'Wakizashi', 'Éventail', 'Kit de calligraphie', 'Koku'],
    startingMoney: '5d10'
  }
];
