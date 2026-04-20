import { describe, expect, it } from "vitest";
import {
  calculateSunSign,
  calculateMoonSign,
  calculateAscendant,
  getPlanetaryPositions,
  getHousePositions,
  generateAstrologyData,
  generateBookletContent,
} from "./astrology";

describe("Astrology Engine", () => {
  describe("Sun Sign Calculation", () => {
    it("should calculate Aries for March 21", () => {
      const sign = calculateSunSign("2000-03-21");
      expect(sign).toBe("Bélier");
    });

    it("should calculate Taurus for May 1", () => {
      const sign = calculateSunSign("2000-05-01");
      expect(sign).toBe("Taureau");
    });

    it("should calculate Leo for August 1", () => {
      const sign = calculateSunSign("2000-08-01");
      expect(sign).toBe("Lion");
    });

    it("should calculate Capricorn for December 25", () => {
      const sign = calculateSunSign("2000-12-25");
      expect(sign).toBe("Capricorne");
    });
  });

  describe("Moon Sign Calculation", () => {
    it("should return a valid zodiac sign", () => {
      const sign = calculateMoonSign("2000-05-15");
      const validSigns = [
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
      expect(validSigns).toContain(sign);
    });

    it("should be consistent for the same date", () => {
      const sign1 = calculateMoonSign("2000-05-15");
      const sign2 = calculateMoonSign("2000-05-15");
      expect(sign1).toBe(sign2);
    });
  });

  describe("Ascendant Calculation", () => {
    it("should return a valid zodiac sign", () => {
      const sign = calculateAscendant("14:30");
      const validSigns = [
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
      expect(validSigns).toContain(sign);
    });

    it("should be consistent for the same time", () => {
      const sign1 = calculateAscendant("14:30");
      const sign2 = calculateAscendant("14:30");
      expect(sign1).toBe(sign2);
    });
  });

  describe("Planetary Positions", () => {
    it("should return 8 planets", () => {
      const positions = getPlanetaryPositions("2000-05-15");
      expect(Object.keys(positions)).toHaveLength(8);
    });

    it("should return valid zodiac signs for each planet", () => {
      const positions = getPlanetaryPositions("2000-05-15");
      const validSigns = [
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

      for (const [planet, sign] of Object.entries(positions)) {
        expect(validSigns).toContain(sign);
      }
    });
  });

  describe("House Positions", () => {
    it("should return 12 houses", () => {
      const houses = getHousePositions("14:30");
      expect(Object.keys(houses)).toHaveLength(12);
    });

    it("should return valid zodiac signs for each house", () => {
      const houses = getHousePositions("14:30");
      const validSigns = [
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

      for (const [house, sign] of Object.entries(houses)) {
        expect(validSigns).toContain(sign);
      }
    });
  });

  describe("Astrology Data Generation", () => {
    it("should generate complete astrology data", () => {
      const data = generateAstrologyData(
        "Jean",
        "Dupont",
        "1990-05-15",
        "14:30",
        "Paris"
      );

      expect(data).toHaveProperty("sunSign");
      expect(data).toHaveProperty("moonSign");
      expect(data).toHaveProperty("ascendant");
      expect(data).toHaveProperty("planets");
      expect(data).toHaveProperty("houses");
      expect(data.dateOfBirth).toBe("1990-05-15");
      expect(data.timeOfBirth).toBe("14:30");
      expect(data.placeOfBirth).toBe("Paris");
    });
  });

  describe("Booklet Content Generation", () => {
    it("should generate complete booklet content", () => {
      const astrologyData = generateAstrologyData(
        "Jean",
        "Dupont",
        "1990-05-15",
        "14:30",
        "Paris"
      );

      const content = generateBookletContent(
        "Jean",
        "Dupont",
        astrologyData
      );

      expect(content).toHaveProperty("coverTitle");
      expect(content).toHaveProperty("introduction");
      expect(content).toHaveProperty("sunSignContent");
      expect(content).toHaveProperty("moonSignContent");
      expect(content).toHaveProperty("ascendantContent");
      expect(content).toHaveProperty("planetaryInfluences");
      expect(content).toHaveProperty("housesContent");
      expect(content).toHaveProperty("conclusion");

      expect(content.coverTitle).toContain("Jean");
      expect(content.coverTitle).toContain("Dupont");
      expect(content.introduction).toContain("Jean");
    });

    it("should include planetary influences for all planets", () => {
      const astrologyData = generateAstrologyData(
        "Jean",
        "Dupont",
        "1990-05-15",
        "14:30",
        "Paris"
      );

      const content = generateBookletContent(
        "Jean",
        "Dupont",
        astrologyData
      );

      expect(Object.keys(content.planetaryInfluences)).toHaveLength(8);
    });

    it("should include houses content for all 12 houses", () => {
      const astrologyData = generateAstrologyData(
        "Jean",
        "Dupont",
        "1990-05-15",
        "14:30",
        "Paris"
      );

      const content = generateBookletContent(
        "Jean",
        "Dupont",
        astrologyData
      );

      expect(Object.keys(content.housesContent)).toHaveLength(12);
    });
  });
});
