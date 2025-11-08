import { Injectable } from '@angular/core';
import { CLAN_TECHNIQUES, KATA } from '../../data/techniques-kata.data';
import { CLAN_TECHNIQUES as CLAN_FAMILY_TECHNIQUES } from '../../data/clan-techniques.data';
import { ClanTechnique as ClanFamilyTechnique } from '../../data/clan-techniques.data';
import { ClanTechnique as TechniqueKata } from '../../data/techniques-kata.data';
// TechniqueKata n'existe pas dans character.model.ts, il faut l'importer de techniques-kata.data
// Il n'y a pas de TechniqueKata, utiliser ClanTechnique pour les deux (techniques et kata)
// import { TechniqueKata } from '../../data/techniques-kata.data';

@Injectable({ providedIn: 'root' })
export class TechniqueService {
  availableClanTechniques(clan: string): TechniqueKata[] {
    if (!clan) return [];
    return CLAN_TECHNIQUES.filter((t: TechniqueKata) => t.clan === clan || t.clan === 'Universel');
  }

  availableKata(): TechniqueKata[] {
    return KATA;
  }

  addTechnique(currentTechniques: string[], techniqueName: string): string[] {
    if (currentTechniques.includes(techniqueName)) return currentTechniques;
    return [...currentTechniques, techniqueName];
  }

  removeTechnique(currentTechniques: string[], techniqueName: string): string[] {
    return currentTechniques.filter((name: string) => name !== techniqueName);
  }

  addKata(currentKata: string[], kataName: string): string[] {
    if (currentKata.includes(kataName)) return currentKata;
    return [...currentKata, kataName];
  }

  removeKata(currentKata: string[], kataName: string): string[] {
    return currentKata.filter((name: string) => name !== kataName);
  }

  isTechniqueSelected(currentTechniques: string[], techniqueName: string): boolean {
    return currentTechniques.includes(techniqueName);
  }

  isKataSelected(currentKata: string[], kataName: string): boolean {
    return currentKata.includes(kataName);
  }

  canAddMoreTechniques(currentTechniques: string[]): boolean {
    return currentTechniques.length < 1;
  }

  canAddMoreKata(currentKata: string[]): boolean {
    return currentKata.length < 2;
  }

  // --- Méthodes techniques de clan/famille ---
  getAllClanFamilyTechniques(): ClanFamilyTechnique[] {
    return CLAN_FAMILY_TECHNIQUES;
  }

  getAvailableClanTechniques(clan: string): ClanFamilyTechnique[] {
    if (!clan) return [];
    return CLAN_FAMILY_TECHNIQUES.filter((t: ClanFamilyTechnique) => t.clan === clan && t.type === 'clan');
  }

  getAvailableFamilyTechniques(family: string): ClanFamilyTechnique[] {
    if (!family) return [];
    return CLAN_FAMILY_TECHNIQUES.filter((t: ClanFamilyTechnique) => t.family === family && t.type === 'famille');
  }

  addClanTechnique(currentTechniques: string[], techniqueName: string): string[] {
    if (currentTechniques.includes(techniqueName)) return currentTechniques;
    return [...currentTechniques, techniqueName];
  }

  removeClanTechnique(currentTechniques: string[], techniqueName: string): string[] {
    return currentTechniques.filter((name: string) => name !== techniqueName);
  }

  isClanTechniqueSelected(currentTechniques: string[], techniqueName: string): boolean {
    return currentTechniques.includes(techniqueName);
  }

  getSelectedClanTechniquesCount(currentTechniques: string[]): number {
    return currentTechniques.length;
  }

  getClanTechniqueDetails(techniqueName: string): ClanFamilyTechnique | undefined {
    return CLAN_FAMILY_TECHNIQUES.find((t: ClanFamilyTechnique) => t.name === techniqueName);
  }

  getSelectedClanTechniquesDetails(selectedNames: string[]): ClanFamilyTechnique[] {
    return selectedNames
      .map((name: string) => this.getClanTechniqueDetails(name))
      .filter((t): t is ClanFamilyTechnique => t !== undefined);
  }
}
