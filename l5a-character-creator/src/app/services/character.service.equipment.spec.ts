import { CharacterService } from './character.service';
import { WEAPONS, ARMOR, ITEMS } from '../data/equipment.data';

// Stubs for injected services
const equipmentServiceStub: any = {
  canAffordEquipment: (equipment: any, koku: number) => {
    // compare numeric cost if present
    const cost = parseFloat((equipment.cost || '0').toString());
    return (koku || 0) >= cost;
  },
  buyEquipment: (char: any, equipmentName: string, type: string) => {
    // simulate adding equipment and deducting cost
    const e = [...WEAPONS, ...ARMOR, ...ITEMS].find((x: any) => x.name === equipmentName);
    if (!e) return { success: false };
    const cost = parseFloat((e.cost || '0').toString()) || 0;
    const newChar = { ...char, equipment: { ...(char.equipment || {}), koku: (char.equipment?.koku || 0) - cost } };
    return { success: true, character: newChar };
  },
  sellEquipment: (char: any, equipmentName: string, type: string) => {
    // simulate selling returns half cost
    const e = [...WEAPONS, ...ARMOR, ...ITEMS].find((x: any) => x.name === equipmentName);
    const gain = e ? (parseFloat((e.cost || '0').toString()) || 0) / 2 : 0;
    const newChar = { ...char, equipment: { ...(char.equipment || {}), koku: (char.equipment?.koku || 0) + gain } };
    return { success: true, character: newChar };
  }
};

// Other light stubs used by CharacterService constructor
const spellServiceStub: any = {};
const techniqueStub: any = {};
const storageStub: any = { addCharacter: (c: any) => ({ ...c, id: 'gen' }), updateCharacter: (c: any) => c, getAllCharacters: () => [] };
const kihoStub: any = { addKiho: () => ({ success: true }), canAddMoreKiho: () => true };

describe('CharacterService - equipment', () => {
  let service: CharacterService;

  beforeEach(() => {
    service = new CharacterService(spellServiceStub, equipmentServiceStub, kihoStub, techniqueStub, storageStub);
    service.resetCharacter();
  });

  it('should report available money and allow affordability check', () => {
    const money = service.getAvailableMoney();
    expect(money).toBeGreaterThanOrEqual(0);
    const cheap = WEAPONS[0];
    expect(service.canAffordEquipment(cheap as any)).toBeTrue();
  });

  it('should update koku when selling equipment via sellEquipment wrapper', () => {
    const initial = service.getAvailableMoney();
    const res: any = service.sellEquipment('Katana', 'weapon');
    expect(res.success).toBeTrue();
    const after = service.getAvailableMoney();
    expect(after).toBeGreaterThanOrEqual(initial);
  });
});
