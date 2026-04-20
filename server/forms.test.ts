import { describe, expect, it } from "vitest";
import { z } from "zod";

// Validation schemas (same as in routers.ts)
const BookletRequestSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timeOfBirth: z.string().regex(/^\d{2}:\d{2}$/),
  placeOfBirth: z.string().min(2).max(200),
  email: z.string().email().max(320),
  message: z.string().max(5000).optional(),
});

const AppointmentRequestSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  email: z.string().email().max(320),
  phone: z.string().max(20).optional(),
  appointmentDate: z.string().datetime(),
  message: z.string().max(5000).optional(),
});

describe("Form Validation", () => {
  describe("Booklet Request Form", () => {
    it("should validate correct booklet request data", () => {
      const validData = {
        firstName: "Jean",
        lastName: "Dupont",
        dateOfBirth: "1990-05-15",
        timeOfBirth: "14:30",
        placeOfBirth: "Paris, France",
        email: "jean@example.com",
        message: "Je suis très intéressé par mon profil astrologique",
      };

      const result = BookletRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.firstName).toBe("Jean");
        expect(result.data.email).toBe("jean@example.com");
      }
    });

    it("should reject invalid email", () => {
      const invalidData = {
        firstName: "Jean",
        lastName: "Dupont",
        dateOfBirth: "1990-05-15",
        timeOfBirth: "14:30",
        placeOfBirth: "Paris, France",
        email: "invalid-email",
        message: "Test",
      };

      const result = BookletRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid date format", () => {
      const invalidData = {
        firstName: "Jean",
        lastName: "Dupont",
        dateOfBirth: "15/05/1990", // Wrong format
        timeOfBirth: "14:30",
        placeOfBirth: "Paris, France",
        email: "jean@example.com",
        message: "Test",
      };

      const result = BookletRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid time format", () => {
      const invalidData = {
        firstName: "Jean",
        lastName: "Dupont",
        dateOfBirth: "1990-05-15",
        timeOfBirth: "2:30 PM", // Wrong format
        placeOfBirth: "Paris, France",
        email: "jean@example.com",
        message: "Test",
      };

      const result = BookletRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject short first name", () => {
      const invalidData = {
        firstName: "J", // Too short
        lastName: "Dupont",
        dateOfBirth: "1990-05-15",
        timeOfBirth: "14:30",
        placeOfBirth: "Paris, France",
        email: "jean@example.com",
        message: "Test",
      };

      const result = BookletRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should allow optional message", () => {
      const validData = {
        firstName: "Jean",
        lastName: "Dupont",
        dateOfBirth: "1990-05-15",
        timeOfBirth: "14:30",
        placeOfBirth: "Paris, France",
        email: "jean@example.com",
      };

      const result = BookletRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject message exceeding max length", () => {
      const invalidData = {
        firstName: "Jean",
        lastName: "Dupont",
        dateOfBirth: "1990-05-15",
        timeOfBirth: "14:30",
        placeOfBirth: "Paris, France",
        email: "jean@example.com",
        message: "a".repeat(5001), // Exceeds max
      };

      const result = BookletRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("Appointment Request Form", () => {
    it("should validate correct appointment request data", () => {
      const validData = {
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean@example.com",
        phone: "+33 6 12 34 56 78",
        appointmentDate: "2026-05-15T14:30:00Z",
        message: "Je souhaite une consultation",
      };

      const result = AppointmentRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.firstName).toBe("Jean");
        expect(result.data.phone).toBe("+33 6 12 34 56 78");
      }
    });

    it("should reject invalid email", () => {
      const invalidData = {
        firstName: "Jean",
        lastName: "Dupont",
        email: "invalid-email",
        appointmentDate: "2026-05-15T14:30:00Z",
      };

      const result = AppointmentRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid datetime format", () => {
      const invalidData = {
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean@example.com",
        appointmentDate: "2026-05-15 14:30", // Invalid format
      };

      const result = AppointmentRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should allow optional phone", () => {
      const validData = {
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean@example.com",
        appointmentDate: "2026-05-15T14:30:00Z",
      };

      const result = AppointmentRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should allow optional message", () => {
      const validData = {
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean@example.com",
        appointmentDate: "2026-05-15T14:30:00Z",
      };

      const result = AppointmentRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject short first name", () => {
      const invalidData = {
        firstName: "J", // Too short
        lastName: "Dupont",
        email: "jean@example.com",
        appointmentDate: "2026-05-15T14:30:00Z",
      };

      const result = AppointmentRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject phone exceeding max length", () => {
      const invalidData = {
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean@example.com",
        phone: "1".repeat(21), // Exceeds max
        appointmentDate: "2026-05-15T14:30:00Z",
      };

      const result = AppointmentRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
