import { Model, model, models } from 'mongoose';
import { TimeEntryDocument, TimeEntrySchema } from './document';
import {
  TimeEntryMethods,
  calculateTotalHours,
  completeShift,
} from './methods';

// Attacher les méthodes au schema
TimeEntrySchema.methods.calculateTotalHours = calculateTotalHours;
TimeEntrySchema.methods.completeShift = completeShift;

export type TimeEntry = TimeEntryMethods;

let TimeEntryModel: Model<TimeEntryDocument>;

if (models.TimeEntry) {
  TimeEntryModel = models.TimeEntry as Model<TimeEntryDocument>;
} else {
  TimeEntryModel = model<TimeEntryDocument>('TimeEntry', TimeEntrySchema);
}

if (!TimeEntryModel) {
  throw new Error('TimeEntry model not initialized');
}

export { TimeEntryModel as TimeEntry };
export type { TimeEntryDocument };
export type { ShiftNumber, TimeEntryStatus } from './document';
