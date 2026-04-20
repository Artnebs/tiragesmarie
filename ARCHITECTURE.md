# Architecture "Les Tirages de Marie"

## 1. Vue d'ensemble du système

Le système est conçu comme un ensemble modulaire de composants interconnectés, permettant une évolution future sans refonte majeure.

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Tailwind)                  │
├─────────────────────────────────────────────────────────────────┤
│  Pages: Home | Services | Booklet | Booking | Blog | About      │
│  Forms: Booklet Request | Appointment Booking                   │
│  Admin: Dashboard | Requests Manager | Bookings Manager         │
└────────────────┬──────────────────────────────────────────────┘
                 │ tRPC API
┌────────────────┴──────────────────────────────────────────────┐
│                    BACKEND (Express + tRPC)                    │
├──────────────────────────────────────────────────────────────┤
│  • Auth & Session Management                                  │
│  • Form Processing & Validation                               │
│  • Booklet Generation Engine                                  │
│  • Content Library Management                                 │
│  • Blog & SEO Management                                      │
│  • Admin CRM Operations                                       │
└────────────────┬──────────────────────────────────────────────┘
                 │ SQL Queries
┌────────────────┴──────────────────────────────────────────────┐
│              DATABASE (MySQL / TiDB)                           │
├──────────────────────────────────────────────────────────────┤
│  • Users & Auth                                               │
│  • Booklet Requests                                           │
│  • Appointments / Bookings                                    │
│  • Blog Articles & Categories                                │
│  • Content Library (Signs, Planets, Houses)                  │
│  • Generated Booklets (metadata)                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. Modules fonctionnels

### 2.1 Module Site Web (Frontend + Pages)

**Responsabilité:** Présenter les services de Marie et convertir les visiteurs.

**Pages:**
- **Home:** Héro, présentation de Marie, témoignages, CTA
- **Services:** Description des 3 services principaux
- **Astral Booklet:** Explication du produit, structure, exemple, CTA
- **Book Appointment:** Formulaire ou intégration Calendly
- **Blog:** Articles SEO, catégories, filtres
- **About:** Histoire de Marie, approche, confiance
- **FAQ:** Questions fréquentes, processus, délais
- **Contact:** Formulaire de contact simple
- **Legal:** Mentions légales, politique de confidentialité

**Navigation:** Barre de navigation responsive (mobile-first), footer complet avec liens sociaux.

---

### 2.2 Module Formulaires & Validation

**Responsabilité:** Capturer et valider les données utilisateur.

**Formulaires:**

1. **Booklet Request Form**
   - Prénom (required)
   - Nom (required)
   - Date de naissance (required, format YYYY-MM-DD)
   - Heure de naissance (required, format HH:MM)
   - Lieu de naissance (required, text)
   - Email (required, email)
   - Message (optional, textarea)
   - Validation côté client et serveur
   - Stockage en base de données

2. **Appointment Booking Form**
   - Prénom (required)
   - Nom (required)
   - Email (required)
   - Téléphone (optional)
   - Date & heure souhaitées (required, sélection parmi créneaux disponibles)
   - Message (optional)
   - Confirmation par email

3. **Contact Form**
   - Prénom, nom, email, sujet, message
   - Notification à Marie via email

---

### 2.3 Module Booklet Generator (Cœur du système)

**Responsabilité:** Générer automatiquement des livrets astrologiques personnalisés.

**Flux:**

```
Input (Birth Data)
    ↓
Astro Calculation (Sun, Moon, Ascendant, Planets, Houses)
    ↓
Content Selection (from Library)
    ↓
Document Assembly (PowerPoint / PDF)
    ↓
Output (Editable + Exportable)
```

**Étapes détaillées:**

1. **Capture des données de naissance**
   - Prénom, nom, date, heure, lieu
   - Validation et normalisation

