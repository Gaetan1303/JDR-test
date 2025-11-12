import { CharacterService } from './character.service';
import { SPELLS } from '../data/spells.data';
import { MAHO_SPELLS } from '../data/maho.data';
import { SCHOOLS } from '../data/schools.data';

// Local stubs for injected services (clean, non-conflicting names)
const spellServiceStub: any = {
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

const equipmentServiceStub: any = { canAffordEquipment: () => true, buyEquipment: () => ({ success: true }), sellEquipment: () => ({ success: true }) };
const techniqueServiceStub: any = { availableClanTechniques: () => [], availableKata: () => [] };
const storageServiceStub: any = { addCharacter: (c: any) => ({ ...c, id: 'gen' }), updateCharacter: (c: any) => c, getAllCharacters: () => [] };
const kihoServiceStub: any = { addKiho: () => ({ success: true }), canAddMoreKiho: () => true };

describe('CharacterService - spells & maho', () => {
  let service: CharacterService;

  beforeEach(() => {
    service = new CharacterService(spellServiceStub, equipmentServiceStub, kihoServiceStub, techniqueServiceStub, storageServiceStub);
    service.resetCharacter();
  });

  it('should allow adding starting spells up to school limits (rank1 and rank2)', () => {
    const school = SCHOOLS.find(s => (s as any).spellLimits) as any;
    expect(school).toBeTruthy();
    service.selectSchool(school.name);

    const limits: any = service.maxStartingSpells;
    expect(limits.rank1).toBeDefined();

    const rank1s = SPELLS.filter(s => s.mastery === 1).slice(0, limits.rank1 + 1).map(s => s.name);
    const rank2s = SPELLS.filter(s => s.mastery === 2).slice(0, Math.max(1, (limits.rank2 || 1) + 1)).map(s => s.name);

    // Add allowed number of rank1 spells
    for (let i = 0; i < limits.rank1; i++) {
      const res: any = service.addSpell(rank1s[i]);
      expect(res.success).toBeTrue();
    }

    // Attempt adding one more rank1 should fail due to per-rank limit
    if (rank1s[limits.rank1]) {
      const resExtra: any = service.addSpell(rank1s[limits.rank1]);
      expect(resExtra.success).toBeFalse();
    }

    // Add allowed rank2 spells
    const allowedRank2 = limits.rank2 || 0;
    for (let i = 0; i < allowedRank2; i++) {
      const res: any = service.addSpell(rank2s[i]);
      expect(res.success).toBeTrue();
    }

    if (rank2s[allowedRank2]) {
      const res2: any = service.addSpell(rank2s[allowedRank2]);
      expect(res2.success).toBeFalse();
    }

    const totalLimit = (limits.rank1 || 0) + (limits.rank2 || 0);
    expect((service.character().spells || []).length).toBeLessThanOrEqual(totalLimit);
  });

  it('should allow adding a high-taint Maho spell and then reject further additions if taint would exceed max', () => {
    const mahoSchool = SCHOOLS.find(s => (s as any).allowsMaho) as any;
    expect(mahoSchool).toBeTruthy();
    service.selectSchool(mahoSchool.name);

    const bigMaho = MAHO_SPELLS.find(s => (s as any).taintCost === 10) || MAHO_SPELLS.find(s => s.mastery === 5);
    expect(bigMaho).toBeTruthy();

    const res: any = service.addMahoSpell(bigMaho!.name);
    expect(res.success).toBeTrue();
    const taintAfter = service.character().taint || 0;
    const tcost = (bigMaho as any).taintCost || Math.round((bigMaho as any).mastery || 0);
    expect(taintAfter).toBe(tcost);

    const small = MAHO_SPELLS.find(s => (s as any).taintCost === 1) || MAHO_SPELLS[0];
    const res2: any = service.addMahoSpell(small!.name);
    expect(res2.success).toBeFalse();
  });

  it('should respect school mahoStartingCount via canAddMoreMahoSpells', () => {
    const mahoSchool = SCHOOLS.find(s => (s as any).allowsMaho) as any;
    expect(mahoSchool).toBeTruthy();
    service.selectSchool(mahoSchool.name);
    const limit = (mahoSchool as any).mahoStartingCount ?? null;
    expect(limit).toBeGreaterThanOrEqual(0);

    const available = MAHO_SPELLS.slice(0, Math.max(limit || 0, 3)).map(s => s.name);
    for (let i = 0; i < (limit || 0); i++) {
      const r: any = service.addMahoSpell(available[i]);
      expect(r.success).toBeTrue();
    }

    expect(service.canAddMoreMahoSpells()).toBeFalse();
  });

  it('should prevent learning spells above effective rank (rings/insight)', () => {
    service.resetCharacter();
    service.selectSchool('École de Shugenja Kuni');
    const highSpell = SPELLS.find(s => s.mastery >= 5);
    if (highSpell) expect(service.canLearnSpell(highSpell.name)).toBeFalse();
  });

  it('should allow adding and removing Maho when school allows and adjust taint', () => {
    service.selectSchool('École de Shugenja Daigotsu');
    expect(service.canUseMaho()).toBeTrue();

    const mahoName = MAHO_SPELLS[0].name;

    const addRes = service.addMahoSpell(mahoName);
    expect(addRes.success).toBeTrue();
    const taintAfter = service.character().taint;
    const expectedTaint = (MAHO_SPELLS[0] as any).taintCost || 1;
    expect(taintAfter).toBe(expectedTaint);

    const addAgain = service.addMahoSpell(mahoName);
    expect(addAgain.success).toBeFalse();

    const removeRes = service.removeMahoSpell(mahoName);
    expect(removeRes.success).toBeTrue();
    expect(service.character().taint).toBe(Math.max(0, taintAfter - expectedTaint));
  });

  it('should prevent adding a Maho that would exceed max taint', () => {
    service.selectSchool('École de Shugenja Daigotsu');
    service.loadCharacter({ ...service.character(), taint: 9 } as any);
    const heavyMaho = MAHO_SPELLS.find(s => (s as any).taintCost >= 2) || MAHO_SPELLS[0];
    const res = service.addMahoSpell(heavyMaho.name);
    if ((heavyMaho as any).taintCost >= 2) {
      expect(res.success).toBeFalse();
      expect((res as any).error).toContain('souillure');
    } else {
      expect(res).toBeDefined();
    }
  });
});
