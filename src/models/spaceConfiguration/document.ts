import { Document } from "mongoose";

/**
 * Pricing structure for different reservation types
 */
export interface PricingStructure {
  hourly: number; // Price per hour (0 if not available or quote-based)
  daily: number; // Price per day (0 if not available or quote-based)
  weekly: number; // Price per week (0 if not available or quote-based)
  monthly: number; // Price per month (0 if not available or quote-based)
  perPerson: boolean; // If true, multiply by number of people
}

/**
 * Available reservation types per space
 */
export interface AvailableReservationTypes {
  hourly: boolean;
  daily: boolean;
  weekly: boolean;
  monthly: boolean;
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
  availableReservationTypes: AvailableReservationTypes;
  requiresQuote: boolean; // If true, show "sur devis" instead of booking

  // Capacity
  minCapacity: number;
  maxCapacity: number;

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
