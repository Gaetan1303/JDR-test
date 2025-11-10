import { Injectable, computed, signal, effect } from '@angular/core';
// ...imports uniques ici...
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

import { SpellService } from './services/spell.service';
import { EquipmentService } from './services/equipment.service';
import { KihoService } from './services/kiho.service';
import { TechniqueService } from './services/technique.service';
import { CharacterStorageService } from './services/character-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  // Signal réactif pour l'état du personnage (déclaration unique et cohérente)
  private _character = signal<Character>({
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
    appliedBonuses: {},
    skills: [],
    spells: [],
    mahoSpells: [],
    techniques: [],
    kata: [],
    kiho: [],
    clanTechniques: [],
    advantages: [],
    disadvantages: [],
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
      armor: (typeof ARMOR !== 'undefined' && ARMOR.length > 0 ? ARMOR[0] : undefined),
      items: [],
      koku: 100
    },
    objective: '',
    personality: '',
    background: '',
    insight: 0,
    initiative: 0,
    woundLevels: {
      healthy: 0,
      nicked: 0,
      grazed: 0,
      hurt: 0,
      injured: 0,
      crippled: 0,
      down: 0,
      out: 0
    }
    ,
    // Rang de l'Anneau du Vide (acheté avec XP — L5A 4e)
    voidRank: 2
  });
  public character = this._character;
  // Mise à jour des infos de base
  updateBasicInfo(data: Partial<Character>) {
    this._character.update(char => ({ ...char, ...data }));
  }
  selectClan(clanName: string) {
    // When changing clan, remove any previously-applied family/school bonuses
    const prevFamily = this._character().appliedBonuses?.family;
    const prevSchool = this._character().appliedBonuses?.school;
    let traits = { ...this._character().traits } as Traits;
    // remove previous family bonus
    if (prevFamily) {
      for (const c of CLANS) {
        const f = (c.families || []).find(fi => fi.name === prevFamily);
        if (f && f.traitBonus) {
          const tb = f.traitBonus as keyof Traits;
          traits[tb] = Math.max(2, (traits[tb] || 0) - 1);
          break;
        }
      }
    }
    // remove previous school bonus
    if (prevSchool) {
      const prevS = SCHOOLS.find(s => s.name === prevSchool);
      if (prevS && prevS.traitBonus) {
        const tb = prevS.traitBonus as keyof Traits;
        traits[tb] = Math.max(2, (traits[tb] || 0) - 1);
      }
    }

    this._character.update(char => ({ ...char, clan: clanName, family: '', school: '', traits, appliedBonuses: {} }));
  }
  selectFamily(familyName: string) {
    // Apply family trait bonus and remove previously-applied family bonus if any
    const prevFamily = this._character().appliedBonuses?.family;
    let traits = { ...this._character().traits } as Traits;
    // remove previous family bonus (if applied by this flow)
    if (prevFamily) {
      for (const c of CLANS) {
        const f = (c.families || []).find(fi => fi.name === prevFamily);
        if (f && f.traitBonus) {
          const tb = f.traitBonus as keyof Traits;
          traits[tb] = Math.max(2, (traits[tb] || 0) - 1);
          break;
        }
      }
    }
    // apply new family bonus
    let newFamilyObj: any = undefined;
    for (const c of CLANS) {
      const f = (c.families || []).find(fi => fi.name === familyName);
      if (f) { newFamilyObj = f; break; }
    }
    if (newFamilyObj && newFamilyObj.traitBonus) {
      const tb = newFamilyObj.traitBonus as keyof Traits;
      traits[tb] = (traits[tb] || 0) + 1;
    }

    this._character.update(char => ({ ...char, family: familyName, school: '', traits, appliedBonuses: { ...char.appliedBonuses, family: familyName } }));
  }
  selectSchool(schoolName: string) {
    // Lors de la sélection d'une école, on met à jour l'école
    // et on ajoute les compétences de l'école (rank 1, isSchoolSkill=true).
    const schoolObj = SCHOOLS.find(s => s.name === schoolName);
    // Apply/remove school trait bonus and add school skills
    const prevSchool = this._character().appliedBonuses?.school;
    let traits = { ...this._character().traits } as Traits;
    // remove previous school bonus if any
    if (prevSchool) {
      const prevS = SCHOOLS.find(s => s.name === prevSchool);
      if (prevS && prevS.traitBonus) {
        const tb = prevS.traitBonus as keyof Traits;
        traits[tb] = Math.max(2, (traits[tb] || 0) - 1);
      }
    }

    // apply new school bonus
    if (schoolObj && schoolObj.traitBonus) {
      const tb = schoolObj.traitBonus as keyof Traits;
      traits[tb] = (traits[tb] || 0) + 1;
    }

    this._character.update(char => {
      // Conserver les compétences hors-école
      const nonSchoolSkills = (char.skills || []).filter(s => !s.isSchoolSkill);
      let schoolSkills = [] as any[];
      if (schoolObj && Array.isArray(schoolObj.skills)) {
        schoolSkills = schoolObj.skills.map(name => ({
          name,
          rank: 1,
          isSchoolSkill: true,
          trait: 'agilite' as keyof typeof char.traits // valeur par défaut
        }));
      }
      return { ...char, school: schoolName, skills: [...nonSchoolSkills, ...schoolSkills], traits, appliedBonuses: { ...char.appliedBonuses, school: schoolName } };
    });
  }

  // Amélioration/diminution de traits/compétences
  improveTrait(trait: keyof Traits) {
    // Compute cost and update spentExperiencePoints when improving a trait
    this._character.update(char => {
      const base = { ...char.traits } as Traits;
      const current = base[trait] || 2;
      const cost = (current + 1) * 4; // same formula que dans CharacterCreator.getTraitCost
      const newTraits: Traits = {
        constitution: trait === 'constitution' ? base.constitution + 1 : base.constitution,
        volonte: trait === 'volonte' ? base.volonte + 1 : base.volonte,
        force: trait === 'force' ? base.force + 1 : base.force,
        perception: trait === 'perception' ? base.perception + 1 : base.perception,
        reflexes: trait === 'reflexes' ? base.reflexes + 1 : base.reflexes,
        intuition: trait === 'intuition' ? base.intuition + 1 : base.intuition,
        agilite: trait === 'agilite' ? base.agilite + 1 : base.agilite,
        intelligence: trait === 'intelligence' ? base.intelligence + 1 : base.intelligence
      } as Traits;
      const newSpent = (char.spentExperiencePoints || 0) + cost;
      return { ...char, traits: newTraits, spentExperiencePoints: newSpent };
    });
  }
  decreaseTrait(trait: keyof Traits) {
    // Refund the cost of the current level when decreasing a trait
    this._character.update(char => {
      const base = { ...char.traits } as Traits;
      const current = base[trait] || 2; // value before decrease
      if (current <= 2) return char; // cannot go below 2
      const refund = current * 4; // cost that was paid to reach `current`
      const newTraits: Traits = {
        constitution: trait === 'constitution' ? Math.max(2, base.constitution - 1) : base.constitution,
        volonte: trait === 'volonte' ? Math.max(2, base.volonte - 1) : base.volonte,
        force: trait === 'force' ? Math.max(2, base.force - 1) : base.force,
        perception: trait === 'perception' ? Math.max(2, base.perception - 1) : base.perception,
        reflexes: trait === 'reflexes' ? Math.max(2, base.reflexes - 1) : base.reflexes,
        intuition: trait === 'intuition' ? Math.max(2, base.intuition - 1) : base.intuition,
        agilite: trait === 'agilite' ? Math.max(2, base.agilite - 1) : base.agilite,
        intelligence: trait === 'intelligence' ? Math.max(2, base.intelligence - 1) : base.intelligence
      } as Traits;
      const newSpent = Math.max(0, (char.spentExperiencePoints || 0) - refund);
      return { ...char, traits: newTraits, spentExperiencePoints: newSpent };
    });
  }
  /**
   * Upgrade the Void rank (Anneau du Vide) according to L5A 4e rules.
   * Cost = newRank * 4 XP. Returns true if operation succeeded.
   */
  upgradeVoid(newRank: number): boolean {
    const current = this._character().voidRank ?? ((this._character().rings || {}).vide || 2);
    if (newRank <= current || newRank > 10) return false;
    const xpCost = newRank * 4;
    const availableComputed = this.availableExperiencePoints();
    const available = (typeof (availableComputed as any) === 'function') ? (availableComputed as any)() : availableComputed;
    if (xpCost > available) {
      console.error('XP insuffisant pour améliorer l\'Anneau du Vide.');
      return false;
    }
    this._character.update(char => ({ ...char, voidRank: newRank, spentExperiencePoints: (char.spentExperiencePoints || 0) + xpCost }));
    return true;
  }

  /**
   * Decrease void rank by 1 and refund the XP paid for the current rank.
   * Refund uses the same formula (currentRank * 4) to keep symmetry.
   */
  decreaseVoidRank(): boolean {
    const current = this._character().voidRank ?? ((this._character().rings || {}).vide || 2);
    if (current <= 2) return false;
    const refund = current * 4;
    this._character.update(char => ({ ...char, voidRank: Math.max(2, current - 1), spentExperiencePoints: Math.max(0, (char.spentExperiencePoints || 0) - refund) }));
    return true;
  }

  // Compatibility wrappers for older UI code that calls improveVoidRing/decreaseVoidRing
  improveVoidRing(): boolean {
    const current = this._character().voidRank ?? ((this._character().rings || {}).vide || 2);
    return this.upgradeVoid(current + 1);
  }
  decreaseVoidRing(): boolean {
    return this.decreaseVoidRank();
  }
  improveSkill(skillName: string) {
    const skills = [...(this._character().skills || [])];
    const idx = skills.findIndex(s => s.name === skillName);
    if (idx >= 0) {
      const currentRank = skills[idx].rank || 0;
      const isSchool = !!skills[idx].isSchoolSkill;
      const cost = isSchool ? (currentRank + 1) * 1 : (currentRank + 1) * 2; // same formula que CharacterCreator.getSkillCost
      skills[idx] = { ...skills[idx], rank: currentRank + 1 };
      this._character.update(char => ({ ...char, skills, spentExperiencePoints: (char.spentExperiencePoints || 0) + cost }));
    }
  }
  decreaseSkill(skillName: string) {
    const skills = [...(this._character().skills || [])];
    const idx = skills.findIndex(s => s.name === skillName);
    if (idx >= 0) {
      const currentRank = skills[idx].rank || 0;
      if (currentRank <= 0) return;
      const isSchool = !!skills[idx].isSchoolSkill;
      const refund = isSchool ? currentRank * 1 : currentRank * 2; // refund cost for current rank
      skills[idx] = { ...skills[idx], rank: Math.max(0, currentRank - 1) };
      this._character.update(char => ({ ...char, skills, spentExperiencePoints: Math.max(0, (char.spentExperiencePoints || 0) - refund) }));
    }
  }

  // Étapes de création
  nextStep() {
    this.currentStep.set(this.currentStep() + 1);
  }
  previousStep() {
    this.currentStep.set(Math.max(1, this.currentStep() - 1));
  }
  resetCharacter() {
    this._character.set({
      name: '',
      age: 15,
      gender: '',
      clan: '',
      family: '',
      school: '',
      rings: { terre: 2, eau: 2, air: 2, feu: 2, vide: 2 },
      traits: { constitution: 2, volonte: 2, force: 2, perception: 2, reflexes: 2, intuition: 2, agilite: 2, intelligence: 2 },
      skills: [],
      spells: [],
      mahoSpells: [],
      techniques: [],
      kata: [],
      kiho: [],
      clanTechniques: [],
      advantages: [],
      disadvantages: [],
      selectedAdvantages: [],
      selectedDisadvantages: [],
      experiencePoints: 40,
      spentExperiencePoints: 0,
      honor: 5.5,
      glory: 1,
      status: 1,
      taint: 0,
      equipment: { weapons: [], armor: (typeof ARMOR !== 'undefined' && ARMOR.length > 0 ? ARMOR[0] : undefined), items: [], koku: 100 },
      objective: '',
      personality: '',
      background: '',
      insight: 0,
      initiative: 0,
      woundLevels: {
        healthy: 0,
        nicked: 0,
        grazed: 0,
        hurt: 0,
        injured: 0,
        crippled: 0,
        down: 0,
        out: 0
      }
      ,
      appliedBonuses: {},
      voidRank: 2
    });
    this.currentStep.set(1);
  }

  // Catégories d'avantages/désavantages
  getAdvantagesByCategory(category: string) {
    return ADVANTAGES.filter(a => a.category === category);
  }
  getDisadvantagesByCategory(category: string) {
    return DISADVANTAGES.filter(d => d.category === category);
  }

  // Sauvegarde du personnage (retourne l'objet courant)
  saveCharacter() {
    const char = { ...this._character() } as Character;
    // Si l'objet a déjà un ID, on met à jour, sinon on l'ajoute
    if (char.id) {
      this.storageService.updateCharacter(char);
      return char;
    }
    // Ajouter et récupérer l'objet avec ID généré
    const saved = this.storageService.addCharacter(char);
    // Mettre à jour le signal avec l'ID/valeurs sauvegardées
    this._character.set({ ...saved });
    return saved;
  }

  // Gestion équipement (vente, argent, etc.)
  sellEquipment(equipmentName: string, type: 'weapon' | 'armor' | 'item') {
    const char = this._character() as Character;
    const result = this.equipmentService.sellEquipment(char, equipmentName, type);
    if (result.success && result.character) this._character.set(result.character);
    return result;
  }
  canAffordEquipment(equipment: Equipment) {
    const char = this._character() as Character;
    return this.equipmentService.canAffordEquipment(equipment, char.equipment?.koku || 0);
  }
  getAvailableMoney() {
    return this._character().equipment?.koku || 0;
  }

  // Pour les sorts : retourner les objets Spell au lieu des strings
  get selectedSpellsObjects() {
    return computed(() => {
      const names = this._character().spells || [];
      return names.map(name => SPELLS.find(s => s.name === name)).filter(Boolean);
    });
  }
  // Avantages/désavantages sélectionnés (signaux)
  get selectedAdvantages() {
    return computed(() => this._character().advantages || []);
  }
  get selectedDisadvantages() {
    return computed(() => this._character().disadvantages || []);
  }

  selectAdvantage(id: string) {
    const current = this._character().advantages || [];
    if (!current.some((a: Advantage) => a.id === id)) {
      const adv = ADVANTAGES.find(a => a.id === id);
      if (adv) this._character.update(char => ({ ...char, advantages: [...current, adv], spentExperiencePoints: (char.spentExperiencePoints || 0) + (adv.cost || 0) }));
    }
  }
  deselectAdvantage(id: string) {
    const current = this._character().advantages || [];
    const adv = current.find((a: Advantage) => a.id === id);
    this._character.update(char => ({ ...char, advantages: current.filter((a: Advantage) => a.id !== id), spentExperiencePoints: Math.max(0, (char.spentExperiencePoints || 0) - (adv?.cost || 0)) }));
  }
  selectDisadvantage(id: string) {
    const current = this._character().disadvantages || [];
    if (!current.some((d: Disadvantage) => d.id === id)) {
      const dis = DISADVANTAGES.find(d => d.id === id);
      if (dis) this._character.update(char => ({ ...char, disadvantages: [...current, dis], experiencePoints: (char.experiencePoints || 0) + (dis.xpGain || 0) }));
    }
  }
  deselectDisadvantage(id: string) {
    const current = this._character().disadvantages || [];
    const dis = current.find((d: Disadvantage) => d.id === id);
    this._character.update(char => ({ ...char, disadvantages: current.filter((d: Disadvantage) => d.id !== id), experiencePoints: Math.max(0, (char.experiencePoints || 0) - (dis?.xpGain || 0)) }));
  }
  isAdvantageSelected(id: string) {
    return (this._character().advantages || []).some((a: Advantage) => a.id === id);
  }
  isDisadvantageSelected(id: string) {
    return (this._character().disadvantages || []).some((d: Disadvantage) => d.id === id);
  }

  // Ajout/suppression de sorts via SpellService
  addSpell(spellName: string) {
    // Retourne un objet résultat pour que l'appelant puisse afficher un feedback
    const current = this._character().spells || [];
    const spell = SPELLS.find(s => s.name === spellName);
    if (!spell) return { success: false, error: 'Sort introuvable' };

    // Vérifier que le personnage peut apprendre ce sort (anneau/insight/universal)
    if (!this.canLearnSpell(spellName)) return { success: false, error: 'Votre personnage ne peut pas apprendre ce sort (rang/anneau insuffisant ou école incompatible)' };

    // Vérifier les limites par rang (rank1 / rank2)
    const limits: any = this.maxStartingSpells;
    const rank = spell.mastery || 1;
    const rankKey = rank === 1 ? 'rank1' : (rank === 2 ? 'rank2' : null);
    if (rankKey && limits && typeof limits[rankKey] === 'number') {
      const currentCountForRank = this.spellService.getSpellCountByRank(current, rank);
      if (currentCountForRank >= limits[rankKey]) {
        return { success: false, error: `Limite atteinte pour les sorts de rang ${rank} (max ${limits[rankKey]})` };
      }
    }

    // Vérifier la limite totale également
    const totalLimit = (limits?.rank1 || 0) + (limits?.rank2 || 0);
    if (totalLimit > 0 && current.length >= totalLimit) {
      return { success: false, error: `Limite totale de sorts atteinte (${totalLimit})` };
    }

    // Tous les contrôles ok -> ajouter
    const updated = this.spellService.addSpell(current, spellName);
    this._character.update(char => ({ ...char, spells: updated }));
    return { success: true };
  }
  removeSpell(spellName: string) {
    const current = this._character().spells || [];
    const updated = this.spellService.removeSpell(current, spellName);
    this._character.update(char => ({ ...char, spells: updated }));
  }
  // Ajout/suppression de sorts Maho via SpellService
  addMahoSpell(spellName: string) {
    // Return result-like object { success: boolean, error?: string }
    const current = this._character().mahoSpells || [];
    // Check permission
    const canUse = this.canUseMaho();
    if (!canUse) return { success: false, error: 'École ou conditions ne permettent pas d\'apprendre le Maho' };
    // Prevent duplicates
    if (current.includes(spellName)) return { success: false, error: 'Sort Maho déjà sélectionné' };
    // Find spell to determine taint (use mastery as proxy for taint increment)
    const spell = MAHO_SPELLS.find(s => s.name === spellName);
    if (!spell) return { success: false, error: 'Sort Maho introuvable' };
    const taintIncrement = (typeof (spell as any).taintCost === 'number') ? (spell as any).taintCost : Math.max(1, Math.round(spell.mastery));
    const MAX_TAINT = 10; // seuil global maximal (peut être ajusté)
    const currentTaint = this._character().taint || 0;
    if (currentTaint + taintIncrement > MAX_TAINT) return { success: false, error: 'Ajout refusé : la souillure dépasserait le maximum autorisé' };

    const updated = this.spellService.addMahoSpell(current, spellName);
    this._character.update(char => ({ ...char, mahoSpells: updated, taint: (char.taint || 0) + taintIncrement }));
    return { success: true };
  }

  removeMahoSpell(spellName: string) {
    const current = this._character().mahoSpells || [];
    const spell = MAHO_SPELLS.find(s => s.name === spellName);
    const taintDecrement = spell ? ((typeof (spell as any).taintCost === 'number') ? (spell as any).taintCost : Math.max(1, Math.round(spell.mastery))) : 1;
    const updated = this.spellService.removeMahoSpell(current, spellName);
    this._character.update(char => ({ ...char, mahoSpells: updated, taint: Math.max(0, (char.taint || 0) - taintDecrement) }));
    return { success: true };
  }

  getAvailableMahoByRank(maxRank: number) {
    return this.spellService.getAvailableMahoByRank(maxRank);
  }

  isMahoSelected(spellName: string): boolean {
    const current = this._character().mahoSpells || [];
    return this.spellService.isMahoSelected(current, spellName);
  }

  getSelectedMahoCount(): number {
    const current = this._character().mahoSpells || [];
    return this.spellService.getSelectedMahoCount(current);
  }

  getSelectedMahoDetails() {
    const current = this._character().mahoSpells || [];
    return this.spellService.getSelectedMahoObjects(current);
  }

  canAddMoreMahoSpells(): boolean {
    // Respecter une limite par école si fournie
    const school = SCHOOLS.find(s => s.name === this._character().school) as any;
    const limit = school?.mahoStartingCount ?? null;
    const selected = this._character().mahoSpells || [];
    if (limit === null) return true;
    return selected.length < limit;
  }

  // Ajout/suppression de techniques/kata (modifie le signal)
  addTechnique(techniqueName: string) {
    const current = this._character().techniques || [];
    if (!current.includes(techniqueName)) {
      this._character.update(char => ({ ...char, techniques: [...current, techniqueName] }));
    }
  }
  removeTechnique(techniqueName: string) {
    const current = this._character().techniques || [];
    this._character.update(char => ({ ...char, techniques: current.filter((t: string) => t !== techniqueName) }));
  }
  addKata(kataName: string) {
    const current = this._character().kata || [];
    if (!current.includes(kataName)) {
      this._character.update(char => ({ ...char, kata: [...current, kataName] }));
    }
  }
  removeKata(kataName: string) {
    const current = this._character().kata || [];
    this._character.update(char => ({ ...char, kata: current.filter((k: string) => k !== kataName) }));
  }

  // Sélection de techniques/kata
  isTechniqueSelected = (name: string) => (this._character().techniques || []).includes(name);
  isKataSelected = (name: string) => (this._character().kata || []).includes(name);
  canAddMoreTechniques = () => (this._character().techniques || []).length < 1;
  canAddMoreKata = () => (this._character().kata || []).length < 2;

  // Pour les techniques de clan/famille (wrappers)
  getAvailableFamilyTechniques(family: string) {
    return this.techniqueService.getAvailableFamilyTechniques(family);
  }
  isClanTechniqueSelected = (name: string) => (this._character().clanTechniques || []).includes(name);
  // Pour les kiho (wrapper)
  // ...existing code...

  // Permet de charger un personnage complet dans le service
  loadCharacter(character: Character) {
    this._character.set({ ...character });
  }
  currentStep = signal<number>(1);

  // Pour la liste des personnages (play-character)
  getAllCharacters(): Character[] {
    return this.storageService.getAllCharacters();
  }

  // Liste des clans disponibles
  get availableClans() {
    return CLANS;
  }

  // Exemples de signaux et getters pour character-creator
  public availableFamilies = computed(() => {
    const clan = this._character().clan;
    if (!clan) return [];

    // Normalisation pour ignorer la casse et les accents
    const normalize = (str: string) => {
      return str
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase()
        .trim();
    };

    const clanNorm = normalize(clan);
    const clanObj = CLANS.find(c => {
      const cName = normalize(c.name);
      // Match strict or when one contains the other (handles 'Clan du Dragon' vs 'Dragon')
      return cName === clanNorm || cName.includes(clanNorm) || clanNorm.includes(cName);
    });
    if (clanObj?.families && Array.isArray(clanObj.families) && clanObj.families.length > 0) {
      return clanObj.families;
    }
    return [];
  });
  
  // Retourne les écoles disponibles pour le clan ET la famille sélectionnée (réactif)
  get availableSchools() {
    return computed(() => {
      const clan = this._character().clan;
      const family = this._character().family;
      if (!clan) return [];

      // Normalisation pour comparer correctement les noms (ex: "Clan du Dragon" vs "Dragon")
      const normalize = (str: string | undefined) => {
        if (!str) return '';
        return str
          .normalize('NFD')
          .replace(/\p{Diacritic}/gu, '')
          .toLowerCase()
          .trim();
      };

      const clanNorm = normalize(clan);
      // Filtrer les écoles par clan normalisé
      let schools = SCHOOLS.filter(s => normalize(s.clan) === clanNorm);

      // Si une famille est sélectionnée, ne pas exclure les autres écoles du clan :
      // on renvoie toutes les écoles du clan, mais on peut prioriser celles liées à la famille.
      if (family) {
        const familyNorm = normalize(family);
        // Séparer les écoles qui correspondent à la famille et les autres
        const matched = schools.filter(s => normalize(s.name).includes(familyNorm));
        const others = schools.filter(s => !normalize(s.name).includes(familyNorm));
        // Concaténer en plaçant les écoles correspondant à la famille en tête
        schools = [...matched, ...others];
      }

      return schools;
    });
  }
  get calculatedRings() {
    // Expose le signal rings du personnage
    return computed(() => this._character().rings || {});
  }

  // Ajout d'autres propriétés attendues (exemples, à compléter selon besoins)
  get availableWeapons() {
    return computed(() => WEAPONS);
  }
  get availableArmor() {
    return computed(() => ARMOR);
  }
  get availableItems() {
    return computed(() => ITEMS);
  }

  // Ajout d'un getter pour l'équipement du personnage
  get characterEquipment() {
    return computed(() => this._character().equipment || { weapons: [], armor: ARMOR[0], items: [], koku: 0 });
  }

  // Ajout d'un getter pour l'expérience disponible (exemple)
  get availableExperiencePoints() {
    return computed(() => (this._character().experiencePoints || 0) - (this._character().spentExperiencePoints || 0));
  }

  // Computed attributes required by rules adaptation (L5A)
  get fixedInitiative() {
    return computed(() => {
      const reflexes = this._character().traits?.reflexes || 0;
      const iaijutsu = (this._character().skills || []).find(s => (s.name || '').toLowerCase() === 'iaijutsu');
      const iaijutsuRank = iaijutsu ? (iaijutsu.rank || 0) : 0;
      return reflexes + iaijutsuRank;
    });
  }

  get movementSpeed() {
    return computed(() => {
      const reflexes = this._character().traits?.reflexes || 0;
      const terreRing = (this._character().rings || {}).terre || 0;
      return (reflexes + terreRing) * 5;
    });
  }

  get woundThresholdIndemne() {
    return computed(() => {
      const terreRing = (this._character().rings || {}).terre || 0;
      return terreRing * 5;
    });
  }

  // Ajout d'un getter pour les techniques de clan disponibles (exemple)
  get clanTechniquesList() {
    const clan = this._character().clan;
    return this.techniqueService.availableClanTechniques(clan || '');
  }

  // Ajout d'un getter pour les kata disponibles (exemple)
  get availableKata() {
    return this.techniqueService.availableKata();
  }

  // Ajout d'un getter pour les sorts sélectionnés (exemple)
  get selectedSpells() {
    return computed(() => this._character().spells || []);
  }

  // Ajout d'un getter pour les sorts par élément (exemple)
  get availableSpellsByElement() {
    return (element: string) => this.spellService.getAvailableSpells(element);
  }

  // Ajout d'un getter pour savoir si on peut lancer des sorts (exemple)
  // Indique si l'école sélectionnée permet d'apprendre/lancer des sorts
  get canCastSpells() {
    return computed(() => {
      const school = SCHOOLS.find(s => s.name === this._character().school);
      if (!school) return false;
      // Schools of type 'shugenja' can cast spells; also support explicit spellLimits
      if ((school as any).type === 'shugenja') return true;
      return !!((school as any).spellLimits);
    });
  }

  // Indique si le personnage peut apprendre/utiliser le Maho
  // Vrai si l'école autorise explicitement le maho (allowsMaho) ou si le désavantage maho-tsukai est sélectionné
  get canUseMaho() {
    return computed(() => {
      const school = SCHOOLS.find(s => s.name === this._character().school) as any;
      const bySchool = !!(school && school.allowsMaho);
      const byDisadv = this.isDisadvantageSelected('maho-tsukai');
      return bySchool || byDisadv;
    });
  }

  // Nombre max de sorts de départ (dépend de l'école sélectionnée)
  // Retourne un objet { rank1, rank2, affinity?, deficiency? }
  get maxStartingSpells() {
    const school = SCHOOLS.find(s => s.name === this._character().school);
    if (school && (school as any).spellLimits) return (school as any).spellLimits;
    return { rank1: 0, rank2: 0 };
  }

  // Retourne les sorts disponibles pour le personnage selon son rang d'insight
  getAvailableSpellsForCharacter(element: string) {
    const insight = this.getInsightRank();
    // Determine ring level for element (map element name to ring key)
    const ringKey = (element || '').toString().toLowerCase();
    const ringLevel = (this._character().rings as any)?.[ringKey] || 0;
    const effectiveRank = Math.max(insight, ringLevel);
    // Récupère tous les sorts de l'élément puis filtre par mastery <= effectiveRank ou universal
    return this.spellService.getAvailableSpells(element).filter(s => (s && (s.mastery <= effectiveRank || (s as any).universal === true)));
  }

  // Indique si le personnage peut apprendre/lancer un sort donné
  canLearnSpell(spellName: string): boolean {
    const spell = SPELLS.find(s => s.name === spellName);
    if (!spell) return false;
    // Doit être une école qui peut lancer des sorts
    if (!this.canCastSpells()) return false;
    const insight = this.getInsightRank();
    // determine which ring corresponds to the spell element
    const ringKey = (spell.element || '').toString().toLowerCase();
    const ringLevel = (this._character().rings as any)?.[ringKey] || 0;
    const effectiveRank = Math.max(insight, ringLevel);
    return spell.mastery <= effectiveRank || (spell as any).universal === true;
  }

  // Ajout d'un getter pour savoir si on peut ajouter plus de sorts (exemple)
  // Autorise l'ajout de sorts si le total de sorts sélectionnés est inférieur au quota total
  get canAddMoreSpells() {
    return computed(() => {
      const limits: any = this.maxStartingSpells;
      const totalLimit = (limits?.rank1 || 0) + (limits?.rank2 || 0);
      const selected = this._character().spells || [];
      return selected.length < totalLimit;
    });
  }

  // Ajout d'un getter pour l'affinité/déficience d'école (exemple)
  get schoolAffinityDeficiency() {
    return computed(() => {
      const school = SCHOOLS.find(s => s.name === this._character().school);
      return { affinity: (school as any)?.affinity, deficiency: (school as any)?.deficiency };
    });
  }

  // Ajout d'un getter pour les avantages/désavantages disponibles (exemple)
  get availableAdvantages() {
    return ADVANTAGES;
  }
  get availableDisadvantages() {
    return DISADVANTAGES;
  }

  // Ajout d'un getter pour les catégories d'avantages/désavantages (exemple)
  get advantageCategories() {
    return Array.from(new Set(ADVANTAGES.map(a => a.category)));
  }
  get disadvantageCategories() {
    return Array.from(new Set(DISADVANTAGES.map(d => d.category)));
  }

  // Ajout d'un getter pour le coût/gain XP des avantages/désavantages (exemple)
  get advantageXPCost() {
    return (id: string) => ADVANTAGES.find(a => a.id === id)?.cost || 0;
  }
  get disadvantageXPGain() {
    return (id: string) => DISADVANTAGES.find(d => d.id === id)?.xpGain || 0;
  }

  // Ajout d'un getter pour le rang d'Insight (exemple)
  get insightRank() {
    return computed(() => this.getInsightRank());
  }

  // Ajout d'un getter pour l'initiative (exemple)
  get initiative() {
    return computed(() => 3 + (this._character().traits?.reflexes || 0));
  }

  // Ajout d'un getter pour les niveaux de blessure (exemple)
  get woundLevels() {
    return computed(() => [0, 5, 10, 15, 20, 40]);
  }

  // Ajout d'un getter pour les stats de combat (exemple)
  get combatStats() {
    return computed(() => ({
      attack: (this._character().traits?.agilite || 0) + (this._character().skills?.find(s => s.name === 'Kenjutsu')?.rank || 0),
      defense: (this._character().traits?.reflexes || 0) + (this._character().skills?.find(s => s.name === 'Défense')?.rank || 0)
    }));
  }
  constructor(
    private spellService: SpellService,
    private equipmentService: EquipmentService,
    private kihoService: KihoService,
    private techniqueService: TechniqueService,
    private storageService: CharacterStorageService
  ) {}

  // --- Délégation vers les services extraits ---
  // Exemples :
  // Spells
  getAvailableSpells(element: string) {
    return this.spellService.getAvailableSpells(element);
  }
  // Equipment
  buyEquipment(character: Character, itemName: string, type: string) {
    // Trouver l'objet Equipment correspondant au nom et au type
    let equipment;
    if (type === 'weapon') {
      equipment = WEAPONS.find(w => w.name === itemName);
    } else if (type === 'armor') {
      equipment = ARMOR.find(a => a.name === itemName);
    } else {
      equipment = ITEMS.find(i => i.name === itemName);
    }
    if (!equipment) return { success: false, error: 'Équipement non trouvé' };
    return this.equipmentService.buyEquipment(character, equipment, type as 'weapon' | 'armor' | 'item');
  }
  // Kiho
  getAvailableKiho(ring: string) {
  // Délégation à getKihoByElement (ou getAllKiho si ring === 'all')
  if (ring === 'all') return this.kihoService.getAllKiho();
  return this.kihoService.getKihoByElement(ring as any);
  }

  // Retourne les Kiho accessibles pour le personnage selon son rang d'insight (et éventuellement l'anneau)
  getAvailableKihoForCharacter(ring: string) {
    const insight = this.getInsightRank();
    if (ring === 'all') return this.kihoService.getAvailableKihoByRank(insight);
    // If we have a specific ring/element requested, compute effective rank using character's ring level
    const ringKey = (ring || '').toString().toLowerCase();
    const ringLevel = (this._character().rings as any)?.[ringKey] || 0;
    const effectiveRank = Math.max(insight, ringLevel);
    return this.kihoService.getAvailableKihoByElementAndRank(ring as any, effectiveRank);
  }

  // Indique si le personnage peut utiliser/apprendre un Kiho donné
  canUseKiho(kihoName: string): boolean {
    const kiho = this.kihoService.getKihoDetails(kihoName);
    if (!kiho) return false;
    if (!this.isMonk()) return false;
    const insight = this.getInsightRank();
    // Determine ring to use: kiho can specify a ring, otherwise use its element
    const ringSource = (kiho.ring || kiho.element || '').toString().toLowerCase();
    const ringLevel = (this._character().rings as any)?.[ringSource] || 0;
    const effectiveRank = Math.max(insight, ringLevel);
    return kiho.mastery <= effectiveRank;
  }
  // Techniques
  getAvailableClanTechniques(clan: string) {
    return this.techniqueService.availableClanTechniques(clan);
  }
  // Stockage
  getAllCharactersValidated() {
    return this.storageService.getAllCharactersValidated();
  }
  updateCharacter(character: Character) {
    return this.storageService.updateCharacter(character);
  }
  // --- Logique équipement extraite dans EquipmentService ---
  // Nettoyage : suppression du code dupliqué et fragments orphelins
  // (Anciennes méthodes d'équipement et signaux dupliqués supprimés)
