import { CharacterService } from './character.service';
import { MAHO_SPELLS } from '../data/maho.data';
import { SPELLS } from '../data/spells.data';
import { SCHOOLS } from '../data/schools.data';

// Stubs minimalistes pour les services dépendants
const spellServiceStub: any = {
  addSpell: (current: string[], name: string) => [...current, name],
  removeSpell: (current: string[], name: string) => current.filter(n => n !== name),
  addMahoSpell: (current: string[], name: string) => [...current, name],
  removeMahoSpell: (current: string[], name: string) => current.filter(n => n !== name),
  getSpellCountByRank: (current: string[], rank: number) => current.filter(n => {
    const s = MAHO_SPELLS.find(sp => sp.name === n) || SPELLS.find(sp => sp.name === n);
    return s?.mastery === rank;
  }).length,
  getAvailableSpells: (element: string) => SPELLS.filter(s => s.element === element)
};

const equipmentServiceStub: any = {
  canAffordEquipment: () => true,
  buyEquipment: (char: any, equipment: any, type: any) => ({ success: true, character: char }),
  sellEquipment: (char: any, name: string, type: any) => ({ success: true, character: char })
};

const techniqueServiceStub: any = {
  availableClanTechniques: () => [],
  availableKata: () => []
};

const storageServiceStub: any = {
  addCharacter: jasmine.createSpy('addCharacter').and.callFake((c: any) => ({ ...c, id: 'generated' })),
  updateCharacter: jasmine.createSpy('updateCharacter').and.callFake((c: any) => c),
  getAllCharacters: () => []
};

const kihoServiceStub: any = {
  addKiho: (name: string, current: string[], school: string | undefined, insightRank: number, maxKihoParam?: number) => ({ success: true }),
  canAddMoreKiho: () => true,
  getKihoDetails: () => undefined,
  getSelectedKihoCount: (arr: string[]) => arr.length,
  isMonk: (s: string | undefined) => !!(s && s.toLowerCase().includes('moine'))
};

describe('CharacterService - creation flows', () => {
  let service: CharacterService;

  beforeEach(() => {
    service = new CharacterService(
      spellServiceStub,
      equipmentServiceStub,
      kihoServiceStub,
      techniqueServiceStub,
      storageServiceStub
    );
    // Reset character to known state
    service.resetCharacter();
  });

  it('should apply family trait bonus when selecting a family', () => {
    // Select clan then family
    service.selectClan('Clan du Crabe');
    const before = service.character().traits.constitution;
    expect(before).toBe(2);
    service.selectFamily('Hida');
    const after = service.character().traits.constitution;
    expect(after).toBe(before + 1);
  });

  it('should apply school trait bonus and add school skills', () => {
    // Choose a known school with skill list
    const school = SCHOOLS.find(s => s.name === 'École de Bushi Kakita');
    expect(school).toBeTruthy();
    const bonusTrait = (school as any).traitBonus;
  const before = (service.character().traits as any)[bonusTrait];
    service.selectSchool(school!.name);
  const after = (service.character().traits as any)[bonusTrait];
    expect(after).toBe(before + 1);
    // Check school skill added
    const hasIaijutsu = (service.character().skills || []).some(s => s.name === 'Iaijutsu' && s.isSchoolSkill);
    expect(hasIaijutsu).toBeTrue();
  });

  it('should spend XP when improving a trait and refund when decreasing', () => {
    const beforeXP = service.character().spentExperiencePoints || 0;
    const beforeTrait = service.character().traits.constitution;
    service.improveTrait('constitution');
    const afterTrait = service.character().traits.constitution;
    expect(afterTrait).toBe(beforeTrait + 1);
    const expectedCost = (beforeTrait + 1) * 4;
    expect(service.character().spentExperiencePoints).toBe(beforeXP + expectedCost);

    // Now decrease and expect refund
    service.decreaseTrait('constitution');
    expect(service.character().traits.constitution).toBe(beforeTrait);
    expect(service.character().spentExperiencePoints).toBe(Math.max(0, (beforeXP + expectedCost) - ((beforeTrait + 1) * 4)));
  });

  it('should save character and return generated id via storage service', () => {
    const char = service.character();
    char.name = 'Test Hero';
    // Ensure no id initially
    expect(char.id).toBeUndefined();
    const saved = service.saveCharacter();
    expect(saved.id).toBeDefined();
    expect(storageServiceStub.addCharacter).toHaveBeenCalled();
  });
});
