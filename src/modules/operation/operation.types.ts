export interface ApprovalRequest {
  _id: string;
  advanceNumber: string;
  payableType:
    | "advancePayment"
    | "transactions"
    | "prePayments"
    | "vehicleLeaseAgreement";
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
  status: "pending" | "active" | "completed" | "cancelled";
  order: {};
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
    type: "per_kilometer" | "per_quintal";
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
  tripType: string;
  productType: string;
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
  };
  totalTyres: number;
  totalPrice: number;
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
