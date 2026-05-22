export const PricingType = {
  PerKilometer: "per_kilometer",
  PerQuintal: "per_quintal",
} as const;

export enum UserRoles {
  CARRIER = "carrier",
  SHIPPER = "shipper",
  ADMIN = "admin",
  DISPATCHER = "dispatcher",
  OWNER = "owner",
}

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

export const TransactionStatus = {
  Paid: "PAID",
  Pending: "PENDING",
  Failed: "FAILED",
  Authorized: "AUTHORIZED",
  Approved: "APPROVED",
  Success: "SUCCESS",
  Rejected: "REJECTED",
  Cancelled: "CANCELLED",
} as const;
export type TransactionStatus =
  (typeof TransactionStatus)[keyof typeof TransactionStatus];
export const TransactionType = {
  Initial: "INITIAL",
} as const;
export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];

export const AdvanceType = {
  FuelOnly: "FUEL_ONLY",
  All: "ALL",
} as const;
export type AdvanceType = (typeof AdvanceType)[keyof typeof AdvanceType];

export const AdvanceCategory = {
  DaysDriven: "DAYS_DRIVEN",
  Weight: "WEIGHT",
  Other: "OTHER",
  Fuel: "FUEL",
} as const;
export type AdvanceCategory =
  (typeof AdvanceCategory)[keyof typeof AdvanceCategory];

export interface ShipmentTransaction {
  _id: string;
  advancePayment: string;
  type: TransactionType;
  advanceType: AdvanceType | string;
  category: AdvanceCategory | string;
  subCategory?: string | null;
  amount: number;
  region?: any;
  shipment: string;
  createdBy: string;
  attachments: string[];
  status: TransactionStatus;
  carrier: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  paidAt?: string;
  paidBy?: string;
  liters?: number;
}

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

