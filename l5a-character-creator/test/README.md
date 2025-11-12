# Tests report and how to reproduce

Contenu:
- `report.txt`: sortie textuelle du dernier run de tests (25 succès).
- `karma_screenshot.png`: image générée résumant le résultat du run (placeholder). Si vous voulez une capture réelle du runner Karma, je peux lancer Karma en mode watch et faire une capture avec Puppeteer.

Comment reproduire localement:

1. Installer les dépendances dans `l5a-character-creator`:

```bash
cd l5a-character-creator
npm ci
```

2. Lancer les tests (utilise le Chromium fourni par Puppeteer si installé):

```bash
CHROME_BIN=$(node -e "console.log(require('puppeteer').executablePath())") npx ng test --watch=false
```

3. Si vous voulez une capture d'écran du runner Karma (UI):

```bash
# Lancer karma en mode watch
CHROME_BIN=$(node -e "console.log(require('puppeteer').executablePath())") npx ng test
# Dans une autre fenêtre, ouvrir http://localhost:9876/debug.html et faire une capture
```

Notes:
- J'ai ajouté des specs pour l'équipement et pour les techniques (`src/app/services/character.service.equipment.spec.ts` et `character.service.techniques.spec.ts`).
- Le test qui affiche `XP insuffisant pour améliorer l'Anneau du Vide.` est attendu lorsque l'on tente d'upgrader sans XP suffisant : le code renvoie false et journalise l'erreur.