// Bloc orphelin supprimé : tout code hors méthode supprimé ici

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

  // --- Logique techniques extraite dans TechniqueService ---

  // --- Logique Kiho extraite dans KihoService ---

  /**
   * Calcule le rang d'Insight du personnage
   * Utilisé pour déterminer quels Kiho peuvent être appris
   */
  getInsightRank(): number {
    // Utiliser la valeur d'insight du personnage (mesurée en points)
    const insightValue = (this._character().insight || 0);
    if (insightValue < 150) return 1;
    if (insightValue < 175) return 2;
    if (insightValue < 200) return 3;
    if (insightValue < 225) return 4;
    return 5;
  }

  /**
   * Retourne le nom de la famille sélectionnée (si existante)
   */
  public selectedFamilyName(): string | undefined {
    const family = this._character().family;
    if (!family) return undefined;
    return family;
  }

  /**
   * Récupère tous les personnages sauvegardés depuis localStorage
   */
  /**
   * Récupère tous les personnages sauvegardés depuis localStorage avec validation
   */

  // --- Gestion Kiho centralisée ---
  getKihoByElement(element: string) {
    return this.kihoService.getKihoByElement(element as any);
  }
  isMonk(): boolean {
    return this.kihoService.isMonk(this._character().school);
  }
  getSelectedKihoCount(): number {
    return this.kihoService.getSelectedKihoCount(this._character().kiho || []);
  }
  getSelectedKihoDetails(): Kiho[] {
    return this.kihoService.getSelectedKihoDetails(this._character().kiho || []);
  }
  addKiho(kihoName: string): { success: boolean; error?: string } {
    const current = this._character().kiho || [];
    const school = this._character().school;
    // Compute effective rank as max(insightRank, ring level for this kiho)
    const insightRank = this.getInsightRank();
    const kiho = this.kihoService.getKihoDetails(kihoName);
    let effectiveRank = insightRank;
    if (kiho) {
      const ringSource = (kiho.ring || kiho.element || '').toString().toLowerCase();
      const ringLevel = (this._character().rings as any)?.[ringSource] || 0;
      effectiveRank = Math.max(insightRank, ringLevel);
    }
  const result = this.kihoService.addKiho(kihoName, current, school, effectiveRank, this.getMaxKiho());
    if (result.success) {
      this._character.update(char => ({ ...char, kiho: [...current, kihoName] }));
    }
    return result;
  }
  removeKiho(kihoName: string): void {
    const current = this._character().kiho || [];
    const updated = this.kihoService.removeKiho(kihoName, current);
    this._character.update(char => ({ ...char, kiho: updated }));
  }
  isKihoSelected(kihoName: string): boolean {
    return this.kihoService.isKihoSelected(kihoName, this._character().kiho || []);
  }
  canAddMoreKiho(): boolean {
    return this.kihoService.canAddMoreKiho(this._character().kiho || [], this.getMaxKiho());
  }
  getMaxKiho(): number {
    // La limite de Kiho dépend désormais du rang acheté de l'Anneau du Vide (voidRank).
    const vr = (typeof this._character().voidRank === 'number') ? this._character().voidRank : ((this._character().rings || {}).vide || 3);
    return (typeof vr === 'number' && vr > 0) ? vr : 3;
  }
}
