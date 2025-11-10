📋 CORRECTION.md - L5A Character Creator
🎯 Corrections Prioritaires
🔴 CRITIQUE - À corriger immédiatement
1. Sécurité - Mots de passe en clair
Fichier: src/app/services/auth.service.ts
Ligne: Interface StoredUser
Problème:
Les mots de passe sont stockés en clair dans localStorage. C'est une faille de sécurité majeure même pour une démo locale.
Solution:
Implémenter un hash basique côté client (btoa + salt) ou utiliser la librairie bcrypt.js. En production, tout doit être côté serveur avec argon2/bcrypt.
Impact: CRITIQUE - Données utilisateurs exposées

2. Validation des données - LocalStorage corrompu
Fichier: src/app/services/character.service.ts
Méthode: loadCharacter()
Problème:
Aucune validation lors du chargement des personnages depuis localStorage. Si les données sont corrompues ou modifiées manuellement, l'application plante.
Solution:
Ajouter une validation avec Zod ou une validation manuelle des champs obligatoires avant de charger dans les signaux. Retourner un objet {success, error} au lieu de void.
Impact: CRITIQUE - Crash application

3. Gestion des erreurs NaN
Fichier: src/app/services/character.service.ts
Méthodes: buyEquipment(), sellEquipment()
Problème:
parseInt() peut retourner NaN si equipment.cost est mal formaté. Aucune vérification avant les calculs monétaires.
Solution:
Ajouter une validation isNaN() après chaque parseInt(). Retourner un objet {success: boolean, error?: string} au lieu de boolean simple pour fournir des messages d'erreur explicites.
Impact: ÉLEVÉ - Bugs silencieux, économie cassée

🟠 IMPORTANT - À corriger rapidement
4. Type Safety - Usage excessif de 'any'
Fichiers multiples: character-creator.ts, character.service.ts
Problème:
Utilisation de 'any' dans updateBasicInfo(), événements DOM ($event.target), et certains callbacks. Perte des avantages TypeScript.
Solution:
Utiliser des types génériques pour updateBasicInfo<K extends keyof Character>(). Typer explicitement les événements DOM avec HTMLInputElement. Créer des interfaces pour les callbacks.
Impact: MOYEN - Perte de sécurité des types

5. Performance - Computed imbriqués
Fichier: src/app/services/character.service.ts
Computed: availableSpellsByElement
Problème:
Le computed recalcule tous les sorts par élément à chaque changement de signal, même mineur. Avec 100+ sorts, cela devient coûteux.
Solution:
Implémenter un système de cache avec Map<string, Spell[]> qui se vide uniquement quand les sorts changent. Utiliser effect() pour invalider le cache intelligemment.
Impact: MOYEN - Ralentissements interface

6. Duplication d'état - Avantages/Désavantages
Fichier: src/app/services/character.service.ts
Problème:
Les avantages/désavantages existent dans deux endroits : _selectedAdvantageIds (signal) et character.selectedAdvantages (array). Source de désynchronisation.
Solution:
Choisir une seule source de vérité. Recommandation : tout dans _character, supprimer les signaux dédiés. Ou inversement, tout dans signaux dédiés et computed pour character.
Impact: MOYEN - Bugs de synchronisation

🟡 SOUHAITABLE - Améliorer quand possible
7. Architecture - Services trop volumineux
Fichier: src/app/services/character.service.ts
Taille: ~2000 lignes
Problème:
Le CharacterService gère trop de responsabilités : création, sorts, équipement, kiho, techniques, sauvegarde. Viole le principe de responsabilité unique (SRP).
Solution:
Refactoriser en services dédiés :

SpellService (gestion sorts + maho)
EquipmentService (achat/vente/inventaire)
KihoService (kiho des moines)
TechniqueService (techniques + kata)
CharacterStorageService (save/load localStorage)

Impact: FAIBLE - Maintenabilité future

8. Tests - Couverture insuffisante
État actuel: Un seul fichier spec (app.spec.ts)
Problème:
Aucun test pour la logique métier critique : calculs XP, jets de dés, génération événements, calculs de combat. Risque de régression élevé.
Solution:
Ajouter tests unitaires prioritaires pour :

character.service.ts (méthodes de calcul)
jet.service.ts (logique dés)
event.service.ts (génération aléatoire)
Viser 60% de couverture minimum.

Impact: FAIBLE - Qualité long terme

9. Accessibilité - ARIA manquant
Fichiers: Tous les templates HTML
Problème:
Boutons +/- sans aria-label, formulaires sans indication d'erreur accessible, messages de succès invisibles pour lecteurs d'écran.
Solution:
Ajouter aria-label sur tous les boutons d'action. Utiliser aria-live pour les messages dynamiques. Ajouter role et aria-describedby sur les formulaires avec erreurs.
Impact: FAIBLE - Accessibilité utilisateurs handicapés

