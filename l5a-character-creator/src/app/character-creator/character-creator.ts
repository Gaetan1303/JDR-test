import { Component, inject, computed, effect } from '@angular/core';
import { ThemeService, Theme } from '../services/theme.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CharacterService } from '../services/character.service';
import { Equipment, Character, Traits, Skill } from '../models/character.model';
import { SCHOOLS } from '../data/schools.data';

@Component({
  selector: 'app-character-creator',
  imports: [
    CommonModule,
    FormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatTabsModule,
    MatDividerModule,
    MatBadgeModule,
    MatProgressBarModule,
    MatTooltipModule
  ],
  templateUrl: './character-creator.html',
  styleUrl: './character-creator.scss'
})
export class CharacterCreator {
  // Expose directement le computed signal des sorts sélectionnés (préserve la réactivité)
  selectedSpellsObjects: any;
  // Détermine si le personnage peut utiliser les sorts Maho (ex : a le désavantage Maho-Tsukai)
  canUseMaho(): boolean {
    // On considère que le désavantage Maho-Tsukai a l'id 'maho-tsukai' dans les désavantages
    const disadvantages = this.character().disadvantages || [];
    return disadvantages.some((d: any) => d.id === 'maho-tsukai');
  }
  characterService = inject(CharacterService);
  themeService = inject(ThemeService);
  private router = inject(Router);
  
  // Expose Math et document pour le template
  Math = Math;
  parseInt = parseInt;
  document = document;
  
  // Descriptions détaillées des traits
  traitDescriptions: Record<string, string> = {
    // Terre
    'force': 'La Force représente la puissance physique brute, la capacité à soulever des charges lourdes et infliger des dégâts au combat.',
    'constitution': 'La Constitution mesure l\'endurance, la résistance aux maladies et poisons, et détermine les niveaux de blessure.',
    'volonte': 'La Volonté mesure la détermination, la résistance mentale aux influences extérieures et la capacité à résister à la magie.',
    // Eau
    'perception': 'La Perception mesure la capacité à observer son environnement, détecter les détails subtils et remarquer les dangers cachés.',
    'intelligence': 'L\'Intelligence représente la capacité d\'apprentissage, de raisonnement logique et de compréhension des concepts complexes.',
    // Feu
    'agilite': 'L\'Agilité mesure la vitesse, la coordination et la capacité à esquiver les attaques ou réaliser des mouvements précis.',
    // Air
    'reflexes': 'Les Réflexes déterminent la vitesse de réaction, l\'initiative au combat et la capacité à agir rapidement.',
    'intuition': 'L\'Intuition représente la compréhension instinctive des situations sociales et la capacité à lire les intentions d\'autrui.',
    // Vide
    'vide': 'Le Vide représente la connexion spirituelle, l\'illumination et la capacité à puiser dans l\'essence de toute chose.'
  };
  
  // Signaux pour la réactivité
  character = this.characterService.character;
  currentStep = this.characterService.currentStep;
  availableClans = this.characterService.availableClans;
  availableFamilies = this.characterService.availableFamilies;
  availableSchools = this.characterService.availableSchools;
  // Méthode d'aide pour debug : retourne les écoles du dataset SCHOOLS pour le clan courant
  schoolsForCurrentClan() {
    const clan = this.character().clan;
    if (!clan) return [] as any[];
    return SCHOOLS.filter(s => s.clan === clan);
  }
  schoolsForCurrentClanNames(): string {
    return this.schoolsForCurrentClan().map(s => s.name).join(', ');
  }
  // Pour éviter les erreurs de typage dans le template, expose les valeurs des anneaux calculés
  get calculatedRingsValue(): { terre: number; eau: number; air: number; feu: number; vide: number } {
    // `calculatedRings` in the service is a computed() — it may be a callable signal.
    // Support both shapes: either the computed function or a plain value.
    const ringsSignalOrValue: any = this.characterService.calculatedRings;
    const rings = (typeof ringsSignalOrValue === 'function') ? ringsSignalOrValue() : ringsSignalOrValue;
    return {
      terre: (rings && typeof rings.terre === 'number') ? rings.terre : 2,
      eau: (rings && typeof rings.eau === 'number') ? rings.eau : 2,
      air: (rings && typeof rings.air === 'number') ? rings.air : 2,
      feu: (rings && typeof rings.feu === 'number') ? rings.feu : 2,
      vide: (rings && typeof rings.vide === 'number') ? rings.vide : 2
    };
  }
  
