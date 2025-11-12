import { CharacterService } from './character.service';
import { SPELLS } from '../data/spells.data';
import { MAHO_SPELLS } from '../data/maho.data';
import { SCHOOLS } from '../data/schools.data';

// Local stubs for injected services
const spellServiceStub2: any = {
  addSpell: (current: string[], name: string) => [...current, name],
  removeSpell: (current: string[], name: string) => current.filter(n => n !== name),
  addMahoSpell: (current: string[], name: string) => [...current, name],
  removeMahoSpell: (current: string[], name: string) => current.filter(n => n !== name),
  getSpellCountByRank: (current: string[], rank: number) => current.filter(n => {
    const s = MAHO_SPELLS.find(sp => sp.name === n) || SPELLS.find(sp => sp.name === n);
    return s?.mastery === rank;
  }).length,
  getAvailableSpells: (element: string) => SPELLS.filter(s => s.element === element),
  getAvailableMahoByRank: (maxRank: number) => MAHO_SPELLS.filter(s => s.mastery <= maxRank),
  isMahoSelected: (current: string[], name: string) => current.includes(name),
  getSelectedMahoCount: (current: string[]) => current.length,
  getSelectedMahoObjects: (current: string[]) => current.map(n => MAHO_SPELLS.find(s => s.name === n)).filter(Boolean)
};

const equipmentServiceStub2: any = { canAffordEquipment: () => true, buyEquipment: () => ({ success: true }), sellEquipment: () => ({ success: true }) };
const techniqueServiceStub2: any = { availableClanTechniques: () => [], availableKata: () => [] };
const storageServiceStub2: any = { addCharacter: (c: any) => ({ ...c, id: 'gen' }), updateCharacter: (c: any) => c, getAllCharacters: () => [] };
const kihoServiceStub2: any = { addKiho: () => ({ success: true }), canAddMoreKiho: () => true };

describe('CharacterService - spells & maho (extra)', () => {
  let service: CharacterService;

  beforeEach(() => {
    service = new CharacterService(spellServiceStub2, equipmentServiceStub2, kihoServiceStub2, techniqueServiceStub2, storageServiceStub2);
    service.resetCharacter();
  });

  it('prevents learning mastery 5 spells when rings/insight are low', () => {
    service.selectSchool('École de Shugenja Kuni');
    const highSpell = SPELLS.find(s => s.mastery >= 5);
    if (highSpell) expect(service.canLearnSpell(highSpell.name)).toBeFalse();
  });

  it('adds and removes maho while updating taint correctly', () => {
    service.selectSchool('École de Shugenja Daigotsu');
    expect(service.canUseMaho()).toBeTrue();
    const mahoName = MAHO_SPELLS[0].name;
    const add = service.addMahoSpell(mahoName);
    expect(add.success).toBeTrue();
    const taint1 = service.character().taint || 0;
    const cost = (MAHO_SPELLS[0] as any).taintCost || 1;
    expect(taint1).toBe(cost);

    const addAgain = service.addMahoSpell(mahoName);
    expect(addAgain.success).toBeFalse();

    const rem = service.removeMahoSpell(mahoName);
    expect(rem.success).toBeTrue();
    expect(service.character().taint).toBe(Math.max(0, taint1 - cost));
  });
});
