import { Injectable, computed, signal } from '@angular/core';
import { Character, Ring, Traits, Skill, Advantage, Disadvantage } from '../models/character.model';
import { CLANS } from '../data/clans.data';
import { SCHOOLS } from '../data/schools.data';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  // Signaux pour les données de base
  private _character = signal<Partial<Character>>({
    name: '',
    age: 15,
    gender: '',
    clan: '',
    family: '',
    school: '',
    rings: {
      terre: 2,
      eau: 2,
      air: 2,
      feu: 2,
      vide: 2
    },
    traits: {
      constitution: 2,
      volonte: 2,
      force: 2,
      perception: 2,
      reflexes: 2,
      intuition: 2,
      agilite: 2,
      intelligence: 2
    },
    skills: [],
    advantages: [],
    disadvantages: [],
    experiencePoints: 40,
    spentExperiencePoints: 0,
    honor: 5.5,
    glory: 1,
    status: 1,
    taint: 0,
    equipment: [],
    weapons: [],
    armor: [],
    money: 0,
    objective: '',
    personality: '',
    background: ''
  });

  // Signal pour l'étape actuelle de création
  currentStep = signal(1);
  
  // Signaux dérivés (computed) pour les calculs automatiques
  readonly character = this._character.asReadonly();
  
  // Calcul automatique des anneaux basé sur les traits
  readonly calculatedRings = computed(() => {
    const traits = this.character().traits!;
    return {
      terre: Math.min(traits.constitution, traits.volonte),
      eau: Math.min(traits.force, traits.perception),
      air: Math.min(traits.reflexes, traits.intuition),
      feu: Math.min(traits.agilite, traits.intelligence),
      vide: this.character().rings!.vide // Le Vide ne dépend pas des traits
    };
  });

  // Calcul du rang d'Insight
  readonly insightRank = computed(() => {
    const rings = this.calculatedRings();
    const skills = this.character().skills || [];
    
    const ringTotal = (rings.terre + rings.eau + rings.air + rings.feu + rings.vide) * 10;
    const skillTotal = skills.reduce((sum, skill) => sum + skill.rank, 0);
    
    return ringTotal + skillTotal;
  });

  // Calcul de l'Initiative (basé sur la documentation de combat)
  readonly initiative = computed(() => {
    // L'initiative de base est Réflexes + Rang d'Insight (divisé pour équilibrer)
    return this.character().traits!.reflexes + Math.floor(this.insightRank() / 10);
  });

  // Calcul des niveaux de blessure
  readonly woundLevels = computed(() => {
    const terre = this.calculatedRings().terre;
    return {
      healthy: terre * 2,
      nicked: terre * 2 + 3,
      grazed: terre * 2 + 6,
      hurt: terre * 2 + 9,
      injured: terre * 2 + 12,
      crippled: terre * 2 + 15,
      down: terre * 2 + 18,
      out: terre * 2 + 21
    };
  });

  // Calcul des ND (Nombres de Difficultés) de base
  readonly combatStats = computed(() => {
    const traits = this.character().traits!;
    const rings = this.calculatedRings();
    
    return {
      // ND de Corps à Corps = (Réflexes + Défense) x 5 + bonus d'armure
      meleeDefenseND: (traits.reflexes + this.getSkillRank('Défense')) * 5,
      
      // ND d'Esquive = (Air + Défense) selon la doc
      dodgeND: (rings.air + this.getSkillRank('Défense')) * 5,
      
      // Initiative de base pour les calculs de combat
      baseInitiative: traits.reflexes + this.getSkillRank('Défense')
    };
  });

  // Calcul des points d'expérience disponibles
  readonly availableExperiencePoints = computed(() => {
    const baseXP = 40;
    const advantageCost = (this.character().advantages || [])
      .reduce((sum, adv) => sum + adv.cost, 0);
    const disadvantageGain = (this.character().disadvantages || [])
      .reduce((sum, dis) => sum + dis.pointsGained, 0);
    const spentXP = this.character().spentExperiencePoints || 0;
    
    return baseXP - advantageCost + disadvantageGain - spentXP;
  });

  // Données disponibles
  readonly availableClans = signal(CLANS);
  readonly availableSchools = signal(SCHOOLS);
  
  // Familles disponibles basées sur le clan sélectionné
  readonly availableFamilies = computed(() => {
    const selectedClan = this.character().clan;
    if (!selectedClan) return [];
    
    const clan = CLANS.find(c => c.name === selectedClan);
    return clan?.families || [];
  });

  // Écoles disponibles basées sur le clan sélectionné
  readonly availableSchoolsForClan = computed(() => {
    const selectedClan = this.character().clan;
    if (!selectedClan) return [];
    
    return SCHOOLS.filter(school => school.clan === selectedClan);
  });

  // Méthodes pour mettre à jour le personnage
  updateBasicInfo(info: { name?: string; age?: number; gender?: string }) {
    this._character.update(char => ({ ...char, ...info }));
  }

  selectClan(clanName: string) {
    this._character.update(char => ({
      ...char,
      clan: clanName,
      family: '', // Reset family when clan changes
      school: ''  // Reset school when clan changes
    }));
  }

  selectFamily(familyName: string) {
    const family = this.availableFamilies().find(f => f.name === familyName);
    if (!family) return;

    this._character.update(char => {
      const newTraits = { ...char.traits! };
      newTraits[family.traitBonus] += 1;
      
      return {
        ...char,
        family: familyName,
        traits: newTraits
      };
    });
  }

  selectSchool(schoolName: string) {
    const school = this.availableSchoolsForClan().find(s => s.name === schoolName);
    if (!school) return;

    this._character.update(char => {
      const newTraits = { ...char.traits! };
      newTraits[school.traitBonus] += 1;
      
      // Ajouter les compétences d'école
      const newSkills: Skill[] = school.skills.map(skillName => ({
        name: skillName,
        rank: 1,
        isSchoolSkill: true,
        trait: this.getSkillTrait(skillName)
      }));
      
      return {
        ...char,
        school: schoolName,
        traits: newTraits,
        skills: [...(char.skills || []), ...newSkills],
        honor: school.honor
      };
    });
  }

  // Méthode pour dépenser des XP pour améliorer un trait
  improveTrait(traitName: keyof Traits) {
    const currentValue = this.character().traits![traitName];
    if (currentValue >= 4) return; // Limite de création
    
    const cost = (currentValue + 1) * 4;
    if (this.availableExperiencePoints() < cost) return;
    
    this._character.update(char => ({
      ...char,
      traits: {
        ...char.traits!,
        [traitName]: currentValue + 1
      },
      spentExperiencePoints: (char.spentExperiencePoints || 0) + cost
    }));
  }

  // Méthode pour améliorer l'anneau du Vide
  improveVoidRing() {
    const currentValue = this.character().rings!.vide;
    if (currentValue >= 4) return; // Limite de création
    
    const cost = (currentValue + 1) * 10;
    if (this.availableExperiencePoints() < cost) return;
    
    this._character.update(char => ({
      ...char,
      rings: {
        ...char.rings!,
        vide: currentValue + 1
      },
      spentExperiencePoints: (char.spentExperiencePoints || 0) + cost
    }));
  }

  // Méthode pour améliorer une compétence
  improveSkill(skillName: string) {
    const skills = this.character().skills || [];
    const skill = skills.find(s => s.name === skillName);
    if (!skill || skill.rank >= 4) return; // Limite de création
    
    const cost = skill.isSchoolSkill ? (skill.rank + 1) * 1 : (skill.rank + 1) * 2;
    if (this.availableExperiencePoints() < cost) return;
    
    this._character.update(char => ({
      ...char,
      skills: char.skills!.map(s => 
        s.name === skillName 
          ? { ...s, rank: s.rank + 1 }
          : s
      ),
      spentExperiencePoints: (char.spentExperiencePoints || 0) + cost
    }));
  }

  // Ajouter un avantage
  addAdvantage(advantage: Advantage) {
    if (this.availableExperiencePoints() < advantage.cost) return;
    
    this._character.update(char => ({
      ...char,
      advantages: [...(char.advantages || []), advantage]
    }));
  }

  // Ajouter un désavantage
  addDisadvantage(disadvantage: Disadvantage) {
    this._character.update(char => ({
      ...char,
      disadvantages: [...(char.disadvantages || []), disadvantage]
    }));
  }

  // Passer à l'étape suivante
  nextStep() {
    this.currentStep.update(step => Math.min(step + 1, 6));
  }

  // Revenir à l'étape précédente
  previousStep() {
    this.currentStep.update(step => Math.max(step - 1, 1));
  }

  // Réinitialiser le personnage
  resetCharacter() {
    this._character.set({
      name: '',
      age: 15,
      gender: '',
      clan: '',
      family: '',
      school: '',
      rings: {
        terre: 2,
        eau: 2,
        air: 2,
        feu: 2,
        vide: 2
      },
      traits: {
        constitution: 2,
        volonte: 2,
        force: 2,
        perception: 2,
        reflexes: 2,
        intuition: 2,
        agilite: 2,
        intelligence: 2
      },
      skills: [],
      advantages: [],
      disadvantages: [],
      experiencePoints: 40,
      spentExperiencePoints: 0,
      honor: 5.5,
      glory: 1,
      status: 1,
      taint: 0,
      equipment: [],
      weapons: [],
      armor: [],
      money: 0,
      objective: '',
      personality: '',
      background: ''
    });
    this.currentStep.set(1);
  }

  // Méthode utilitaire pour obtenir le trait associé à une compétence
  private getSkillTrait(skillName: string): keyof Traits {
    const skillTraitMap: Record<string, keyof Traits> = {
      // Compétences de combat
      'Défense': 'reflexes',
      'Kenjutsu': 'agilite',
      'Kyujutsu': 'reflexes',
      'Combat sans Armes': 'agilite',
      'Iaijutsu': 'reflexes',
      'Jiujutsu': 'agilite',
      
      // Compétences d'armes spécialisées (d'après la doc)
      'Bojutsu': 'agilite',
      'Chisaïjutsu': 'agilite',
      'Nofujutsu': 'agilite',
      'Onojutsu': 'force',
      'Subojutsu': 'force',
      'Tantojutsu': 'agilite',
      'Umayarijutsu': 'agilite',
      'Yarijutsu': 'agilite',
      
      // Compétences intellectuelles
      'Lore: Terres Souillées': 'intelligence',
      'Calligraphie': 'intelligence',
      'Médecine': 'intelligence',
      'Spellcraft': 'intelligence',
      'Théologie': 'intelligence',
      'Lore: Histoire': 'intelligence',
      'Lore: Ancêtres': 'intelligence',
      'Lore: Gaijin': 'intelligence',
      'Lore: Éléments': 'intelligence',
      'Lore: Théologie': 'intelligence',
      'Divination': 'intelligence',
      
      // Compétences sociales
      'Sincérité': 'intuition',
      'Courtoisie': 'intuition',
      'Acting': 'intuition',
      'Temptation': 'intuition',
      'Tromperie': 'intuition',
      'Leadership': 'intuition',
      'Poésie': 'intuition',
      
      // Compétences physiques
      'Artisanat': 'agilite',
      'Artisanat : Tatouage': 'agilite',
      'Danse': 'agilite',
      'Stealth': 'agilite',
      'Équitation': 'agilite',
      'Athlétisme': 'force',
      
      // Compétences mentales
      'Méditation': 'volonte',
      'Thé': 'volonte',
      'Intimidation': 'volonte',
      'Mode': 'perception',
      'Combat en Formation': 'perception',
      
      // Compétences tactiques
      'Art de la Guerre': 'intelligence',
      'Manipulation': 'intelligence'
    };
    
    return skillTraitMap[skillName] || 'intelligence';
  }

  // Méthode utilitaire pour obtenir le rang d'une compétence
  private getSkillRank(skillName: string): number {
    const skills = this.character().skills || [];
    const skill = skills.find(s => s.name === skillName);
    return skill?.rank || 0;
  }
}