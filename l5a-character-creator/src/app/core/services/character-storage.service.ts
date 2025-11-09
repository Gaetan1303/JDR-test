import { Injectable } from '@angular/core';
import { Character } from '../../models/character.model';

@Injectable({ providedIn: 'root' })
export class CharacterStorageService {
  /**
   * Récupère tous les personnages sauvegardés depuis localStorage avec validation
   */
  getAllCharactersValidated(): { success: boolean; error?: string; data: Character[] } {
    const saved = localStorage.getItem('myCharacters');
    if (!saved) return { success: true, data: [] };
    try {
      const arr = JSON.parse(saved);
      if (!Array.isArray(arr)) return { success: false, error: 'Format non valide', data: [] };
      // Validation manuelle minimale (id, name, clan, traits, skills)
      const valid = arr.filter((c: any) =>
        c && typeof c.id === 'string' && typeof c.name === 'string' && typeof c.clan === 'string' &&
        c.traits && typeof c.traits === 'object' && Array.isArray(c.skills)
      );
      if (valid.length !== arr.length) {
        return { success: false, error: 'Certains personnages sont corrompus ou incomplets', data: valid };
      }
      return { success: true, data: valid };
    } catch (error) {
      return { success: false, error: 'Erreur de parsing JSON', data: [] };
    }
  }

  /**
   * Récupère tous les personnages sauvegardés (sans validation)
   */
  getAllCharacters(): Character[] {
    const res = this.getAllCharactersValidated();
    return res.data;
  }

  /**
   * Met à jour un personnage existant dans localStorage
   */
  updateCharacter(character: Character): void {
    if (!character.id) {
      console.error('Impossible de mettre à jour un personnage sans ID');
      return;
    }
    const characters = this.getAllCharacters();
    const index = characters.findIndex(c => c.id === character.id);
    if (index >= 0) {
      characters[index] = character;
      localStorage.setItem('myCharacters', JSON.stringify(characters));
      // Log supprimé: personnage mis à jour
    } else {
      console.error('[CharacterStorageService] Personnage non trouvé pour mise à jour:', character.id);
    }
  }
}
