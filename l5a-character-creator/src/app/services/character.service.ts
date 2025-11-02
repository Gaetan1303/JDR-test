import { Injectable, computed, signal } from '@angular/core';
import { Character, Ring, Traits, Skill, Advantage, Disadvantage, Spell, Equipment, CharacterEquipment } from '../models/character.model';
import { CLANS } from '../data/clans.data';
import { SCHOOLS } from '../data/schools.data';
import { ADVANTAGES, DISADVANTAGES } from '../data/advantages-disadvantages.data';
import { SPELLS } from '../data/spells.data';
import { WEAPONS, ARMOR, ITEMS, getSchoolStartingEquipment } from '../data/equipment.data';

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
    spells: [],
    advantages: [],
    disadvantages: [],
    experiencePoints: 40,
    spentExperiencePoints: 0,
    honor: 5.5,
    glory: 1,
    status: 1,
    taint: 0,
    equipment: {
      weapons: [],
      armor: ARMOR[0], // Pas d'armure par défaut
      items: [],
      koku: 100 // Argent de départ : 100 Koku
    },
    objective: '',
    personality: '',
    background: ''
  });

  // Signaux dédiés pour les avantages/désavantages (optimisation performance)
  private readonly _selectedAdvantageIds = signal<string[]>([]);
  private readonly _selectedDisadvantageIds = signal<string[]>([]);

  // Signal pour l'étape courante de création
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
    const advantageCost = this.advantageXPCost();
    const disadvantageGain = this.disadvantageXPGain();
    const spentXP = this.character().spentExperiencePoints || 0;
    
    return baseXP - advantageCost + disadvantageGain - spentXP;
  });

  // Données disponibles
  readonly availableClans = signal(CLANS);
  readonly availableSchools = signal(SCHOOLS);
  readonly availableAdvantages = signal(ADVANTAGES);
  readonly availableDisadvantages = signal(DISADVANTAGES);
  
  // Avantages et désavantages sélectionnés (objets complets) - optimisé avec signaux dédiés
  readonly selectedAdvantages = computed(() => {
    const selectedIds = this._selectedAdvantageIds();
    return ADVANTAGES.filter(adv => selectedIds.includes(adv.id));
  });

  readonly selectedDisadvantages = computed(() => {
    const selectedIds = this._selectedDisadvantageIds();
    return DISADVANTAGES.filter(dis => selectedIds.includes(dis.id));
  });

  // Avantages et désavantages disponibles (non sélectionnés) - pour l'interface utilisateur
  readonly availableAdvantagesForSelection = computed(() => {
    const selectedIds = this._selectedAdvantageIds();
    return ADVANTAGES.filter(adv => !selectedIds.includes(adv.id));
  });

  readonly availableDisadvantagesForSelection = computed(() => {
    const selectedIds = this._selectedDisadvantageIds();
    return DISADVANTAGES.filter(dis => !selectedIds.includes(dis.id));
  });

  // Calcul des points d'expérience des avantages/désavantages
  readonly advantageXPCost = computed(() => {
    return this.selectedAdvantages().reduce((sum, adv) => sum + adv.cost, 0);
  });

  readonly disadvantageXPGain = computed(() => {
    return this.selectedDisadvantages().reduce((sum, dis) => sum + dis.xpGain, 0);
  });

  // Catégories disponibles - computed pour l'interface utilisateur
  readonly advantageCategories = computed(() => {
    const categories = new Set(ADVANTAGES.map(adv => adv.category));
    return Array.from(categories).sort();
  });

  readonly disadvantageCategories = computed(() => {
    const categories = new Set(DISADVANTAGES.map(dis => dis.category));
    return Array.from(categories).sort();
  });
  
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
      
      // Ajouter les compétences d'école (en évitant les doublons)
      const existingSkills = char.skills || [];
      const existingSkillNames = existingSkills.map(s => s.name);
      
      const newSkills: Skill[] = school.skills
        .filter(skillName => !existingSkillNames.includes(skillName))
        .map(skillName => ({
          name: skillName,
          rank: 1,
          isSchoolSkill: true,
          trait: this.getSkillTrait(skillName)
        }));
      
      // Obtenir l'équipement de départ selon l'école
      const schoolEquipment = getSchoolStartingEquipment(schoolName);
      
      return {
        ...char,
        school: schoolName,
        traits: newTraits,
        skills: [...existingSkills, ...newSkills],
        equipment: schoolEquipment,
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

  // Méthodes pour diminuer les points investis
  
  // Méthode pour diminuer un trait
  decreaseTrait(traitName: keyof Traits) {
    const currentValue = this.character().traits![traitName];
    if (currentValue <= 2) return; // Ne peut pas descendre en dessous de la valeur de base
    
    const refundCost = currentValue * 4;
    
    this._character.update(char => ({
      ...char,
      traits: {
        ...char.traits!,
        [traitName]: currentValue - 1
      },
      spentExperiencePoints: Math.max(0, (char.spentExperiencePoints || 0) - refundCost)
    }));
  }

  // Méthode pour diminuer l'anneau du Vide
  decreaseVoidRing() {
    const currentValue = this.character().rings!.vide;
    if (currentValue <= 2) return; // Ne peut pas descendre en dessous de la valeur de base
    
    const refundCost = currentValue * 10;
    
    this._character.update(char => ({
      ...char,
      rings: {
        ...char.rings!,
        vide: currentValue - 1
      },
      spentExperiencePoints: Math.max(0, (char.spentExperiencePoints || 0) - refundCost)
    }));
  }

  // Méthode pour diminuer une compétence
  decreaseSkill(skillName: string) {
    const skills = this.character().skills || [];
    const skill = skills.find(s => s.name === skillName);
    if (!skill || skill.rank <= 1) return; // Ne peut pas descendre en dessous de 1
    
    const refundCost = skill.isSchoolSkill ? skill.rank * 1 : skill.rank * 2;
    
    this._character.update(char => ({
      ...char,
      skills: char.skills!.map(s => 
        s.name === skillName 
          ? { ...s, rank: s.rank - 1 }
          : s
      ),
      spentExperiencePoints: Math.max(0, (char.spentExperiencePoints || 0) - refundCost)
    }));
  }

  // Sélectionner un avantage - optimisé avec signaux
  selectAdvantage(advantageId: string) {
    const advantage = ADVANTAGES.find(adv => adv.id === advantageId);
    if (!advantage) return;
    
    if (this.availableExperiencePoints() < advantage.cost) return;
    
    // Mise à jour du signal dédié pour une meilleure performance
    this._selectedAdvantageIds.update(ids => [...ids, advantageId]);
    
    // Synchronisation avec le personnage
    this._character.update(char => ({
      ...char,
      selectedAdvantages: this._selectedAdvantageIds()
    }));
  }

  // Désélectionner un avantage - optimisé avec signaux
  deselectAdvantage(advantageId: string) {
    this._selectedAdvantageIds.update(ids => ids.filter(id => id !== advantageId));
    
    this._character.update(char => ({
      ...char,
      selectedAdvantages: this._selectedAdvantageIds()
    }));
  }

  // Sélectionner un désavantage - optimisé avec signaux
  selectDisadvantage(disadvantageId: string) {
    const disadvantage = DISADVANTAGES.find(dis => dis.id === disadvantageId);
    if (!disadvantage) return;
    
    this._selectedDisadvantageIds.update(ids => [...ids, disadvantageId]);
    
    this._character.update(char => ({
      ...char,
      selectedDisadvantages: this._selectedDisadvantageIds()
    }));
  }

  // Désélectionner un désavantage - optimisé avec signaux
  deselectDisadvantage(disadvantageId: string) {
    this._selectedDisadvantageIds.update(ids => ids.filter(id => id !== disadvantageId));
    
    this._character.update(char => ({
      ...char,
      selectedDisadvantages: this._selectedDisadvantageIds()
    }));
  }

  // Méthodes utilitaires pour vérifier la sélection - utilisant les signaux pour la performance
  isAdvantageSelected(advantageId: string): boolean {
    return this._selectedAdvantageIds().includes(advantageId);
  }

  isDisadvantageSelected(disadvantageId: string): boolean {
    return this._selectedDisadvantageIds().includes(disadvantageId);
  }

  // Filtrer les avantages par catégorie - computed pour la réactivité
  getAdvantagesByCategory(category: string) {
    return computed(() => 
      this.availableAdvantagesForSelection().filter(adv => adv.category === category)
    );
  }

  getDisadvantagesByCategory(category: string) {
    return computed(() => 
      this.availableDisadvantagesForSelection().filter(dis => dis.category === category)
    );
  }

  // Passer à l'étape suivante
  nextStep() {
    this.currentStep.update(step => Math.min(step + 1, 7));
  }

  // Revenir à l'étape précédente
  previousStep() {
    this.currentStep.update(step => Math.max(step - 1, 1));
  }

  // Réinitialiser le personnage - avec reset des signaux optimisés
  resetCharacter() {
    // Reset des signaux dédiés
    this._selectedAdvantageIds.set([]);
    this._selectedDisadvantageIds.set([]);
    
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
      selectedAdvantages: [],
      selectedDisadvantages: [],
      experiencePoints: 40,
      spentExperiencePoints: 0,
      honor: 5.5,
      glory: 1,
      status: 1,
      taint: 0,
      equipment: {
        weapons: [],
        armor: ARMOR[0], // Pas d'armure par défaut
        items: [],
        koku: 50 // Argent de départ : 50 Koku
      },
      objective: '',
      personality: '',
      background: ''
    });
    this.currentStep.set(1);
  }

  // ==========================
  // MÉTHODES POUR LES SORTS
  // ==========================

  // Computed pour les sorts sélectionnés du personnage
  readonly selectedSpells = computed(() => {
    const selectedIds = this.character().spells || [];
    return SPELLS.filter(spell => selectedIds.includes(spell.name));
  });

  // Sorts disponibles par élément (avec restrictions)
  readonly availableSpellsByElement = computed(() => {
    const spellsByElement: { [key: string]: Spell[] } = {};
    const selectedSpellNames = this.character().spells || [];
    const { deficiency } = this.schoolAffinityDeficiency();
    const canAdd = this.canAddMoreSpells();
    
    SPELLS.forEach(spell => {
      if (!selectedSpellNames.includes(spell.name)) {
        // Les sorts universels ignorent les restrictions de déficience
        if (!spell.universal && deficiency && spell.element === deficiency) {
          return; // Ignorer les sorts de l'élément de déficience (sauf universels)
        }
        
        // Filtrer par rang disponible
        if (spell.mastery === 1 && !canAdd.rank1) return;
        if (spell.mastery === 2 && !canAdd.rank2) return;
        if (spell.mastery > 2) return; // Pas de sorts de rang 3+ à la création
        
        // Catégoriser le sort par élément (ou "Universels" pour les sorts universels)
        const category = spell.universal ? 'Universels' : spell.element;
        if (!spellsByElement[category]) {
          spellsByElement[category] = [];
        }
        spellsByElement[category].push(spell);
      }
    });
    
    return spellsByElement;
  });

  // Méthode pour ajouter un sort
  addSpell(spellName: string) {
    const spell = SPELLS.find(s => s.name === spellName);
    if (!spell) return;
    
    const currentSpells = this.character().spells || [];
    if (currentSpells.includes(spellName)) return; // Déjà sélectionné
    
    // Vérifier la limite de sorts selon le rang
    const canAdd = this.canAddMoreSpells();
    if (spell.mastery === 1 && !canAdd.rank1) return;
    if (spell.mastery === 2 && !canAdd.rank2) return;
    
    // Vérifier la déficience élémentaire (interdiction) - sauf pour les sorts universels
    const { deficiency } = this.schoolAffinityDeficiency();
    if (!spell.universal && deficiency && spell.element === deficiency) {
      // Un shugenja ne peut pas apprendre de sorts de son élément de déficience (sauf universels)
      return;
    }
    
    this._character.update(char => ({
      ...char,
      spells: [...currentSpells, spellName]
    }));
  }

  // Méthode pour retirer un sort
  removeSpell(spellName: string) {
    const currentSpells = this.character().spells || [];
    
    this._character.update(char => ({
      ...char,
      spells: currentSpells.filter(name => name !== spellName)
    }));
  }

  // Méthode pour vérifier si un personnage peut lancer des sorts (est un shugenja)
  readonly canCastSpells = computed(() => {
    const schoolName = this.character().school;
    if (!schoolName) return false;
    
    // Chercher l'école dans la base de données pour vérifier son type
    const school = SCHOOLS.find(s => s.name === schoolName);
    return school?.type === 'shugenja' || false;
  });

  // Sorts disponibles pour le niveau de maîtrise actuel
  readonly availableSpellsForMastery = computed(() => {
    // Pour simplifier, on suppose que tous les sorts de niveau 1 sont disponibles au début
    // Dans une version plus avancée, cela dépendrait du rang d'école et des compétences
    return SPELLS.filter(spell => spell.mastery <= 1);
  });

  // Nombre maximum de sorts au début (selon les règles L5A et restrictions d'école)
  readonly maxStartingSpells = computed(() => {
    if (!this.canCastSpells()) return { rank1: 0, rank2: 0 };
    
    const schoolName = this.character().school;
    const school = SCHOOLS.find(s => s.name === schoolName);
    
    if (school?.spellLimits) {
      return {
        rank1: school.spellLimits.rank1,
        rank2: school.spellLimits.rank2
      };
    }
    
    // Valeurs par défaut si pas de restrictions spécifiées
    return { rank1: 3, rank2: 1 };
  });

  // Vérifier si on peut ajouter plus de sorts d'un rang donné
  readonly canAddMoreSpells = computed(() => {
    const currentSpells = this.character().spells || [];
    const selectedSpells = SPELLS.filter(spell => currentSpells.includes(spell.name));
    
    const rank1Count = selectedSpells.filter(spell => spell.mastery === 1).length;
    const rank2Count = selectedSpells.filter(spell => spell.mastery === 2).length;
    
    const maxSpells = this.maxStartingSpells();
    
    return {
      rank1: rank1Count < maxSpells.rank1,
      rank2: rank2Count < maxSpells.rank2,
      canAddAny: rank1Count < maxSpells.rank1 || rank2Count < maxSpells.rank2
    };
  });

  // Obtenir l'affinité et déficience de l'école
  readonly schoolAffinityDeficiency = computed(() => {
    const schoolName = this.character().school;
    const school = SCHOOLS.find(s => s.name === schoolName);
    
    return {
      affinity: school?.spellLimits?.affinity || null,
      deficiency: school?.spellLimits?.deficiency || null
    };
  });

  // ==========================
  // MÉTHODES POUR L'ÉQUIPEMENT
  // ==========================

  // Computed pour l'équipement du personnage
  readonly characterEquipment = computed(() => {
    return this.character().equipment || {
      weapons: [],
      armor: ARMOR[0],
      items: [],
      koku: 100
    };
  });

  // Équipements disponibles par catégorie
  readonly availableWeapons = computed(() => WEAPONS);
  readonly availableArmor = computed(() => ARMOR);
  readonly availableItems = computed(() => ITEMS);

  // Méthodes pour gérer l'équipement
  addWeapon(weapon: Equipment) {
    const currentEquipment = this.characterEquipment();
    this._character.update(char => ({
      ...char,
      equipment: {
        ...currentEquipment,
        weapons: [...currentEquipment.weapons, weapon]
      }
    }));
  }

  removeWeapon(weaponName: string) {
    const currentEquipment = this.characterEquipment();
    this._character.update(char => ({
      ...char,
      equipment: {
        ...currentEquipment,
        weapons: currentEquipment.weapons.filter(w => w.name !== weaponName)
      }
    }));
  }

  setArmor(armor: Equipment) {
    const currentEquipment = this.characterEquipment();
    this._character.update(char => ({
      ...char,
      equipment: {
        ...currentEquipment,
        armor: armor
      }
    }));
  }

  addItem(item: Equipment) {
    const currentEquipment = this.characterEquipment();
    this._character.update(char => ({
      ...char,
      equipment: {
        ...currentEquipment,
        items: [...currentEquipment.items, item]
      }
    }));
  }

  removeItem(itemName: string) {
    const currentEquipment = this.characterEquipment();
    this._character.update(char => ({
      ...char,
      equipment: {
        ...currentEquipment,
        items: currentEquipment.items.filter(i => i.name !== itemName)
      }
    }));
  }

  // ==========================
  // MÉTHODES UTILITAIRES
  // ==========================

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

  // === GESTION DES ÉQUIPEMENTS ET MONNAIE ===
  
  // Acheter un équipement
  buyEquipment(equipment: Equipment): boolean {
    const character = this.character();
    if (!character.equipment) return false;
    
    const cost = parseInt(equipment.cost || '0');
    
    if (character.equipment.koku < cost) {
      return false; // Pas assez d'argent
    }
    
    this._character.update(char => {
      if (!char.equipment) return char;
      
      char.equipment.koku -= cost;
      
      if (equipment.type === 'weapon') {
        char.equipment.weapons.push(equipment);
      } else if (equipment.type === 'armor') {
        char.equipment.armor = equipment;
      } else {
        char.equipment.items.push(equipment);
      }
      
      return char;
    });
    
    return true;
  }
  
  // Vendre un équipement
  sellEquipment(equipmentName: string, equipmentType: 'weapon' | 'armor' | 'item'): boolean {
    const character = this.character();
    if (!character.equipment) return false;
    
    let equipment: Equipment | undefined;
    
    if (equipmentType === 'weapon') {
      equipment = character.equipment.weapons.find(w => w.name === equipmentName);
    } else if (equipmentType === 'armor') {
      const armor = character.equipment.armor;
      if (armor && !Array.isArray(armor) && armor.name === equipmentName) {
        equipment = armor;
      }
    } else {
      equipment = character.equipment.items.find(i => i.name === equipmentName);
    }
    
    if (!equipment) {
      return false;
    }
    
    const sellPrice = Math.floor(parseInt(equipment.cost || '0') / 2); // Vente à 50% du prix
    
    this._character.update(char => {
      if (!char.equipment) return char;
      
      char.equipment.koku += sellPrice;
      
      if (equipmentType === 'weapon') {
        char.equipment.weapons = char.equipment.weapons.filter(w => w.name !== equipmentName);
      } else if (equipmentType === 'armor') {
        char.equipment.armor = ARMOR[0]; // Retour à "Pas d'armure"
      } else {
        char.equipment.items = char.equipment.items.filter(i => i.name !== equipmentName);
      }
      
      return char;
    });
    
    return true;
  }
  
  // Vérifier si on peut acheter un équipement
  canAffordEquipment(equipment: Equipment): boolean {
    const character = this.character();
    if (!character.equipment) return false;
    
    const cost = parseInt(equipment.cost || '0');
    return character.equipment.koku >= cost;
  }
  
  // Obtenir l'argent disponible
  getAvailableMoney(): number {
    const character = this.character();
    return character.equipment?.koku || 0;
  }

  // Charger un personnage existant
  loadCharacter(character: Character) {
    this._character.set(character);
    // Restaurer les signaux dédiés
    this._selectedAdvantageIds.set(character.selectedAdvantages || []);
    this._selectedDisadvantageIds.set(character.selectedDisadvantages || []);
  }

  // Sauvegarder le personnage actuel
  saveCharacter(): Character {
    const character = this.character() as Character;
    const saved = localStorage.getItem('l5a-characters');
    let characters: Character[] = [];
    
    if (saved) {
      try {
        characters = JSON.parse(saved);
      } catch (error) {
        console.error('Erreur lors du chargement des personnages sauvegardés:', error);
      }
    }

    // Ajouter ou mettre à jour le personnage
    const existingIndex = characters.findIndex(c => c.id === character.id);
    if (existingIndex >= 0) {
      characters[existingIndex] = character;
    } else {
      character.id = Date.now().toString();
      characters.push(character);
    }

    localStorage.setItem('l5a-characters', JSON.stringify(characters));
    return character;
  }
}