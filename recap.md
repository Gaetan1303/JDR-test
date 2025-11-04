 RECAP.md - GameMaster L5R
 Concept
Plateforme de jeu de rôle Legend of the Five Rings type "click & point" avec interface Angular et backend Node.js temps réel.

 Flow Utilisateur
1. Connexion

Le joueur upload son personnage.json
Validation des données (traits, compétences, équipement)
Affichage liste des rooms disponibles

2. Sélection Room

Rejoindre une room existante (voir scénario, nb joueurs)
Créer une nouvelle room (choisir scénario, max 5 joueurs)

3. Session de Jeu

GM : Narration, propose actions, gère combats, valide jets de dés
Joueurs : Choisissent actions, lancent dés, interagissent via interface

Frontend Angular (https://gaetan1303.github.io/JDR-test/)
    ↕ WebSocket
Backend Node.js (Port 3000)
    ↓

 Événements WebSocket Clés
Connexion

connect-with-character → Envoi personnage.json
join-room → Rejoindre une session
player-joined → Broadcast nouveau joueur

Jeu

start-scenario → GM lance le scénario
gm-narration → GM raconte l'histoire
propose-actions → GM propose choix aux joueurs
choose-action → Joueur choisit une action
roll-dice → Joueur lance les dés
dice-rolled → Broadcast résultat

Combat

initiate-combat → Démarrage combat
combat-action → Action de combat
combat-action-resolved → Résolution + dégâts


 Services Backend à Créer/Modifier
Nouveaux

    characterService : Validation et gestion des personnages JSON
    gameStateService : Logique de jeu (actions, résolution, combat)

À Étendre

    roomService : Ajouter scenarioData, gameState, history
    socketHandler : Ajouter tous les événements listés ci-dessus

 Interface Joueur (Angular)
Écrans principaux

    Upload personnage → Validation
    Liste rooms → Filtres, création
    Session de jeu :
        Zone narration (lecture seule)
        Actions disponibles (boutons cliquables)
        Lanceur de dés (Trait + Compétence)
        Chat de groupe
        Fiche personnage (blessures, statut)

Écran GM

    Contrôle scénario (actes, scènes)
    Liste joueurs + états
    Outils : proposer actions, déclencher combats, gérer PNJ
    Validation jets de dés

 Prochaines Étapes Dev

    Backend :
        Créer characterService.js
        Étendre roomService.js avec nouveaux champs
        Créer gameStateService.js
        Implémenter tous les événements WebSocket
    Frontend :
        Composant upload personnage
        Composant liste rooms
        Composant session joueur
        Composant session GM
        Gestion WebSocket avec RxJS
    Intégration :
        Tests de flux complet
        Gestion erreurs réseau
        Persistance (DB pour personnages/historique)

 Objectif Final

Interface click & point intuitive où les joueurs cliquent sur des actions proposées par le GM, lancent des dés en un clic, et vivent une aventure L5R immersive sans se soucier des règles complexes.
 
 Jouer un personnage
 
 Logiciel hors ligne
 Événements aléatoires
 Crafts et missions liées au personnage