  // Signaux pour les avantages/désavantages
  availableAdvantages = this.characterService.availableAdvantages;
  availableDisadvantages = this.characterService.availableDisadvantages;
  selectedAdvantages = this.characterService.selectedAdvantages;
  selectedDisadvantages = this.characterService.selectedDisadvantages;
  advantageCategories = this.characterService.advantageCategories;
  disadvantageCategories = this.characterService.disadvantageCategories;
  // Calcule le coût total des avantages sélectionnés
  get advantageXPCostValue(): number {
    const advantages = this.selectedAdvantages();
    if (!advantages || !Array.isArray(advantages)) return 0;
    return advantages.reduce((sum, adv: any) => sum + (adv.cost || 0), 0);
  }
  // Calcule le gain total des désavantages sélectionnés
  get disadvantageXPGainValue(): number {
    const disadvantages = this.selectedDisadvantages();
    if (!disadvantages || !Array.isArray(disadvantages)) return 0;
    return disadvantages.reduce((sum, dis: any) => sum + (dis.xpGain || 0), 0);
  }
  insightRank = this.characterService.insightRank;
  initiative = this.characterService.initiative;
  woundLevels = this.characterService.woundLevels;
  combatStats = this.characterService.combatStats;
  availableXP = this.characterService.availableExperiencePoints;

  // Signaux pour les sorts
  selectedSpells = this.characterService.selectedSpells;
  availableSpellsByElement = this.characterService.availableSpellsByElement;
  // Retourne les sorts filtrés selon le rang d'insight et règles d'école
  getAvailableSpellsForCharacter = (element: string) => this.characterService.getAvailableSpellsForCharacter(element);
  // Vérifie si le personnage peut apprendre/laner le sort
  canLearnSpell = (spellName: string) => this.characterService.canLearnSpell(spellName);
  canCastSpells = this.characterService.canCastSpells;
  get maxStartingSpellsValue() {
    // maxStartingSpells est un getter, pas une fonction
    const val = this.characterService.maxStartingSpells;
    if (typeof val === 'object' && val !== null && 'rank1' in val && 'rank2' in val) {
      return val;
    }
    // Si c'est un nombre ou autre, retourne un objet par défaut
    return { rank1: 0, rank2: 0 };
  }
  canAddMoreSpells = this.characterService.canAddMoreSpells;
  schoolAffinityDeficiency = this.characterService.schoolAffinityDeficiency;

  // Signaux pour l'équipement
  characterEquipment = this.characterService.characterEquipment;
  availableWeapons = this.characterService.availableWeapons;

  // Signaux pour les techniques et kata
  // getAvailableClanTechniques déjà déclaré, suppression du doublon
  availableKata = this.characterService.availableKata;
  isTechniqueSelected = this.characterService.isTechniqueSelected.bind(this.characterService);
  isKataSelected = this.characterService.isKataSelected.bind(this.characterService);
  canAddMoreTechniques = this.characterService.canAddMoreTechniques.bind(this.characterService);
  canAddMoreKata = this.characterService.canAddMoreKata.bind(this.characterService);
  
  // Signaux pour les techniques de clan/famille
  getAvailableClanTechniques = this.characterService.getAvailableClanTechniques.bind(this.characterService);
  getAvailableFamilyTechniques = this.characterService.getAvailableFamilyTechniques.bind(this.characterService);
  isClanTechniqueSelected = this.characterService.isClanTechniqueSelected.bind(this.characterService);
  
