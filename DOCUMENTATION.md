# Les Tirages de Marie - Documentation Complète

> ⚠️ **STALE 2026-05-18** — Manus-export, NEVER updated. Same 5 lies as ARCHITECTURE.md.
> Manus OAuth → password auth · Manus hosting → local+ngrok · Calendly → native booking ·
> TiDB → MySQL/Drizzle · PPTX → PDF only.
> **CANONICAL source of truth**: `~/.claude/projects/-home-arthur/memory/tiragesmarie-project.md`
> Do NOT use this file as authoritative.

## 🌙 Vue d'ensemble

**Les Tirages de Marie** est un mini-site élégant et complet pour une praticienne en guidances spirituelles et livrets astrologiques personnalisés. Le site combine une présence web professionnelle avec un système de gestion de demandes et un moteur de génération de livrets astrologiques.

## 🏗️ Architecture

### Stack Technique

- **Frontend** : React 19 + Tailwind CSS 4 + TypeScript
- **Backend** : Express 4 + tRPC 11 + Node.js
- **Base de données** : MySQL/TiDB avec Drizzle ORM
- **Authentification** : Manus OAuth
- **Validation** : Zod
- **Tests** : Vitest

### Structure du Projet

```
les-tirages-de-marie/
├── client/
│   ├── src/
│   │   ├── pages/          # Pages du site (Home, Services, Blog, etc.)
│   │   ├── components/     # Composants réutilisables
│   │   ├── contexts/       # Contextes React (Theme, Auth)
│   │   ├── lib/            # Utilitaires (tRPC client)
│   │   ├── App.tsx         # Routeur principal
│   │   └── index.css       # Styles globaux
│   └── public/             # Assets statiques
├── server/
│   ├── routers.ts          # Procédures tRPC
│   ├── db.ts               # Helpers de base de données
│   ├── astrology.ts        # Moteur de calcul astrologique
│   ├── auth.logout.test.ts # Tests d'authentification
│   ├── booklet.test.ts     # Tests du système de livret
│   ├── forms.test.ts       # Tests de validation des formulaires
│   └── _core/              # Infrastructure (OAuth, contexte, etc.)
├── drizzle/
│   ├── schema.ts           # Schéma de base de données
│   └── migrations/         # Fichiers de migration SQL
├── shared/
│   └── constants.ts        # Constantes et routes partagées
└── storage/                # Helpers S3 pour fichiers
```

## 📄 Pages Principales

### 1. **Accueil (Home)**
- Héro section avec proposition de valeur
- Présentation de Marie
- Témoignages de clients
- Appels à l'action (CTA) vers les services
- Liens vers les réseaux sociaux

### 2. **Prestations (Services)**
- Présentation des 3 services principaux
- Descriptions détaillées
- Tarification (optionnel)
- CTA vers réservation

### 3. **Livret Astral Personnalisé**
- Explication du service
- Structure du livret
- Exemple de contenu
- Formulaire de commande

### 4. **Prendre Rendez-vous (Booking)**
- Formulaire de réservation
- Créneaux disponibles
- Confirmation immédiate

### 5. **Blog**
- Articles avec catégories
- Recherche et filtres
- Contenu SEO-optimisé

### 6. **À propos**
- Histoire de Marie
- Approche et philosophie
- Qualifications

### 7. **FAQ**
- Questions fréquentes
- Réponses détaillées

### 8. **Contact**
- Formulaire de contact
- Informations de contact
- Liens sociaux

### Pages Légales
- **Mentions légales** : Informations légales du site
- **Politique de confidentialité** : Conformité RGPD

## 🗄️ Base de Données

### Tables Principales

#### `users`
Gestion des utilisateurs authentifiés (admin)
```sql
- id (PK)
- openId (unique)
- name
- email
- role (user | admin)
- createdAt
- updatedAt
```

#### `booklet_requests`
Demandes de livrets astrologiques
```sql
- id (PK)
- firstName
- lastName
- dateOfBirth
- timeOfBirth
- placeOfBirth
- email
- message (optionnel)
- status (pending | in_progress | delivered)
- createdAt
- updatedAt
```

#### `appointments`
Réservations de rendez-vous
```sql
- id (PK)
- firstName
- lastName
- email
- phone (optionnel)
- appointmentDate
- message (optionnel)
- status (pending | confirmed | completed)
- createdAt
- updatedAt
```

