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
import { MatIconModule } from '@angular/material/icon';
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
    MatIconModule,
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
  
  // Signaux pour la réactivité
  character = this.characterService.character;
  currentStep = this.characterService.currentStep;
  availableClans = this.characterService.availableClans;
  availableFamilies = this.characterService.availableFamilies;
  availableSchools = this.characterService.availableSchoolsForClan;
  calculatedRings = this.characterService.calculatedRings;
  insightRank = this.characterService.insightRank;
  initiative = this.characterService.initiative;
  woundLevels = this.characterService.woundLevels;
  combatStats = this.characterService.combatStats;
  availableXP = this.characterService.availableExperiencePoints;

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
}
