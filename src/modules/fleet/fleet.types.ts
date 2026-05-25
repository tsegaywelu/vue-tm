export type MeterType = 'ODOMETER' | 'ENGINE_HOURS';
export type MeterEntrySource = 'MANUAL' | 'INSPECTION' | 'WORK_ORDER' | 'SERVICE_REMINDER' | 'SERVICE_RECORD' | 'FUEL_ENTRY';
export type UsageType = 'BUSINESS' | 'PERSONAL';
export type RecurringFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY';

export interface MeterEntry {
  _id: string;
  vehicle: { _id: string; plateNumber: string } | string;
  meterType?: MeterType;
  reading: number;
  entryDate: string;
  entrySource?: MeterEntrySource;
  sourceId?: string;
  comment?: string;
  photos?: string[];
  isOverride?: boolean;
  overrideReason?: string;
  carrier: string;
  createdBy?: { _id: string; username: string };
  createdAt: string;
  updatedAt: string;
}

export interface FuelEntry {
  _id: string;
  vehicle: { _id: string; plateNumber: string } | string;
  date: string;
  odometer?: number;
  quantity?: number;
  unitPrice?: number;
  amount?: number;
  vendor?: string;
  reference?: string;
  usageType?: UsageType;
  comment?: string;
  photos?: string[];
  isVoided: boolean;
  voidedBy?: { _id: string; username: string } | string;
  voidedAt?: string;
  voidReason?: string;
  meterEntry?: string;
  carrier: string;
  createdBy?: { _id: string; username: string };
  createdAt: string;
  updatedAt: string;
}

export interface VehicleExpenseEntry {
  _id: string;
  vehicle: { _id: string; plateNumber: string } | string;
  vehicleExpenseType: { _id: string; name: string } | string;
  amount: number;
  date: string;
  notes?: string;
  vendor?: string;
  reference?: string;
  photos?: string[];
  isVoided: boolean;
  voidedBy?: { _id: string; username: string } | string;
  voidedAt?: string;
  voidReason?: string;
  sourceRuleId?: string;
  occurrenceDate?: string;
  carrier: string;
  createdBy?: { _id: string; username: string };
  createdAt: string;
  updatedAt: string;
}

export interface RecurringExpenseRule {
  _id: string;
  vehicle: { _id: string; plateNumber: string } | string;
  vehicleExpenseType: { _id: string; name: string } | string;
  amount: number;
  frequency: RecurringFrequency;
  interval?: number;
  startDate: string;
  endDate?: string;
  nextRunAt?: string;
  isActive: boolean;
  autopost?: boolean;
  notes?: string;
  vendor?: string;
  reference?: string;
  carrier: string;
  createdBy?: { _id: string; username: string };
  createdAt: string;
  updatedAt: string;
}
