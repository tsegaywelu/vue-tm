export const PricingType = {
  PerKilometer: "per_kilometer",
  PerQuintal: "per_quintal",
} as const;

export type PricingType = (typeof PricingType)[keyof typeof PricingType];

export const ShipmentStatus = {
  VehicleAssigned: "vehicle_assigned",
  Accepted: "accepted",
  WaitingToLoadAtOrigin: "waiting_to_load_at_origin",
  LoadingStartedAtOrigin: "loading_started_at_origin",
  LoadedAtOrigin: "loaded_at_origin",
  Departed: "departed",
  EnRouteToDestination: "en_route_to_destination",
  ArrivedAtDestination: "arrived_at_destination",
  WaitingToOffloadAtDestination: "waiting_to_offload_at_destination",
  OffloadingStartedAtDestination: "offloading_started_at_destination",
  OffloadedAtDestination: "offloaded_at_destination",
  WaitingToLoadAtDestination: "waiting_to_load_at_destination",
  LoadingStartedAtDestination: "loading_started_at_destination",
  LoadedAtDestination: "loaded_at_destination",
  EnRouteToOrigin: "en_route_to_origin",
  ArrivedAtOrigin: "arrived_at_origin",
  WaitingToOffloadAtOrigin: "waiting_to_offload_at_origin",
  OffloadingStartedAtOrigin: "offloading_started_at_origin",
  OffloadedAtOrigin: "offloaded_at_origin",
  Completed: "completed",
  Custom: "custom",
  Terminated: "terminated",
  Cancelled: "cancelled",
  Delayed: "delayed",
  Pending: "pending",
  Active: "active",
  Warning: "warning",
} as const;
export type ShipmentStatus =
  (typeof ShipmentStatus)[keyof typeof ShipmentStatus];

export const PayableType = {
  AdvancePayment: "advancePayment",
  Transactions: "transactions",
  PrePayments: "prePayments",
  VehicleLeaseAgreement: "vehicleLeaseAgreement",
} as const;
export type PayableType = (typeof PayableType)[keyof typeof PayableType];

export const TripType = {
  RoundTrip: "round_trip",
  SingleTrip: "single_trip",
} as const;
export type TripType = (typeof TripType)[keyof typeof TripType];

export const ProductType = {
  "Out Bound": "OUT_BOUND",
  "In Bound": "IN_BOUND",
  "Site Transfer": "SITE_TRANSFER",
} as const;
export type ProductType = (typeof ProductType)[keyof typeof ProductType];

export const VehicleOwnership = {
  Leased: "Leased",
  Rental: "Rental",
  Owned: "Owned",
} as const;
export type VehicleOwnership =
  (typeof VehicleOwnership)[keyof typeof VehicleOwnership];

export const VehicleTypeName = {
  FlatBed: "flat-bed",
  FSR: "FSR",
  MDV: "MDV",
  DoubleCup: "DOUBLE CUP",
  PowerAndTrailer: "POWER & TRAILER",
  Power: "POWER",
} as const;
export type VehicleTypeName =
  (typeof VehicleTypeName)[keyof typeof VehicleTypeName];

export interface ApprovalRequest {
  _id: string;
  advanceNumber: string;
  payableType: PayableType;
  advancePaymentId?: string;
  driver?: {
    _id: string;
    firstName: string;
    middleName?: string;
    lastName?: string;
  };
  createdAt: string;
  shipmentCode?: string;
  route?: {
    _id: string;
    name: string;
  };
  plateNumber?: string;
  totalFuelAdvances?: number;
  totalPerDiemExpenses?: number;
  totalOtherExpenses?: number;
  total: number;
  attachments?: string[];
  attachment?: string;
}

