/**
 * Astrology Engine - Calculs et contenu astrologique
 * Gère les calculs de signe solaire, lunaire, ascendant et la sélection de contenu
 */

export interface AstrologyData {
  dateOfBirth: string; // YYYY-MM-DD
  timeOfBirth: string; // HH:MM
  placeOfBirth: string;
  sunSign: string;
  moonSign: string;
  ascendant: string;
  planets: Record<string, string>;
  houses: Record<string, string>;
}

export interface BookletContent {
  coverTitle: string;
  introduction: string;
  sunSignContent: string;
  moonSignContent: string;
  ascendantContent: string;
  planetaryInfluences: Record<string, string>;
  housesContent: Record<string, string>;
  conclusion: string;
}

// Zodiac signs
const ZODIAC_SIGNS = [
  "Bélier",
  "Taureau",
  "Gémeaux",
  "Cancer",
  "Lion",
  "Vierge",
  "Balance",
  "Scorpion",
  "Sagittaire",
  "Capricorne",
  "Verseau",
  "Poissons",
];

// Simplified zodiac date ranges (approximate)
const ZODIAC_DATES: Record<string, [number, number]> = {
  "Bélier": [3, 21],
  "Taureau": [4, 20],
  "Gémeaux": [5, 21],
  "Cancer": [6, 21],
  "Lion": [7, 23],
  "Vierge": [8, 23],
  "Balance": [9, 23],
  "Scorpion": [10, 23],
  "Sagittaire": [11, 22],
  "Capricorne": [12, 22],
  "Verseau": [1, 20],
  "Poissons": [2, 19],
};

/**
 * Calculate sun sign based on birth date
 */
export function calculateSunSign(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const monthDay = month * 100 + day;

  for (const [sign, [startMonth, startDay]] of Object.entries(ZODIAC_DATES)) {
    const startDate = startMonth * 100 + startDay;
    const endMonth = (startMonth % 12) + 1;
    const endDay = ZODIAC_DATES[ZODIAC_SIGNS[(ZODIAC_SIGNS.indexOf(sign) + 1) % 12]][1];
    const endDate = endMonth * 100 + endDay;

    if (startDate <= endDate) {
      if (monthDay >= startDate && monthDay <= endDate) return sign;
    } else {
      if (monthDay >= startDate || monthDay <= endDate) return sign;
    }
  }

  return "Capricorne";
}

/**
 * Calculate moon sign (simplified - based on birth date only)
 * In reality, this requires precise time and ephemeris data
 */
export function calculateMoonSign(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const dayOfYear =
    new Date(year, month - 1, day).getTime() - new Date(year, 0, 0).getTime();
  const moonCycle = dayOfYear % 27.3; // Moon cycle is ~27.3 days
  const signIndex = Math.floor((moonCycle / 27.3) * 12);
  return ZODIAC_SIGNS[signIndex];
}

/**
 * Calculate ascendant (simplified - based on birth time)
 * In reality, this requires precise time and location data
 */
export function calculateAscendant(timeStr: string): string {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes;
  const signIndex = Math.floor((totalMinutes / (24 * 60)) * 12);
  return ZODIAC_SIGNS[signIndex];
}

/**
 * Get planetary positions (simplified - returns a sign for each planet)
 */
export function getPlanetaryPositions(dateStr: string): Record<string, string> {
  const planets = [
    "Mercure",
    "Vénus",
    "Mars",
    "Jupiter",
    "Saturne",
    "Uranus",
    "Neptune",
    "Pluton",
  ];
  const positions: Record<string, string> = {};

  const [year, month, day] = dateStr.split("-").map(Number);
  const dayOfYear =
    new Date(year, month - 1, day).getTime() - new Date(year, 0, 0).getTime();

  planets.forEach((planet, idx) => {
    const cycle = 365 / (idx + 2); // Each planet has a different cycle
    const signIndex = Math.floor(((dayOfYear % cycle) / cycle) * 12);
    positions[planet] = ZODIAC_SIGNS[signIndex];
  });

  return positions;
}

/**
 * Get house positions (simplified - based on birth time)
 */
export function getHousePositions(timeStr: string): Record<string, string> {
  const houses: Record<string, string> = {};
  const [hours, minutes] = timeStr.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes;

  for (let i = 1; i <= 12; i++) {
    const signIndex = Math.floor(((totalMinutes + i * 120) / (24 * 60)) * 12);
    houses[`Maison ${i}`] = ZODIAC_SIGNS[signIndex % 12];
  }

  return houses;
}

/**
 * Content library organized by sign, planet, and house
 */