#### `blog_articles`
Articles de blog
```sql
- id (PK)
- title
- slug (unique)
- content
- excerpt
- metaDescription
- keywords
- ogImage
- authorId (FK users)
- categoryId (FK blog_categories)
- status (draft | published)
- publishedAt
- createdAt
- updatedAt
```

#### `blog_categories`
Catégories de blog
```sql
- id (PK)
- name
- slug (unique)
- description
```

#### `astro_signs`
Signes astrologiques (12 signes)
```sql
- id (PK)
- name
- symbol
- description
- strengths
- challenges
- advice
```

#### `astro_planets`
Planètes (8 planètes)
```sql
- id (PK)
- name
- symbol
- meaning
- interpretation
```

#### `astro_houses`
Maisons astrologiques (12 maisons)
```sql
- id (PK)
- houseNumber
- name
- meaning
- influence
```

#### `generated_booklets`
Livrets générés
```sql
- id (PK)
- bookletRequestId (FK booklet_requests)
- sunSign
- moonSign
- ascendant
- status (draft | ready | sent | downloaded)
- pdfUrl (optionnel)
- createdAt
- updatedAt
```

## 🔐 Authentification & Autorisation

### Flux OAuth

1. Utilisateur clique sur "Admin"
2. Redirection vers portail Manus OAuth
3. Authentification et consentement
4. Redirection vers `/api/oauth/callback`
5. Session créée et stockée en cookie
6. Accès au dashboard admin

### Procédures Protégées

Les procédures tRPC marquées `protectedProcedure` nécessitent une authentification :
- `booklet.list` - Voir les demandes de livrets
- `booklet.updateStatus` - Modifier le statut
- `appointment.list` - Voir les rendez-vous
- `appointment.updateStatus` - Modifier le statut
- `blog.create` - Créer un article

## 🌟 Système de Génération de Livret

### Flux Complet

1. **Collecte des données** : Formulaire avec date, heure, lieu de naissance
2. **Calcul astrologique** :
   - Signe solaire (date de naissance)
   - Signe lunaire (date + heure)
   - Ascendant (heure + lieu)
   - Positions planétaires
   - Maisons astrologiques
3. **Sélection de contenu** : La bibliothèque astrologique fournit :
   - Descriptions des signes
   - Significations des planètes
   - Influences des maisons
4. **Assemblage du livret** :
   - Couverture personnalisée
   - Introduction
   - Profil du signe solaire
   - Profil du signe lunaire
   - Profil de l'ascendant
   - Influences planétaires
   - Influences des maisons
   - Conclusion
5. **Export** : PDF ou PowerPoint (à implémenter)

### Calculs Astrologiques

#### Signe Solaire
Basé sur la date de naissance. Implémentation avec dates de transition des signes.

#### Signe Lunaire
Calcul approximatif basé sur le jour de l'année. Nécessite une éphéméride pour plus de précision.

#### Ascendant
Calcul approximatif basé sur l'heure de naissance. Nécessite les coordonnées géographiques pour plus de précision.

## 📝 Formulaires & Validation

### Formulaire de Livret Astral

**Champs requis** :
- `prénom` (min 2 caractères)
- `nom` (min 2 caractères)
- `date de naissance` (format YYYY-MM-DD)
- `heure de naissance` (format HH:mm)
- `lieu de naissance` (min 2 caractères)
- `email` (format email valide)
- `message` (optionnel, max 5000 caractères)

**Validation** : Côté client (React Hook Form) et côté serveur (Zod)

### Formulaire de Rendez-vous

**Champs requis** :
- `prénom` (min 2 caractères)
- `nom` (min 2 caractères)
- `email` (format email valide)
- `téléphone` (optionnel)
- `date du rendez-vous` (format ISO datetime)
- `message` (optionnel)

## 🎨 Design & Styling

### Palette de Couleurs

