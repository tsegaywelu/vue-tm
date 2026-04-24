export const PricingType = {
  PerKilometer: "per_kilometer",
  PerQuintal: "per_quintal",
} as const;

export type PricingType = (typeof PricingType)[keyof typeof PricingType];

export const ShipmentStatus = {
  Pending: "pending",
  Active: "active",
  Completed: "completed",
  Cancelled: "cancelled",
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
  OutBound: "OUT_BOUND",
} as const;
export type ProductType = (typeof ProductType)[keyof typeof ProductType];

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
    name: "POWER & TRAILER";
  };
  vehicle: {
    plateNumber: string;
    ownership: string;
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
  statusTime: {
    vehicleAssignedTime: string;
    acceptedTime: string;
    waitingToLoadAtOriginTime: string;
    loadingStartedAtOriginTime: string;
    loadedAtOriginTime: string;
    departedTime: string;
  };
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
  shipmentCode?: string;
  status?: string;
  productType?: string;
  tripType?: string;
  shipper?: string;
  agent?: string;
  startDate?: string;
  endDate?: string;
  vehicleOwnership?: string;
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

}

export interface Mechanic {
  _id: string;
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
    name: string;
  };
  odometerReading?: number;
  remarks?: string;
  issuesFound?: {
    issueType: string;
  }[];
}

export interface ServiceRecord {
  _id: string;
  vehicle?: {
    plateNumber: string;
  };
  maintenanceDate?: string;
  mechanics?: {
    name?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
  }[];
  workshop?: {
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
    name: string;
  };
  priority: string;
  commodity: {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
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