const CONTENT_LIBRARY = {
  sunSigns: {
    "Bélier":
      "Vous êtes un Bélier, signe de feu gouverné par Mars. Votre essence est celle d'un pionnier courageux, d'un leader naturel qui fonce vers ses objectifs avec passion et détermination. Vous êtes dynamique, impulsif et plein d'énergie. Votre défi est d'apprendre la patience et à considérer les conséquences de vos actions.",
    "Taureau":
      "Vous êtes un Taureau, signe de terre gouverné par Vénus. Votre essence est celle d'un bâtisseur stable et fiable, appréciant les plaisirs de la vie et la sécurité matérielle. Vous êtes déterminé, sensuel et loyal. Votre défi est d'accepter le changement et de cultiver la flexibilité.",
    "Gémeaux":
      "Vous êtes un Gémeaux, signe d'air gouverné par Mercure. Votre essence est celle d'un communicateur curieux et adaptable, toujours en quête de nouvelles connaissances. Vous êtes intellectuel, social et versatile. Votre défi est de cultiver la profondeur et la concentration.",
    "Cancer":
      "Vous êtes un Cancer, signe d'eau gouverné par la Lune. Votre essence est celle d'un protecteur émotionnel, profondément connecté à vos racines et à votre famille. Vous êtes intuitif, sensible et nourricier. Votre défi est de gérer vos émotions et de créer des limites saines.",
    "Lion":
      "Vous êtes un Lion, signe de feu gouverné par le Soleil. Votre essence est celle d'un créateur confiant et généreux, cherchant à briller et à inspirer. Vous êtes charismatique, courageux et loyal. Votre défi est de cultiver l'humilité et d'écouter les autres.",
    "Vierge":
      "Vous êtes une Vierge, signe de terre gouverné par Mercure. Votre essence est celle d'un analyste minutieux et pratique, cherchant la perfection et l'ordre. Vous êtes intelligent, consciencieux et utile. Votre défi est de lâcher prise et d'accepter l'imperfection.",
    "Balance":
      "Vous êtes une Balance, signe d'air gouverné par Vénus. Votre essence est celle d'un diplomate esthète, cherchant l'harmonie et l'équilibre en toutes choses. Vous êtes juste, social et raffiné. Votre défi est de prendre des décisions et de cultiver votre assertivité.",
    "Scorpion":
      "Vous êtes un Scorpion, signe d'eau gouverné par Pluton. Votre essence est celle d'un transformateur intense, plongé dans les mystères de la vie et de la mort. Vous êtes passionné, intuitif et puissant. Votre défi est de cultiver la confiance et de lâcher le contrôle.",
    "Sagittaire":
      "Vous êtes un Sagittaire, signe de feu gouverné par Jupiter. Votre essence est celle d'un aventurier philosophe, en quête de sens et d'expansion. Vous êtes optimiste, aventureux et sage. Votre défi est de cultiver la discipline et de terminer ce que vous commencez.",
    "Capricorne":
      "Vous êtes un Capricorne, signe de terre gouverné par Saturne. Votre essence est celle d'un bâtisseur ambitieux, cherchant la réussite et la reconnaissance. Vous êtes responsable, discipliné et persévérant. Votre défi est de cultiver la joie et la légèreté.",
    "Verseau":
      "Vous êtes un Verseau, signe d'air gouverné par Uranus. Votre essence est celle d'un visionnaire indépendant, cherchant à transformer le monde. Vous êtes innovant, humanitaire et unique. Votre défi est de cultiver l'intimité et la connexion émotionnelle.",
    "Poissons":
      "Vous êtes un Poisson, signe d'eau gouverné par Neptune. Votre essence est celle d'un rêveur spirituel, connecté à l'invisible et à l'imagination. Vous êtes empathique, créatif et mystique. Votre défi est de cultiver la clarté et les limites.",
  },

  moonSigns: {
    "Bélier":
      "Votre Lune en Bélier vous donne des émotions vives et directes. Vous réagissez rapidement aux situations et avez besoin d'action pour vous sentir vivant.",
    "Taureau":
      "Votre Lune en Taureau vous donne une stabilité émotionnelle et un besoin de sécurité. Vous appréciez le confort et les plaisirs sensoriels.",
    "Gémeaux":
      "Votre Lune en Gémeaux vous donne une curiosité émotionnelle et un besoin de communication. Vous traitez vos émotions par la parole et l'analyse.",
    "Cancer":
      "Votre Lune en Cancer vous donne une profondeur émotionnelle et un besoin de sécurité affective. Vous êtes très intuitif et protecteur.",
    "Lion":
      "Votre Lune en Lion vous donne un besoin de reconnaissance émotionnelle et de créativité. Vous êtes généreux et chaleureux dans vos relations.",
    "Vierge":
      "Votre Lune en Vierge vous donne une analyse émotionnelle et un besoin d'ordre. Vous êtes pratique et utile dans vos relations.",
    "Balance":
      "Votre Lune en Balance vous donne un besoin d'harmonie émotionnelle et de relation. Vous êtes diplomate et cherchez l'équilibre.",
    "Scorpion":
      "Votre Lune en Scorpion vous donne une intensité émotionnelle et une profondeur. Vous êtes passionné et mystérieux.",
    "Sagittaire":
      "Votre Lune en Sagittaire vous donne un besoin d'aventure émotionnelle et de liberté. Vous êtes optimiste et expansif.",
    "Capricorne":
      "Votre Lune en Capricorne vous donne une réserve émotionnelle et un besoin de contrôle. Vous êtes responsable et ambitieux.",
    "Verseau":
      "Votre Lune en Verseau vous donne une indépendance émotionnelle et un besoin de liberté. Vous êtes détaché et humanitaire.",
    "Poissons":
      "Votre Lune en Poissons vous donne une sensibilité émotionnelle et une imagination riche. Vous êtes empathique et spirituel.",
  },

  ascendants: {
    "Bélier":
      "Votre Ascendant Bélier vous donne une apparence dynamique et courageuse. Vous semblez être un leader naturel et une personne d'action.",
    "Taureau":
      "Votre Ascendant Taureau vous donne une apparence stable et sensuelle. Vous semblez être une personne fiable et de bon goût.",
    "Gémeaux":
      "Votre Ascendant Gémeaux vous donne une apparence jeune et communicative. Vous semblez être une personne curieuse et versatile.",
    "Cancer":
      "Votre Ascendant Cancer vous donne une apparence douce et protectrice. Vous semblez être une personne sensible et bienveillante.",
    "Lion":
      "Votre Ascendant Lion vous donne une apparence charismatique et confiante. Vous semblez être une personne créative et généreuse.",
    "Vierge":
      "Votre Ascendant Vierge vous donne une apparence soignée et analytique. Vous semblez être une personne pratique et consciencieuse.",
    "Balance":
      "Votre Ascendant Balance vous donne une apparence gracieuse et harmonieuse. Vous semblez être une personne diplomate et esthète.",
    "Scorpion":
      "Votre Ascendant Scorpion vous donne une apparence mystérieuse et intense. Vous semblez être une personne profonde et puissante.",
    "Sagittaire":
      "Votre Ascendant Sagittaire vous donne une apparence aventureuse et optimiste. Vous semblez être une personne ouverte et philosophe.",
    "Capricorne":
      "Votre Ascendant Capricorne vous donne une apparence sérieuse et ambitieuse. Vous semblez être une personne responsable et professionnelle.",
    "Verseau":
      "Votre Ascendant Verseau vous donne une apparence unique et indépendante. Vous semblez être une personne originale et visionnaire.",
    "Poissons":
      "Votre Ascendant Poissons vous donne une apparence douce et spirituelle. Vous semblez être une personne créative et mystérieuse.",
  },

  planets: {
    "Mercure":
      "Mercure dans votre thème gouverne votre communication et votre intellect. Elle influence votre façon de penser, d'apprendre et de vous exprimer.",
    "Vénus":
      "Vénus dans votre thème gouverne votre amour et votre beauté. Elle influence vos relations, vos valeurs et votre appréciation de l'esthétique.",
    "Mars":
      "Mars dans votre thème gouverne votre énergie et votre passion. Elle influence votre courage, votre désir et votre capacité d'action.",
    "Jupiter":
      "Jupiter dans votre thème gouverne votre expansion et votre chance. Elle influence votre optimisme, votre générosité et votre croissance.",
    "Saturne":
      "Saturne dans votre thème gouverne votre discipline et votre responsabilité. Elle influence votre maturité, votre sagesse et vos défis de croissance.",
    "Uranus":
      "Uranus dans votre thème gouverne votre innovation et votre liberté. Elle influence votre originalité, votre rébellion et votre transformation.",
    "Neptune":
      "Neptune dans votre thème gouverne votre spiritualité et votre imagination. Elle influence votre créativité, votre intuition et votre connexion au divin.",
    "Pluton":
      "Pluton dans votre thème gouverne votre transformation et votre pouvoir. Elle influence votre profondeur, votre régénération et votre évolution.",
  },

  houses: {
    "Maison 1":
      "La Maison 1 représente votre identité et votre apparence. Elle gouverne comment vous vous présentez au monde et votre première impression.",
    "Maison 2":
      "La Maison 2 représente vos ressources et vos valeurs. Elle gouverne vos finances, vos possessions et votre estime de soi.",
    "Maison 3":
      "La Maison 3 représente votre communication et vos apprentissages. Elle gouverne vos pensées, vos études et vos relations fraternelles.",
    "Maison 4":
      "La Maison 4 représente votre foyer et vos racines. Elle gouverne votre famille, votre maison et votre fondation émotionnelle.",
    "Maison 5":
      "La Maison 5 représente votre créativité et votre romance. Elle gouverne vos loisirs, vos amours et votre expression créative.",
    "Maison 6":
      "La Maison 6 représente votre travail et votre santé. Elle gouverne votre emploi, votre routine et votre bien-être physique.",
    "Maison 7":
      "La Maison 7 représente vos partenariats et votre mariage. Elle gouverne vos relations, vos contrats et votre vie conjugale.",
    "Maison 8":
      "La Maison 8 représente votre transformation et vos ressources partagées. Elle gouverne l'intimité, l'héritage et la régénération.",
    "Maison 9":
      "La Maison 9 représente votre philosophie et vos voyages. Elle gouverne vos croyances, vos études supérieures et vos aventures.",
    "Maison 10":
      "La Maison 10 représente votre carrière et votre réputation. Elle gouverne votre profession, votre statut social et votre héritage public.",
    "Maison 11":
      "La Maison 11 représente vos amis et vos espoirs. Elle gouverne vos amitiés, vos groupes et vos rêves pour l'avenir.",
    "Maison 12":
      "La Maison 12 représente votre spiritualité et l'inconscient. Elle gouverne votre vie intérieure, vos secrets et votre connexion au divin.",
  },
};

