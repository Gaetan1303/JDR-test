import { Spell } from '../models/character.model';

/**
 * Sorts Maho (Magie de Sang / Magie Noire)
 * Ces sorts sont interdits et corrompent l'utilisateur
 * Chaque utilisation augmente la Souillure du personnage
 */
export const MAHO_SPELLS: Spell[] = [
  // Maho Rang 1
  {
    name: 'Toucher de la Main Vide',
    element: 'Maho',
    mastery: 1,
    taintCost: 1,
    range: 'Contact',
    area: '1 cible',
    duration: 'Instantané',
    raises: 'Dégâts (+1k1)',
    description: 'Le maho-tsukai touche sa victime et draine son essence vitale. Inflige 2k2 dégâts qui ignorent l\'armure. Chaque raise ajoute +1k1 aux dégâts. Augmente la Souillure de 1.'
  },
  {
    name: 'Lire les Cendres',
    element: 'Maho',
    mastery: 1,
    taintCost: 0.5,
    range: 'Contact',
    area: 'Cendres d\'un cadavre',
    duration: 'Concentration',
    raises: 'Détails (+1 question)',
    description: 'En touchant les cendres d\'un défunt, le lanceur peut voir les derniers moments de sa vie et apprendre comment il est mort. Augmente la Souillure de 0.5.'
  },
  {
    name: 'Sens du Mal',
    element: 'Maho',
    mastery: 1,
    taintCost: 0.5,
    range: 'Personnel',
    area: 'Rayon de 30 mètres',
    duration: 'Concentration',
    raises: 'Portée (+10m)',
    description: 'Permet de détecter la présence de créatures souillées, de maho-tsukai ou d\'objets maudits dans la zone. Augmente la Souillure de 0.5.'
  },
  {
    name: 'Commandement des Ténèbres',
    element: 'Maho',
    mastery: 1,
    taintCost: 1,
    range: '10 mètres',
    area: '1 créature morte-vivante mineure',
    duration: '24 heures',
    raises: 'Durée (+12h), Cibles (+1)',
    description: 'Permet de commander un squelette, un zombie ou un esprit mineur. La créature obéit aux ordres simples du lanceur. Augmente la Souillure de 1.'
  },
  {
    name: 'Poison du Sang',
    element: 'Maho',
    mastery: 1,
    taintCost: 1,
    range: 'Contact',
    area: '1 cible',
    duration: '1 heure',
    raises: 'Dégâts (+0k1), Durée (+30min)',
    description: 'Le sang de la victime devient toxique, infligeant 1k1 dégâts par round pendant 5 rounds. La victime doit réussir un jet de Terre TN 15 pour résister. Augmente la Souillure de 1.'
  },

  // Maho Rang 2
  {
    name: 'Armure d\'Obsidienne',
    element: 'Maho',
    mastery: 2,
    taintCost: 1.5,
    range: 'Personnel',
    area: 'Lanceur',
    duration: '10 minutes',
    raises: 'Durée (+5min), Armure (+5)',
    description: 'Une armure noire comme l\'obsidienne enveloppe le maho-tsukai, lui octroyant +15 en Armure contre les attaques physiques et +10 contre les attaques magiques. Augmente la Souillure de 1.5.'
  },
  {
    name: 'Douleur Sans Fin',
    element: 'Maho',
    mastery: 2,
    taintCost: 1.5,
    range: '20 mètres',
    area: '1 cible',
    duration: '5 rounds',
    raises: 'Portée (+5m), Durée (+2 rounds)',
    description: 'La victime subit des douleurs atroces. Elle doit réussir un jet de Volonté TN 20 ou subir une pénalité de -3k0 à toutes ses actions. Augmente la Souillure de 1.5.'
  },
  {
    name: 'Invoquer un Oni Mineur',
    element: 'Maho',
    mastery: 2,
    taintCost: 2,
    range: '5 mètres',
    area: 'Zone d\'invocation',
    duration: '1 heure',
    raises: 'Durée (+30min)',
    description: 'Invoque un oni mineur (démon) pour servir le lanceur. L\'oni obéit à des ordres simples mais peut être hostile si mal contrôlé (jet de Volonté TN 25). Augmente la Souillure de 2.'
  },
  {
    name: 'Malédiction du Sang',
    element: 'Maho',
    mastery: 2,
    taintCost: 1.5,
    range: '30 mètres',
    area: '1 cible',
    duration: '24 heures',
    raises: 'Durée (+12h), Pénalité (-1k0)',
    description: 'La victime est maudite et subit -2k0 à tous ses jets de Terre. Peut être dissipé par un contre-sort ou une purification shintô. Augmente la Souillure de 1.5.'
  },
  {
    name: 'Vision de Jigoku',
    element: 'Maho',
    mastery: 2,
    taintCost: 1,
    range: '15 mètres',
    area: '1 cible',
    duration: 'Instantané',
    raises: 'Portée (+5m), Effet (Peur)',
    description: 'Force la cible à voir les horreurs de Jigoku (les Enfers). Elle doit réussir un jet de Volonté TN 25 ou fuir en panique pendant 3 rounds. Augmente la Souillure de 1.'
  },

  // Maho Rang 3
  {
    name: 'Drain de Vie',
    element: 'Maho',
    mastery: 3,
    taintCost: 2,
    range: '10 mètres',
    area: '1 cible',
    duration: 'Instantané',
    raises: 'Dégâts (+2k1), Soins (+1k1)',
    description: 'Draine l\'essence vitale de la victime (4k4 dégâts) et transfère la moitié des dégâts infligés au lanceur sous forme de soins. Augmente la Souillure de 2.'
  },
  {
    name: 'Peur Primordiale',
    element: 'Maho',
    mastery: 3,
    taintCost: 2,
    range: '25 mètres',
    area: 'Rayon de 10 mètres',
    duration: '5 rounds',
    raises: 'Zone (+5m), Durée (+2 rounds)',
    description: 'Toutes les créatures dans la zone doivent réussir un jet de Volonté TN 30 ou être paralysées par la peur pendant la durée du sort. Augmente la Souillure de 2.'
  },
  {
    name: 'Réanimer les Morts',
    element: 'Maho',
    mastery: 3,
    taintCost: 3,
    range: '10 mètres',
    area: '3 cadavres',
    duration: 'Permanent',
    raises: 'Cibles (+1 cadavre)',
    description: 'Transforme des cadavres en zombies permanents sous le contrôle du maho-tsukai. Les zombies obéissent jusqu\'à leur destruction. Augmente la Souillure de 3.'
  },
  {
    name: 'Corruption du Jade',
    element: 'Maho',
    mastery: 3,
    taintCost: 2.5,
    range: 'Contact',
    area: '1 objet de jade',
    duration: 'Permanent',
    raises: 'Taille de l\'objet',
    description: 'Corrompt un objet en jade, le transformant en jade noir (souillé). L\'objet perd ses propriétés protectrices et devient nocif pour les êtres purs. Augmente la Souillure de 2.5.'
  },
  {
    name: 'Nuée de Ténèbres',
    element: 'Maho',
    mastery: 3,
    taintCost: 2,
    range: '30 mètres',
    area: 'Rayon de 15 mètres',
    duration: '10 minutes',
    raises: 'Zone (+5m), Durée (+5min)',
    description: 'Crée une zone de ténèbres absolues où seul le lanceur peut voir. Les créatures à l\'intérieur subissent -4k0 à toutes leurs actions. Augmente la Souillure de 2.'
  },

  // Maho Rang 4
  {
    name: 'Déchirer l\'Âme',
    element: 'Maho',
    mastery: 4,
    taintCost: 3,
    range: '20 mètres',
    area: '1 cible',
    duration: 'Instantané',
    raises: 'Dégâts (+3k2)',
    description: 'Attaque directement l\'âme de la victime, infligeant 7k7 dégâts qui ignorent totalement l\'armure. Si la victime meurt, son âme est détruite et ne peut être ressuscitée. Augmente la Souillure de 3.'
  },
  {
    name: 'Invoquer un Oni Majeur',
    element: 'Maho',
    mastery: 4,
    taintCost: 4,
    range: '10 mètres',
    area: 'Zone d\'invocation',
    duration: '3 heures',
    raises: 'Durée (+1h)',
    description: 'Invoque un oni majeur (grand démon) pour servir le lanceur. Nécessite un jet de Volonté TN 35 pour contrôler, sinon l\'oni est libre et potentiellement hostile. Augmente la Souillure de 4.'
  },
  {
    name: 'Forme de Démon',
    element: 'Maho',
    mastery: 4,
    taintCost: 3.5,
    range: 'Personnel',
    area: 'Lanceur',
    duration: '1 heure',
    raises: 'Durée (+30min), Bonus (+1k1)',
    description: 'Le maho-tsukai se transforme partiellement en démon : +3k3 en Force, +3k3 en Agilité, griffes et crocs (3k3 dégâts), apparence monstrueuse. Augmente la Souillure de 3.5.'
  },
  {
    name: 'Peste Spirituelle',
    element: 'Maho',
    mastery: 4,
    taintCost: 4,
    range: '40 mètres',
    area: 'Rayon de 20 mètres',
    duration: '1 semaine',
    raises: 'Zone (+10m), Durée (+3 jours)',
    description: 'Répand une maladie spirituelle contagieuse. Les victimes perdent 1 rang de Terre par jour et gagnent 1 point de Souillure par jour. Nécessite une purification majeure pour guérir. Augmente la Souillure de 4.'
  },
  {
    name: 'Marionnette de Sang',
    element: 'Maho',
    mastery: 4,
    taintCost: 3,
    range: '25 mètres',
    area: '1 cible',
    duration: 'Concentration',
    raises: 'Durée (1 round sans concentration)',
    description: 'Prend le contrôle total du corps d\'une victime. La victime peut tenter un jet de Volonté TN 40 pour résister chaque round. Augmente la Souillure de 3.'
  },

  // Maho Rang 5
  {
    name: 'Portail vers Jigoku',
    element: 'Maho',
    mastery: 5,
    taintCost: 5,
    range: '15 mètres',
    area: 'Portail de 3m de rayon',
    duration: '10 minutes',
    raises: 'Durée (+5min), Taille (+2m)',
    description: 'Ouvre un portail vers Jigoku (les Enfers). Des créatures démoniaques peuvent en sortir et toute la zone devient souillée. Extrêmement dangereux. Augmente la Souillure de 5.'
  },
  {
    name: 'Transformation en Oni',
    element: 'Maho',
    mastery: 5,
    taintCost: 10,
    range: 'Personnel',
    area: 'Lanceur',
    duration: 'Permanent',
    raises: 'Aucun (irréversible)',
    description: 'Le maho-tsukai se transforme complètement en oni (démon). Gains massifs en puissance mais perte totale d\'humanité. Transformation irréversible. Augmente la Souillure de 10 (souillure maximale).'
  },
  {
    name: 'Mort Noire',
    element: 'Maho',
    mastery: 5,
    taintCost: 5,
    range: '50 mètres',
    area: 'Rayon de 25 mètres',
    duration: 'Instantané',
    raises: 'Dégâts (+4k4), Zone (+10m)',
    description: 'Une vague de mort pure balaye la zone. Toutes les créatures vivantes subissent 10k10 dégâts. Les victimes tuées se relèvent en tant que morts-vivants. Augmente la Souillure de 5.'
  },
  {
    name: 'Dévorer l\'Âme',
    element: 'Maho',
    mastery: 5,
    taintCost: 5,
    range: 'Contact',
    area: '1 cible',
    duration: 'Permanent',
    raises: 'Aucun',
    description: 'Dévore complètement l\'âme de la victime. Si elle meurt, son essence est absorbée par le lanceur qui gagne définitivement +1 dans un Anneau de son choix. L\'âme est détruite à jamais. Augmente la Souillure de 5.'
  },
  {
    name: 'Malédiction Ancestrale',
    element: 'Maho',
    mastery: 5,
    taintCost: 5,
    range: '30 mètres',
    area: '1 cible et ses descendants',
    duration: 'Permanent (générations)',
    raises: 'Aucun',
    description: 'Maudit la cible et toute sa lignée pour les générations futures. Les effets varient mais sont toujours terribles (maladie, malchance, mort prématurée, etc.). Extrêmement difficile à lever. Augmente la Souillure de 5.'
  }
];
