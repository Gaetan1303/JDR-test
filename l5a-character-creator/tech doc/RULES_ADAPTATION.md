Règles adaptées — Maho, Kiho, Sorts, XP

But
----
Expliquer quelles règles de L5R ont été approximées et où les tolérances se trouvent dans le code.

1 — Maho (souillure)
--------------------
- Implémentation actuelle : chaque sort de Maho augmente la `taint` du personnage d'une valeur dérivée de `spell.mastery` (arrondi, min 1). Le seuil maximal global est codé par `MAX_TAINT = 10` dans `CharacterService`.
- Limitation connue : le vrai livre de règles donne souvent un coût de souillure spécifique par sort; le code devrait idéalement contenir un champ `taint?: number` dans `maho.data.ts` pour refléter la valeur exacte de chaque sort.
- Suggestion : ajouter `taint` aux entrées `MAHO_SPELLS` et utiliser cette valeur au lieu de `mastery`.

2 — Kiho (apprentissage & limite)
---------------------------------
- Implémentation actuelle : `KihoService.addKiho()` vérifie que le personnage est d'une école de moine (simple heuristique `school.name.toLowerCase().includes('moine')`) et que son rang d'insight est suffisant; il impose une limite fixe (3) pour l'exemple.
- Limitation : règles précises par école/technique peuvent être plus fines (achetables via XP, prérequis, etc.). Adapter si nécessaire.

3 — Sorts (Insight/maîtrise) et école
-------------------------------------
- Implémentation actuelle : un sort est accessible si `spell.mastery <= character.insightRank()` (ou si `spell.universal === true`).
- Remarque : les écoles avec `spellLimits` ou `allowsMaho` sont prises en compte dans `CharacterService.canCastSpells()`.

4 — XP et dépenses
-------------------
- Implémentation : `experiencePoints` représente le total reçu, `spentExperiencePoints` est mis à jour à chaque opération d'amélioration (traits, compétences, anneau du vide, avantages/désavantages). `CharacterService.availableExperiencePoints` est un computed.
- Remarque : cette logique est centralisée; vérifie les formules de coût si tu veux respecter exactement les règles papier.

5 — Sauvegarde des personnages
------------------------------
- `CharacterStorageService.addCharacter()` génère un ID local (timestamp) et persiste en `localStorage`.
- `CharacterService.saveCharacter()` met à jour le signal local avec l'objet renvoyé par `addCharacter()` afin que l'interface conserve l'ID et l'état.

6 — Recommandations pour précision
----------------------------------
- Ajouter champs explicites dans les données : `taint` (maho), `insightCost` (kiho), `xpCost` (améliorations) pour éviter d'encoder des approximations dans la logique métier.
- Ajouter une petite suite de tests unitaires pour `CharacterService` (ajout/suppression de sorts maho, calcul XP, limitations de kiho) et exécuter en CI.

---

Relis ces approximations après test de jeu avec un maître pour valider les valeurs numériques (souillure et coûts).