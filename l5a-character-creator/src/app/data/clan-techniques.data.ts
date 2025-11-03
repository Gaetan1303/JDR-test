export interface ClanTechnique {
  name: string;
  clan: string;
  family?: string; // Si défini, c'est une technique de famille, sinon c'est une technique de clan
  description: string;
  effect: string;
  mastery?: number; // Rang de maîtrise requis
  type: 'clan' | 'famille';
}

export const CLAN_TECHNIQUES: ClanTechnique[] = [
  // CLAN DU CRABE
  {
    name: 'Serment du Crabe',
    clan: 'Clan du Crabe',
    type: 'clan',
    description: 'Les samouraïs du Crabe jurent de défendre l\'Empire contre les Terres Souillées, quoi qu\'il en coûte.',
    effect: 'Lorsque vous combattez une créature des Terres Souillées, vous gagnez un bonus de +1k0 à tous vos jets d\'attaque et de dégâts. Vous ne subissez pas de pénalité de Blessures tant que vous êtes dans la Zone de Blessures Graves.'
  },
  {
    name: 'Façon Hida',
    clan: 'Clan du Crabe',
    family: 'Hida',
    type: 'famille',
    description: 'Les Hida sont formés dès l\'enfance à endurer la douleur et à ne jamais reculer.',
    effect: 'Vous réduisez de 3 toutes les pénalités de Blessures que vous subissez. Vous pouvez effectuer une Attaque Complète même lorsque vous êtes dans la Zone de Blessures Graves.'
  },
  {
    name: 'Traqueur Hiruma',
    clan: 'Clan du Crabe',
    family: 'Hiruma',
    type: 'famille',
    description: 'Les Hiruma sont des maîtres de la survie et de la traque dans les territoires hostiles.',
    effect: 'Vous gagnez un bonus gratuit de +2k0 à tous les jets de Chasse et de Survie. Dans les Terres Souillées, vous ajoutez votre Rang d\'École à tous les jets de Stealth.'
  },
  {
    name: 'Génie Kaiu',
    clan: 'Clan du Crabe',
    family: 'Kaiu',
    type: 'famille',
    description: 'Les ingénieurs Kaiu sont capables de créer des merveilles d\'ingénierie et de fortification.',
    effect: 'Vous réduisez de 5 le ND de tous vos jets d\'Artisanat. Lorsque vous créez des armes de siège ou des fortifications, vous réduisez le temps de construction de moitié.'
  },
  {
    name: 'Sagesse Kuni',
    clan: 'Clan du Crabe',
    family: 'Kuni',
    type: 'famille',
    description: 'Les Kuni ont une compréhension profonde de la souillure et de la magie noire.',
    effect: 'Vous gagnez +1k0 à tous les jets de Lore: Shadowlands et de Lore: Souillure. Vous pouvez détecter la souillure d\'une créature ou d\'un objet en le touchant (jet de Perception à ND 15).'
  },
  {
    name: 'Persuasion Yasuki',
    clan: 'Clan du Crabe',
    family: 'Yasuki',
    type: 'famille',
    description: 'Les Yasuki sont des négociateurs redoutables et des marchands astucieux.',
    effect: 'Vous gagnez +1k0 à tous les jets de Commerce et de Courtier. Une fois par session, vous pouvez re-lancer un jet de Commerce raté.'
  },

  // CLAN DE LA GRUE
  {
    name: 'Grâce de la Grue',
    clan: 'Clan de la Grue',
    type: 'clan',
    description: 'Les samouraïs de la Grue incarnent la perfection artistique et la courtoisie.',
    effect: 'Vous gagnez un bonus gratuit de +1k0 à tous les jets sociaux (Courtier, Etiquette, Sincerity) à la cour. Votre Honneur est considéré comme étant supérieur de 1.0 pour tous les effets de jeu.'
  },
  {
    name: 'Excellence Doji',
    clan: 'Clan de la Grue',
    family: 'Doji',
    type: 'famille',
    description: 'Les Doji représentent l\'apogée de la culture rokugani.',
    effect: 'Vous pouvez ajouter votre Honneur (en nombre entier) à tous vos jets sociaux. Lorsque vous effectuez un jet d\'Art (n\'importe quel type), vous gagnez +2k0.'
  },
  {
    name: 'Lame Kakita',
    clan: 'Clan de la Grue',
    family: 'Kakita',
    type: 'famille',
    description: 'Les Kakita sont les plus grands duellistes de l\'Empire.',
    effect: 'Lors d\'un duel iaijutsu, vous gagnez +2k0 à votre jet de Focus. Vous pouvez re-lancer un dé lors de la phase de Frappe du duel.'
  },
  {
    name: 'Art Asahina',
    clan: 'Clan de la Grue',
    family: 'Asahina',
    type: 'famille',
    description: 'Les Asahina sont des pacifistes dévoués à l\'art et à la guérison.',
    effect: 'Vous gagnez +1k1 à tous les jets de sorts de guérison. Vous pouvez lancer un sort de guérison en Action Simple au lieu d\'Action Complexe une fois par jour.'
  },
  {
    name: 'Discipline Daidoji',
    clan: 'Clan de la Grue',
    family: 'Daidoji',
    type: 'famille',
    description: 'Les Daidoji sont les gardes du corps et protecteurs silencieux de la Grue.',
    effect: 'Lorsque vous protégez quelqu\'un (Défense Totale pour un allié), vous donnez un bonus de +10 à son ND d\'Armure. Vous gagnez +1k0 aux jets d\'Iaijutsu (dégainage).'
  },

  // CLAN DU DRAGON
  {
    name: 'Énigme du Dragon',
    clan: 'Clan du Dragon',
    type: 'clan',
    description: 'Les Dragons suivent des voies mystérieuses et impénétrables.',
    effect: 'Une fois par session, vous pouvez entrer dans un état méditatif qui vous donne +3k0 à un seul jet de votre choix. Vous gagnez +1k0 à tous les jets de Méditation.'
  },
  {
    name: 'Voie Mirumoto',
    clan: 'Clan du Dragon',
    family: 'Mirumoto',
    type: 'famille',
    description: 'Les Mirumoto maîtrisent le style de combat à deux sabres.',
    effect: 'Lorsque vous combattez avec deux armes, vous ne subissez pas de pénalité. Vous gagnez +1k0 aux jets d\'attaque avec votre arme secondaire.'
  },
  {
    name: 'Connaissance Agasha',
    clan: 'Clan du Dragon',
    family: 'Agasha',
    type: 'famille',
    description: 'Les Agasha sont des alchimistes et savants accomplis.',
    effect: 'Vous réduisez de 5 le ND de tous les jets d\'Artisanat: Alchimie. Vous pouvez créer des potions et des substances alchimiques en deux fois moins de temps.'
  },
  {
    name: 'Sagesse Kitsuki',
    clan: 'Clan du Dragon',
    family: 'Kitsuki',
    type: 'famille',
    description: 'Les Kitsuki sont des enquêteurs et magistrats perspicaces.',
    effect: 'Vous gagnez +2k0 à tous les jets d\'Investigation. Vous pouvez utiliser Intelligence à la place d\'Intuition pour les jets de Perception.'
  },
  {
    name: 'Mystère Togashi',
    clan: 'Clan du Dragon',
    family: 'Togashi',
    type: 'famille',
    description: 'Les moines Togashi portent des tatouages magiques ancestraux.',
    effect: 'Vous commencez le jeu avec un tatouage magique mineur. Vous gagnez +1k0 à tous les jets de Méditation et pouvez apprendre un Kiho supplémentaire.'
  },

  // CLAN DU LION
  {
    name: 'Fureur du Lion',
    clan: 'Clan du Lion',
    type: 'clan',
    description: 'Les Lions sont des guerriers féroces animés par l\'honneur et le devoir.',
    effect: 'Lorsque vous êtes en infériorité numérique au combat, vous gagnez +1k0 à tous vos jets d\'attaque. Vous pouvez effectuer une charge même après avoir déjà bougé pendant votre tour.'
  },
  {
    name: 'Commandement Akodo',
    clan: 'Clan du Lion',
    family: 'Akodo',
    type: 'famille',
    description: 'Les Akodo sont les plus grands tacticiens et commandants de l\'Empire.',
    effect: 'Vous gagnez +2k0 à tous les jets de Battle (tactique militaire). En combat de masse, vos troupes gagnent +5 à leur ND d\'Armure.'
  },
  {
    name: 'Honneur Matsu',
    clan: 'Clan du Lion',
    family: 'Matsu',
    type: 'famille',
    description: 'Les Matsu ne reculent jamais et combattent avec une fureur légendaire.',
    effect: 'Lorsque vous êtes dans la Zone de Blessures, vous gagnez +2k1 à tous vos jets d\'attaque au lieu de subir des pénalités. Vous ne pouvez jamais échouer à un jet de Peur.'
  },
  {
    name: 'Tactique Ikoma',
    clan: 'Clan du Lion',
    family: 'Ikoma',
    type: 'famille',
    description: 'Les Ikoma sont les gardiens de l\'histoire et les conteurs de l\'Empire.',
    effect: 'Vous gagnez +1k0 à tous les jets de Lore (n\'importe quel type). Lorsque vous racontez une histoire ou récitez un poème, vous pouvez inspirer vos alliés qui gagnent +1k0 à leur prochain jet.'
  },
  {
    name: 'Dévotion Kitsu',
    clan: 'Clan du Lion',
    family: 'Kitsu',
    type: 'famille',
    description: 'Les Kitsu ont un lien unique avec les esprits des ancêtres.',
    effect: 'Vous pouvez communiquer avec les esprits ancestraux. Une fois par session, vous pouvez invoquer un ancêtre pour obtenir un conseil ou un bonus de +3k0 à un jet de Lore.'
  },

  // CLAN DU PHÉNIX
  {
    name: 'Illumination du Phénix',
    clan: 'Clan du Phénix',
    type: 'clan',
    description: 'Les Phénix sont les maîtres de la magie et de la connaissance ésotérique.',
    effect: 'Vous gagnez +1k0 à tous vos jets de lancement de sorts. Vous connaissez un sort supplémentaire de votre élément de Vide gratuitement.'
  },
  {
    name: 'Maîtrise Isawa',
    clan: 'Clan du Phénix',
    family: 'Isawa',
    type: 'famille',
    description: 'Les Isawa sont les plus puissants shugenja de l\'Empire.',
    effect: 'Vous réduisez de 5 le ND de tous vos jets de Spellcraft. Vous pouvez importer un sort d\'un autre élément que vous maîtrisez à moindre coût (-1 XP).'
  },
  {
    name: 'Protecteur Shiba',
    clan: 'Clan du Phénix',
    family: 'Shiba',
    type: 'famille',
    description: 'Les Shiba sont les gardiens dévoués des shugenja Isawa.',
    effect: 'Lorsque vous protégez un shugenja allié, vous gagnez +5 à votre ND d\'Armure et le shugenja gagne +1k0 à ses jets de sort. Vous pouvez intercepter une attaque visant un allié adjacent en Action Libre.'
  },
  {
    name: 'Divination Asako',
    clan: 'Clan du Phénix',
    family: 'Asako',
    type: 'famille',
    description: 'Les Asako sont des érudits et des devins accomplis.',
    effect: 'Vous gagnez +2k0 à tous les jets de Divination et de Lore: Théologie. Une fois par session, vous pouvez avoir une vision du futur qui vous donne un indice sur un événement à venir.'
  },

  // CLAN DU SCORPION
  {
    name: 'Masque du Scorpion',
    clan: 'Clan du Scorpion',
    type: 'clan',
    description: 'Les Scorpions sont les maîtres de la tromperie et de la manipulation.',
    effect: 'Vous gagnez +1k0 à tous les jets de Sincerity (mensonge) et de Stealth. Personne ne peut utiliser de magie ou de compétence pour déterminer si vous mentez, sauf si leur Insight Rank est supérieur au vôtre de 2 rangs ou plus.'
  },
  {
    name: 'Manipulation Bayushi',
    clan: 'Clan du Scorpion',
    family: 'Bayushi',
    type: 'famille',
    description: 'Les Bayushi sont des manipulateurs nés et des courtisans redoutables.',
    effect: 'Lorsque vous mentez, vous gagnez +2k0 au jet de Sincerity. Vous pouvez relancer un jet de compétence sociale raté une fois par scène.'
  },
  {
    name: 'Secret Shosuro',
    clan: 'Clan du Scorpion',
    family: 'Shosuro',
    type: 'famille',
    description: 'Les Shosuro sont des acteurs, des infiltrateurs et des assassins.',
    effect: 'Vous gagnez +2k0 à tous les jets d\'Acting et de Disguise. Lorsque vous attaquez un adversaire qui n\'est pas conscient de votre présence, vous lancez des dés supplémentaires égaux à votre Rang d\'École.'
  },
  {
    name: 'Venin Yogo',
    clan: 'Clan du Scorpion',
    family: 'Yogo',
    type: 'famille',
    description: 'Les Yogo maîtrisent les arts sombres des malédictions.',
    effect: 'Vous gagnez +1k1 aux jets de lancement de sorts de malédiction. Vous connaissez gratuitement un sort de malédiction supplémentaire.'
  },
  {
    name: 'Ombre Soshi',
    clan: 'Clan du Scorpion',
    family: 'Soshi',
    type: 'famille',
    description: 'Les Soshi sont des shugenja spécialisés dans la magie de l\'illusion et de l\'Air.',
    effect: 'Vous gagnez +1k0 à tous les sorts d\'Air. Vous pouvez lancer un sort d\'illusion en Action Simple au lieu d\'Action Complexe.'
  },

  // CLAN DE LA LICORNE
  {
    name: 'Chevauchée de la Licorne',
    clan: 'Clan de la Licorne',
    type: 'clan',
    description: 'Les Licornes sont des cavaliers inégalés venus des terres étrangères.',
    effect: 'Vous ignorez toutes les pénalités pour combattre à cheval. Vous gagnez +5 au ND d\'Armure lorsque vous êtes monté. Vous ne pouvez jamais être désarçonné involontairement.'
  },
  {
    name: 'Fureur Moto',
    clan: 'Clan de la Licorne',
    family: 'Moto',
    type: 'famille',
    description: 'Les Moto sont des guerriers féroces et des cavaliers nés.',
    effect: 'Lorsque vous chargez à cheval, vous doublez votre bonus de dégâts. Vous gagnez +1k0 aux jets d\'attaque effectués à cheval.'
  },
  {
    name: 'Exploration Shinjo',
    clan: 'Clan de la Licorne',
    family: 'Shinjo',
    type: 'famille',
    description: 'Les Shinjo sont des explorateurs intrépides et des cavaliers élégants.',
    effect: 'Vous gagnez +2k0 à tous les jets d\'Horsemanship. Vous ne vous perdez jamais et pouvez toujours retrouver votre chemin. Vous doublez votre vitesse de déplacement en terrain ouvert.'
  },
  {
    name: 'Savoir Ide',
    clan: 'Clan de la Licorne',
    family: 'Ide',
    type: 'famille',
    description: 'Les Ide sont des diplomates et des émissaires cultivés.',
    effect: 'Vous gagnez +1k0 à tous les jets de Courtier et d\'Etiquette avec des étrangers ou lors de négociations. Vous connaissez automatiquement une langue étrangère supplémentaire.'
  },
  {
    name: 'Magie Iuchi',
    clan: 'Clan de la Licorne',
    family: 'Iuchi',
    type: 'famille',
    description: 'Les Iuchi pratiquent une forme unique de magie mêlant traditions rokugani et étrangères.',
    effect: 'Vous pouvez lancer des sorts tout en vous déplaçant à cheval sans pénalité. Vous connaissez un sort étranger (Meishodo) en plus de vos sorts normaux.'
  },

  // CLAN DE L'ARAIGNÉE
  {
    name: 'Étreinte de la Souillure',
    clan: 'Clan de l\'Araignée',
    type: 'clan',
    description: 'Les samouraïs de l\'Araignée ont appris à utiliser la Souillure comme une arme.',
    effect: 'Vous pouvez choisir de gagner 1 point de Souillure pour obtenir +2k1 à un jet d\'attaque ou de dégâts. Vous résistez aux effets négatifs de la Souillure jusqu\'à un Rang de Souillure de 3.'
  },
  {
    name: 'Ténèbres Daigotsu',
    clan: 'Clan de l\'Araignée',
    family: 'Daigotsu',
    type: 'famille',
    description: 'Les Daigotsu sont les seigneurs de la Souillure et maîtres des ombres.',
    effect: 'Votre Rang de Souillure est ajouté à vos jets d\'Intimidation et de Fear. Vous pouvez dépenser 1 point de Vide pour infliger des dégâts de Souillure (2k2) à une cible en la touchant.'
  },
  {
    name: 'Fantôme Goju',
    clan: 'Clan de l\'Araignée',
    family: 'Goju',
    type: 'famille',
    description: 'Les Goju sont des ninjas surnaturels capables de se fondre dans les ombres.',
    effect: 'Vous gagnez +3k0 aux jets de Stealth dans l\'obscurité. Vous pouvez devenir invisible dans les ombres totales pour une Action Complexe (ND 20, jet de Vide).'
  },
  {
    name: 'Séduction Susumu',
    clan: 'Clan de l\'Araignée',
    family: 'Susumu',
    type: 'famille',
    description: 'Les Susumu sont des manipulateurs experts en corruption morale.',
    effect: 'Vous gagnez +2k0 aux jets de Temptation. Lorsque vous tentez de corrompre quelqu\'un, réduisez le ND de 10. Une fois par session, vous pouvez forcer une relance d\'un jet social effectué contre vous.'
  },

  // CLANS MINEURS
  {
    name: 'Résilience du Blaireau',
    clan: 'Clan du Blaireau',
    type: 'clan',
    description: 'Les Blaireaux sont tenaces et refusent d\'abandonner.',
    effect: 'Vous ignorez les 5 premiers points de pénalités de Blessures. Lorsque vous êtes à terre, vous pouvez vous relever en Action Libre une fois par combat.'
  },
  {
    name: 'Grâce de la Libellule',
    clan: 'Clan de la Libellule',
    type: 'clan',
    description: 'Les Libellules ont un lien profond avec les kami et la nature.',
    effect: 'Vous gagnez +1k0 à tous les sorts qui affectent la nature ou les éléments. Vous pouvez communiquer empathiquement avec les animaux.'
  },
  {
    name: 'Précision du Faucon',
    clan: 'Clan du Faucon',
    type: 'clan',
    description: 'Les Faucons sont des archers d\'élite et des observateurs perspicaces.',
    effect: 'Vous ignorez les pénalités de portée jusqu\'à 100 mètres avec un arc. Vous gagnez +1k0 aux jets de Perception pour repérer des détails à distance.'
  },
  {
    name: 'Ruse du Renard',
    clan: 'Clan du Renard',
    type: 'clan',
    description: 'Les Renards sont rusés et savent retourner les situations à leur avantage.',
    effect: 'Une fois par session, vous pouvez déclarer qu\'une action que vous avez entreprise faisait partie d\'un plan plus large. Vous gagnez +2k2 à un jet lié à ce plan.'
  },
  {
    name: 'Vitesse du Lièvre',
    clan: 'Clan du Lièvre',
    type: 'clan',
    description: 'Les Lièvres sont rapides et évitent le danger avec agilité.',
    effect: 'Votre vitesse de déplacement augmente de +5. Vous gagnez +1k0 à tous les jets d\'Initiative et de Defense.'
  },
  {
    name: 'Harmonie du Moineau',
    clan: 'Clan du Moineau',
    type: 'clan',
    description: 'Les Moineaux sont pacifiques et recherchent la médiation.',
    effect: 'Vous gagnez +2k0 aux jets de Courtier visant à négocier une paix ou un compromis. Vous pouvez re-lancer un jet social raté si votre intention est pacifique.'
  },
  {
    name: 'Emprise de la Mante',
    clan: 'Clan de la Mante',
    type: 'clan',
    description: 'Les Mantes sont des combattants agiles maîtrisant les armes à deux mains.',
    effect: 'Vous ne subissez pas de pénalité pour manier une arme dans chaque main. Avec des kamas, vous gagnez +1k0 aux jets d\'attaque.'
  }
];