export interface ApprovalFilterParams {
  select?: string;
  vehiclePlateNumber?: string;
  advanceNumber?: string;
  driverFirstName?: string;
  driverMiddleName?: string;
  routeOrigin?: string;
  routeDestination?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export type ApprovalAction = "approve" | "reject";
export type ApprovalSubject =
  | "advance"
  | "settlement"
  | "prePayment"
  | "agreement";

export interface Shipment {
  _id: string;
  shipmentCode: string;
  status: ShipmentStatus;
  order: Order;
  orderCode: string;
  route: {
    routeName: string;
    origin: string;
    destination: string;
  };
  waypoint: {
    name: string;
    TAT: number;
  };
  freightOrder: string;
  shipper: {
    _id: string;
    name: string;
  };
  vehicleType: {
    name: VehicleTypeName;
  };
  vehicle: {
    plateNumber: string;
    ownership: VehicleOwnership;
    trailerPlate: string;
  };
  dispatchWeight: number;
  odometerAtDispatch: number;
  fuelReadingAtDispatch: number;
  commodity: {
    name: string;
  }[];
  dispatchDate: string;
  pricingType: {
    type: PricingType;
    amount: number;
  };
  packaging: {
    name: string;
  };
  driver: {
    _id?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    phoneNumber?: string;
  };
  statusTime: { [K in ShipmentStatus]: string };
  transporterPrice?: string;
  remark: string;
  totalPrice: number;
  tripType: TripType;
  productType: ProductType;
  paymentDetail: {
    paymentStatus?: string;
  };
  shipmentDocuments: [];
  rejectorDrivers: [];
  followUp: [];
  deadHole: number;
  CKRF: boolean;
  isDamaged: boolean;
  waypointDistance: number;
  areDocumentsUploaded: boolean;
  carrier: {
    name: string;
  };
  agent: {
    name: string;
  };
  civ: string;
  shipperIssueVoucher: string;
  createdByUser: {
    username: string;
  };
}

export interface ShipmentFilterParams {
  selectedFilterOption?: {
    value: string;
  };
  searchField?: string;
  shipmentCode?: string;
  status?: string;
  productType?: string;
  tripType?: string;
  shipper?: string;
  agent?: string;
  startDate?: string;
  endDate?: string;
  vehicleOwnership?: VehicleOwnership;
  damage?: string;
  documentedUploads?: string;
  routeOrigin?: string;
  routeDestination?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface Tyre {
  _id: string;
  vehicle: {
    plateNumber: string;
    _id?: string;
  };
  totalTyres?: number;
  totalPrice?: number;
  serialNumber?: string;
  brand?: string;
  tyrePosition?: string;
  price?: number;
  status?: string;
  data?: any


}

export interface Mechanic {
  _id: string;
  data?: any;
  firstName: string;
  middleName?: string;
  lastName?: string;
  isInternal: boolean;
  phoneNumber?: string;
  employeeNumber?: string;
  dateOfBirth?: string;
  certification?: string;
  experience?: string;
  workshop?: {
    _id?: string;
    name: string;
  };

}

export interface Inspection {
  _id: string;
  vehicle?: {
    plateNumber: string;
  };
  inspectionDate?: string;
  inspectionReason?: string;
  inspector?: {
    _id?: string;
    name: string;
  };
  odometerReading?: number;
  remarks?: string;
  issuesFound?: {
    description: string;
    severity: string;
    issueType: string;
  }[];
  nextInspectionDate?: string;
}

export interface ServiceRecord {
  _id: string;
  vehicle?: {
    plateNumber: string;
  };
  maintenanceDate?: string;
  mechanics?: {
    _id?: string;
    name?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
  }[];
  workshop?: {
    _id?: string;
    name: string;
  };
  mileageAtService?: number;
  totalCost?: number;
  description?: string;
}

export interface ServiceReminder {
  _id: string;
  vehicle?: {
    plateNumber: string;
  };
  serviceTask?: {
    name: string;
  };
  mileageInterval?: number;
  interval?: number;
  lastServiceDate?: string;
  lastServiceMileage?: number;
  reminderMileage?: number;
  reminderDays?: number;
}

export interface ServiceTask {
  _id: string;
  name: string;
  code?: string;
  requiredParts?: string[];
  estimatedDuration?: number;
  estimatedCost?: number;
  priority?: string;
  description?: string;
}

export interface ServiceType {
  _id: string;
  name: string;
  description?: string;
  serviceTasks?: {
    _id: string;
  }[];
}

export interface WorkOrder {
  _id: string;
  vehicle?: {
    plateNumber: string;
  };
  createdAt?: string;
  status?: string;
  mechanics?: {
    name?: string;
    firstName?: string;
    lastName?: string;
  }[];
  workType?: string;
  workArea?: string;
  costBreakdown?: {
    partsCost?: number;
  };
}

export interface Workshop {
  _id: string;
  name: string;
  tradeName?: string;
  contactPerson?: string;
  contactPhone?: string;
  specialization?: string;
  tin?: string;
  location?: {
    street?: string;
    city?: string;
    region?: string;
  };
  latitude?: number;
  longitude?: number;
}

export interface IssueReport {
  _id: string;
  driver?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  type?: string;
  severity?: string;
  status?: string;
  location?: string;
  createdAt?: string;
}

export interface TyreHandoff {
  _id: string;
  serialNumber?: string;
  eventType?: string;
  status?: string;
  toVehicle?: {
    plateNumber?: string;
  };
  fromVehicle?: {
    plateNumber?: string;
  };
  assignedTo?: {
    username?: string;
  };
  createdAt?: string;
}
export interface Order {
  _id: string;
  orderCode: string;
  route: {
    _id: string;
    routeName: string;
    origin: string;
    destination: string;
  };
  shipper: {
    apiVersion: string;
    uiVersion: string;
    _id: string;
    name: string;
    tradeName: string;
    email: string;
    shipperCode: string;
    phone: string;
    address: string;
    tin: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    phoneNumbers: string[];
  };
  vehicleType: {
    _id: string;
    name: VehicleTypeName;
  };
  priority: string;
  commodity: {
    packaging: string;
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    shipper: string;
  }[];
  packaging: {
    _id: string;
    name: string;
  };
  agent: {
    _id?: string;
    name: string;
  };
  totalRequest: number;
  numberOfVehicles: number;
  unitOfMeasurement: string;
  status: string;
  tripType: TripType;
  productType: ProductType;
  remark: string;
  carrier: {
    _id?: string;
    name: string;
  };
  createdAt: string;
  waypoints: Waypoints[];
  vehicleTypeName: VehicleTypeName;
}

export type VehiclePricing = {
  _id: string;
  pricePerUnit: number;
  productType: ProductType;
  type: PricingType;
  vehicleType: string;
};

export type Waypoint = {
  _id: string;
  route: string;
  name: string;
  distance: number;
  perDiemDays: number;
  TAT: number;
  AFU: number;
  roadTypes: string[];
  terrainTypes: string[];
  isActive: boolean;
  isDefault: boolean;
  updatedAt: string;
};

export type Waypoints = {
  _id: string;
  vehiclePricing: VehiclePricing[];
  waypoint: Waypoint;
};

export interface Driver {
  _id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  name: string;
  educationalBackground: any[];
  workExperience: any[];
  isEmployed: boolean;
  phoneNumber: string;
  driverLicenceNumber: string;
  driverStatus: string;
  isActive: boolean;
  transporter: string;
  bankAccount: any[];
  driverDocuments: any[];
  ratingCount: number;
  carrier: Record<string, any>;
  hasUserAccount: boolean;
  initialSettlementBalance: number;
  regionHistory: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Vehicle {
  _id: string;
  plateNumber: string;
  transporter: string;
  ownership: VehicleOwnership;
  vehicleUseType: string | null;
  trailerPlate: string;
  vehicleType: string;
  driver: string;
  status: string;
  isOperational: boolean;
  pastInsurances: any[];
  driverHistory: any[];
  vehicleDocuments: any[];
  carrier: string;
  vehicleTypeName: string;
  transporterName: string;
  driverName: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Insurance {
  _id: string;
  insurer: string;
  insuranceCategoryAmount: any[];
  vehicle: string;
  prePaymentDate: string;
  prePaymentMatureDate: string;
  JV: string;
  withHoldTax: number;
  CPV: string;
  total: number;
  insuranceDocuments: any[];
  carrier: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type Trasporter = {
  name: string;
  tradeName: string;
  phoneNumber: string;
  address: string;
  type: string;
  bankAccount: string[];
  carrier: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export interface StatusSource {
  source: string;
  count: number;
  percentage: number;
}

export interface StatusSourceReport {
  shipmentId: string;
  totalChanges: number;
  bySource: StatusSource[];
  driverAppUsage: {
    count: number;
    eligibleTotal: number;
    percentage: number;
    excludedStatuses: string[];
  };
  statusSourceBreakdown: {
    status: string;
    total: number;
    bySource: StatusSource[];
  }[];
}
