# MoodMeal — Cahier des charges fonctionnel

## 1. Présentation du projet

**Nom du projet** : MoodMeal — Application bien-être & alimentation douce.

**Concept** : MoodMeal est une application web qui propose des boissons et encas adaptés à l'humeur et à la phase du cycle menstruel. L'objectif est d'aider les femmes à mieux écouter leur corps et leurs émotions à travers des rituels simples et bienveillants (tisane, smoothie, snack sain, etc.). L'application utilise une base interne et une touche d'IA pour enrichir les suggestions avec des descriptions personnalisées.

## 2. Objectifs du projet

### Objectifs principaux

* Offrir une expérience bien-être personnalisée.
* Proposer des boissons et encas simples, naturels et accessibles.
* Permettre de mieux comprendre le lien entre cycle et humeur.
* Montrer les compétences full-stack (Spring Boot + React + IA).

### Objectifs secondaires

* Créer une interface apaisante et immersive.
* Donner à l'IA un rôle de conseiller bienveillant, pas de chatbot.

## 3. Public cible

* Femmes de 18 à 35 ans intéressées par le bien-être et la santé naturelle.
* Personnes stressées, fatiguées ou curieuses d’explorer des rituels bienveillants.
* Utilisatrices souhaitant mieux comprendre leur cycle et adapter leur alimentation.

## 4. Fonctionnalités principales

| Fonctionnalité                 | Description                                                                  |
| ------------------------------ | ---------------------------------------------------------------------------- |
| Accueil                        | Message d’accueil apaisant et bouton “Commencer ma recommandation”.          |
| Sélection de l’humeur          | Choix de l’humeur (stressée, fatiguée, triste, motivée, etc.).               |
| Sélection de la phase du cycle | Choix de la phase (menstruation, prémenstruelle, ovulatoire, folliculaire).  |
| Préférences                    | Type de suggestion : boisson chaude/froide, snack, sucré/salé.               |
| Suggestion personnalisée       | Fiche avec nom, bienfaits, ingrédients, préparation et message bienveillant. |
| Favoris                        | Possibilité de sauvegarder les suggestions préférées.                        |
| Nouvelle suggestion            | Possibilité de relancer une autre suggestion.                                |

## 5. Fonctionnalités secondaires (v2)

* Rappels doux pour boire ou se relaxer.
* Journal de bien-être (enregistrer humeur et boisson du jour).
* Statistiques sur les humeurs et préférences.

## 6. Parcours utilisateur

1. Page d’accueil → bouton “Commencer”.
2. Choix de l’humeur, de la phase du cycle et des préférences.
3. Requête POST → `/api/suggest`.
4. Affichage de la suggestion : nom, bienfaits, ingrédients, préparation, message IA.
5. Option : enregistrer en favori ou relancer une autre suggestion.

## 7. Architecture technique

### Frontend

* React + Vite + TailwindCSS
* Pages : HomePage, MoodFormPage, SuggestionPage, FavoritesPage
* Composants : MoodSelector, CycleSelector, PreferenceSelector, SuggestionCard, FavoriteCard
* Appels API via Axios

### Backend

* Spring Boot (Java 17+)
* API REST :

  * `POST /api/suggest` → suggestion
  * `GET /api/favorites`
  * `POST /api/favorites`
* Base : PostgreSQL ou SQLite
* Modèles : Mood, CyclePhase, Preference, Suggestion, UserFavorite
* Intégration IA : enrichissement texte via API externe (OpenAI/Mistral)

## 8. Charte graphique & ambiance

* Palette pastel : rose poudré, crème, vert sauge, lavande
* Typographie douce et lisible : Poppins, Quicksand
* Ambiance : minimaliste, cocooning, bienveillante
* Animations légères : transitions douces entre étapes

## 9. Données de base (exemple JSON)

```json
[
  {
    "mood": "stressée",
    "phase": "SPM",
    "preference": "boisson chaude",
    "name": "Tisane camomille-gingembre",
    "benefits": "Apaise le stress et les douleurs menstruelles",
    "ingredients": ["Camomille", "Gingembre", "Miel", "Citron"],
    "preparation": "Infuser 7 minutes et respirer profondément."
  }
]
```

## 10. Livrables attendus

* Cahier des charges (ce document)
* Maquettes d’écrans (Figma ou dessin)
* Backend fonctionnel (Spring Boot REST API)
* Frontend responsive (React + Tailwind)
* Démo locale fonctionnelle

## 11. Points forts du projet

* Original, apaisant et personnel
* Montre compétences techniques complètes (front + back + IA)
* Facile à présenter dans un portfolio ou entretien
* Projet évolutif (journal, notifications, suivi cycle)

## 12. Planning prévisionnel (MVP → V1 → V2)

| Phase              | Objectifs                                                         |
| ------------------ | ----------------------------------------------------------------- |
| MVP (semaines 1-2) | Front form, backend mock, suggestion fixe, affichage fiche simple |
| V1 (semaines 3-4)  | Intégration IA, génération dynamique des messages et suggestions  |
| V2 (semaines 5-6)  | Favoris, historique, amélioration UI/UX, déploiement              |
