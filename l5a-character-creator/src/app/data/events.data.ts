// Événements spéciaux pour L5A : Kami, Magie, Relations

export interface EventL5A {
  title: string;
  description: string;
}

export const EVENT_CATEGORIES: Record<string, EventL5A[]> = {
  yokai: [
    {
      title: 'Rencontre avec un Kappa',
      description: 'Un petit yokai aquatique sème la pagaille près d’un cours d’eau. Les PJ doivent l’amadouer ou le piéger.'
    },
    {
      title: 'Farce d’un Tanuki',
      description: 'Un tanuki métamorphe joue des tours aux villageois. Les PJ peuvent tenter de le démasquer ou de négocier avec lui.'
    },
    {
      title: 'Chant d’un Kodama',
      description: 'Des esprits d’arbres (kodama) apparaissent dans une forêt, apportant des présages ou demandant de l’aide.'
    }
  ],
  magie: [
    {
      title: 'Rituel perturbé',
      description: 'Un rituel magique tourne mal, provoquant des effets imprévus ou l’apparition d’un phénomène surnaturel.'
    },
    {
      title: 'Artefact perdu',
      description: 'Un artefact magique ancien est découvert. Sa puissance attire l’attention de shugenja et de forces occultes.'
    }
  ],
  relation: [
    {
      title: 'Alliance inattendue',
      description: 'Deux clans rivaux cherchent à conclure une alliance secrète. Les PJ peuvent être impliqués comme médiateurs ou espions.'
    },
    {
      title: 'Mariage politique',
      description: 'Un mariage arrangé entre deux familles importantes risque de dégénérer en conflit ou en scandale.'
    }
  ],
  politique: [
    {
      title: 'Coup d’État',
      description: 'Un seigneur tente de renverser son supérieur, impliquant les PJ dans des intrigues de cour.'
    }
  ],
  guerre: [
    {
      title: 'Bataille décisive',
      description: 'Une grande bataille se prépare, les PJ peuvent influencer l’issue du conflit.'
    }
  ],
  mystere: [
    {
      title: 'Disparition inexpliquée',
      description: 'Un notable ou un artefact disparaît mystérieusement, les PJ mènent l’enquête.'
    }
  ]
};
