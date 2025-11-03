import { Injectable, computed, signal } from '@angular/core';
import { Character, Ring, Traits, Skill, Advantage, Disadvantage, Spell, Equipment, CharacterEquipment, Kiho, NPC } from '../models/character.model';
import { CLANS } from '../data/clans.data';
import { SCHOOLS } from '../data/schools.data';
import { ADVANTAGES, DISADVANTAGES } from '../data/advantages-disadvantages.data';
import { SPELLS } from '../data/spells.data';
import { MAHO_SPELLS } from '../data/maho.data';
import { WEAPONS, ARMOR, ITEMS, getSchoolStartingEquipment } from '../data/equipment.data';
import { CLAN_TECHNIQUES, KATA, ClanTechnique as TechniqueKata } from '../data/techniques-kata.data';
import { CLAN_TECHNIQUES as CLAN_FAMILY_TECHNIQUES, ClanTechnique } from '../data/clan-techniques.data';
import { KIHO } from '../data/kiho.data';

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
    techniques: [],
    kata: [],
    kiho: [],
    clanTechniques: [],
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
  updateBasicInfo(info: { name?: string; age?: number; gender?: string; avatar?: string | null }) {
    this._character.update(char => ({ ...char, ...info }));
  }

  selectClan(clanName: string) {
    this._character.update(char => ({
      ...char,
      clan: clanName,
      family: '', // Reset family when clan changes
      school: '', // Reset school when clan changes
      // Réinitialiser tous les traits à 2 (valeur de base)
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
      // Retirer toutes les compétences d'école
      skills: (char.skills || []).filter(skill => !skill.isSchoolSkill),
      // Réinitialiser les XP dépensés sur les traits/compétences
      spentExperiencePoints: 0
    }));
  }

  /**
   * Sélectionne une famille pour le personnage
   * Les traits sont calculés ainsi :
   * - Base : 2 pour chaque trait
   * - Bonus de famille : +1 au trait de la famille
   * - Bonus d'école : +1 au trait de l'école
   * - Améliorations XP : peut monter jusqu'à 5 maximum (incluant tous les bonus)
   */
  selectFamily(familyName: string) {
    const family = this.availableFamilies().find(f => f.name === familyName);
    if (!family) return;

    this._character.update(char => {
      // Réinitialiser tous les traits à 2 (valeur de base)
      const newTraits: Traits = {
        constitution: 2,
        volonte: 2,
        force: 2,
        perception: 2,
        reflexes: 2,
        intuition: 2,
        agilite: 2,
        intelligence: 2
      };
      
      // Ajouter le bonus de la nouvelle famille
      newTraits[family.traitBonus] = 3;
      
      return {
        ...char,
        family: familyName,
        school: '',  // Reset school when family changes
        traits: newTraits,
        // Retirer toutes les compétences d'école (car on va changer d'école)
        skills: (char.skills || []).filter(skill => !skill.isSchoolSkill),
        // Réinitialiser les XP dépensés
        spentExperiencePoints: 0
      };
    });
  }

  selectSchool(schoolName: string) {
    const school = this.availableSchoolsForClan().find(s => s.name === schoolName);
    if (!school) return;

    this._character.update(char => {
      // Réinitialiser tous les traits à leur valeur de base + bonus de famille
      const newTraits: Traits = {
        constitution: 2,
        volonte: 2,
        force: 2,
        perception: 2,
        reflexes: 2,
        intuition: 2,
        agilite: 2,
        intelligence: 2
      };
      
      // Ré-appliquer le bonus de famille
      if (char.family) {
        const family = this.availableFamilies().find(f => f.name === char.family);
        if (family) {
          newTraits[family.traitBonus] = 3;
        }
      }
      
      // Ajouter le nouveau bonus d'école
      newTraits[school.traitBonus] += 1;
      
      // Retirer les compétences de l'ancienne école si elle existe
      let filteredSkills = char.skills || [];
      if (char.school) {
        const oldSchool = SCHOOLS.find(s => s.name === char.school);
        if (oldSchool) {
          // Garder seulement les compétences qui ne sont pas de l'ancienne école
          filteredSkills = filteredSkills.filter(skill => 
            !skill.isSchoolSkill || !oldSchool.skills.includes(skill.name)
          );
        }
      }
      
      // Ajouter les nouvelles compétences d'école
      const existingSkillNames = filteredSkills.map(s => s.name);
      
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
        skills: [...filteredSkills, ...newSkills],
        equipment: schoolEquipment,
        honor: school.honor,
        // Réinitialiser les XP dépensés car on a reset les traits
        spentExperiencePoints: 0
      };
    });
  }

  // Méthode pour dépenser des XP pour améliorer un trait
  improveTrait(traitName: keyof Traits) {
    const currentValue = this.character().traits![traitName];
    // Empêcher de dépasser 5 (la limite INCLUT les bonus d'école)
    if (currentValue >= 5) return;
    
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
    // Empêcher de dépasser 5
    if (currentValue >= 5) return;
    
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
    if (!skill || skill.rank <= 1 || skill.isSchoolSkill) return; // Ne peut pas descendre en dessous de 1 ni diminuer compétences d'école
    
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
    
    // NOTE: Les alliés seront générés lors de la sauvegarde finale du personnage
    
    // Ajouter l'équipement accordé par l'avantage (si disponible)
    if (advantage.grantedEquipment && advantage.grantedEquipment.length > 0) {
      this._character.update(char => {
        const currentEquipment = char.equipment || this.getDefaultEquipment();
        const updatedEquipment = { ...currentEquipment };
        
        // Ajouter chaque équipement selon son type
        advantage.grantedEquipment!.forEach(eq => {
          if (eq.type === 'weapon') {
            updatedEquipment.weapons = [...updatedEquipment.weapons, eq];
          } else if (eq.type === 'armor') {
            updatedEquipment.armor = eq;
          } else if (eq.type === 'item') {
            updatedEquipment.items = [...updatedEquipment.items, eq];
          }
        });
        
        return {
          ...char,
          equipment: updatedEquipment,
          selectedAdvantages: this._selectedAdvantageIds()
        };
      });
    } else {
      // Synchronisation avec le personnage
      this._character.update(char => ({
        ...char,
        selectedAdvantages: this._selectedAdvantageIds()
      }));
    }
  }

  // Désélectionner un avantage - optimisé avec signaux
  deselectAdvantage(advantageId: string) {
    const advantage = ADVANTAGES.find(adv => adv.id === advantageId);
    
    this._selectedAdvantageIds.update(ids => ids.filter(id => id !== advantageId));
    
    // NOTE: Les alliés seront retirés/gérés lors de la sauvegarde finale
    
    // Retirer l'équipement accordé par l'avantage (si disponible)
    if (advantage?.grantedEquipment && advantage.grantedEquipment.length > 0) {
      const grantedEquipmentNames = advantage.grantedEquipment.map(eq => eq.name);
      
      this._character.update(char => {
        const currentEquipment = char.equipment || this.getDefaultEquipment();
        const updatedEquipment = {
          ...currentEquipment,
          weapons: currentEquipment.weapons.filter(w => !grantedEquipmentNames.includes(w.name)),
          items: currentEquipment.items.filter(i => !grantedEquipmentNames.includes(i.name))
        };
        
        return {
          ...char,
          equipment: updatedEquipment,
          selectedAdvantages: this._selectedAdvantageIds()
        };
      });
    } else {
      this._character.update(char => ({
        ...char,
        selectedAdvantages: this._selectedAdvantageIds()
      }));
    }
  }

  // Méthode utilitaire pour obtenir l'équipement par défaut
  private getDefaultEquipment(): CharacterEquipment {
    return {
      weapons: [],
      armor: ARMOR[0],
      items: [],
      koku: 100
    };
  }

  // Générer un PNJ aléatoire (allié ou ennemi)
  // Générer un NPC aléatoire (allié ou ennemi)
  generateRandomNPC(relationship: 'Allié' | 'Ennemi'): any {
    const firstNames = [
      'Akodo', 'Bayushi', 'Doji', 'Hida', 'Isawa', 'Kakita', 'Matsu', 'Mirumoto', 
      'Shiba', 'Shinjo', 'Togashi', 'Yoritomo', 'Asahina', 'Kitsuki', 'Utaku'
    ];
    
    const lastNames = [
      'Takeshi', 'Yumiko', 'Kenji', 'Sakura', 'Hiroshi', 'Ayame', 'Daichi', 'Hana',
      'Ichiro', 'Kaede', 'Masaru', 'Mei', 'Noboru', 'Rin', 'Taro', 'Yuki'
    ];
    
    // 50% de chance d'être du même clan, 50% d'un clan aléatoire
    const playerClan = this.character().clan;
    const usePlayerClan = Math.random() < 0.5 && playerClan;
    
    const randomClan = usePlayerClan ? playerClan : CLANS[Math.floor(Math.random() * CLANS.length)].name;
    const clan = CLANS.find(c => c.name === randomClan);
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${firstName} ${lastName}`;
    
    const family = clan?.families[Math.floor(Math.random() * (clan?.families.length || 1))];
    const school = SCHOOLS.filter(s => s.clan === randomClan)[Math.floor(Math.random() * SCHOOLS.filter(s => s.clan === randomClan).length)];
    
    const descriptions = relationship === 'Allié' ? [
      'Un compagnon fidèle rencontré lors de votre formation.',
      'Un ami d\'enfance qui vous soutient dans vos épreuves.',
      'Un mentor bienveillant qui guide vos pas.',
      'Un camarade de combat qui a sauvé votre vie.',
      'Un allié politique précieux dans votre clan.'
    ] : [
      'Un rival jaloux de votre réussite.',
      'Un ennemi juré cherchant à ternir votre honneur.',
      'Un adversaire politique manœuvrant contre vous.',
      'Un ancien ami devenu ennemi après une trahison.',
      'Un membre d\'un clan rival cherchant vengeance.'
    ];
    
    return {
      name: fullName,
      clan: randomClan,
      family: family?.name,
      school: school?.name,
      relationship: relationship,
      description: descriptions[Math.floor(Math.random() * descriptions.length)]
    };
  }

  // Sélectionner un désavantage - optimisé avec signaux
  selectDisadvantage(disadvantageId: string) {
    const disadvantage = DISADVANTAGES.find(dis => dis.id === disadvantageId);
    if (!disadvantage) return;
    
    this._selectedDisadvantageIds.update(ids => [...ids, disadvantageId]);
    
    // NOTE: Les ennemis seront générés lors de la sauvegarde finale du personnage
    
    this._character.update(char => ({
      ...char,
      selectedDisadvantages: this._selectedDisadvantageIds()
    }));
  }

  // Désélectionner un désavantage - optimisé avec signaux
  deselectDisadvantage(disadvantageId: string) {
    this._selectedDisadvantageIds.update(ids => ids.filter(id => id !== disadvantageId));
    
    // NOTE: Les ennemis seront retirés/gérés lors de la sauvegarde finale
    
    this._character.update(char => ({
      ...char,
      selectedDisadvantages: this._selectedDisadvantageIds()
    }));
  }

  // Méthodes utilitaires pour vérifier la sélection - utilisant les signaux pour la performance
  isAdvantageSelected(advantageId: string): boolean {
    return this._selectedAdvantageIds().includes(advantageId);
  }  isDisadvantageSelected(disadvantageId: string): boolean {
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
    this.currentStep.update(step => Math.min(step + 1, 8));
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
      id: undefined, // Pas d'ID tant que le personnage n'est pas sauvegardé
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
  // NE COMPTE PAS les sorts Maho (séparés)
  readonly canAddMoreSpells = computed(() => {
    const currentSpells = this.character().spells || [];
    // Filtrer uniquement les sorts classiques (pas Maho)
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

  // ========== MÉTHODES MAHO (MAGIE NOIRE) ==========
  
  /**
   * Vérifie si le personnage a accès aux sorts Maho
   * Nécessite le désavantage "Maho-Tsukai"
   */
  canUseMaho(): boolean {
    const selectedDisadvantages = this.character().selectedDisadvantages || [];
    return selectedDisadvantages.includes('maho-tsukai');
  }

  /**
   * Retourne tous les sorts Maho disponibles
   * Seulement si le personnage a le désavantage Maho-Tsukai
   */
  getAllMahoSpells(): Spell[] {
    if (!this.canUseMaho()) {
      return [];
    }
    return MAHO_SPELLS;
  }

  /**
   * Retourne les sorts Maho disponibles pour le rang de maîtrise
   */
  getAvailableMahoByRank(maxRank: number = 2): Spell[] {
    if (!this.canUseMaho()) {
      return [];
    }
    return MAHO_SPELLS.filter(spell => spell.mastery <= maxRank);
  }

  /**
   * Vérifie si un sort Maho est sélectionné
   */
  isMahoSelected(spellName: string): boolean {
    const currentSpells = this.character().spells || [];
    return currentSpells.includes(spellName);
  }

  /**
   * Vérifie si on peut ajouter plus de sorts Maho
   * Les sorts Maho ont leur propre limite séparée (même que sorts classiques)
   */
  canAddMoreMahoSpells(): { rank1: boolean; rank2: boolean; canAddAny: boolean } {
    if (!this.canUseMaho()) {
      return { rank1: false, rank2: false, canAddAny: false };
    }

    const currentSpells = this.character().spells || [];
    // Filtrer uniquement les sorts Maho
    const selectedMahoSpells = MAHO_SPELLS.filter(spell => currentSpells.includes(spell.name));
    
    const rank1Count = selectedMahoSpells.filter(spell => spell.mastery === 1).length;
    const rank2Count = selectedMahoSpells.filter(spell => spell.mastery === 2).length;
    
    const maxSpells = this.maxStartingSpells();
    
    return {
      rank1: rank1Count < maxSpells.rank1,
      rank2: rank2Count < maxSpells.rank2,
      canAddAny: rank1Count < maxSpells.rank1 || rank2Count < maxSpells.rank2
    };
  }

  /**
   * Ajoute un sort Maho au personnage
   * Attention : Nécessite le désavantage "Maho-Tsukai" !
   */
  addMahoSpell(spellName: string): boolean {
    // Vérifier que le personnage a accès au Maho
    if (!this.canUseMaho()) {
      console.warn('Vous devez avoir le désavantage "Maho-Tsukai" pour apprendre des sorts Maho');
      return false;
    }

    const spell = MAHO_SPELLS.find(s => s.name === spellName);
    if (!spell) {
      console.warn('Sort Maho non trouvé:', spellName);
      return false;
    }

    const currentSpells = this.character().spells || [];
    
    // Vérifier si déjà sélectionné
    if (currentSpells.includes(spellName)) {
      return false;
    }

    // Vérifier la limite de sorts Maho (séparée des sorts classiques)
    const canAdd = this.canAddMoreMahoSpells();
    if (spell.mastery === 1 && !canAdd.rank1) return false;
    if (spell.mastery === 2 && !canAdd.rank2) return false;

    // Ajouter le sort Maho
    this._character.update(char => ({
      ...char,
      spells: [...currentSpells, spellName]
    }));

    return true;
  }

  /**
   * Retire un sort Maho du personnage
   */
  removeMahoSpell(spellName: string): void {
    const currentSpells = this.character().spells || [];
    
    this._character.update(char => ({
      ...char,
      spells: currentSpells.filter(name => name !== spellName)
    }));
  }

  /**
   * Compte le nombre de sorts Maho sélectionnés
   */
  getSelectedMahoCount(): number {
    const currentSpells = this.character().spells || [];
    return currentSpells.filter(spellName => 
      MAHO_SPELLS.some(maho => maho.name === spellName)
    ).length;
  }

  /**
   * Obtient les détails des sorts Maho sélectionnés
   */
  getSelectedMahoDetails(): Spell[] {
    const currentSpells = this.character().spells || [];
    return MAHO_SPELLS.filter(spell => currentSpells.includes(spell.name));
  }

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
    
    // Pendant la création (insight rank 1 et pas encore finalisé), vente à 100%
    // Après la création, vente à 50% du prix
    const isCreation = this.insightRank() === 1 && this.currentStep() < 7;
    const sellPrice = isCreation 
      ? parseInt(equipment.cost || '0') 
      : Math.floor(parseInt(equipment.cost || '0') / 2);
    
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
    
    console.log('[CharacterService] Sauvegarde personnage:', character.name);
    console.log('[CharacterService] Avantages sélectionnés:', this._selectedAdvantageIds());
    console.log('[CharacterService] Désavantages sélectionnés:', this._selectedDisadvantageIds());
    
    // Générer les alliés et ennemis selon les avantages/désavantages sélectionnés
    const hasAlliesAdvantage = this._selectedAdvantageIds().includes('allies');
    const hasEnemiesDisadvantage = this._selectedDisadvantageIds().includes('enemies');
    
    // Générer des alliés si l'avantage "Alliés" est sélectionné
    if (hasAlliesAdvantage && (!character.allies || character.allies.length === 0)) {
      console.log('[CharacterService] Génération de 2 alliés...');
      character.allies = [
        this.generateRandomNPC('Allié'),
        this.generateRandomNPC('Allié')
      ];
    }
    
    // Générer des ennemis si le désavantage "Ennemis" est sélectionné
    if (hasEnemiesDisadvantage && (!character.enemies || character.enemies.length === 0)) {
      console.log('[CharacterService] Génération de 2 ennemis...');
      character.enemies = [
        this.generateRandomNPC('Ennemi'),
        this.generateRandomNPC('Ennemi')
      ];
    }
    
    // NE PAS supprimer les alliés/ennemis existants si l'avantage n'est plus sélectionné
    // (garde l'historique du personnage)
    
    const saved = localStorage.getItem('myCharacters');
    let characters: Character[] = [];
    
    if (saved) {
      try {
        characters = JSON.parse(saved);
      } catch (error) {
        console.error('Erreur lors du chargement des personnages sauvegardés:', error);
      }
    }

    // Générer les alliés si l'avantage "Alliés" est présent
    if (!character.allies || character.allies.length === 0) {
      console.log('[CharacterService] Recherche avantage Alliés...');
      console.log('[CharacterService] Avantages du personnage:', character.advantages);
      console.log('[CharacterService] IDs avantages sélectionnés:', character.selectedAdvantages);
      
      // Chercher dans les avantages complets
      let alliesAdvantage = character.advantages?.find(a => 
        a.name.toLowerCase().includes('allié') || a.name.toLowerCase().includes('allies')
      );
      
      // Si pas trouvé, chercher dans les IDs sélectionnés
      if (!alliesAdvantage && character.selectedAdvantages) {
        const hasAlliesId = character.selectedAdvantages.includes('allies');
        if (hasAlliesId) {
          console.log('[CharacterService] Avantage Alliés trouvé dans selectedAdvantages');
          character.allies = this.generateAllies(2); // Générer 2 alliés
        }
      } else if (alliesAdvantage) {
        console.log('[CharacterService] Avantage Alliés trouvé:', alliesAdvantage.name);
        character.allies = this.generateAllies(2); // Générer 2 alliés
      }
    }

    // Générer les ennemis si le désavantage "Ennemis" est présent
    if (!character.enemies || character.enemies.length === 0) {
      console.log('[CharacterService] Recherche désavantage Ennemis...');
      console.log('[CharacterService] Désavantages du personnage:', character.disadvantages);
      console.log('[CharacterService] IDs désavantages sélectionnés:', character.selectedDisadvantages);
      
      // Chercher dans les désavantages complets
      let enemiesDisadvantage = character.disadvantages?.find(d => 
        d.name.toLowerCase().includes('ennemi') || d.name.toLowerCase().includes('enemies')
      );
      
      // Si pas trouvé, chercher dans les IDs sélectionnés
      if (!enemiesDisadvantage && character.selectedDisadvantages) {
        const hasEnemiesId = character.selectedDisadvantages.includes('enemies');
        if (hasEnemiesId) {
          console.log('[CharacterService] Désavantage Ennemis trouvé dans selectedDisadvantages');
          character.enemies = this.generateEnemies(2); // Générer 2 ennemis
        }
      } else if (enemiesDisadvantage) {
        console.log('[CharacterService] Désavantage Ennemis trouvé:', enemiesDisadvantage.name);
        character.enemies = this.generateEnemies(2); // Générer 2 ennemis
      }
    }

    // Initialiser totalExperiencePoints si non défini
    if (!character.totalExperiencePoints) {
      character.totalExperiencePoints = character.experiencePoints + character.spentExperiencePoints;
    }

    // Générer un ID unique si le personnage n'en a pas encore
    if (!character.id) {
      character.id = Date.now().toString();
      console.log('[CharacterService] Nouveau personnage, ID généré:', character.id);
    }

    // Ajouter ou mettre à jour le personnage
    const existingIndex = characters.findIndex(c => c.id === character.id);
    if (existingIndex >= 0) {
      console.log('[CharacterService] Mise à jour du personnage existant à l\'index', existingIndex);
      characters[existingIndex] = character;
    } else {
      console.log('[CharacterService] Ajout d\'un nouveau personnage');
      characters.push(character);
    }

    localStorage.setItem('myCharacters', JSON.stringify(characters));
    return character;
  }

  private generateAllies(count: number): NPC[] {
    const allies: NPC[] = [];
    const clans = ['Crabe', 'Grue', 'Dragon', 'Lion', 'Phénix', 'Scorpion', 'Licorne'];
    const relationships = [
      'Ami d\'enfance qui a toujours été présent',
      'Ancien camarade d\'école devenu confident',
      'Membre de la famille éloignée mais loyal',
      'Compagnon de voyage de confiance',
      'Mentor qui continue à offrir ses conseils'
    ];

    for (let i = 0; i < count; i++) {
      const clan = clans[Math.floor(Math.random() * clans.length)];
      allies.push({
        name: `Allié ${i + 1}`,
        clan: clan,
        relationship: 'Allié',
        description: relationships[Math.floor(Math.random() * relationships.length)]
      });
    }

    return allies;
  }

  private generateEnemies(count: number): NPC[] {
    const enemies: NPC[] = [];
    const clans = ['Crabe', 'Grue', 'Dragon', 'Lion', 'Phénix', 'Scorpion', 'Licorne'];
    const relationships = [
      'Rival jaloux qui cherche à nuire à votre réputation',
      'Ancien ami devenu ennemi après une trahison',
      'Membre d\'un clan rival avec une vendetta personnelle',
      'Criminel que vous avez dénoncé',
      'Courtisan offensé par vos actions passées'
    ];

    for (let i = 0; i < count; i++) {
      const clan = clans[Math.floor(Math.random() * clans.length)];
      enemies.push({
        name: `Ennemi ${i + 1}`,
        clan: clan,
        relationship: 'Ennemi',
        description: relationships[Math.floor(Math.random() * relationships.length)]
      });
    }

    return enemies;
  }

  // Méthodes pour les techniques de clan et kata
  availableClanTechniques(): TechniqueKata[] {
    const clan = this.character().clan;
    if (!clan) return [];
    
    return CLAN_TECHNIQUES.filter(t => t.clan === clan || t.clan === 'Universel');
  }

  availableKata(): TechniqueKata[] {
    return KATA;
  }

  addTechnique(techniqueName: string) {
    const currentTechniques = this.character().techniques || [];
    if (currentTechniques.includes(techniqueName)) return;
    
    this._character.update(char => ({
      ...char,
      techniques: [...currentTechniques, techniqueName]
    }));
  }

  removeTechnique(techniqueName: string) {
    const currentTechniques = this.character().techniques || [];
    
    this._character.update(char => ({
      ...char,
      techniques: currentTechniques.filter(name => name !== techniqueName)
    }));
  }

  addKata(kataName: string) {
    const currentKata = this.character().kata || [];
    if (currentKata.includes(kataName)) return;
    
    this._character.update(char => ({
      ...char,
      kata: [...currentKata, kataName]
    }));
  }

  removeKata(kataName: string) {
    const currentKata = this.character().kata || [];
    
    this._character.update(char => ({
      ...char,
      kata: currentKata.filter(name => name !== kataName)
    }));
  }

  isTechniqueSelected(techniqueName: string): boolean {
    return (this.character().techniques || []).includes(techniqueName);
  }

  isKataSelected(kataName: string): boolean {
    return (this.character().kata || []).includes(kataName);
  }

  // Limite de techniques et kata à la création (1 technique de clan + 2 kata max)
  canAddMoreTechniques(): boolean {
    return (this.character().techniques || []).length < 1;
  }

  canAddMoreKata(): boolean {
    return (this.character().kata || []).length < 2;
  }

  // ========== MÉTHODES TECHNIQUES DE CLAN/FAMILLE ==========
  
  /**
   * Retourne toutes les techniques de clan/famille disponibles
   */
  getAllClanFamilyTechniques(): ClanTechnique[] {
    return CLAN_FAMILY_TECHNIQUES;
  }

  /**
   * Retourne les techniques disponibles pour le clan du personnage
   */
  getAvailableClanTechniques(): ClanTechnique[] {
    const clan = this.character().clan;
    if (!clan) return [];
    
    return CLAN_FAMILY_TECHNIQUES.filter(t => t.clan === clan && t.type === 'clan');
  }

  /**
   * Retourne les techniques disponibles pour la famille du personnage
   */
  getAvailableFamilyTechniques(): ClanTechnique[] {
    const family = this.character().family;
    if (!family) return [];
    
    return CLAN_FAMILY_TECHNIQUES.filter(t => t.family === family && t.type === 'famille');
  }

  /**
   * Ajoute une technique de clan/famille au personnage
   */
  addClanTechnique(techniqueName: string) {
    const currentTechniques = this.character().clanTechniques || [];
    if (currentTechniques.includes(techniqueName)) return;
    
    this._character.update(char => ({
      ...char,
      clanTechniques: [...currentTechniques, techniqueName]
    }));
  }

  /**
   * Retire une technique de clan/famille du personnage
   */
  removeClanTechnique(techniqueName: string) {
    const currentTechniques = this.character().clanTechniques || [];
    
    this._character.update(char => ({
      ...char,
      clanTechniques: currentTechniques.filter(name => name !== techniqueName)
    }));
  }

  /**
   * Vérifie si une technique de clan/famille est déjà sélectionnée
   */
  isClanTechniqueSelected(techniqueName: string): boolean {
    return (this.character().clanTechniques || []).includes(techniqueName);
  }

  /**
   * Retourne le nombre de techniques de clan/famille sélectionnées
   */
  getSelectedClanTechniquesCount(): number {
    return (this.character().clanTechniques || []).length;
  }

  /**
   * Retourne les détails d'une technique de clan/famille
   */
  getClanTechniqueDetails(techniqueName: string): ClanTechnique | undefined {
    return CLAN_FAMILY_TECHNIQUES.find(t => t.name === techniqueName);
  }

  /**
   * Retourne les détails de toutes les techniques de clan/famille sélectionnées
   */
  getSelectedClanTechniquesDetails(): ClanTechnique[] {
    const selectedNames = this.character().clanTechniques || [];
    return selectedNames
      .map(name => this.getClanTechniqueDetails(name))
      .filter((t): t is ClanTechnique => t !== undefined);
  }

  // ========== MÉTHODES KIHO ==========
  
  /**
   * Retourne tous les Kiho disponibles
   */
  getAllKiho(): Kiho[] {
    return KIHO;
  }

  /**
   * Retourne les Kiho disponibles filtrés par élément
   */
  getKihoByElement(element: 'Air' | 'Terre' | 'Eau' | 'Feu' | 'Vide'): Kiho[] {
    return KIHO.filter(k => k.element === element);
  }

  /**
   * Retourne les Kiho disponibles filtrés par type
   */
  getKihoByType(type: 'Interne' | 'Martial' | 'Mystique'): Kiho[] {
    return KIHO.filter(k => k.type === type);
  }

  /**
   * Retourne les Kiho disponibles pour le rang actuel du personnage
   * Un moine peut apprendre des Kiho dont le mastery <= son Insight Rank
   */
  getAvailableKihoByRank(): Kiho[] {
    const insightRank = this.getInsightRank();
    return KIHO.filter(k => k.mastery <= insightRank);
  }

  /**
   * Retourne les Kiho disponibles pour un élément et un rang donné
   */
  getAvailableKihoByElementAndRank(element: 'Air' | 'Terre' | 'Eau' | 'Feu' | 'Vide'): Kiho[] {
    const insightRank = this.getInsightRank();
    return KIHO.filter(k => k.element === element && k.mastery <= insightRank);
  }

  /**
   * Ajoute un Kiho au personnage
   */
  addKiho(kihoName: string): boolean {
    const currentKiho = this.character().kiho || [];
    
    // Vérifier si déjà sélectionné
    if (currentKiho.includes(kihoName)) {
      return false;
    }

    // Vérifier la limite de Kiho (3 par rang d'école, donc 3 au rang 1)
    const maxKiho = 3;
    if (currentKiho.length >= maxKiho) {
      console.warn(`Limite de Kiho atteinte (${maxKiho} maximum au rang 1)`);
      return false;
    }

    // Vérifier si le personnage est un moine
    const school = this.character().school;
    if (!school || !school.toLowerCase().includes('moine')) {
      console.warn('Seuls les moines peuvent apprendre des Kiho');
      return false;
    }

    // Trouver le Kiho
    const kiho = KIHO.find(k => k.name === kihoName);
    if (!kiho) {
      console.warn('Kiho non trouvé:', kihoName);
      return false;
    }

    // Vérifier le rang requis
    const insightRank = this.getInsightRank();
    if (kiho.mastery > insightRank) {
      console.warn(`Rang d'Insight insuffisant pour ${kihoName} (requis: ${kiho.mastery}, actuel: ${insightRank})`);
      return false;
    }

    this._character.update(char => ({
      ...char,
      kiho: [...currentKiho, kihoName]
    }));

    return true;
  }

  /**
   * Retire un Kiho du personnage
   */
  removeKiho(kihoName: string): void {
    const currentKiho = this.character().kiho || [];
    
    this._character.update(char => ({
      ...char,
      kiho: currentKiho.filter(name => name !== kihoName)
    }));
  }

  /**
   * Vérifie si un Kiho est sélectionné
   */
  isKihoSelected(kihoName: string): boolean {
    return (this.character().kiho || []).includes(kihoName);
  }

  /**
   * Retourne le nombre de Kiho sélectionnés
   */
  getSelectedKihoCount(): number {
    return (this.character().kiho || []).length;
  }

  /**
   * Retourne les détails d'un Kiho sélectionné
   */
  getKihoDetails(kihoName: string): Kiho | undefined {
    return KIHO.find(k => k.name === kihoName);
  }

  /**
   * Retourne tous les Kiho sélectionnés avec leurs détails
   */
  getSelectedKihoDetails(): Kiho[] {
    const selectedKihoNames = this.character().kiho || [];
    return selectedKihoNames
      .map(name => KIHO.find(k => k.name === name))
      .filter(k => k !== undefined) as Kiho[];
  }

  /**
   * Vérifie si le personnage peut apprendre plus de Kiho
   * À la création: 3 Kiho maximum (règle L5A)
   */
  canAddMoreKiho(): boolean {
    const currentCount = (this.character().kiho || []).length;
    return currentCount < 3;
  }

  /**
   * Retourne le nombre maximum de Kiho autorisé
   */
  getMaxKiho(): number {
    return 3; // 3 Kiho par rang d'école, donc 3 au rang 1
  }

  /**
   * Vérifie si le personnage est un moine
   */
  isMonk(): boolean {
    const school = this.character().school;
    return school ? school.toLowerCase().includes('moine') : false;
  }

  /**
   * Calcule le rang d'Insight du personnage
   * Utilisé pour déterminer quels Kiho peuvent être appris
   */
  getInsightRank(): number {
    const insight = this.insightRank();
    
    if (insight < 150) return 1;
    if (insight < 175) return 2;
    if (insight < 200) return 3;
    if (insight < 225) return 4;
    return 5;
  }
}
