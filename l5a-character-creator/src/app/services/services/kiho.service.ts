import { Injectable } from '@angular/core';
import { KIHO } from '../../data/kiho.data';
import { Kiho } from '../../models/character.model';

@Injectable({ providedIn: 'root' })
export class KihoService {
  getAllKiho(): Kiho[] {
    return KIHO;
  }

  getKihoByElement(element: 'Air' | 'Terre' | 'Eau' | 'Feu' | 'Vide'): Kiho[] {
    return KIHO.filter((k: Kiho) => k.element === element);
  }

  getKihoByType(type: 'Interne' | 'Martial' | 'Mystique'): Kiho[] {
    return KIHO.filter((k: Kiho) => k.type === type);
  }

  getAvailableKihoByRank(insightRank: number): Kiho[] {
    return KIHO.filter((k: Kiho) => k.mastery <= insightRank);
  }

  getAvailableKihoByElementAndRank(element: 'Air' | 'Terre' | 'Eau' | 'Feu' | 'Vide', insightRank: number): Kiho[] {
    return KIHO.filter((k: Kiho) => k.element === element && k.mastery <= insightRank);
  }

  addKiho(kihoName: string, currentKiho: string[], school: string | undefined, insightRank: number): { success: boolean; error?: string } {
    if (currentKiho.includes(kihoName)) {
      return { success: false, error: 'Kiho déjà sélectionné' };
    }
    const maxKiho = 3;
    if (currentKiho.length >= maxKiho) {
      return { success: false, error: `Limite de Kiho atteinte (${maxKiho} maximum au rang 1)` };
    }
    if (!school || !school.toLowerCase().includes('moine')) {
      return { success: false, error: 'Seuls les moines peuvent apprendre des Kiho' };
    }
    const kiho = KIHO.find((k: Kiho) => k.name === kihoName);
    if (!kiho) {
      return { success: false, error: 'Kiho non trouvé' };
    }
    if (kiho.mastery > insightRank) {
      return { success: false, error: `Rang d'Insight insuffisant pour ${kihoName} (requis: ${kiho.mastery}, actuel: ${insightRank})` };
    }
    return { success: true };
  }

  removeKiho(kihoName: string, currentKiho: string[]): string[] {
    return currentKiho.filter((name: string) => name !== kihoName);
  }

  isKihoSelected(kihoName: string, currentKiho: string[]): boolean {
    return currentKiho.includes(kihoName);
  }

  getSelectedKihoCount(currentKiho: string[]): number {
    return currentKiho.length;
  }

  getKihoDetails(kihoName: string): Kiho | undefined {
    return KIHO.find((k: Kiho) => k.name === kihoName);
  }

  getSelectedKihoDetails(selectedKihoNames: string[]): Kiho[] {
    return selectedKihoNames
      .map((name: string) => KIHO.find((k: Kiho) => k.name === name))
      .filter((k: Kiho | undefined): k is Kiho => k !== undefined) as Kiho[];
  }

  canAddMoreKiho(currentKiho: string[]): boolean {
    return currentKiho.length < 3;
  }

  getMaxKiho(): number {
    return 3;
  }

  isMonk(school: string | undefined): boolean {
    return school ? school.toLowerCase().includes('moine') : false;
  }
}
