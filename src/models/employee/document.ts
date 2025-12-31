import { Schema, Document } from "mongoose";

/** Document of an Employee, as stored in the database. */
export interface EmployeeDocument extends Document {
  // Informations personnelles
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  placeOfBirth: string; // Lieu de naissance
  address: {
    street: string;
    postalCode: string;
    city: string;
  };
  phone: string;
  email: string;
  socialSecurityNumber: string; // N° Sécu (15 chiffres)

  // Informations contractuelles
  contractType: 'CDI' | 'CDD' | 'Stage';
  contractualHours: number; // Nombre d'heures hebdomadaires
  hireDate: Date;
  endDate?: Date; // Pour CDD et Stage
  endContractReason?: 'démission' | 'fin-periode-essai' | 'rupture'; // Motif de fin de contrat

  // Rémunération
  level: string; // Niveau (I, II, III, IV, V)
  step: number; // Échelon (1, 2, 3, etc.)
  hourlyRate: number; // Taux horaire en euros
  monthlySalary?: number; // Salaire mensuel brut (calculé automatiquement)

  // Code de pointage
  clockingCode: string; // Code PIN 4 chiffres

  // Rôle employé
  employeeRole: 'Manager' | 'Employé';

  // Disponibilités horaires (par jour)
  availability: {
    monday: { start: string; end: string; available: boolean };
    tuesday: { start: string; end: string; available: boolean };
    wednesday: { start: string; end: string; available: boolean };
    thursday: { start: string; end: string; available: boolean };
    friday: { start: string; end: string; available: boolean };
    saturday: { start: string; end: string; available: boolean };
    sunday: { start: string; end: string; available: boolean };
  };

  // Statut du processus de création
  onboardingStatus: {
    contractGenerated: boolean;
    contractGeneratedAt?: Date;
    dpaeCompleted: boolean;
    dpaeCompletedAt?: Date;
    bankDetailsProvided: boolean;
    bankDetailsProvidedAt?: Date;
    contractSent: boolean;
    contractSentAt?: Date;
  };

  // Coordonnées bancaires
  bankDetails?: {
    iban: string;
    bic: string;
    bankName: string;
  };

  // Statut
  isActive: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/** Schema used to validate Employee objects for the database. */
export const EmployeeSchema = new Schema<EmployeeDocument>(
  {
    // Informations personnelles
    firstName: {
      type: String,
      required: [true, "Le prénom est requis"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Le nom est requis"],
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, "La date de naissance est requise"],
    },
    placeOfBirth: {
      type: String,
      required: [true, "Le lieu de naissance est requis"],
      trim: true,
    },
    address: {
      street: {
        type: String,
        required: [true, "L'adresse est requise"],
        trim: true,
      },
      postalCode: {
        type: String,
        required: [true, "Le code postal est requis"],
        trim: true,
      },
      city: {
        type: String,
        required: [true, "La ville est requise"],
        trim: true,
      },
    },
    phone: {
      type: String,
      required: [true, "Le téléphone est requis"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Veuillez fournir une adresse email valide"],
    },
    socialSecurityNumber: {
      type: String,
      required: [true, "Le numéro de sécurité sociale est requis"],
      trim: true,
      match: [/^\d{15}$/, "Le numéro de sécurité sociale doit contenir 15 chiffres"],
    },

    // Informations contractuelles
    contractType: {
      type: String,
      enum: ['CDI', 'CDD', 'Stage'],
      required: [true, "Le type de contrat est requis"],
    },
    contractualHours: {
      type: Number,
      required: [true, "Le nombre d'heures contractuelles est requis"],
      min: [0, "Le nombre d'heures doit être positif"],
    },
    hireDate: {
      type: Date,
      required: [true, "La date d'embauche est requise"],
    },
    endDate: {
      type: Date,
    },
    endContractReason: {
      type: String,
      enum: ['démission', 'fin-periode-essai', 'rupture'],
    },

    // Rémunération
    level: {
      type: String,
      required: [true, "Le niveau est requis"],
      trim: true,
    },
    step: {
      type: Number,
      required: [true, "L'échelon est requis"],
      min: [1, "L'échelon doit être supérieur à 0"],
    },
    hourlyRate: {
      type: Number,
      required: [true, "Le taux horaire est requis"],
      min: [0, "Le taux horaire doit être positif"],
    },
    monthlySalary: {
      type: Number,
      min: [0, "Le salaire mensuel doit être positif"],
    },

    // Code de pointage
    clockingCode: {
      type: String,
      required: [true, "Le code de pointage est requis"],
      match: [/^\d{4}$/, "Le code de pointage doit contenir 4 chiffres"],
    },

    // Rôle employé
    employeeRole: {
      type: String,
      enum: ['Manager', 'Employé'],
      required: [true, "Le rôle de l'employé est requis"],
      default: 'Employé',
    },

    // Disponibilités horaires
    availability: {
      monday: {
        start: { type: String, default: '09:00' },
        end: { type: String, default: '18:00' },
        available: { type: Boolean, default: true },
      },
      tuesday: {
        start: { type: String, default: '09:00' },
        end: { type: String, default: '18:00' },
        available: { type: Boolean, default: true },
      },
      wednesday: {
        start: { type: String, default: '09:00' },
        end: { type: String, default: '18:00' },
        available: { type: Boolean, default: true },
      },
      thursday: {
        start: { type: String, default: '09:00' },
        end: { type: String, default: '18:00' },
        available: { type: Boolean, default: true },
      },
      friday: {
        start: { type: String, default: '09:00' },
        end: { type: String, default: '18:00' },
        available: { type: Boolean, default: true },
      },
      saturday: {
        start: { type: String, default: '09:00' },
        end: { type: String, default: '18:00' },
        available: { type: Boolean, default: false },
      },
      sunday: {
        start: { type: String, default: '09:00' },
        end: { type: String, default: '18:00' },
        available: { type: Boolean, default: false },
      },
    },

    // Statut du processus de création
    onboardingStatus: {
      contractGenerated: { type: Boolean, default: false },
      contractGeneratedAt: { type: Date },
      dpaeCompleted: { type: Boolean, default: false },
      dpaeCompletedAt: { type: Date },
      bankDetailsProvided: { type: Boolean, default: false },
      bankDetailsProvidedAt: { type: Date },
      contractSent: { type: Boolean, default: false },
      contractSentAt: { type: Date },
    },

    // Coordonnées bancaires
    bankDetails: {
      iban: { type: String, trim: true },
      bic: { type: String, trim: true },
      bankName: { type: String, trim: true },
    },

    // Statut
    isActive: {
      type: Boolean,
      default: true,
    },

    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
EmployeeSchema.index({ email: 1 }, { unique: true });
EmployeeSchema.index({ socialSecurityNumber: 1 }, { unique: true });
EmployeeSchema.index({ clockingCode: 1 }, { unique: true });
EmployeeSchema.index({ isActive: 1 });
EmployeeSchema.index({ deletedAt: 1 });
EmployeeSchema.index({ hireDate: 1 });
