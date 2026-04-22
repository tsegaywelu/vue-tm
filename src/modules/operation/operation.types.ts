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
