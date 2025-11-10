ARCHITECTURE — l5a-character-creator (adaptée)

But
----
Documenter l'architecture générale de l'application Angular + services, expliquer le rôle des principaux services et la cartographie entre concepts du jeu (sorts, kiho, techniques, maho) et composants/services.

1 — Aperçu global
------------------
- Frontend : Angular (v20+), TypeScript, signaux Angular (signal(), computed()). App single-page. Dossier principal : `l5a-character-creator/src/app`.
- Services centraux :
  - `CharacterService` : source de vérité (WritableSignal) pour le personnage en cours, logique métier (amélioration traits/compétences, gestion XP, wrappers vers Spell/Kiho/Technique services), gestion de `currentStep` et flux de création. Fichier : `src/app/services/character.service.ts`.
  - `SpellService` : fournit les listes de sorts, add/remove de sorts élémentaires et Maho (wrappers purs autour des données). `src/app/services/services/spell.service.ts`.
  - `KihoService` : validation et règles d'apprentissage/limites pour Kiho (moines). `src/app/services/services/kiho.service.ts`.
  - `TechniqueService` : fournit techniques de clan/famille et kata; filtration et helpers. `src/app/services/services/technique.service.ts`.
  - `CharacterStorageService` : persistance locale (localStorage) avec validation et méthodes `addCharacter`/`updateCharacter`.

- Données : sous `src/app/data/` (spells, maho.data.ts, kiho.data.ts, clans.data.ts, schools.data.ts, techniques-kata.data.ts, clan-techniques.data.ts).

- Pages et composants clés :
  - `CharacterCreator` : multi-step wizard (templates `character-creator.html`) — gère la création.
  - `CharacterSheet` : vue détaillée d'un personnage, édition rapide.
  - `Characters` : liste des personnages sauvegardés.

2 — Principes d'architecture appliqués
-------------------------------------
- Single Source of Truth : `CharacterService._character` (signal) est la source réactive ; les composants s'abonnent via `characterService.character`.
- Séparation des responsabilités : services spécialisés (Spell/Kiho/Technique/Storage) pour logique métier, `CharacterService` orchestre.
- Data-driven : les règles de jeu (sorts/maho/kiho/techniques) sont dans des fichiers data (`/data`), faciles à modifier.
- UI defensif : templates consultent les helpers du service (`canCastSpells`, `canUseMaho`, `canLearnSpell`, `getAvailableSpellsForCharacter`) pour activer/désactiver les actions.

3 — Cartographie code → règle de jeu
------------------------------------
- Règles d'Insight (niveau pour apprendre des sorts / kiho) : calculées via `CharacterService.getInsightRank()` ; filtres appliqués dans `getAvailableSpellsForCharacter()` et `getAvailableKihoForCharacter()`.
- Règles Maho : `canUseMaho` (école avec `allowsMaho` OU désavantage `maho-tsukai`), `addMahoSpell()` incrémente `taint` et empêche dépassement de seuil.
- XP : `experiencePoints` (total) et `spentExperiencePoints` (ce qui a été dépensé) — `CharacterService` met à jour ces valeurs lors des améliorations.

4 — Points d'intégration externe
--------------------------------
- Possibilité backend / multi-joueurs : le projet a un serveur WebSocket (`GM_L5R_websocket_server.js`) à la racine. Le frontend peut se connecter au serveur pour synchronisation en temps réel via un service `multiplayer.service.ts`.

5 — Conseils d'évolution
------------------------
- Centraliser la logique de coût XP dans une classe dédiée si elle s'épaissit.
- Ajouter des tests unitaires pour `CharacterService` (calculs XP, canLearnSpell, addMahoSpell) — tests rapides sur méthodes pures.
- Ajouter un schéma JSON pour valider les fichiers de données (spells/maho/kiho) à la CI.

---

Fichier adapté automatiquement — relis et valide les points d'implémentation des règles (par ex. seuil de souillure, règles d'affinité/déficience).