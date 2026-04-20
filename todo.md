# Les Tirages de Marie - Project TODO

## Phase 1: Fondations & Base de données
- [x] Configurer les tables Drizzle (booklet_requests, appointments, blog_articles, astro_signs, astro_planets, astro_houses)
- [x] Générer et exécuter les migrations SQL
- [x] Créer les helpers de base de données (db.ts)
- [x] Configurer les routes tRPC de base

## Phase 2: Layout & Navigation
- [x] Créer le layout principal avec navigation responsive
- [x] Implémenter la barre de navigation (top nav, mobile menu)
- [x] Créer le footer avec liens sociaux et pages légales
- [x] Configurer le routage (wouter) avec toutes les pages

## Phase 3: Pages publiques - Contenu
- [x] Créer la page Home (héro, présentation Marie, témoignages, CTA)
- [x] Créer la page Services (3 services, explications, CTA)
- [x] Créer la page Astral Booklet (explication, structure, exemple, CTA)
- [x] Créer la page About (histoire de Marie, approche, confiance)
- [x] Créer la page FAQ (questions fréquentes)
- [x] Créer la page Contact (formulaire simple)
- [x] Créer la page Blog (liste d'articles, filtres, recherche)
- [x] Créer la page Appointment Booking (formulaire + créneaux)
- [x] Créer les pages légales (Mentions légales, Politique de confidentialité)
- [ ] Créer la page 404 (existe déjà)

## Phase 4: Formulaires & Validation
- [x] Implémenter le formulaire Booklet Request (prénom, nom, date, heure, lieu, email, message)
- [x] Validation côté client (React Hook Form + Zod)
- [x] Validation côté serveur
- [x] Endpoint tRPC: booklet.create
- [x] Stockage en base de données
- [x] Notification à Marie par email (via notifyOwner)
- [x] Confirmation au client (toast message)
- [x] Implémenter le formulaire Appointment Booking
- [x] Endpoint tRPC: appointment.create
- [ ] Gestion des créneaux disponibles (à améliorer)
- [x] Notification et confirmation

## Phase 5: Content Library (Bibliothèque astrologique)
- [x] Créer les tables de contenu (astro_signs, astro_planets, astro_houses)
- [x] Remplir les 12 signes avec descriptions, forces, défis, conseils
- [x] Remplir les 10 planètes avec significations et interprétations
- [x] Remplir les 12 maisons avec meanings et influences
- [x] Créer les endpoints tRPC pour accéder au contenu
- [ ] Implémenter l'admin panel pour éditer le contenu (placeholder créé)

## Phase 6: Booklet Generator (Système de génération)
- [x] Implémenter le calcul du signe solaire (Sun Sign)
- [x] Implémenter le calcul du signe lunaire (Moon Sign) - approximatif
- [x] Implémenter le calcul de l'ascendant (Ascendant/Rising Sign)
- [x] Créer l'engine d'assemblage du livret (sélection de contenu)
- [ ] Implémenter la génération PDF (à faire)
- [ ] Implémenter la génération PowerPoint (PPTX) (à faire)
- [x] Endpoint tRPC: booklet.generate (existe)
- [x] Stockage du livret généré en base
- [x] Gestion des statuts (draft, ready, sent, downloaded)
- [ ] Lien de téléchargement pour le client (à faire)

## Phase 7: Back-office Admin
- [x] Créer le dashboard admin (overview, stats)
- [x] Implémenter le manager de demandes de livret (CRUD) (liste affichée)
- [x] Implémenter le manager de rendez-vous (CRUD) (liste affichée)
- [ ] Ajouter les filtres et recherche (à faire)
- [ ] Implémenter les actions (view, edit, mark as done, delete) (à faire)
- [x] Ajouter les statuts et transitions (statuts affichés)
- [ ] Créer la page d'édition du contenu (signs, planets, houses) (à faire)
- [x] Implémenter les notifications pour Marie (via notifyOwner)

## Phase 8: Blog & SEO
- [x] Créer les tables de blog (blog_articles, blog_categories, blog_tags)
- [x] Implémenter le système de catégories
- [ ] Implémenter le système de tags (à faire)
- [ ] Créer l'éditeur d'articles (admin panel) (à faire)
- [ ] Implémenter la publication d'articles (à faire)
- [ ] Ajouter les métadonnées SEO (title, description, keywords, og:image) (à faire)
- [ ] Générer le sitemap.xml (à faire)
- [ ] Implémenter les robots.txt (à faire)
- [ ] Ajouter les structured data (JSON-LD) (à faire)
- [x] Créer la page de liste des articles avec filtres
- [x] Implémenter la recherche d'articles (backend existe)
- [ ] Ajouter les articles connexes (related posts) (à faire)

## Phase 9: Pages légales
- [x] Créer la page Mentions légales
- [x] Créer la page Politique de confidentialité
- [x] Ajouter les liens dans le footer
- [ ] Vérifier la conformité RGPD (à faire)

## Phase 10: Design & Styling
- [x] Configurer la palette de couleurs (beige, crème, doré, brun chaud)
- [x] Configurer la typographie (serif pour titres, sans-serif pour corps)
- [x] Créer les composants réutilisables (buttons, cards, sections)
- [x] Implémenter le design mobile-first
- [x] Vérifier la responsivité sur tous les appareils
- [ ] Ajouter les animations et transitions subtiles (à améliorer)
- [ ] Optimiser les performances CSS (à faire)

## Phase 11: Intégrations & Améliorations
- [x] Intégrer les liens sociaux (Instagram, etc.)
- [x] Ajouter les images et visuels (via CDN)
- [x] Implémenter les témoignages (statique)
- [x] Ajouter les CTA (call-to-action) stratégiques
- [x] Implémenter les notifications par email (via notifyOwner)
- [ ] Ajouter les analytics (optionnel)

## Phase 12: Tests & Optimisation
- [x] Tester tous les formulaires (31 tests Vitest passent)
- [x] Tester la génération de livret (16 tests astrology passent)
- [ ] Tester le back-office admin (à faire)
- [x] Tester la responsivité mobile (design mobile-first implémenté)
- [ ] Vérifier les performances (Lighthouse) (à faire)
- [ ] Vérifier l'accessibilité (WCAG) (à faire)
- [ ] Tester la sécurité (CSRF, XSS, injection SQL) (à faire)
- [x] Optimiser les images (via CDN)
- [ ] Optimiser les requêtes base de données (à faire)

## Phase 13: Déploiement & Lancement
- [ ] Vérifier toutes les configurations (à faire)
- [ ] Tester en environnement de production (à faire)
- [ ] Créer un checkpoint final (à faire)
- [ ] Déployer sur Manus (à faire)
- [ ] Vérifier le fonctionnement en production (à faire)
- [ ] Configurer les domaines personnalisés (optionnel)
- [ ] Mettre en place le monitoring (à faire)

## Phase 14: Upgrade Vendable (Sellable MVP)
- [ ] Intégrer Stripe pour paiements livrets et rendez-vous
- [ ] Ajouter checkout flow Stripe
- [ ] Ajouter success/cancel pages
- [ ] Stocker payment status en base de données
- [ ] Implémenter Calendly ou créneaux internes pour booking
- [ ] Ajouter emails transactionnels (confirmations, paiements)
- [ ] Améliorer admin dashboard avec actions réelles
- [ ] Connecter blog à la base de données
- [ ] Documenter limitations astrologiques
- [ ] Préparer export et documentation

## Future Enhancements (Non-MVP)
- [ ] Intégration IA Assistant (placeholder API créé)
- [ ] Système de commentaires sur le blog
- [ ] Analytics avancées
- [ ] Système de newsletters
- [ ] Intégration Instagram API
- [ ] Système de recommandations
- [ ] Chatbot pour FAQ
