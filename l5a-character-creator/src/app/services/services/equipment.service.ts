import { Injectable } from '@angular/core';
import { WEAPONS, ARMOR, ITEMS } from '../../data/equipment.data';
import { Equipment, Character } from '../../models/character.model';

@Injectable({ providedIn: 'root' })
export class EquipmentService {
  /**
   * Vérifie si le personnage peut acheter un équipement
   */
  canAffordEquipment(equipment: Equipment, koku: number): boolean {
    const cost = parseInt(equipment.cost || '0');
    return !isNaN(cost) && koku >= cost;
  }

  /**
   * Ajoute un équipement (arme, armure, item) au personnage
   */
  addEquipment(character: Character, equipment: Equipment, type: 'weapon' | 'armor' | 'item'): Character {
    const updated = { ...character };
    if (!updated.equipment) return updated;
    if (type === 'weapon') {
      updated.equipment.weapons = [...(updated.equipment.weapons || []), equipment];
    } else if (type === 'armor') {
      updated.equipment.armor = equipment;
    } else {
      updated.equipment.items = [...(updated.equipment.items || []), equipment];
    }
    return updated;
  }

  /**
   * Retire un équipement (arme, armure, item) du personnage
   */
  removeEquipment(character: Character, equipmentName: string, type: 'weapon' | 'armor' | 'item'): Character {
    const updated = { ...character };
    if (!updated.equipment) return updated;
    if (type === 'weapon') {
      updated.equipment.weapons = (updated.equipment.weapons || []).filter((w: Equipment) => w.name !== equipmentName);
    } else if (type === 'armor') {
      updated.equipment.armor = ARMOR[0];
    } else {
      updated.equipment.items = (updated.equipment.items || []).filter((i: Equipment) => i.name !== equipmentName);
    }
    return updated;
  }

  /**
   * Achète un équipement (décrémente le koku)
   */
  buyEquipment(character: Character, equipment: Equipment, type: 'weapon' | 'armor' | 'item'): { success: boolean; character?: Character; error?: string } {
    if (!this.canAffordEquipment(equipment, character.equipment?.koku || 0)) {
      return { success: false, error: 'Fonds insuffisants' };
    }
    const cost = parseInt(equipment.cost || '0');
    if (isNaN(cost)) return { success: false, error: 'Prix invalide' };
    const updated = this.addEquipment(character, equipment, type);
    updated.equipment!.koku -= cost;
    return { success: true, character: updated };
  }

  /**
   * Vend un équipement (incrémente le koku)
   */
  sellEquipment(character: Character, equipmentName: string, type: 'weapon' | 'armor' | 'item'): { success: boolean; character?: Character; error?: string } {
    let equipment: Equipment | undefined;
    if (!character.equipment) return { success: false, error: 'Aucun équipement' };
    if (type === 'weapon') {
      equipment = (character.equipment.weapons || []).find((w: Equipment) => w.name === equipmentName);
    } else if (type === 'armor') {
      equipment = character.equipment.armor && !Array.isArray(character.equipment.armor) && character.equipment.armor.name === equipmentName ? character.equipment.armor : undefined;
    } else {
      equipment = (character.equipment.items || []).find((i: Equipment) => i.name === equipmentName);
    }
    if (!equipment) return { success: false, error: 'Équipement non trouvé' };
    const rawCost = parseInt(equipment.cost || '0');
    if (isNaN(rawCost)) return { success: false, error: 'Prix de l\'équipement invalide' };
    const sellPrice = Math.floor(rawCost / 2);
    const updated = this.removeEquipment(character, equipmentName, type);
    updated.equipment!.koku += sellPrice;
    return { success: true, character: updated };
  }
}
