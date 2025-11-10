Création de personnage — séquence de sauvegarde & comportements UI

1 — Séquence de création
------------------------
- Le wizard `CharacterCreator` expose plusieurs étapes (traits, compétences, anneau du vide, avantages/désavantages, sorts/maho/kiho, récapitulatif).
- Chaque action modifie la `CharacterService.character` (WritableSignal). `CharacterService` tient à jour :
  - `experiencePoints` (total)
  - `spentExperiencePoints` (total dépensé)
  - `mahoSpells` et `taint`
  - `kiho` (liste)
  - `selectedSpellsObjects` (objets complets des sorts)

2 — Sauvegarde finale
---------------------
- `CharacterService.saveCharacter()` :
  - Si `character.id` existe → `CharacterStorageService.updateCharacter()`
  - Sinon → `CharacterStorageService.addCharacter()` et mise à jour du signal avec l'objet renvoyé (conserve l'ID)
- Après sauvegarde, le wizard ne doit pas reset la page ; vérifie que le signal a bien l'ID et que le router/flux n'appelle pas `reset()` ailleurs.

3 — Restauration (édition)
---------------------------
- La page d'édition charge un personnage via `CharacterStorageService.getCharacter(id)` et `CharacterService.setCharacter(loaded)`.
- Les composants doivent se baser sur `characterService.character` (signal) pour garantir que l'UI reste synchronisée.

4 — Erreurs fréquentes et diagnostics
------------------------------------
- Symptom: l'app revient à la première étape après sauvegarde
  - Cause probable: `saveCharacter()` n'a pas mis à jour l'objet avec l'ID (création) et le code de navigation détecte un "nouveau personnage". Solution: vérifier `addCharacter()` et s'assurer que le signal est mis à jour après l'appel réseau/local.
- Symptom: les sorts/techniques ne s'affichent
  - Cause probable: mismatch de noms (ex: "Crabe" vs "Clan du Crabe") — utiliser `TechniqueService.normalizeName()`.

---

Ce document est un guide rapide pour QA/QA playtests et debugging lors de la phase de création de personnage.