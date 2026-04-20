/**
 * Constantes partagées entre le frontend et le backend
 */

// ============================================================================
// BRANDING & DESIGN
// ============================================================================

export const BRAND = {
  name: "Les Tirages de Marie",
  tagline: "Guidances et livrets astrologiques personnalisés",
  description:
    "Découvrez votre profil astrologique unique et recevez des guidances spirituelles adaptées à votre destinée.",
};

export const COLORS = {
  primary: "#F5F1E8", // Beige clair
  secondary: "#FFF8F0", // Crème
  accent: "#D4AF6A", // Doré doux
  text: "#5C4A3D", // Brun chaud
  textDark: "#3E2723", // Brun profond
  border: "#E8DDD0", // Beige moyen
};

export const TYPOGRAPHY = {
  fontFamily: {
    serif: "'Playfair Display', serif",
    sans: "'Inter', sans-serif",
  },
};

// ============================================================================
// ROUTES
// ============================================================================

export const ROUTES = {
  HOME: "/",
  SERVICES: "/services",
  BOOKLET: "/booklet",
  BOOKING: "/booking",
  BLOG: "/blog",
  ABOUT: "/about",
  FAQ: "/faq",
  CONTACT: "/contact",
  ADMIN: "/admin",
  ADMIN_LOGIN: "/admin/login",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_REQUESTS: "/admin/requests",
  ADMIN_APPOINTMENTS: "/admin/appointments",
  ADMIN_CONTENT: "/admin/content",
  ADMIN_BLOG: "/admin/blog",
  LEGAL_MENTIONS: "/mentions-legales",
  LEGAL_PRIVACY: "/politique-de-confidentialite",
  PAYMENT_SUCCESS: "/payment-success",
  PAYMENT_CANCEL: "/payment-cancel",
};

// ============================================================================
// SERVICES
// ============================================================================

export const SERVICES = [
  {
    id: "readings",
    title: "Tirages & Guidances",
    description:
      "Des lectures intuitives et des guidances personnalisées pour éclairer votre chemin.",
    icon: "✨",
  },
  {
    id: "booklet",
    title: "Livret Astral Personnalisé",
    description:
      "Un livret complet analysant votre profil astrologique unique et vos influences planétaires.",
    icon: "📖",
  },
  {
    id: "consultation",
    title: "Consultations Privées",
    description:
      "Des séances en profondeur pour explorer votre destinée et vos cycles de vie.",
    icon: "🌙",
  },
];

// ============================================================================
// FORM FIELDS (Exact French naming as required)
// ============================================================================

export const BOOKLET_FORM_FIELDS = {
  firstName: "prénom",
  lastName: "nom",
  dateOfBirth: "date de naissance",
  timeOfBirth: "heure de naissance",
  placeOfBirth: "lieu de naissance",
  email: "email",
  message: "message",
};

export const APPOINTMENT_FORM_FIELDS = {
  firstName: "prénom",
  lastName: "nom",
  email: "email",
  phone: "téléphone",
  appointmentDate: "date et heure",
  message: "message",
};

// ============================================================================
// ASTROLOGY DATA
// ============================================================================

export const ZODIAC_SIGNS = [
  { name: "Aries", symbol: "♈", element: "Fire", dateRange: "Mar 21 - Apr 19" },
  {
    name: "Taurus",
    symbol: "♉",
    element: "Earth",
    dateRange: "Apr 20 - May 20",
  },
  {
    name: "Gemini",
    symbol: "♊",
    element: "Air",
    dateRange: "May 21 - Jun 20",
  },
  {
    name: "Cancer",
    symbol: "♋",
    element: "Water",
    dateRange: "Jun 21 - Jul 22",
  },
  { name: "Leo", symbol: "♌", element: "Fire", dateRange: "Jul 23 - Aug 22" },
  {
    name: "Virgo",
    symbol: "♍",
    element: "Earth",
    dateRange: "Aug 23 - Sep 22",
  },
  {
    name: "Libra",
    symbol: "♎",
    element: "Air",
    dateRange: "Sep 23 - Oct 22",
  },
  {
    name: "Scorpio",
    symbol: "♏",
    element: "Water",
    dateRange: "Oct 23 - Nov 21",
  },
  {
    name: "Sagittarius",
    symbol: "♐",
    element: "Fire",
    dateRange: "Nov 22 - Dec 21",
  },
  {
    name: "Capricorn",
    symbol: "♑",
    element: "Earth",
    dateRange: "Dec 22 - Jan 19",
  },
  {
    name: "Aquarius",
    symbol: "♒",
    element: "Air",
    dateRange: "Jan 20 - Feb 18",
  },
  {
    name: "Pisces",
    symbol: "♓",
    element: "Water",
    dateRange: "Feb 19 - Mar 20",
  },
];

export const PLANETS = [
  "Sun",
  "Moon",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Uranus",
  "Neptune",
  "Pluto",
];

export const HOUSES = Array.from({ length: 12 }, (_, i) => `House ${i + 1}`);

// ============================================================================
// SOCIAL MEDIA
// ============================================================================

export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/lestiragesdemarie",
  facebook: "https://facebook.com/lestiragesdemarie",
  email: "marie@lestiragesdemarie.fr",
};

// ============================================================================
// CONTENT ENGINE
// ============================================================================

export const CONTENT_ENGINE_TYPES = {
  INSTAGRAM_POST: "instagram_post",
  BLOG_ARTICLE: "blog_article",
  GUIDANCE_TEXT: "guidance_text",
};

export const TONE_OF_VOICE = {
  style: "soft, spiritual, warm, reassuring, modern",
  avoid: "clichéd, kitsch, overly mystical, generic",
  pillars: [
    "Spiritual guidance",
    "Personal growth",
    "Cosmic wisdom",
    "Authentic connection",
  ],
};

// ============================================================================
// CRM STATUSES
// ============================================================================

export const CRM_STATUSES = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  DELIVERED: "delivered",
  COMPLETED: "completed",
};

export const BOOKLET_STATUSES = {
  PENDING: "pending",
  GENERATED: "generated",
  SENT: "sent",
  COMPLETED: "completed",
};

export const APPOINTMENT_STATUSES = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

// ============================================================================
// PAGINATION
// ============================================================================

export const PAGINATION = {
  ITEMS_PER_PAGE: 10,
  BLOG_ITEMS_PER_PAGE: 12,
};

// ============================================================================
// VALIDATION
// ============================================================================

export const VALIDATION = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MAX_EMAIL_LENGTH: 320,
  MAX_MESSAGE_LENGTH: 5000,
};