  // Méthode wrapper pour les Kiho par élément
  getKihoByElement(element: string) {
    return this.characterService.getKihoByElement(element as 'Air' | 'Terre' | 'Eau' | 'Feu' | 'Vide');
  }
  
  // Méthode wrapper pour le rang d'Insight
  getInsightRank = () => this.characterService.getInsightRank();
  
  // === MÉTHODES MAHO ===
  getAvailableMahoByRank = (maxRank: number) => this.characterService.getAvailableMahoByRank(maxRank);
  isMahoSelected = (spellName: string) => this.characterService.isMahoSelected(spellName);
  getSelectedMahoCount = () => this.characterService.getSelectedMahoCount();
  getSelectedMahoDetails = () => this.characterService.getSelectedMahoDetails();
  canAddMoreMahoSpells = () => this.characterService.canAddMoreMahoSpells();
  addMahoSpell(spellName: string) { this.characterService.addMahoSpell(spellName); }
  removeMahoSpell(spellName: string) { this.characterService.removeMahoSpell(spellName); }
  
  availableArmor = this.characterService.availableArmor;
  // Expose the computed signal directly to preserve Angular reactivity in templates
  availableItems = this.characterService.availableItems;
  
  // Computed signal pour gérer l'armure (Equipment | Equipment[] -> Equipment)
  currentArmor = computed(() => {
    const armor = this.characterEquipment().armor;
    if (!armor) return undefined;
    if (Array.isArray(armor)) {
      return armor.length > 0 ? armor[0] : undefined;
    }
    return armor;
  });
  
  // Équipement filtré pour l'achat (uniquement avec prix)
  get shopWeapons() {
    return this.availableWeapons().filter(w => w.cost);
  }
  
  get shopArmor() {
    return this.availableArmor().filter(a => a.cost && a.name !== 'Pas d\'armure');
  }

  // Type d'école sélectionnée pour le styling
  schoolType = computed(() => {
    const schoolName = this.character().school;
    if (!schoolName) return '';
    
    // Chercher dans toutes les écoles, pas seulement celles disponibles
    const school = SCHOOLS.find(s => s.name === schoolName);
    const type = school?.type || '';
    return type;
  });

  constructor() {
    // Initialiser les exposés réactifs après injection des services
    this.selectedSpellsObjects = this.characterService.selectedSpellsObjects;
    // Synchronise le thème avec le type d'école sélectionné
    effect(() => {
      const type = this.schoolType();
      // Mappe le type d'école vers le thème
  let theme: Theme = 'bushi';
  if (type === 'shugenja') theme = 'shugenja';
  else if (type === 'moine') theme = 'moine';
  else if (type === 'artisan') theme = 'marchand';
  else if (type === 'courtier') theme = 'courtisan';
  this.themeService.setTheme(theme);
    });
  }

  // Méthodes pour les étapes de création
  updateBasicInfo(field: string, value: string | number) {
    // Validation de l'âge minimum
    if (field === 'age' && typeof value === 'number' && value < 14) {
      value = 14;
    }
    this.characterService.updateBasicInfo({ [field]: value });
  }

  // Validation pour passer à l'étape suivante
  canGoToNextStep(): boolean {
    const char = this.character();
    const step = this.currentStep();
    
    if (step === 1) {
      // Étape 1: nom et genre obligatoires
      return !!(char.name && char.name.trim() !== '' && char.gender);
    }
    
    return true; // Autres étapes pas de validation spéciale
  }

