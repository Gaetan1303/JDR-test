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

import { SpellService } from '../core/services/spell.service';
import { EquipmentService } from '../core/services/equipment.service';
import { KihoService } from '../core/services/kiho.service';
import { TechniqueService } from '../core/services/technique.service';
import { CharacterStorageService } from '../core/services/character-storage.service';

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
  });
  public character = this._character;
  // Mise à jour des infos de base
  updateBasicInfo(data: Partial<Character>) {
    this._character.update(char => ({ ...char, ...data }));
  }
  selectClan(clanName: string) {
    this._character.update(char => ({ ...char, clan: clanName, family: '', school: '' }));
  }
  selectFamily(familyName: string) {
    this._character.update(char => ({ ...char, family: familyName, school: '' }));
  }
  selectSchool(schoolName: string) {
    // Lors de la sélection d'une école, on met à jour l'école
    // et on ajoute les compétences de l'école (rank 1, isSchoolSkill=true).
    const schoolObj = SCHOOLS.find(s => s.name === schoolName);
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
      return { ...char, school: schoolName, skills: [...nonSchoolSkills, ...schoolSkills] };
    });
  }

  // Amélioration/diminution de traits/compétences
  improveTrait(trait: keyof Traits) {
    this._character.update(char => {
      const base = { ...char.traits } as Traits;
      return {
        ...char,
        traits: {
          constitution: trait === 'constitution' ? base.constitution + 1 : base.constitution,
          volonte: trait === 'volonte' ? base.volonte + 1 : base.volonte,
          force: trait === 'force' ? base.force + 1 : base.force,
          perception: trait === 'perception' ? base.perception + 1 : base.perception,
          reflexes: trait === 'reflexes' ? base.reflexes + 1 : base.reflexes,
          intuition: trait === 'intuition' ? base.intuition + 1 : base.intuition,
          agilite: trait === 'agilite' ? base.agilite + 1 : base.agilite,
          intelligence: trait === 'intelligence' ? base.intelligence + 1 : base.intelligence
        }
      };
    });
  }
  decreaseTrait(trait: keyof Traits) {
    this._character.update(char => {
      const base = { ...char.traits } as Traits;
      return {
        ...char,
        traits: {
          constitution: trait === 'constitution' ? Math.max(2, base.constitution - 1) : base.constitution,
          volonte: trait === 'volonte' ? Math.max(2, base.volonte - 1) : base.volonte,
          force: trait === 'force' ? Math.max(2, base.force - 1) : base.force,
          perception: trait === 'perception' ? Math.max(2, base.perception - 1) : base.perception,
          reflexes: trait === 'reflexes' ? Math.max(2, base.reflexes - 1) : base.reflexes,
          intuition: trait === 'intuition' ? Math.max(2, base.intuition - 1) : base.intuition,
          agilite: trait === 'agilite' ? Math.max(2, base.agilite - 1) : base.agilite,
          intelligence: trait === 'intelligence' ? Math.max(2, base.intelligence - 1) : base.intelligence
        }
      };
    });
  }
  improveVoidRing() {
    this._character.update(char => {
      const base = { ...char.rings } as Ring;
      return {
        ...char,
        rings: {
          terre: base.terre,
          eau: base.eau,
          air: base.air,
          feu: base.feu,
          vide: base.vide + 1
        }
      };
    });
  }
  decreaseVoidRing() {
    this._character.update(char => {
      const base = { ...char.rings } as Ring;
      return {
        ...char,
        rings: {
          terre: base.terre,
          eau: base.eau,
          air: base.air,
          feu: base.feu,
          vide: Math.max(2, base.vide - 1)
        }
      };
    });
  }
  improveSkill(skillName: string) {
    const skills = [...(this._character().skills || [])];
    const idx = skills.findIndex(s => s.name === skillName);
    if (idx >= 0) skills[idx] = { ...skills[idx], rank: (skills[idx].rank || 0) + 1 };
    this._character.update(char => ({ ...char, skills }));
  }
  decreaseSkill(skillName: string) {
    const skills = [...(this._character().skills || [])];
    const idx = skills.findIndex(s => s.name === skillName);
    if (idx >= 0) skills[idx] = { ...skills[idx], rank: Math.max(0, (skills[idx].rank || 0) - 1) };
    this._character.update(char => ({ ...char, skills }));
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
    const char = { ...this._character() };
    this.storageService.updateCharacter(char as Character);
    return char;
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
      if (adv) this._character.update(char => ({ ...char, advantages: [...current, adv] }));
    }
  }
  deselectAdvantage(id: string) {
    const current = this._character().advantages || [];
    this._character.update(char => ({ ...char, advantages: current.filter((a: Advantage) => a.id !== id) }));
  }
  selectDisadvantage(id: string) {
    const current = this._character().disadvantages || [];
    if (!current.some((d: Disadvantage) => d.id === id)) {
      const dis = DISADVANTAGES.find(d => d.id === id);
      if (dis) this._character.update(char => ({ ...char, disadvantages: [...current, dis] }));
    }
  }
  deselectDisadvantage(id: string) {
    const current = this._character().disadvantages || [];
    this._character.update(char => ({ ...char, disadvantages: current.filter((d: Disadvantage) => d.id !== id) }));
  }
  isAdvantageSelected(id: string) {
    return (this._character().advantages || []).some((a: Advantage) => a.id === id);
  }
  isDisadvantageSelected(id: string) {
    return (this._character().disadvantages || []).some((d: Disadvantage) => d.id === id);
  }

  // Ajout/suppression de sorts via SpellService
  addSpell(spellName: string) {
    const current = this._character().spells || [];
    const updated = this.spellService.addSpell(current, spellName);
    this._character.update(char => ({ ...char, spells: updated }));
  }
  removeSpell(spellName: string) {
    const current = this._character().spells || [];
    const updated = this.spellService.removeSpell(current, spellName);
    this._character.update(char => ({ ...char, spells: updated }));
  }
  // Ajout/suppression de sorts Maho via SpellService
  addMahoSpell(spellName: string) {
    const current = this._character().mahoSpells || [];
    const updated = this.spellService.addMahoSpell(current, spellName);
    this._character.update(char => ({ ...char, mahoSpells: updated }));
  }

  removeMahoSpell(spellName: string) {
    const current = this._character().mahoSpells || [];
    const updated = this.spellService.removeMahoSpell(current, spellName);
    this._character.update(char => ({ ...char, mahoSpells: updated }));
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
    // Par défaut, pas de limite stricte, mais on peut en ajouter une ici si besoin
    return true;
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

      // Si une famille est sélectionnée, on affine la recherche par nom d'école contenant le nom de la famille
      if (family) {
        const familyNorm = normalize(family);
        const filtered = schools.filter(s => normalize(s.name).includes(familyNorm));
        if (filtered.length > 0) schools = filtered;
        // sinon on garde toutes les écoles du clan
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
  get canCastSpells() {
    return computed(() => (this._character().spells || []).length > 0);
  }

  // Ajout d'un getter pour le nombre max de sorts de départ (exemple)
  get maxStartingSpells() {
    return 3;
  }

  // Ajout d'un getter pour savoir si on peut ajouter plus de sorts (exemple)
  get canAddMoreSpells() {
    return computed(() => (this._character().spells || []).length < this.maxStartingSpells);
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
  const insight = this.getInsightRank();
    
    if (insight < 150) return 1;
    if (insight < 175) return 2;
    if (insight < 200) return 3;
    if (insight < 225) return 4;
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
  addKiho(kihoName: string): void {
    const current = this._character().kiho || [];
    const school = this._character().school;
    const insightRank = this.getInsightRank();
    const result = this.kihoService.addKiho(kihoName, current, school, insightRank);
    if (result.success) {
      this._character.update(char => ({ ...char, kiho: [...current, kihoName] }));
    } else {
      // Optionnel : gestion d'erreur utilisateur
      // alert(result.error);
    }
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
    return this.kihoService.canAddMoreKiho(this._character().kiho || []);
  }
  getMaxKiho(): number {
    return this.kihoService.getMaxKiho();
  }
}
