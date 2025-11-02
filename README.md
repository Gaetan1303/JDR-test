Absolument. Je comprends que vous souhaitiez un fichier Markdown propre, complet, et structuré uniquement avec les balises Markdown, sans éléments de code Python pour l'instant.

Voici le fichier Markdown, basé sur les règles de la 4ème Édition de La Légende des Cinq Anneaux, prêt à servir de documentation pour votre automatisation dans VS Code.

Création de Personnage - La Légende des Cinq Anneaux (4e Édition)

Ce document résume le processus de création de personnage pour La Légende des Cinq Anneaux 4e Édition, en vue d'une automatisation.

1. Initialisation des Statistiques

Toutes les caractéristiques de base du Samouraï commencent à une valeur fixe.

1.1. Anneaux et Traits

Les personnages commencent avec tous leurs Anneaux et Traits à 2.
Anneau	Traits Associés	Valeur de Base
Terre	Constitution & Volonté	2
Eau	Force & Perception	2
Air	Réflexes & Intuition	2
Feu	Agilité & Intelligence	2
Vide	-	2

Règle de Calcul : La valeur d'un Anneau (sauf le Vide) est toujours égale au plus petit de ses deux Traits associés.

1.2. Compétences

Le personnage commence avec aucune compétence au Rang. Les compétences seront ajoutées aux étapes suivantes.

2. Choix du Clan et de la Famille

Ce choix détermine l'identité sociale et le premier bonus de Trait.

2.1. Sélection du Clan

L'utilisateur choisit le Clan Majeur ou Mineur.

2.2. Sélection de la Famille

L'utilisateur choisit une Famille au sein du Clan.

    Bonus de Trait Familial : La Famille octroie un +1 gratuit à un Trait spécifique.

        Action du Script : Appliquer le +1 au Trait, puis recalculer la valeur de l'Anneau associé.

3. Choix de l'École

L'École définit la carrière (Bushi, Shugenja, Courtisan, etc.) et apporte des bonus mécaniques importants.

3.1. Sélection de l'École

L'utilisateur choisit l'École (ex: Bushi Hida, Courtisan Kakita, Shugenja Isawa).

    Bonus de Trait d'École : L'École octroie un +1 gratuit à un Trait spécifique (différent ou identique à celui de la Famille).

        Action du Script : Appliquer le +1 au Trait, puis recalculer la valeur de l'Anneau associé.

3.2. Compétences et Techniques d'École

    Compétences d'École : Le personnage gagne un ensemble de Compétences au Rang 1 ou plus, spécifiques à l'École. Ces compétences sont considérées comme des Compétences d'École pour le calcul du coût en XP futur (coût ×1).

    Techniques d'École : Le personnage reçoit la Technique de Rang 1 de son École.

3.3. Statuts et Réputations

    Honneur : La valeur de départ est fixée par l'École.

    Gloire : Rang de départ 1.

    Statut : Rang de départ 1.

    Souillure : Rang de départ 0.

4. Personnalisation (Points d'Expérience - XP)

Le personnage dispose de points pour affiner ses capacités.

4.1. Budget XP

Le personnage reçoit 40 Points d'Expérience (XP) à dépenser.

4.2. Avantages et Désavantages

L'utilisateur sélectionne un ensemble d'Avantages (coûtent de l'XP) et de Désavantages (rapportent de l'XP).

    Action du Script : Ajuster le budget XP total.

4.3. Dépenses et Limites

Les XP restants peuvent être dépensés pour augmenter les Anneaux, les Traits ou les Compétences.

    Limite de Création : À la création, aucun Anneau, Trait ou Compétence ne peut dépasser 4.

Amélioration	Coût en XP
Augmenter un Anneau	Nouvelle Valeur de l'Anneau ×10
Augmenter un Trait	Nouvelle Valeur du Trait ×4
Augmenter une Compétence d'École	Nouvelle Valeur de la Compétence ×1
Augmenter une Compétence Hors-École	Nouvelle Valeur de la Compétence ×2

    Action du Script : Mettre à jour les Traits et Anneaux. Pour les Anneaux, un seul Trait (celui le plus bas) doit être augmenté. Si les deux Traits sont égaux, l'utilisateur choisit lequel augmenter pour dépasser l'Anneau actuel.

5. Calcul des Statistiques Dérivées

Ces valeurs sont calculées automatiquement en fin de processus.

5.1. Rang d'Insight (ou Réputation)

Le Rang d'Insight est la mesure de la puissance globale du personnage.
Rang d’Insight=(∑Valeur des Cinq Anneaux×10)+∑Rang de toutes les Compeˊtences

5.2. Initiative de Combat

L'Initiative est cruciale pour le combat.
Base d’Initiative=Rang d’Insight/Reˊflexes

5.3. Niveaux de Blessure (Wound Levels)

Les Niveaux de Blessure (sain, égratigné, blessé, etc.) sont déterminés par la valeur de l'Anneau de Terre (Constitution).

5.4. TN de Couverture / TN de Corps à Corps

Le TN (Target Number) de la défense est essentiel pour la résistance.
TN de Corps aˋ Corps=(5×Deˊfense)+Bonus d’Armure+(5×Reˊflexes)

6. Éléments Narratifs et Équipement

Ces éléments sont à renseigner par l'utilisateur ou sont dérivés de l'École.

    Informations Personnelles : Nom, Âge, Sexe, etc.

    Objectif/Destinée : Motivation personnelle du personnage.

    Équipement de Départ : Armes, Armure, Vêtements, Koku de départ, déterminés par l'École.