/**
 * Generate astrology data for a person
 */
export function generateAstrologyData(
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  timeOfBirth: string,
  placeOfBirth: string
): AstrologyData {
  const sunSign = calculateSunSign(dateOfBirth);
  const moonSign = calculateMoonSign(dateOfBirth);
  const ascendant = calculateAscendant(timeOfBirth);
  const planets = getPlanetaryPositions(dateOfBirth);
  const houses = getHousePositions(timeOfBirth);

  return {
    dateOfBirth,
    timeOfBirth,
    placeOfBirth,
    sunSign,
    moonSign,
    ascendant,
    planets,
    houses,
  };
}

/**
 * Generate booklet content based on astrology data
 */
export function generateBookletContent(
  firstName: string,
  lastName: string,
  astrologyData: AstrologyData
): BookletContent {
  const { sunSign, moonSign, ascendant, planets, houses } = astrologyData;

  const planetaryInfluences: Record<string, string> = {};
  for (const [planet, sign] of Object.entries(planets)) {
    const baseContent = (CONTENT_LIBRARY.planets as Record<string, string>)[planet] || "";
    planetaryInfluences[planet] =
      `${baseContent} Votre ${planet} est en ${sign}, ce qui ajoute les qualités du ${sign} à votre profil astrologique.`;
  }

  const housesContent: Record<string, string> = {};
  for (const [house, sign] of Object.entries(houses)) {
    const baseContent = (CONTENT_LIBRARY.houses as Record<string, string>)[house] || "";
    housesContent[house] =
      `${baseContent} Votre ${house} est en ${sign}, ce qui influence comment vous exprimez les énergies du ${sign} dans ce domaine de vie.`;
  }

  return {
    coverTitle: `Le Livret Astral de ${firstName} ${lastName}`,
    introduction: `Bienvenue dans votre livret astral personnalisé. Ce document a été créé spécialement pour vous, ${firstName}, en fonction de vos données de naissance uniques. Explorez les mystères de votre profil cosmique et découvrez les influences qui façonnent votre destinée.`,
    sunSignContent:
      (CONTENT_LIBRARY.sunSigns as Record<string, string>)[sunSign] ||
      "Votre signe solaire représente votre essence profonde.",
    moonSignContent:
      (CONTENT_LIBRARY.moonSigns as Record<string, string>)[moonSign] ||
      "Votre signe lunaire représente votre monde émotionnel.",
    ascendantContent:
      (CONTENT_LIBRARY.ascendants as Record<string, string>)[ascendant] ||
      "Votre ascendant représente votre apparence et votre première impression.",
    planetaryInfluences,
    housesContent,
    conclusion: `Votre profil astrologique est unique et complexe. Les influences que vous avez découvertes dans ce livret sont des guides pour mieux vous comprendre et naviguer votre vie avec plus de clarté. Rappelez-vous que vous avez toujours le libre arbitre et le pouvoir de créer votre destinée. Utilisez ces insights comme des outils de transformation et de croissance personnelle.`,
  };
}