2. **Calcul astrologique**
   - Signe solaire (Sun Sign) basé sur la date
   - Signe lunaire (Moon Sign) - approximatif ou via API externe
   - Ascendant (Rising Sign) - basé sur l'heure et le lieu
   - Positions des planètes (approximatif)
   - Maisons astrologiques (basé sur l'heure et le lieu)

3. **Sélection de contenu**
   - Accès à la Content Library
   - Sélection des blocs de texte correspondant aux signes, planètes, maisons
   - Assemblage logique (couverture → intro → infos → signe solaire → signe lunaire → ascendant → planètes → maisons → conclusion)

4. **Génération du document**
   - Format: PowerPoint (PPTX) ou PDF
   - Éditable par Marie avant envoi
   - Exportable par le client

5. **Stockage & Suivi**
   - Métadonnées sauvegardées en base
   - Lien de téléchargement généré
   - Statut: "generated" → "sent" → "downloaded"

---

### 2.4 Module Content Library (Bibliothèque de contenu)

**Responsabilité:** Stocker et organiser le contenu réutilisable.

**Structure:**

```
Content Library
├── Signs (12)
│   ├── Aries
│   │   ├── description (text)
│   │   ├── strengths (text)
│   │   ├── challenges (text)
│   │   └── advice (text)
│   ├── Taurus
│   └── ... (10 other signs)
├── Planets (10)
│   ├── Sun
│   │   ├── meaning (text)
│   │   ├── influence (text)
│   │   └── interpretation (text)
│   ├── Moon
│   └── ... (8 other planets)
├── Houses (12)
│   ├── House 1
│   │   ├── meaning (text)
│   │   ├── influence (text)
│   │   └── interpretation (text)
│   └── ... (11 other houses)
└── Templates
    ├── Booklet Cover
    ├── Introduction
    ├── Birth Info Page
    ├── Sign Page
    └── Conclusion Page
```

**Gestion:**
- Contenu éditable par Marie via admin panel
- Versioning simple (created_at, updated_at)
- Réutilisable dans plusieurs livrets
- Extensible pour ajouter de nouveaux éléments

---

### 2.5 Module Blog & SEO

**Responsabilité:** Générer du trafic organique et établir l'autorité.

**Structure:**

- Articles avec métadonnées SEO (title, description, keywords, slug)
- Catégories (Astrology, Guidance, Signs, Planets, etc.)
- Dates de publication
- Auteur (Marie)
- Tags
- Contenu markdown ou rich text
- Sitemap.xml généré automatiquement
- Meta tags OpenGraph pour partage social

**Fonctionnalités:**
- Filtrage par catégorie
- Recherche d'articles
- Articles connexes (basés sur les tags)
- Commentaires (optionnel, future)

---

### 2.6 Module CRM Léger

**Responsabilité:** Suivre les demandes et les réservations.

**Fonctionnalités:**

1. **Dashboard Admin**
   - Vue d'ensemble: nombre de demandes, réservations, statuts
   - Graphiques simples (demandes par mois, etc.)

2. **Booklet Requests Manager**
   - Liste des demandes avec filtres (statut, date, nom)
   - Détails complets de chaque demande
   - Actions: view, edit, mark as done, send booklet, delete
   - Statuts: pending, generated, sent, completed

3. **Appointments Manager**
   - Liste des réservations
   - Détails, statuts, actions
   - Intégration avec calendrier (optionnel)

4. **Client Database**
   - Historique des interactions par client
   - Informations de contact
   - Demandes et réservations associées

---

### 2.7 Module Authentification & Autorisation

**Responsabilité:** Sécuriser l'accès au back-office.

- Authentification Manus OAuth (déjà intégrée)
- Rôles: admin (Marie), user (visiteurs)
- Accès au back-office réservé aux admins
- Sessions sécurisées

---

### 2.8 Module IA Assistant (Futur - Placeholder)

**Responsabilité:** Préparer l'intégration d'un agent IA personnalisé.

**Placeholder:**
- Endpoint API défini mais non implémenté
- Documentation pour connexion future
- Cas d'usage envisagés:
  - Génération de contenu blog
  - Suggestions de textes pour livrets
  - Assistance à la communication avec clients
  - Analyse des demandes

**À implémenter plus tard:**
- Intégration avec l'agent IA de l'utilisateur
- Appels API asynchrones
- Stockage des suggestions en base

---

## 3. Flux de données complet

### 3.1 Flux: Demande de livret

```
1. Visiteur remplit le formulaire (Booklet Request Form)
   └─ Prénom, nom, date, heure, lieu, email, message

2. Validation côté client (React Hook Form + Zod)
   └─ Vérification des formats, champs requis

3. Envoi au serveur (tRPC mutation)
   └─ POST /api/trpc/booklet.create

4. Validation côté serveur
   └─ Vérification supplémentaire, sanitization

5. Stockage en base de données
   └─ Table: booklet_requests
   └─ Statut: "pending"

6. Notification à Marie
   └─ Email ou notification in-app

7. Réponse au client
   └─ Confirmation + numéro de demande

8. Marie accède au back-office
   └─ Voit la nouvelle demande
   └─ Peut générer le livret

9. Génération du livret
   └─ Calcul astrologique
   └─ Sélection de contenu
   └─ Assemblage du document
   └─ Statut: "generated"

10. Marie édite et valide
    └─ Peut modifier le contenu avant envoi
    └─ Exporte en PDF ou PPTX

11. Envoi au client
    └─ Email avec lien de téléchargement
    └─ Statut: "sent"

12. Client télécharge
    └─ Accès au livret personnalisé
    └─ Statut: "downloaded"
```

### 3.2 Flux: Réservation de rendez-vous

```
1. Visiteur accède à la page "Book Appointment"
   └─ Voit les créneaux disponibles

2. Sélectionne une date/heure
   └─ Remplit le formulaire (prénom, nom, email, message)

3. Validation et envoi
   └─ tRPC mutation: appointment.create

4. Stockage en base
   └─ Table: appointments
   └─ Statut: "pending"

5. Notification à Marie
   └─ Email avec détails

6. Confirmation au client
   └─ Email de confirmation + détails du rendez-vous

7. Marie gère les rendez-vous
   └─ Back-office: liste des réservations
   └─ Peut confirmer, annuler, reprogrammer
   └─ Intégration optionnelle avec Calendly
```

### 3.3 Flux: Génération de contenu blog

```
1. Marie accède à l'admin panel
   └─ Section "Blog"

2. Crée un nouvel article
   └─ Titre, slug, description, contenu, catégorie, tags

3. Édite le contenu
   └─ Éditeur markdown ou rich text
   └─ Aperçu en temps réel

4. Ajoute les métadonnées SEO
   └─ Meta title, meta description, keywords, og:image

5. Publie l'article
   └─ Statut: "published"
   └─ Date de publication automatique

6. Article visible sur le site
   └─ Accessible via /blog/slug
   └─ Indexable par les moteurs de recherche
   └─ Partage sur les réseaux sociaux
```

---

## 4. Structure de base de données

### 4.1 Tables principales

```sql
-- Users (existante, du template)
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  openId VARCHAR(64) UNIQUE NOT NULL,
  name TEXT,
  email VARCHAR(320),
  role ENUM('user', 'admin') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  lastSignedIn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Booklet Requests
CREATE TABLE booklet_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  dateOfBirth DATE NOT NULL,
  timeOfBirth TIME NOT NULL,
  placeOfBirth VARCHAR(200) NOT NULL,
  email VARCHAR(320) NOT NULL,
  message TEXT,
  status ENUM('pending', 'generated', 'sent', 'completed') DEFAULT 'pending',
  generatedBookletId INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (generatedBookletId) REFERENCES generated_booklets(id)
);

-- Generated Booklets
CREATE TABLE generated_booklets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  bookletRequestId INT NOT NULL,
  sunSign VARCHAR(50),
  moonSign VARCHAR(50),
  ascendant VARCHAR(50),
  documentUrl VARCHAR(500),
  documentFormat ENUM('pdf', 'pptx') DEFAULT 'pdf',
  contentData JSON,
  status ENUM('draft', 'ready', 'sent', 'downloaded') DEFAULT 'draft',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (bookletRequestId) REFERENCES booklet_requests(id)
);

-- Appointments
CREATE TABLE appointments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(320) NOT NULL,
  phone VARCHAR(20),
  appointmentDate DATETIME NOT NULL,
  message TEXT,
  status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Blog Articles
CREATE TABLE blog_articles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content LONGTEXT NOT NULL,
  excerpt VARCHAR(500),
  metaDescription VARCHAR(160),
  keywords VARCHAR(255),
  ogImage VARCHAR(500),
  categoryId INT,
  authorId INT,
  status ENUM('draft', 'published') DEFAULT 'draft',
  publishedAt TIMESTAMP NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (categoryId) REFERENCES blog_categories(id),
  FOREIGN KEY (authorId) REFERENCES users(id)
);

-- Blog Categories
CREATE TABLE blog_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog Tags
CREATE TABLE blog_tags (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Article-Tag Junction
CREATE TABLE article_tags (
  articleId INT NOT NULL,
  tagId INT NOT NULL,
  PRIMARY KEY (articleId, tagId),
  FOREIGN KEY (articleId) REFERENCES blog_articles(id) ON DELETE CASCADE,
  FOREIGN KEY (tagId) REFERENCES blog_tags(id) ON DELETE CASCADE
);

-- Content Library: Signs
CREATE TABLE astro_signs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE,
  symbol VARCHAR(10),
  element VARCHAR(20),
  description LONGTEXT,
  strengths LONGTEXT,
  challenges LONGTEXT,
  advice LONGTEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Content Library: Planets
CREATE TABLE astro_planets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE,
  symbol VARCHAR(10),
  meaning LONGTEXT,
  influence LONGTEXT,
  interpretation LONGTEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Content Library: Houses
CREATE TABLE astro_houses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  houseNumber INT NOT NULL UNIQUE,
  meaning LONGTEXT,
  influence LONGTEXT,
  interpretation LONGTEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Booklet Templates
CREATE TABLE booklet_templates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  section VARCHAR(50) NOT NULL,
  content LONGTEXT,
  order INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 4.2 Indices pour performance

```sql
CREATE INDEX idx_booklet_requests_email ON booklet_requests(email);
CREATE INDEX idx_booklet_requests_status ON booklet_requests(status);
CREATE INDEX idx_booklet_requests_createdAt ON booklet_requests(createdAt);
CREATE INDEX idx_appointments_email ON appointments(email);
CREATE INDEX idx_appointments_appointmentDate ON appointments(appointmentDate);
CREATE INDEX idx_blog_articles_slug ON blog_articles(slug);
CREATE INDEX idx_blog_articles_status ON blog_articles(status);
CREATE INDEX idx_blog_articles_publishedAt ON blog_articles(publishedAt);
```

---

## 5. Stack technique recommandé

### Frontend
- **React 19** - Framework UI
- **Tailwind CSS 4** - Styling (palette: beige, cream, soft gold, warm brown)
- **React Hook Form** - Gestion des formulaires
- **Zod** - Validation des schémas
- **Wouter** - Routage léger
- **tRPC** - Communication avec le backend

### Backend
- **Express 4** - Serveur web
- **tRPC** - API type-safe
- **Drizzle ORM** - Gestion de base de données
- **Node.js** - Runtime

### Base de données
- **MySQL 8** ou **TiDB** (compatible MySQL)
- Hébergé sur Manus (inclus)

### Génération de documents
- **PDFKit** ou **Puppeteer** - Génération PDF
- **pptx** (librairie npm) - Génération PowerPoint

### Hébergement & Déploiement
- **Manus** - Plateforme tout-en-un (incluse)
- Déploiement automatique depuis le projet

### Authentification
- **Manus OAuth** - Déjà intégré

---

## 6. Plan d'implémentation (Ordre recommandé)

### Phase 1: Fondations (Semaine 1)
1. ✅ Initialiser le projet (scaffold web-db-user)
2. ✅ Configurer la base de données (tables, schémas)
3. ✅ Définir les routes tRPC de base
4. ✅ Mettre en place la navigation et le layout principal

### Phase 2: Pages publiques (Semaine 1-2)
5. ✅ Créer la page Home (héro, présentation, CTA)
6. ✅ Créer les pages Services, About, FAQ, Contact
7. ✅ Créer la page Astral Booklet (explication + exemple)
8. ✅ Créer la page Blog (structure SEO)

### Phase 3: Formulaires & Validation (Semaine 2)
9. ✅ Implémenter le formulaire Booklet Request
10. ✅ Implémenter le formulaire Appointment Booking
11. ✅ Ajouter la validation côté client et serveur
12. ✅ Intégrer les notifications par email

### Phase 4: Content Library (Semaine 2-3)
13. ✅ Créer les tables de contenu (signs, planets, houses)
14. ✅ Remplir la bibliothèque avec du contenu initial
15. ✅ Créer les endpoints pour accéder au contenu

### Phase 5: Booklet Generator (Semaine 3)
16. ✅ Implémenter le calcul astrologique (sun, moon, ascendant)
17. ✅ Créer l'engine d'assemblage du livret
18. ✅ Implémenter la génération PDF/PPTX
19. ✅ Tester la génération de bout en bout

### Phase 6: Back-office Admin (Semaine 3-4)
20. ✅ Créer le dashboard admin
21. ✅ Implémenter le manager de demandes de livret
22. ✅ Implémenter le manager de rendez-vous
23. ✅ Ajouter les fonctionnalités CRUD

### Phase 7: Blog & SEO (Semaine 4)
24. ✅ Implémenter le système de blog complet
25. ✅ Ajouter les métadonnées SEO
26. ✅ Générer sitemap.xml
27. ✅ Ajouter les pages légales (mentions légales, politique de confidentialité)

### Phase 8: Optimisation & Déploiement (Semaine 4-5)
28. ✅ Tests complets (formulaires, génération, admin)
29. ✅ Optimisation des performances
30. ✅ Vérification de la responsivité mobile
31. ✅ Déploiement sur Manus

---

## 7. Considérations futures

### 7.1 Intégration IA Assistant
- Endpoint API défini: `/api/trpc/ai.generateContent`
- Paramètres: `{ type: 'blog' | 'booklet' | 'email', context: string }`
- Réponse: `{ content: string, suggestions: string[] }`
- À connecter avec l'agent IA personnalisé de l'utilisateur

### 7.2 Améliorations possibles
- Système de paiement (Stripe) pour les livrets premium
- Intégration Calendly pour les rendez-vous
- Système de commentaires sur le blog
- Analytics avancées
- Système de newsletters
- Intégration Instagram API pour flux automatique
- Système de recommandations (articles connexes)
- Chatbot pour les questions fréquentes

### 7.3 Scalabilité
- Architecture modulaire permet l'ajout facile de nouvelles fonctionnalités
- Base de données normalisée pour éviter les redondances
- API tRPC extensible
- Séparation claire entre frontend et backend

---

## 8. Directives de design

### Palette de couleurs
- **Primaire:** Beige clair (#F5F1E8)
- **Secondaire:** Crème (#FFF8F0)
- **Accent:** Doré doux (#D4AF6A)
- **Texte:** Brun chaud (#5C4A3D)
- **Accent sombre:** Brun profond (#3E2723)

### Typographie
- **Titres:** Serif élégant (ex: Playfair Display, Cormorant)
- **Corps:** Sans-serif moderne (ex: Inter, Poppins)
- **Accent:** Serif léger pour les citations

### Spacing & Layout
- Approche mobile-first
- Beaucoup d'espace blanc
- Sections bien délimitées
- Padding généreux

### Ton & Voix
- Doux, rassurant, spirituel
- Moderne sans être kitsch
- Professionnel mais accessible
- Inclusif et bienveillant

---

## 9. Métriques de succès

- ✅ Toutes les pages créées et responsive
- ✅ Formulaires fonctionnels avec validation
- ✅ Système de génération de livret opérationnel
- ✅ Back-office admin complet
- ✅ Blog SEO-optimisé
- ✅ Performance: < 3s page load
- ✅ Mobile-first: 100% responsive
- ✅ Accessibilité: WCAG AA minimum
- ✅ Sécurité: HTTPS, CSRF protection, input sanitization

---

## 10. Conclusion

Cette architecture fournit une base solide pour "Les Tirages de Marie" tout en restant modulaire et évolutive. Chaque composant peut être amélioré ou remplacé indépendamment sans affecter les autres. La structure est prête pour l'intégration future d'un agent IA personnalisé et d'autres fonctionnalités avancées.

L'approche MVP garantit une mise en marché rapide tout en maintenant la qualité et la professionnalité attendues.
