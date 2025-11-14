import { Document } from "mongoose";

/**
 * Opening hours for a specific day
 */
export interface DayHours {
  isOpen: boolean;
  openTime?: string; // Format: "HH:mm" (e.g., "09:00")
  closeTime?: string; // Format: "HH:mm" (e.g., "20:00")
}

/**
 * Weekly opening hours
 */
export interface WeeklyHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

/**
 * Exceptional closure (holidays, special events, etc.)
 */
export interface ExceptionalClosure {
  date: Date;
  reason?: string;
}

/**
 * Pricing structure for different reservation types
 */
export interface PricingStructure {
  hourly: number; // Price per hour
  daily: number; // Price per day
  weekly: number; // Price per week
  monthly: number; // Price per month
  perPerson: boolean; // If true, multiply by number of people
}

/**
 * Space configuration document
 */
export interface SpaceConfigurationDocument extends Document {
  spaceType: "open-space" | "salle-verriere" | "salle-etage" | "evenementiel";
  name: string;
  slug: string;
  description?: string;

  // Pricing
  pricing: PricingStructure;

  // Capacity
  minCapacity: number;
  maxCapacity: number;

  // Opening hours
  defaultHours: WeeklyHours;
  exceptionalClosures: ExceptionalClosure[];

  // Availability
  isActive: boolean;

  // Display
  imageUrl?: string;
  displayOrder: number;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}
