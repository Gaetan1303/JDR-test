import { TestBed } from '@angular/core/testing';
import { CharacterService } from './character.service';
import { MAHO_SPELLS } from '../data/maho.data';
import { SPELLS } from '../data/spells.data';

// Minimal stubs for dependent services
const spellServiceStub: any = {
  addMahoSpell: (current: string[], name: string) => [...current, name],
  removeMahoSpell: (current: string[], name: string) => current.filter(n => n !== name),
  getSpellCountByRank: (current: string[], rank: number) => {
    return current.filter(n => {
      const s = MAHO_SPELLS.find(sp => sp.name === n) || SPELLS.find(sp => sp.name === n);
      return s?.mastery === rank;
    }).length;
  }
};
const equipmentServiceStub: any = {};
const techniqueServiceStub: any = {};
const storageServiceStub: any = {
  addCharacter: (c: any) => ({ ...c, id: 'generated' }),
  updateCharacter: (c: any) => c,
  getAllCharacters: () => []
};

const kihoServiceStub: any = {
  addKiho: (name: string, current: string[], school: string | undefined, insightRank: number, maxKihoParam?: number) => {
    const max = typeof maxKihoParam === 'number' && maxKihoParam > 0 ? maxKihoParam : 3;
    if (current.length >= max) return { success: false, error: `Limite de Kiho atteinte (${max} maximum)` };
    return { success: true };
  },
  canAddMoreKiho: (current: string[], maxKiho?: number) => {
    const max = typeof maxKiho === 'number' && maxKiho > 0 ? maxKiho : 3;
    return current.length < max;
  },
  getKihoDetails: (n: string) => undefined,
  getSelectedKihoCount: (arr: string[]) => arr.length,
  isMonk: (s: string | undefined) => !!(s && s.toLowerCase().includes('moine'))
};

describe('CharacterService (rules tests)', () => {
  let service: CharacterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CharacterService,
        { provide: (window as any).SpellService, useValue: spellServiceStub },
      ]
    });
    // Provide by manual instantiation so we can inject our stubs easily
    service = new CharacterService(
      spellServiceStub,
      equipmentServiceStub,
      kihoServiceStub,
      techniqueServiceStub,
      storageServiceStub
    );
  });

  it('should upgrade void rank and spend XP (upgradeVoid)', () => {
    // initial XP 40, spent 0
  // ensure starting XP is enough
  expect(service.character().experiencePoints).toBeGreaterThanOrEqual(12);

  const success = service.upgradeVoid(3);
  expect(success).toBeTrue();
  expect(service.character().voidRank).toBe(3);
  expect(service.character().spentExperiencePoints).toBe(3 * 4);
  });

  it('should add a Maho spell and increment taint by taintCost', () => {
    // Allow Maho by setting the maho-tsukai disadvantage manually
  service.character.update(c => ({ ...c, disadvantages: [{ id: 'maho-tsukai', name: 'Maho', xpGain: 0, description: '', category: 'Spirituel' }] }));
  const spell = MAHO_SPELLS[0];
  const beforeTaint = service.character().taint || 0;
  const res = service.addMahoSpell(spell.name);
  expect(res.success).toBeTrue();
  const afterTaint = service.character().taint || 0;
  expect(afterTaint).toBe(beforeTaint + (spell as any).taintCost);
  });

  it('should prevent adding Kiho beyond voidRank limit', () => {
    // set voidRank to 2 and current kiho length to 2
  service.character.update(c => ({ ...c, voidRank: 2, kiho: ['k1', 'k2'], school: 'École de Moine' }));
    // attempt to add another kiho
    const res = service.addKiho('Some Kiho');
    // Our kihoServiceStub will check current length >= max and return failure
    expect(res.success).toBeFalse();
  });
});
