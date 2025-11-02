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
    startingMoney: '2d10'
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
    startingMoney: '2d10'
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
    startingMoney: '2d10'
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
    startingMoney: '2d10'
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
    startingMoney: '2d10'
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
    startingMoney: '2d10'
  }
];