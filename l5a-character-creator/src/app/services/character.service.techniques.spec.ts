import { CharacterService } from './character.service';

// Minimal stubs
const spellStub: any = {};
const equipmentStub: any = { canAffordEquipment: () => true };
const techniqueServiceStub: any = { availableClanTechniques: (clan: string) => ['Technique A'], availableKata: () => ['Kata A'] };
const storageStub: any = { addCharacter: (c: any) => ({ ...c, id: 'gen' }), updateCharacter: (c: any) => c, getAllCharacters: () => [] };
const kihoStub: any = { addKiho: () => ({ success: true }), canAddMoreKiho: () => true };

describe('CharacterService - techniques & kata', () => {
  let service: CharacterService;

  beforeEach(() => {
    service = new CharacterService(spellStub, equipmentStub, kihoStub, techniqueServiceStub, storageStub);
    service.resetCharacter();
  });

  it('should add and remove a technique', () => {
    expect(service.isTechniqueSelected('Technique A')).toBeFalse();
    service.addTechnique('Technique A');
    expect(service.isTechniqueSelected('Technique A')).toBeTrue();
    service.removeTechnique('Technique A');
    expect(service.isTechniqueSelected('Technique A')).toBeFalse();
  });

  it('should enforce technique limits via canAddMoreTechniques', () => {
    // initially can add
    expect(service.canAddMoreTechniques()).toBeTrue();
    service.addTechnique('T1');
    // canAddMoreTechniques allows only <1 in implementation
    expect(service.canAddMoreTechniques()).toBeFalse();
  });

  it('should add and remove kata and respect limits', () => {
    expect(service.canAddMoreKata()).toBeTrue();
    service.addKata('Kata A');
    expect(service.isKataSelected('Kata A')).toBeTrue();
    service.addKata('Kata B');
    expect(service.canAddMoreKata()).toBeFalse();
    service.removeKata('Kata A');
    expect(service.canAddMoreKata()).toBeTrue();
  });
});