  // Upload d'avatar
  onAvatarSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const avatarUrl = e.target?.result as string;
        this.characterService.updateBasicInfo({ avatar: avatarUrl });
      };
      
      reader.readAsDataURL(file);
    }
  }

  selectClan(clanName: string) {
    this.characterService.selectClan(clanName);
  }

  selectFamily(familyName: string) {
    this.characterService.selectFamily(familyName);
  }

  selectSchool(schoolName: string) {
    this.characterService.selectSchool(schoolName);
  }

  improveTrait(traitName: string) {
    this.characterService.improveTrait(traitName as keyof Traits);
  }

  improveVoidRing() {
    this.characterService.improveVoidRing();
  }

  improveSkill(skillName: string) {
    this.characterService.improveSkill(skillName);
  }

  // Méthodes pour diminuer les points
  decreaseTrait(traitName: string) {
    this.characterService.decreaseTrait(traitName as keyof Traits);
  }

  decreaseVoidRing() {
    this.characterService.decreaseVoidRing();
  }

  decreaseSkill(skillName: string) {
    this.characterService.decreaseSkill(skillName);
  }

  nextStep() {
    this.characterService.nextStep();
  }

  previousStep() {
    this.characterService.previousStep();
  }

  resetCharacter() {
    this.characterService.resetCharacter();
  }

  // Méthodes utilitaires
  getTraitCost(currentValue: number): number {
    return (currentValue + 1) * 4;
  }

  getVoidRingCost(currentValue: number): number {
    return (currentValue + 1) * 10;
  }

  getSkillCost(skill: Skill): number {
    return skill.isSchoolSkill ? (skill.rank + 1) * 1 : (skill.rank + 1) * 2;
  }

  canAfford(cost: number): boolean {
    return this.availableXP() >= cost;
  }

  isAtMaximum(value: number): boolean {
    return value >= 5; // Limite absolue de 5 à la création
  }

  // Calculer le prix de vente (100% pendant création, 50% après)
  getSellPrice(cost: string): number {
    const basePrice = parseInt(cost || '0');
    const isCreation = this.insightRank() === 1 && this.currentStep() < 7;
    return isCreation ? basePrice : Math.floor(basePrice / 2);
  }

  // Méthodes TrackBy pour les performances
  trackByClanName(index: number, clan: { name: string }): string {
    return clan.name;
  }

  trackByFamilyName(index: number, family: { name: string }): string {
    return family.name;
  }

  trackBySchoolName(index: number, school: { name: string }): string {
    return school.name;
  }

  // Méthodes pour les avantages/désavantages
  selectAdvantage(advantageId: string) {
    this.characterService.selectAdvantage(advantageId);
  }

  deselectAdvantage(advantageId: string) {
    this.characterService.deselectAdvantage(advantageId);
  }

  selectDisadvantage(disadvantageId: string) {
    this.characterService.selectDisadvantage(disadvantageId);
  }

  deselectDisadvantage(disadvantageId: string) {
    this.characterService.deselectDisadvantage(disadvantageId);
  }

  isAdvantageSelected(advantageId: string): boolean {
    return this.characterService.isAdvantageSelected(advantageId);
  }

  isDisadvantageSelected(disadvantageId: string): boolean {
    return this.characterService.isDisadvantageSelected(disadvantageId);
  }

  getAdvantagesByCategory(category: string) {
    return this.characterService.getAdvantagesByCategory(category);
  }

  getDisadvantagesByCategory(category: string) {
    return this.characterService.getDisadvantagesByCategory(category);
  }

  // Méthodes pour les sorts
  addSpell(spellName: string) {
    this.characterService.addSpell(spellName);
  }

  removeSpell(spellName: string) {
    this.characterService.removeSpell(spellName);
  }

  // Vérifier si un sort est déjà sélectionné
  isSpellSelected(spellName: string): boolean {
    const currentSpells = this.character().spells || [];
    return currentSpells.includes(spellName);
  }

  // Méthodes utilitaires supplémentaires
  getTraitNames(): string[] {
    return ['constitution', 'volonte', 'force', 'perception', 'reflexes', 'intuition', 'agilite', 'intelligence'];
  }

  getTraitValue(traitName: string): number {
  return (this.character().traits)?.[traitName as keyof Traits] || 2;
  }

  goToStep(step: number) {
    // Permet de naviguer directement vers une étape précédente
    if (step < this.currentStep()) {
      this.characterService.currentStep.set(step);
    }
  }

  saveToMyCharacters() {
    // Sauvegarder via le service (utilise la même logique que exportCharacter)
    const savedCharacter = this.characterService.saveCharacter();
    
    // Afficher un message de confirmation simple SANS redirection
    alert(`✅ ${savedCharacter.name || 'Votre personnage'} a été sauvegardé avec succès !`);
  }

  exportCharacter() {
    // Sauvegarder le personnage via le service (qui génère alliés/ennemis)
    const savedCharacter = this.characterService.saveCharacter();
    
    // Télécharger le JSON AVANT de montrer les messages
    const characterData = {
      ...savedCharacter,
      calculatedRings: this.calculatedRingsValue,
      insightRank: this.insightRank(),
      initiative: this.initiative(),
      woundLevels: this.woundLevels(),
      createdAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(characterData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${savedCharacter.name || 'personnage'}_L5A.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    // Message de confirmation APRES le téléchargement
    setTimeout(() => {
      const characterName = savedCharacter.name || 'votre personnage';
      const confirmMessage = `✅ ${characterName} a été sauvegardé avec succès !\n\nVoulez-vous retourner au menu principal ?`;
      
      if (confirm(confirmMessage)) {
        // L'utilisateur veut retourner au menu
        this.router.navigate(['/dashboard']);
      } else {
        // L'utilisateur veut rester ou aller voir ses personnages
        const goToCharacters = confirm(`Voulez-vous voir la liste de vos personnages ?`);
        if (goToCharacters) {
          this.router.navigate(['/characters']);
        }
        // Sinon, rester sur la page de création
      }
    }, 100);
  }

  // Méthode pour compter les sorts par rang
  getSpellCountByRank(rank: number): number {
  return (typeof this.selectedSpellsObjects === 'function' ? this.selectedSpellsObjects() : [])
    .filter((s: any) => s && s.mastery === rank).length;
  }

  // Méthode pour obtenir la description d'un trait
  getTraitDescription(traitName: string): string {
    return this.traitDescriptions[traitName.toLowerCase()] || traitName;
  }

  // === MÉTHODES D'ACHAT D'ÉQUIPEMENT ===
  
  buyEquipment(equipment: Equipment) {
  // Nécessite le type (weapon/armor/item) et le personnage courant
  const type = equipment.type as 'weapon' | 'armor' | 'item';
  // Cast explicite pour garantir le typage strict
  return this.characterService.buyEquipment(this.characterService.character() as Character, equipment.name, type);
  }
  
  sellEquipment(equipmentName: string, equipmentType: 'weapon' | 'armor' | 'item') {
    return this.characterService.sellEquipment(equipmentName, equipmentType);
  }
  
  canAffordEquipment(equipment: Equipment): boolean {
    return this.characterService.canAffordEquipment(equipment);
  }
  
  getAvailableMoney(): number {
    return this.characterService.getAvailableMoney();
  }

  // Helpers pour gérer armor qui peut être Equipment ou Equipment[]
  getArmorAsEquipment(): Equipment | undefined {
    const armor = this.characterEquipment().armor;
    if (!armor) return undefined;
    if (Array.isArray(armor)) {
      return armor.length > 0 ? armor[0] : undefined;
    }
    return armor;
  }

  // Méthodes pour les techniques et kata
  addTechnique(techniqueName: string) {
    this.characterService.addTechnique(techniqueName);
  }

  removeTechnique(techniqueName: string) {
    this.characterService.removeTechnique(techniqueName);
  }

  addKata(kataName: string) {
    this.characterService.addKata(kataName);
  }

  removeKata(kataName: string) {
    this.characterService.removeKata(kataName);
  }

  hasArmor(): boolean {
    const armor = this.getArmorAsEquipment();
    return !!armor && armor.name !== 'Pas d\'armure';
  }
}
