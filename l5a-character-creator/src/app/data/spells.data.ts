import { Spell } from '../models/character.model';

export const SPELLS: Spell[] = [
  // Sorts d'Air
  {
    name: 'Bénédiction du Vent',
    element: 'Air',
    mastery: 1,
    range: 'Personnel',
    area: 'Lanceur',
    duration: '5 minutes',
    raises: 'Durée (+5 minutes)',
    description: 'Le shugenja peut voler pendant la durée du sort.'
  },
  {
    name: 'Clairvoyance',
    element: 'Air',
    mastery: 1,
    range: 'Illimitée',
    area: 'Spécial',
    duration: 'Concentration',
    raises: 'Aucun',
    description: 'Permet de voir et entendre à distance à travers les yeux d\'un animal.'
  },
  {
    name: 'Nature du Tempête',
    element: 'Air',
    mastery: 2,
    range: '50 mètres',
    area: 'Rayon de 10 mètres',
    duration: 'Instantané',
    raises: 'Dégâts (+1k0), Zone (+3 mètres)',
    description: 'Invoque des vents violents qui infligent 2k2 dégâts et peuvent renverser.'
  },
  {
    name: 'Marcher sur les Nuages',
    element: 'Air',
    mastery: 3,
    range: 'Personnel',
    area: 'Lanceur',
    duration: '1 heure',
    raises: 'Durée (+30 minutes)',
    description: 'Le shugenja peut marcher sur l\'air comme sur la terre ferme.'
  },
  {
    name: 'Colère des Kamis',
    element: 'Air',
    mastery: 4,
    range: '100 mètres',
    area: 'Rayon de 20 mètres',
    duration: 'Instantané',
    raises: 'Dégâts (+2k1), Zone (+5 mètres)',
    description: 'Tornade dévastatrice infligeant 5k5 dégâts dans une large zone.'
  },

  // Sorts de Terre
  {
    name: 'Armure de Jade',
    element: 'Terre',
    mastery: 1,
    range: 'Contact',
    area: '1 personne',
    duration: '1 heure',
    raises: 'Durée (+30 minutes), Cibles (+1)',
    description: 'Octroie un bonus d\'Armure de +5 contre les attaques physiques.'
  },
  {
    name: 'Force de la Terre',
    element: 'Terre',
    mastery: 1,
    range: 'Contact',
    area: '1 personne',
    duration: '10 minutes',
    raises: 'Durée (+5 minutes), Bonus (+1k0)',
    description: 'Augmente la Force de la cible de +2k0 pour la durée du sort.'
  },
  {
    name: 'Peau de Pierre',
    element: 'Terre',
    mastery: 2,
    range: 'Contact',
    area: '1 personne',
    duration: '1 heure',
    raises: 'Durée (+30 minutes), Réduction (+1)',
    description: 'Réduit tous les dégâts subis de 10 points.'
  },
  {
    name: 'Mur de Pierre',
    element: 'Terre',
    mastery: 3,
    range: '25 mètres',
    area: 'Mur de 10m x 3m',
    duration: '1 heure',
    raises: 'Taille (+3m), Durée (+30 min)',
    description: 'Crée un mur de pierre solide surgissant du sol.'
  },
  {
    name: 'Tremblement de Terre',
    element: 'Terre',
    mastery: 5,
    range: '100 mètres',
    area: 'Rayon de 50 mètres',
    duration: '5 rounds',
    raises: 'Zone (+10m), Durée (+1 round)',
    description: 'Provoque un séisme majeur dans une large zone.'
  },

  // Sorts d'Eau
  {
    name: 'Clarté de l\'Eau',
    element: 'Eau',
    mastery: 1,
    range: 'Contact',
    area: '1 personne',
    duration: '1 heure',
    raises: 'Durée (+30 minutes), Cibles (+1)',
    description: 'Augmente la Perception de +2k0 et permet de voir à travers les illusions.'
  },
  {
    name: 'Chemin sur l\'Eau',
    element: 'Eau',
    mastery: 1,
    range: 'Personnel',
    area: 'Lanceur',
    duration: '10 minutes',
    raises: 'Durée (+5 minutes)',
    description: 'Permet de marcher sur l\'eau comme sur la terre ferme.'
  },
  {
    name: 'Guérison Réflexe',
    element: 'Eau',
    mastery: 2,
    range: 'Contact',
    area: '1 personne',
    duration: 'Instantané',
    raises: 'Guérison (+1k1)',
    description: 'Guérit immédiatement 2k1 points de dégâts.'
  },
  {
    name: 'Purification',
    element: 'Eau',
    mastery: 2,
    range: 'Contact',
    area: '1 personne',
    duration: 'Instantané',
    raises: 'Aucun',
    description: 'Élimine les poisons, maladies et malédictions mineures.'
  },
  {
    name: 'Tsunami',
    element: 'Eau',
    mastery: 4,
    range: '200 mètres',
    area: 'Ligne de 100m x 20m',
    duration: 'Instantané',
    raises: 'Dégâts (+2k2), Zone (+20m)',
    description: 'Gigantesque vague d\'eau infligeant 6k4 dégâts.'
  },

  // Sorts de Feu
  {
    name: 'Flèche de Feu',
    element: 'Feu',
    mastery: 1,
    range: '30 mètres',
    area: '1 cible',
    duration: 'Instantané',
    raises: 'Dégâts (+1k1), Portée (+10m)',
    description: 'Projectile de feu pur infligeant 2k2 dégâts.'
  },
  {
    name: 'Aura de Flamme',
    element: 'Feu',
    mastery: 2,
    range: 'Personnel',
    area: 'Lanceur',
    duration: '5 minutes',
    raises: 'Durée (+2 minutes), Dégâts (+1k0)',
    description: 'Entoure le lanceur de flammes, infligeant 1k1 aux attaquants au corps à corps.'
  },
  {
    name: 'Katana de Feu',
    element: 'Feu',
    mastery: 3,
    range: 'Personnel',
    area: 'Arme du lanceur',
    duration: '10 minutes',
    raises: 'Durée (+5 min), Dégâts (+1k0)',
    description: 'L\'arme du lanceur s\'enflamme, +2k0 dégâts de feu.'
  },
  {
    name: 'Inferno',
    element: 'Feu',
    mastery: 4,
    range: '50 mètres',
    area: 'Rayon de 15 mètres',
    duration: 'Instantané',
    raises: 'Dégâts (+2k1), Zone (+5m)',
    description: 'Explosion de flammes dévastatrice infligeant 6k3 dégâts.'
  },
  {
    name: 'Avatar de Flamme',
    element: 'Feu',
    mastery: 5,
    range: 'Personnel',
    area: 'Lanceur',
    duration: '10 rounds',
    raises: 'Durée (+2 rounds)',
    description: 'Le shugenja devient un être de flamme pure, immunité au feu, vol, +4k2 dégâts.'
  },

  // Sorts de Vide
  {
    name: 'Sens du Vide',
    element: 'Vide',
    mastery: 1,
    range: 'Personnel',
    area: 'Lanceur',
    duration: '1 heure',
    raises: 'Durée (+30 minutes)',
    description: 'Permet de détecter la magie et les créatures surnaturelles dans un rayon de 30m.'
  },
  {
    name: 'Réflexes du Vide',
    element: 'Vide',
    mastery: 2,
    range: 'Contact',
    area: '1 personne',
    duration: '5 rounds',
    raises: 'Durée (+2 rounds), Bonus (+5)',
    description: 'Augmente l\'Initiative de +10 et permet d\'agir en premier.'
  },
  {
    name: 'Frappe du Vide',
    element: 'Vide',
    mastery: 3,
    range: 'Contact',
    area: '1 personne',
    duration: 'Instantané',
    raises: 'Dégâts (+1k1)',
    description: 'Attaque ignorant l\'armure, dégâts égaux au Vide du lanceur en k1.'
  },
  {
    name: 'Destruction du Vide',
    element: 'Vide',
    mastery: 4,
    range: '10 mètres',
    area: '1 objet',
    duration: 'Instantané',
    raises: 'Aucun',
    description: 'Détruit instantanément un objet non-magique de taille humaine.'
  },
  {
    name: 'Maîtrise du Vide',
    element: 'Vide',
    mastery: 5,
    range: 'Spécial',
    area: 'Spécial',
    duration: 'Spécial',
    raises: 'Aucun',
    description: 'Permet de lancer n\'importe quel sort d\'un autre élément sans le connaître.'
  },

  // Sorts supplémentaires de rang 1 et 2 pour la création de personnage

  // Air - Rang 1
  {
    name: 'Souffle des Kamis',
    element: 'Air',
    mastery: 1,
    range: '10 mètres',
    area: '1 cible',
    duration: 'Instantané',
    raises: 'Portée (+5m), Cibles (+1)',
    description: 'Pousse violemment une cible. ND de Force + 15 pour résister ou être renversée.'
  },
  {
    name: 'Yeux du Faucon',
    element: 'Air',
    mastery: 1,
    range: 'Personnel',
    area: 'Lanceur',
    duration: '1 heure',
    raises: 'Durée (+30 min)',
    description: 'Améliore la vision. +2k0 aux jets de Perception visuelle.'
  },

  // Air - Rang 2
  {
    name: 'Vitesse du Vent',
    element: 'Air',
    mastery: 2,
    range: 'Contact',
    area: '1 cible',
    duration: '10 minutes',
    raises: 'Durée (+5 min), Cibles (+1)',
    description: 'La cible gagne +10 en Initiative et +1 Action Simple par round.'
  },

  // Eau - Rang 1
  {
    name: 'Pureté de l\'Eau',
    element: 'Eau',
    mastery: 1,
    range: 'Contact',
    area: '1 cible ou 10L d\'eau',
    duration: 'Instantané',
    raises: 'Quantité (x2)',
    description: 'Purifie l\'eau empoisonnée ou contaminée, ou neutralise 1 poison dans le corps.'
  },
  {
    name: 'Réflexions de l\'Étang',
    element: 'Eau',
    mastery: 1,
    range: 'Spécial',
    area: 'Surface d\'eau',
    duration: 'Concentration',
    raises: 'Distance (x2)',
    description: 'Permet de voir à travers toute surface d\'eau dans un rayon de 1 km.'
  },

  // Eau - Rang 2
  {
    name: 'Lame de Glace',
    element: 'Eau',
    mastery: 2,
    range: '20 mètres',
    area: '1 cible',
    duration: 'Instantané',
    raises: 'Dégâts (+1k0), Portée (+10m)',
    description: 'Projette un trait de glace acérée. Attaque à distance 3k3 dégâts.'
  },

  // Feu - Rang 1
  {
    name: 'Importation',
    element: 'Feu',
    mastery: 1,
    range: '1 km',
    area: '1 objet',
    duration: 'Instantané',
    raises: 'Distance (x2), Taille (+1)',
    description: 'Téléporte instantanément un petit objet non-vivant vers le lanceur.'
  },
  {
    name: 'Flammes Dansantes',
    element: 'Feu',
    mastery: 1,
    range: '10 mètres',
    area: 'Spécial',
    duration: '5 minutes',
    raises: 'Durée (+5 min), Portée (+5m)',
    description: 'Contrôle les flammes existantes pour créer des formes et des illusions.'
  },
  {
    name: 'Chaleur Intérieure',
    element: 'Feu',
    mastery: 1,
    range: 'Contact',
    area: '1 cible',
    duration: '8 heures',
    raises: 'Durée (+4h), Cibles (+1)',
    description: 'Protège contre le froid. Immunité aux effets du froid naturel.'
  },

  // Feu - Rang 2
  {
    name: 'Lame Enflammée',
    element: 'Feu',
    mastery: 2,
    range: 'Contact',
    area: '1 arme',
    duration: '10 minutes',
    raises: 'Durée (+5 min), Dégâts (+1k0)',
    description: 'Une arme s\'enflamme et inflige +1k1 dégâts de feu.'
  },

  // Terre - Rang 1
  {
    name: 'Pierre Parlante',
    element: 'Terre',
    mastery: 1,
    range: 'Contact',
    area: '1 pierre',
    duration: 'Spécial',
    raises: 'Détails (+1 question)',
    description: 'Une pierre révèle ce qui s\'est passé dans la zone récemment.'
  },
  {
    name: 'Poussière Aux Yeux',
    element: 'Terre',
    mastery: 1,
    range: '5 mètres',
    area: '1 cible',
    duration: '1 minute',
    raises: 'Durée (+1 min), Cibles (+1)',
    description: 'Aveugle temporairement une cible. -3k0 à toutes les actions.'
  },

  // Terre - Rang 2
  {
    name: 'Mur de Terre',
    element: 'Terre',
    mastery: 2,
    range: '20 mètres',
    area: 'Mur 3x3 mètres',
    duration: '1 heure',
    raises: 'Taille (+1,5m), Durée (+30min)',
    description: 'Fait surgir un mur de terre solide du sol.'
  },

  // Vide - Rang 1 et 2
  {
    name: 'Sens des Kamis',
    element: 'Vide',
    mastery: 1,
    range: 'Personnel',
    area: 'Rayon 30m',
    duration: 'Concentration',
    raises: 'Portée (+15m)',
    description: 'Détecte la présence de magie, d\'esprits ou d\'impuretés.'
  },
  {
    name: 'Toucher du Vide',
    element: 'Vide',
    mastery: 2,
    range: 'Contact',
    area: '1 cible',
    duration: 'Instantané',
    raises: 'Aucun',
    description: 'Annule complètement un sort en cours ou un effet magique.'
  },

  // Sorts supplémentaires de niveau 1 et 2 pour équilibrer le jeu
  {
    name: 'Brise Purificatrice',
    element: 'Air',
    mastery: 1,
    range: 'Contact',
    area: 'Une personne',
    duration: 'Instantané',
    raises: 'Zone (+1 personne)',
    description: 'Nettoie complètement la cible de toute saleté, maladie ou poison mineur.'
  },
  {
    name: 'Souffle Glacial',
    element: 'Air',
    mastery: 2,
    range: '20 mètres',
    area: 'Cône de 10 mètres',
    duration: 'Instantané',
    raises: 'Dégâts (+1k0), Zone (+5 mètres)',
    description: 'Crée un souffle de vent glacé qui inflige 2k1 dégâts de froid.'
  },
  {
    name: 'Caresse de la Terre',
    element: 'Terre',
    mastery: 1,
    range: 'Contact',
    area: 'Une blessure',
    duration: 'Instantané',
    raises: 'Guérison (+2 points)',
    description: 'Guérit 1k2 points de dégâts par contact avec la terre.'
  },
  {
    name: 'Flamme Dansante',
    element: 'Feu',
    mastery: 1,
    range: '10 mètres',
    area: 'Une flamme',
    duration: '10 minutes',
    raises: 'Durée (+10 minutes), Portée (+10m)',
    description: 'Contrôle et déplace une flamme existante à volonté.'
  },
  {
    name: 'Explosion de Flammes',
    element: 'Feu',
    mastery: 2,
    range: '25 mètres',
    area: 'Rayon de 3 mètres',
    duration: 'Instantané',
    raises: 'Dégâts (+1k0), Zone (+1 mètre)',
    description: 'Crée une explosion de flammes qui inflige 2k3 dégâts de feu.'
  },
  {
    name: 'Rosée Rafraîchissante',
    element: 'Eau',
    mastery: 1,
    range: 'Contact',
    area: 'Une personne',
    duration: 'Instantané',
    raises: 'Cibles (+1 personne)',
    description: 'Restaure complètement la fatigue et donne +1k1 au prochain jet.'
  },
  {
    name: 'Lames d\'Eau',
    element: 'Eau',
    mastery: 2,
    range: '20 mètres',
    area: 'Ligne de 15 mètres',
    duration: 'Instantané',
    raises: 'Dégâts (+1k0), Longueur (+5m)',
    description: 'Projette des lames d\'eau tranchantes qui infligent 2k2 dégâts.'
  },
  {
    name: 'Protection Mystique',
    element: 'Vide',
    mastery: 2,
    range: 'Contact',
    area: 'Une personne',
    duration: '24 heures',
    raises: 'Durée (+12 heures), Cibles (+1 personne)',
    description: 'Protège contre les sorts de rang inférieur ou égal au rang du lanceur.'
  },

  // SORTS UNIVERSELS - Peuvent être appris par tous les shugenjas
  {
    name: 'Communion avec les Kamis',
    element: 'Vide',
    mastery: 1,
    range: 'Personnel',
    area: 'Lanceur',
    duration: 'Concentration',
    raises: 'Durée (+10 minutes)',
    description: 'Permet de parler avec les esprits kamis pour obtenir des informations.',
    universal: true
  },
  {
    name: 'Sanctifier',
    element: 'Vide',
    mastery: 1,
    range: 'Contact',
    area: 'Objet ou lieu',
    duration: 'Permanent',
    raises: 'Zone (+3m radius)',
    description: 'Bénit un objet ou un lieu, le protégeant des influences impures.',
    universal: true
  },
  {
    name: 'Sens de la Magie',
    element: 'Vide',
    mastery: 1,
    range: '30 mètres',
    area: 'Rayon',
    duration: 'Concentration',
    raises: 'Portée (+15m)',
    description: 'Détecte la présence de magie active dans la zone.',
    universal: true
  },
  {
    name: 'Invoquer les Kamis',
    element: 'Vide',
    mastery: 1,
    range: 'Spécial',
    area: 'Spécial',
    duration: 'Négociation',
    raises: 'Aucun',
    description: 'Invoque un kami pour demander son aide ou ses conseils.',
    universal: true
  },
  {
    name: 'Élément Minor',
    element: 'Vide',
    mastery: 1,
    range: '10 mètres',
    area: 'Petite zone',
    duration: '10 minutes',
    raises: 'Durée (+10 min), Portée (+10m)',
    description: 'Crée un petit effet élémentaire de base (flamme, brise, goutte d\'eau, etc.).',
    universal: true
  },
  {
    name: 'Résistance Élémentaire',
    element: 'Vide',
    mastery: 2,
    range: 'Contact',
    area: 'Une personne',
    duration: '1 heure',
    raises: 'Durée (+30 min), Cibles (+1 personne)',
    description: 'Confère une résistance de +2k0 contre un type d\'élément choisi.',
    universal: true
  },
  {
    name: 'Bannir les Mauvais Esprits',
    element: 'Vide',
    mastery: 2,
    range: '15 mètres',
    area: 'Rayon de 5 mètres',
    duration: 'Instantané',
    raises: 'Portée (+10m), Zone (+3m)',
    description: 'Force les esprits maléfiques et les morts-vivants à fuir la zone.',
    universal: true
  },
  {
    name: 'Purifier la Souillure',
    element: 'Vide',
    mastery: 2,
    range: 'Contact',
    area: 'Une personne ou objet',
    duration: 'Instantané',
    raises: 'Zone (affect area), Cibles (+1)',
    description: 'Élimine la souillure de l\'Outremonde et les malédictions mineures.',
    universal: true
  },
  {
    name: 'Protection du Voyageur',
    element: 'Vide',
    mastery: 1,
    range: 'Contact',
    area: 'Groupe jusqu\'à 5 personnes',
    duration: '8 heures',
    raises: 'Durée (+4 heures), Cibles (+2 personnes)',
    description: 'Protège le groupe des dangers naturels et des esprits hostiles en voyage.',
    universal: true
  },
  {
    name: 'Lien Spirituel',
    element: 'Vide',
    mastery: 2,
    range: 'Contact',
    area: 'Deux personnes',
    duration: '24 heures',
    raises: 'Durée (+12 heures), Distance (ignore)',
    description: 'Crée un lien spirituel permettant la communication télépathique simple.',
    universal: true
  }
];