# WORK IN PROGRESS (État du projet)

Date : 10 novembre 2025

But : garder une trace synthétique de l'état actuel du projet pour pouvoir reprendre plus tard.

---

Résumé rapide
------------
- Objectif du dernier cycle : retirer les consoles de debug et corriger la réactivité Angular Signals dans le flow Création de personnage (Clan → Famille → École), plus appliquer correctement les bonus de famille/école.
- Travail réalisé :
  - Ajout d'un mécanisme `appliedBonuses` pour tracer les bonus appliqués automatiquement.
  - Application et retrait automatiques des bonus de `family` et `school` dans `CharacterService`.
  - Conversion de certains wrappers computed en propriétés (pattern de réactivité standardisé).
  - Ajout de 6 nouvelles écoles fictives (2 par clan demandé).

Fichiers modifiés
-----------------
- `src/app/models/character.model.ts`
  - Ajout de `appliedBonuses?: { family?: string; school?: string; clan?: string }`
- `src/app/services/character.service.ts`
  - Application/retrait des bonus de famille/école dans `selectFamily`, `selectSchool`, `selectClan`.
  - Initialisation de `appliedBonuses` lors de `resetCharacter()`.
- `src/app/data/schools.data.ts`
  - Ajout de 6 écoles fictives pour `Ours`, `Serpent`, `Tortue`.

Tests / Vérifications réalisées
-------------------------------
- `npx tsc --noEmit -p tsconfig.json` exécuté localement — pas d'erreur TypeScript constatée.

Comment reprendre / reproduire
-----------------------------
1. Installer les dépendances si nécessaire :

```bash
npm install
```

2. Vérifier les types :

```bash
npx tsc --noEmit -p tsconfig.json
```

3. Démarrer l'application (selon ta config) :

```bash
npm start    # ou 'ng serve' si tu utilises Angular CLI directement
```

4. Parcours à tester dans l'UI :
- Création de personnage → choisir Clan
- Choisir Famille → vérifier que le trait mentionné par `traitBonus` augmente de +1
- Changer Famille → vérifier que l'ancien bonus est retiré et le nouveau appliqué
- Choisir École → vérifier que le trait d'école (+1) est appliqué et les compétences d'école sont ajoutées

Si un comportement inattendu apparaît, récupère la trace console (browser DevTools) et envoie la première erreur.

Notes d'implémentation / décisions utiles
----------------------------------------
- Le fichier `appliedBonuses` sert à éviter de confondre une augmentation manuelle d'un trait par l'utilisateur et un bonus automatique appliqué par la sélection; on ne retire que les bonus que le système a marqué.
- Le pattern Angular Signals : expose les `computed` depuis les services et consomme-les correctement depuis les composants (appeler la computed comme fonction si nécessaire). Cela évite les problèmes de réactivité.

Prochaines tâches (si reprise)
-----------------------------
- Auditer les templates HTML pour s'assurer que tous les `computed` sont appelés correctement (utiliser `()` quand c'est une computed).
- Nettoyer les derniers logs/debug temporaires restants.
- Ajouter un petit panneau debug désactivable (option) pour inspecter `traits` et `appliedBonuses` à la volée lors des tests si besoin.
- Ajouter tests unitaires ciblés pour la logique `selectFamily`/`selectSchool` (vérifier application/retrait de bonus).

Contact rapide
--------------
- Branche actuelle : `main`
- Si tu veux que je crée une PR ou une branche séparée, dis-moi le nom souhaité et je préparerai la PR.

---

Prends le temps de souffler — le projet est en état de pause. Quand tu veux qu'on reprenne, dis simplement "on reprend" et je m'occupe de la suite (audit templates -> tests -> nettoyage). 
