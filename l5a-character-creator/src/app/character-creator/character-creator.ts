import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  characterService = inject(CharacterService);
  
  // Expose Math pour le template
  Math = Math;
  parseInt = parseInt;
  
  // Signaux pour la réactivité
  character = this.characterService.character;
  currentStep = this.characterService.currentStep;
  availableClans = this.characterService.availableClans;
  availableFamilies = this.characterService.availableFamilies;
  availableSchools = this.characterService.availableSchoolsForClan;
  calculatedRings = this.characterService.calculatedRings;
  
  // Signaux pour les avantages/désavantages
  availableAdvantages = this.characterService.availableAdvantages;
  availableDisadvantages = this.characterService.availableDisadvantages;
  selectedAdvantages = this.characterService.selectedAdvantages;
  selectedDisadvantages = this.characterService.selectedDisadvantages;
  advantageCategories = this.characterService.advantageCategories;
  disadvantageCategories = this.characterService.disadvantageCategories;
  advantageXPCost = this.characterService.advantageXPCost;
  disadvantageXPGain = this.characterService.disadvantageXPGain;
  insightRank = this.characterService.insightRank;
  initiative = this.characterService.initiative;
  woundLevels = this.characterService.woundLevels;
  combatStats = this.characterService.combatStats;
  availableXP = this.characterService.availableExperiencePoints;

  // Signaux pour les sorts
  selectedSpells = this.characterService.selectedSpells;
  availableSpellsByElement = this.characterService.availableSpellsByElement;
  canCastSpells = this.characterService.canCastSpells;
  maxStartingSpells = this.characterService.maxStartingSpells;
  canAddMoreSpells = this.characterService.canAddMoreSpells;
  schoolAffinityDeficiency = this.characterService.schoolAffinityDeficiency;

  // Signaux pour l'équipement
  characterEquipment = this.characterService.characterEquipment;
  availableWeapons = this.characterService.availableWeapons;
  availableArmor = this.characterService.availableArmor;
  availableItems = this.characterService.availableItems;
  
  // Équipement filtré pour l'achat (uniquement avec prix)
  get shopWeapons() {
    return this.availableWeapons().filter(w => w.cost);
  }
  
  get shopArmor() {
    return this.availableArmor().filter(a => a.cost && a.name !== 'Pas d\'armure');
  }

  // Méthodes pour les étapes de création
  updateBasicInfo(field: string, value: any) {
    this.characterService.updateBasicInfo({ [field]: value });
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

  improveTrait(traitName: any) {
    this.characterService.improveTrait(traitName);
  }

  improveVoidRing() {
    this.characterService.improveVoidRing();
  }

  improveSkill(skillName: string) {
    this.characterService.improveSkill(skillName);
  }

  // Méthodes pour diminuer les points
  decreaseTrait(traitName: any) {
    this.characterService.decreaseTrait(traitName);
  }

  decreaseVoidRing() {
    this.characterService.decreaseVoidRing();
  }

  decreaseSkill(skillName: string) {
    this.characterService.decreaseSkill(skillName);
  }

  nextStep() {
    console.log('NextStep called, current step:', this.currentStep());
    this.characterService.nextStep();
    console.log('After nextStep, current step:', this.currentStep());
  }

  previousStep() {
    console.log('PreviousStep called, current step:', this.currentStep());
    this.characterService.previousStep();
    console.log('After previousStep, current step:', this.currentStep());
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

  getSkillCost(skill: any): number {
    return skill.isSchoolSkill ? (skill.rank + 1) * 1 : (skill.rank + 1) * 2;
  }

  canAfford(cost: number): boolean {
    return this.availableXP() >= cost;
  }

  isAtMaximum(value: number): boolean {
    return value >= 4;
  }

  // Méthodes TrackBy pour les performances
  trackByClanName(index: number, clan: any): string {
    return clan.name;
  }

  trackByFamilyName(index: number, family: any): string {
    return family.name;
  }

  trackBySchoolName(index: number, school: any): string {
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

  // Méthodes utilitaires supplémentaires
  getTraitNames(): string[] {
    return ['constitution', 'volonte', 'force', 'perception', 'reflexes', 'intuition', 'agilite', 'intelligence'];
  }

  getTraitValue(traitName: string): number {
    return (this.character().traits as any)?.[traitName] || 2;
  }

  goToStep(step: number) {
    // Permet de naviguer directement vers une étape précédente
    if (step < this.currentStep()) {
      this.characterService.currentStep.set(step);
    }
  }

  exportCharacter() {
    const characterData = {
      ...this.character(),
      calculatedRings: this.calculatedRings(),
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
    link.download = `${this.character().name || 'personnage'}_L5A.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  // === MÉTHODES D'ACHAT D'ÉQUIPEMENT ===
  
  buyEquipment(equipment: any) {
    return this.characterService.buyEquipment(equipment);
  }
  
  sellEquipment(equipmentName: string, equipmentType: 'weapon' | 'armor' | 'item') {
    return this.characterService.sellEquipment(equipmentName, equipmentType);
  }
  
  canAffordEquipment(equipment: any): boolean {
    return this.characterService.canAffordEquipment(equipment);
  }
  
  getAvailableMoney(): number {
    return this.characterService.getAvailableMoney();
  }
}