- **Primaire** : Beige chaud (#E8D5C4)
- **Accent** : Doré doux (#D4A574)
- **Secondaire** : Crème (#F5F1ED)
- **Texte** : Brun chaud (#5C4A47)
- **Arrière-plan** : Blanc cassé (#FAFAF8)

### Typographie

- **Titres** : Serif (Playfair Display)
- **Corps** : Sans-serif (Inter)
- **Taille de base** : 16px

### Composants

- Buttons : Tailwind avec variantes
- Cards : Bordures subtiles, ombres douces
- Forms : Validation en temps réel
- Navigation : Responsive mobile-first

## 🧪 Tests

### Suite de Tests

- **31 tests Vitest** au total
- **booklet.test.ts** : 16 tests pour le système astrologique
- **forms.test.ts** : 14 tests pour la validation des formulaires
- **auth.logout.test.ts** : 1 test pour la déconnexion

### Exécution

```bash
pnpm test
```

## 📊 Back-Office Admin

### Dashboard

- **Vue d'ensemble** : Statistiques clés
- **Demandes de livrets** : Tableau avec filtres et actions
- **Rendez-vous** : Tableau avec filtres et actions
- **Statuts** : Badges colorés pour chaque statut
- **Actions** : Voir, modifier, supprimer (à implémenter)

### Accès

- URL : `/admin`
- Authentification requise
- Redirection automatique si non authentifié

## 🚀 Déploiement

### Environnement de Production

Le site est déployé sur Manus avec :
- URL auto-générée : `https://les-tirages-de-marie.manus.space`
- Domaine personnalisé : À configurer
- SSL automatique
- CDN global

### Variables d'Environnement

Les variables d'environnement suivantes sont injectées automatiquement :
- `DATABASE_URL` : Connexion MySQL
- `JWT_SECRET` : Clé de signature des sessions
- `VITE_APP_ID` : ID OAuth Manus
- `OAUTH_SERVER_URL` : URL du serveur OAuth
- `BUILT_IN_FORGE_API_KEY` : Clé API Manus
- Autres : Voir `.env.example`

## 🔄 Flux de Données

### Demande de Livret

```
Utilisateur remplit formulaire
    ↓
Validation côté client (React Hook Form)
    ↓
Envoi tRPC (booklet.create)
    ↓
Validation côté serveur (Zod)
    ↓
Stockage en base de données
    ↓
Notification propriétaire (notifyOwner)
    ↓
Confirmation utilisateur (toast)
```

### Génération de Livret

```
Admin clique "Générer"
    ↓
Récupération des données de naissance
    ↓
Calcul astrologique (sun, moon, ascendant, planets, houses)
    ↓
Sélection du contenu dans la bibliothèque
    ↓
Assemblage du livret
    ↓
Génération PDF/PowerPoint
    ↓
Stockage et lien de téléchargement
```

## 📱 Responsive Design

- **Mobile** : 320px - 640px
- **Tablet** : 641px - 1024px
- **Desktop** : 1025px+

Tous les composants sont testés sur mobile-first.

## 🔒 Sécurité

- **CSRF Protection** : Cookies SameSite
- **XSS Protection** : Sanitization automatique
- **SQL Injection** : Requêtes paramétrées (Drizzle ORM)
- **Authentication** : OAuth Manus
- **HTTPS** : Obligatoire en production

## 📈 SEO

- Meta tags sur toutes les pages
- Structured data (JSON-LD)
- Sitemap.xml
- robots.txt
- Slug d'URL optimisés
- Descriptions optimisées pour les moteurs de recherche

## 🎯 Prochaines Étapes (Futures Enhancements)

1. **Content Engine** : Interface pour générer du contenu (posts Instagram, articles blog)
2. **Système de Paiement** : Intégration Stripe pour les services payants
3. **Intégration Calendly** : Gestion des créneaux de rendez-vous
4. **IA Assistant** : Aide à la génération de contenu et réponses aux messages
5. **Système de Newsletter** : Abonnement et envoi d'emails
6. **Analytics Avancées** : Suivi des conversions et comportement utilisateur
7. **Système de Commentaires** : Sur les articles du blog
8. **Intégration Instagram API** : Partage automatique des posts

## 📞 Support & Maintenance

- **Logs** : `.manus-logs/` (devserver.log, browserConsole.log, etc.)
- **Monitoring** : Dashboard Manus
- **Backups** : Automatiques
- **Mises à jour** : Gérées par Manus

## 📄 Fichiers Importants

- `ARCHITECTURE.md` : Architecture détaillée
- `todo.md` : Liste des tâches
- `.env.example` : Variables d'environnement
- `package.json` : Dépendances et scripts
- `drizzle.config.ts` : Configuration Drizzle

---

**Créé avec ✨ par Manus**  
Dernière mise à jour : Avril 2026
