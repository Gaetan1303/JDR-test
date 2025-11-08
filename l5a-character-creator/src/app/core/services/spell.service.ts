import { Injectable, computed, signal, effect } from '@angular/core';
import { SPELLS } from '../../data/spells.data';
import { MAHO_SPELLS } from '../../data/maho.data';
import { SCHOOLS } from '../../data/schools.data';
import { Spell } from '../../models/character.model';

@Injectable({ providedIn: 'root' })
export class SpellService {
  /**
   * Retourne la liste des sorts disponibles pour un élément donné
   */
  getAvailableSpells(element: string) {
    return SPELLS.filter(s => s.element === element);
  }

  /**
   * Retourne la liste des sorts Maho disponibles jusqu'à un certain rang
   */
  getAvailableMahoByRank(maxRank: number) {
    return MAHO_SPELLS.filter(s => s.mastery <= maxRank);
  }

  /**
   * Ajoute un sort à la liste des sorts connus du personnage
   */
  addSpell(currentSpells: string[], spellName: string): string[] {
    if (currentSpells.includes(spellName)) return currentSpells;
    return [...currentSpells, spellName];
  }

  /**
   * Retire un sort de la liste des sorts connus du personnage
   */
  removeSpell(currentSpells: string[], spellName: string): string[] {
    return currentSpells.filter(s => s !== spellName);
  }

  /**
   * Ajoute un sort Maho à la liste des sorts Maho connus du personnage
   */
  addMahoSpell(currentMaho: string[], spellName: string): string[] {
    if (currentMaho.includes(spellName)) return currentMaho;
    return [...currentMaho, spellName];
  }

  /**
   * Retire un sort Maho de la liste des sorts Maho connus du personnage
   */
  removeMahoSpell(currentMaho: string[], spellName: string): string[] {
    return currentMaho.filter(s => s !== spellName);
  }

  /**
   * Vérifie si un sort est déjà sélectionné
   */
  isSpellSelected(currentSpells: string[], spellName: string): boolean {
    return currentSpells.includes(spellName);
  }

  /**
   * Vérifie si un sort Maho est déjà sélectionné
   */
  isMahoSelected(currentMaho: string[], spellName: string): boolean {
    return currentMaho.includes(spellName);
  }

  /**
   * Retourne le nombre de sorts sélectionnés par rang
   */
  getSpellCountByRank(spells: string[], rank: number): number {
    return SPELLS.filter(s => spells.includes(s.name) && s.mastery === rank).length;
  }

  /**
   * Retourne le nombre de sorts Maho sélectionnés
   */
  getSelectedMahoCount(mahoSpells: string[]): number {
    return mahoSpells.length;
  }

  /**
   * Retourne les objets sorts sélectionnés
   */
  getSelectedSpellsObjects(spells: string[]): Spell[] {
    return spells.map(name => SPELLS.find(s => s.name === name)).filter(Boolean) as Spell[];
  }

  /**
   * Retourne les objets sorts Maho sélectionnés
   */
  getSelectedMahoObjects(mahoSpells: string[]): Spell[] {
    return mahoSpells.map(name => MAHO_SPELLS.find(s => s.name === name)).filter(Boolean) as Spell[];
  }
}
