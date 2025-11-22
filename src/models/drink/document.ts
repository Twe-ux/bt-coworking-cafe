import { Document, Types } from 'mongoose';

export interface DrinkDocument extends Document {
  name: string;
  description?: string;
  image?: string;
  category: Types.ObjectId;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DrinkCategoryDocument extends Document {
  name: string;
  slug: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