export type PricingTypeObject = {
  _id: string;
  type: PricingType;
  amount: number;
};

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
    _id: string;
    routeName: string;
    origin: string;
    destination: string;
    carrier: string;
    waypoints: string[];
    updatedAt: string;
    originGPS: {
      latitude: number;
      longitude: number;
    };
    shipmentCount: number;
  };
  waypoint: {
    _id: string;
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
  freightOrder: string;
  shipper: {
    _id: string;
    name: string;
  };
  vehicleType: {
    _id: string;
    name: VehicleTypeName;
  };
  vehicle: {
    _id: string;
    driver: Driver;
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
  pricingType: PricingTypeObject;
  packaging: {
    _id: string;
    name: string;
  };
  transporter: {
    _id: string;
    name: string;
    tradeName: string;
    phoneNumber: string;
    bankAccount: [];
  };
  driver: {
    _id?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    phoneNumber?: string;
    licenseNumber?: string;
  };
  statusTime: { [K in ShipmentStatus]: string };
  transporterPrice?: string;
  remark: string;
  totalPrice: number;
  tripType: TripType;
  productType: ProductType;
  paymentDetail: {
    paymentStatus?: string;
    reference?: string;
    paymentRequestedDate?: string;
    paymentRequestedBy?: { _id?: string; username?: string };
    paymentApprovedBy?: { _id?: string; username?: string };
    paymentApprovedDate?: string;
    paidDate?: string;
    collectedBy?: { _id?: string; username?: string };
  };
  shipmentDocuments: [];
  rejectorDrivers: [];
  followUp: [];
  deadHole: number;
  CKRF: boolean;
  isDamaged: boolean;
  CKRFCode: string;
  waypointDistance: number;
  areDocumentsUploaded: boolean;
  carrier: {
    apiVersion: string;
    uiVersion: string;
    _id: string;
    name: string;
    tradeName: string;
    email: string;
    phone: string;
    address: string;
    tin: string;
    createdAt: string;
    updatedAt: string;
  };
  agent: {
    _id: string;
    name: string;
  };
  civ: string;
  shipperIssueVoucher: string;
  agentReceiveVoucher?: string;
  agentIssueVoucher?: string;
  shipperReceiveVoucher?: string;
  odometerAtComplete?: number;
  fuelReadingAtComplete?: number;
  createdByUser: {
    username: string;
  };
  CIVuploadedBy?: string;
  AIVuploadedBy?: string;
  ARVuploadedBy?: string;
  CRVuploadedBy?: string;
  closingDocUploadedBy?: string;
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
  data?: any;
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
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  carrier?: {
    _id?: string;
    name?: string;
    email?: string;
  };
  shipment?: {
    _id: string;
    shipmentNumber?: string;
  };
  type?: string;
  severity?: string;
  status?: string;
  location?: string;
  lat?: number;
  long?: number;
  description?: string;
  picture?: string;
  createdAt?: string;
  updatedAt?: string;
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
  sideNumber?: number;
  lastServiceDate?: string;
  chassisNumber?: string;
  ownership: VehicleOwnership;
  trailerPlate?: string;
  trailerChassisNumber?: string;
  trailerPurchaseDate?: string;
  vehicleType?: {
    _id?: string;
    name: string;
  };
  vehicleModel?: {
    _id?: string;
    name: string;
  };
  maker?: {
    _id?: string;
    name: string;
  };
  mileage?: number;
  mileageSinceService?: number;
  driver?: {
    _id: string;
    firstName: string;
    middleName?: string;
    lastName?: string;
  };
  status: string;
  isOperational: boolean;
  remark?: string;
  fuelRateLoaded?: number;
  fuelRateUnloaded?: number;
  averageFuelUsage?: number;
  engineNumber?: string;
  driverHistory?: Array<{
    driver: string;
    assignedDate: string;
    leaveDate?: string | null;
  }>;
  insuranceInformation?: {
    insuredDate: string;
    insuredAmount: number;
    prePaymentAmount: number;
    lifespan: number;
    insurer: {
      _id: string;
      name: string;
    };
  };
  roadTaxExpireDate?: string;
  purchaseDate?: string;
  vehicleDocuments?: string[];
  region?: {
    _id: string;
    name: string;
  };
  vehicleGroup?: {
    _id: string;
    name: string;
  };
  type?: {
    _id: string;
    name: string;
  };
  transporter?: {
    _id: string | null;
    name: string | null;
  };
  lease?: {
    startDate?: string;
    endDate?: string;
    amount?: number;
    transporter?: string;
    leaseDirection?: string;
    leaseAgreement?: {
      coversMaintenance?: boolean;
      coversAdvance?: boolean;
    };
  };
  carrier?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
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

export interface FuelAdvance {
  paymentType: string;
  refueledAmount: number;
  fuelPrice: number;
  fuelStation: string;
  amount: number;
  remark?: string;
}

export interface PerDiemExpense {
  category: string;
  amount: number;
  daysDriven?: number | null;
  weight?: number | null;
  remark?: string;
}

export interface OtherExpense {
  expenseType: {
    _id: string;
    name: string;
    typicalPrice?: number;
  };
  amount: number;
  remark?: string;
}

export interface Advance {
  _id: string;
  advanceNumber: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  shipment?: Shipment;
  driver?: Driver;
  fuelAdvances?: FuelAdvance[];
  perDiemExpenses?: PerDiemExpense[];
  otherExpenses?: OtherExpense[];
  transactions?: ShipmentTransaction[];
  authorizedBy?: { _id: string; username: string };
  approvedBy?: { _id: string; username: string };
  paidBy?: { _id: string; username: string };
  subtotal?: number;
  vehiclePlateNumber?: string;
  shipmentCode?: string;
  routeName?: string;
}

export interface RouteRequest {
  _id: string;
  routeName: string;
  origin: string;
  destination: string;
  waypoint: any[];
  carriers: {
    _id: string;
    name: string;
  }[];
  createdAt: string;
}
export interface Region {
  _id: string;
  name: string;
  notificationEnabled?: boolean;
  enforceOdometerRouteTolerance?: boolean;
  odometerRouteToleranceKilometer?: number;
  createdAt: string;
}

export interface BonusMultiplier {
  _id: string;
  metric: "totalTrips" | "distanceCovered" | "fuelUsage" | string;
  minValue: number;
  maxValue: number | null;
  multiplier: number;
  description?: string;
  createdAt: string;
}

export interface BonusRoute {
  _id: string;
  route: {
    _id: string;
    routeName: string;
    origin?: { name: string };
    destination?: { name: string };
  };
  amount: number;
  description?: string;
  createdAt: string;
}

export interface Announcement {
  _id: string;
  title: string;
  message: string;
  targetAudience: "ALL" | "DRIVER" | "MECHANIC" | string;
  createdAt: string;
}
export interface PrePayment {
  _id: string;
  advanceNumber: string;
  createdAt: string;
  status: string;
  shipment?: {
    _id: string;
    shipmentCode: string;
    route?: {
      _id: string;
      routeName: string;
    };
  };
  totalTransporterPrice: number;
  amount: number;
}