10. UX - Feedback utilisateur insuffisant
Fichiers: character-creator.ts, characters.ts
Problème:
Utilisation de alert() natif pour les confirmations. Pas de loading spinners lors des appels async. Pas de toasts pour succès/erreur.
Solution:
Implémenter MatSnackBar pour notifications toast. Ajouter MatProgressSpinner dans boutons async. Utiliser MatDialog pour confirmations au lieu de confirm().
Impact: FAIBLE - Expérience utilisateur

11. CSS - Duplication de styles
Fichiers: character-creator.scss, play-character.scss, dashboard.scss
Problème:
Styles pour écoles (bushi, shugenja, etc.) dupliqués dans chaque fichier SCSS. Background gradients répétés. Variables CSS non utilisées partout.
Solution:
Créer un fichier _themes.scss avec mixins SCSS pour chaque école. Centraliser variables CSS dans styles.scss global. Utiliser @use au lieu de duplication.
Impact: FAIBLE - Maintenabilité CSS

12. Performance - Images non optimisées
Dossier: src/styles/assets/images/
Problème:
Images potentiellement lourdes (background.png, Monastere.png) chargées sans lazy loading. Pas de format moderne (WebP/AVIF).
Solution:
Convertir images en WebP avec fallback PNG. Implémenter lazy loading avec loading="lazy". Compresser images avec TinyPNG ou Squoosh.
Impact: FAIBLE - Temps de chargement initial

13. Routes - Pas de Guards
Fichier: app.routes.ts
Problème:
Routes /multiplayer et /play-character accessibles sans authentification. Pas de redirection automatique si non connecté.
Solution:
Créer AuthGuard qui vérifie auth.isAuthenticated(). Appliquer canActivate sur routes protégées. Rediriger vers /login avec returnUrl.
Impact: FAIBLE - Sécurité navigation

14. Formulaires - Pas de debounce
Fichier: library.ts
Problème:
Recherche de sorts/équipement sans debounce. Filtres recalculés à chaque frappe clavier. Potentiellement lourd avec beaucoup de données.
Solution:
Implémenter debounceTime(300) sur les inputs de recherche avec RxJS. Convertir spellFilter en BehaviorSubject pour gérer flux réactif.
Impact: FAIBLE - Performance recherche

15. WebSocket - Reconnexion
Fichier: multiplayer.service.ts
Problème:
Configuration reconnexion basique (5 tentatives). Pas de stratégie exponential backoff. Pas de feedback utilisateur pendant reconnexion.
Solution:
Implémenter reconnection avec délai exponentiel (1s, 2s, 4s, 8s...). Afficher toast "Reconnexion en cours..." pour l'utilisateur. Sauvegarder état salon en local pendant coupure.
Impact: FAIBLE - Robustesse multijoueur

📊 Récapitulatif par Priorité
🔴 CRITIQUE (3)

Mots de passe en clair
Validation données localStorage
Gestion erreurs NaN

🟠 IMPORTANT (3)

Type safety (any)
Performance computed
Duplication état

🟡 SOUHAITABLE (9)

Architecture services
Tests unitaires
Accessibilité ARIA
Feedback UX
Duplication CSS
Images non optimisées
Routes sans Guards
Pas de debounce
Reconnexion WebSocket


🎯 Plan d'Action Recommandé
Sprint 1 (Critique - 1 semaine)

Jour 1-2: Hash mots de passe + validation localStorage
Jour 3-4: Gestion erreurs NaN dans économie
Jour 5: Tests des corrections

Sprint 2 (Important - 1 semaine)

Jour 1-2: Refactoring types (supprimer any)
Jour 3-4: Cache pour computed imbriqués
Jour 5: Unification état avantages/désavantages

Sprint 3 (Souhaitable - 2 semaines)

Semaine 1: Architecture (split services) + tests
Semaine 2: UX (feedback, accessibilité, guards)


✅ Points Déjà Excellents (à conserver)

Architecture Signals moderne (Angular 20)
Standalone components partout
Séparation claire services/components
Gestion XP complexe bien implémentée
Système multijoueur fonctionnel
Mode solo avec événements aléatoires
Interface riche et complète


📝 Notes Finales
Projet globalement solide, prêt pour MVP après corrections critiques.
Score actuel: 7.2/10
Score potentiel après corrections: 8.5-9/10
Le projet démontre une excellente maîtrise d'Angular moderne. Les corrections proposées sont principalement préventives pour solidifier la base avant scaling.