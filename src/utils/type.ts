import type { ShipmentStatus, Status } from "@/components/Status";
import type { FileRoutesByPath } from "@tanstack/react-router";
import type { TranslationKey } from "@/store/lang.store";
import type { PaymentTerm } from "./utils";

declare global {
  interface Window {
    google: any;
  }
}

export enum RateType {
  "Per Quintal" = "PER_QUINTAL",
  "Per Kilometer" = "PER_KILOMETER",
}

export type ViewType = "view" | "edit";

export enum BiDRejectReason {
  PriceNotAcceptable = "Price not acceptable",
  TruckNotSuitable = "Truck not suitable",
  TimingIssue = "Timing issue",
  CarrierNotPreferred = "Carrier not preferred",
  LoadCanceled = "Load canceled",
  Other = "Other",
}

export type Bid = {
  id: string;
  bidNumber: string;
  shipmentId: string;
  carrierId: string;
  ownerId: string;
  carrierName: string;
  carrierEmail: string;
  carrierPhone: string;
  carrierCompany: string;
  amount: number;
  notes: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "COUNTERED";
  counterAmount: number;
  counterMessage: string;
  rejectionReason: string;
  createdAt: string;
  updatedAt: string;
  shipment: {
    id: string;
    shipmentNumber: string;
    origin: string;
    destination: string;
    status: string;
    isTrackingRequired: boolean;
  };
  bidCount: number;
};

export enum ContactPreference {
  PHONE = "PHONE",
  PRIMARY_PHONE = "PRIMARY_PHONE",
  SECONDARY_PHONE = "SECONDARY_PHONE",
  EMAIL = "EMAIL",
}

export enum LoadType {
  FULL = "FULL",
  PARTIAL = "PARTIAL",
  BOTH = "BOTH",
}

export type City = {
  id: string;
  cityName: string;
  cityAm?: string;
  regionId: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  region: {
    id: string;
    regionName: string;
    regionAm?: string;
    isActive: boolean;
  };
};

export type TruckPost = {
  id: string;
  origin: string;
  originId: string;
  destination: string;
  originLat: number;
  originLng: number;
  destinationLat: number;
  destinationLng: number;
  destinationId: string;
  startDate: string;
  endDate: string;
  loadType: LoadType;
  weight: number;
  rate: number;
  rateType: RateType;
  isActive: boolean;
  status: Status;
  createdAt: string;
  originCity: {
    id: string;

    cityName: string;
    latitude: number;
    longitude: number;
  };
  destinationCity: {
    id: string;

    cityName: string;
    latitude: number;
    longitude: number;
  };
  truck: {
    plateNumber: string;
  };
  carrierDetails: {
    name: string;
    email: string;
    companyName: string;
    phoneNumber: string;
  };
  age: string;
  originRegion: string;
  destinationRegion: string;
  carrierId: string;
  truckId: string;
  truckTypeId: string;
  remark: string | null;
  contactPreference: ContactPreference;
  contactPhone: string;
  contactEmail: string | null;
  truckType: Trucktype;
};

export enum Visibility {
  PUBLIC = "PUBLIC",
  PRIVATE_NETWORK = "PRIVATE_NETWORK",
  PRIVATE_GROUP = "PRIVATE_GROUP",
}

export interface AsyncResponse<T = any> {
  status?: number;
  success?: boolean;
  data?: T;
  error?: string;
  errorBody?: any;
  message?: string;
}

export enum Language {
  English = "English",
  Amharic = "Amharic",
  // AfaanOromo = 'Afaan Oromo',
  // Tigrigna = 'Tigrigna'
}

export enum LanguageKey {
  English = "en",
  Amharic = "am",
}

export enum UserType {
  Shipper = "SHIPPER",
  Carrier = "CARRIER",
  Broker = "BROKER",
  Admin = "ADMIN",
}

export type OtpChannels = "email" | "sms";

export type RegisterUserInfo = {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string | undefined;
  role: UserType;
  otpChannel: OtpChannels;
  phoneNumber: string;
  terms: boolean | undefined;
};

export type Size = "sm" | "md" | "lg";
export type InputSize = Size;

export type BusinessInfoRegister = {
  companyName: string;
  tin: string;
  region: string;
  city: string;
  businessLicense: File | null;
  tinCertificate: File | null;
};

export type Navs = {
  name: string;
  labelKey?: TranslationKey;
  path?: keyof FileRoutesByPath;
  icon?: string;
  show?: boolean;
  group?: string;
  groupKey?: TranslationKey;
  onClick?: (...args: any) => void;
  children?: Navs[];
  role?: UserType | UserType[];
  privileges?: Permissions[];
  requiresAuth?: boolean;
  titleKey?: TranslationKey;
  subtitleKey?: TranslationKey;
};

export type Region = {
  id: string;
  regionName: string;
  cities: City[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  regionAm: string;
};

export enum ShipmenFilterStatus {
  "APPROVED" = "APPROVED",
  "WARNING" = "WARNING",
  "PENDING" = "PENDING",
  "COUNTERED" = "COUNTERED",
  "REJECTED" = "REJECTED",
  "CANCELED" = "CANCELED",
  "COMPLETED" = "COMPLETED",
  "ACCEPTED" = "ACCEPTED",
  "POSTED" = "POSTED",
  "UNPOSTED" = "UNPOSTED",
  "ASSIGNED" = "ASSIGNED",
  "ACTIVE" = "ACTIVE",
  "INACTIVE" = "INACTIVE",
  "DELETED" = "DELETED",
}

export enum Permissions {
  create_users = "create_users",
  read_users = "read_users",
  update_users = "update_users",
  delete_users = "delete_users",
  Submit_Bid_users = "Submit_Bid_users",
  Accept_Bid_users = "Accept_Bid_users",
  Reject_Bid_users = "Reject_Bid_users",
  create_loads = "create_loads",
  read_loads = "read_loads",
  update_loads = "update_loads",
  delete_loads = "delete_loads",
  Submit_Bid_loads = "Submit_Bid_loads",
  Accept_Bid_loads = "Accept_Bid_loads",
  Reject_Bid_loads = "Reject_Bid_loads",
  create_shipments = "create_shipments",
  read_shipments = "read_shipments",
  update_shipments = "update_shipments",
  delete_shipments = "delete_shipments",
  Submit_Bid_shipments = "Submit_Bid_shipments",
  Accept_Bid_shipments = "Accept_Bid_shipments",
  Reject_Bid_shipments = "Reject_Bid_shipments",
  create_vehicles = "create_vehicles",
  read_vehicles = "read_vehicles",
  update_vehicles = "update_vehicles",
  delete_vehicles = "delete_vehicles",
  Submit_Bid_vehicles = "Submit_Bid_vehicles",
  Accept_Bid_vehicles = "Accept_Bid_vehicles",
  Reject_Bid_vehicles = "Reject_Bid_vehicles",
  create_PRIVATE_NETWORK = "create_PRIVATE_NETWORK",
  read_PRIVATE_NETWORK = "read_PRIVATE_NETWORK",
  update_PRIVATE_NETWORK = "update_PRIVATE_NETWORK",
  delete_PRIVATE_NETWORK = "delete_PRIVATE_NETWORK",
  Submit_Bid_PRIVATE_NETWORK = "Submit_Bid_PRIVATE_NETWORK",
  Accept_Bid_PRIVATE_NETWORK = "Accept_Bid_PRIVATE_NETWORK",
  Reject_Bid_PRIVATE_NETWORK = "Reject_Bid_PRIVATE_NETWORK",
  create_private_network = "create_private_network",
  read_private_network = "read_private_network",
  update_private_network = "update_private_network",
  delete_private_network = "delete_private_network",
  Submit_Bid_private_network = "Submit_Bid_private_network",
  Accept_Bid_private_network = "Accept_Bid_private_network",
  Reject_Bid_private_network = "Reject_Bid_private_network",
  create_private_group = "create_private_group",
  read_private_group = "read_private_group",
  update_private_group = "update_private_group",
  delete_private_group = "delete_private_group",
  Submit_Bid_private_group = "Submit_Bid_private_group",
  Accept_Bid_private_group = "Accept_Bid_private_group",
  Reject_Bid_private_group = "Reject_Bid_private_group",
  create_REGION = "create_REGION",
  read_REGION = "read_REGION",
  update_REGION = "update_REGION",
  delete_REGION = "delete_REGION",
  Submit_Bid_REGION = "Submit_Bid_REGION",
  Accept_Bid_REGION = "Accept_Bid_REGION",
  Reject_Bid_REGION = "Reject_Bid_REGION",
  create_CITIES = "create_CITIES",
  read_CITIES = "read_CITIES",
  update_CITIES = "update_CITIES",
  delete_CITIES = "delete_CITIES",
  Submit_Bid_CITIES = "Submit_Bid_CITIES",
  Accept_Bid_CITIES = "Accept_Bid_CITIES",
  Reject_Bid_CITIES = "Reject_Bid_CITIES",
  create_regions = "create_regions",
  read_regions = "read_regions",
  update_regions = "update_regions",
  delete_regions = "delete_regions",
  Submit_Bid_regions = "Submit_Bid_regions",
  Accept_Bid_regions = "Accept_Bid_regions",
  Reject_Bid_regions = "Reject_Bid_regions",
  create_cities = "create_cities",
  read_cities = "read_cities",
  update_cities = "update_cities",
  delete_cities = "delete_cities",
  Submit_Bid_cities = "Submit_Bid_cities",
  Accept_Bid_cities = "Accept_Bid_cities",
  Reject_Bid_cities = "Reject_Bid_cities",
}

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
};

export enum SavedShipmentSource {
  BID_SENT = "BID_SENT",
  BID_COUNTERED = "BID_COUNTERED",
  BID_REJECTED = "BID_REJECTED",
  SAVED = "SAVED",
}

export type Shipment = {
  id: string;
  _id: string;
  shipmentNumber: string;
  shipperId: string;
  carrierId: string;
  status: ShipmentStatus;
  loadSource: string;
  origin: string;
  originRegion: string;
  originCityId: string;
  originId: string;
  originLat: number;
  originLng: number;
  destination: string;
  destinationRegion: string;
  destinationCityId: string;
  destinationId: string;
  destinationLat: number;
  destinationLng: number;
  distance: number;
  estimatedArrivalDate: string;
  travelDuration: number;
  distanceText: string;
  durationText: string;
  routePolyline: string;
  routeSource: string;
  pickupEarliest: string;
  pickupLatest: string;
  pickupHours: string;
  dropoffHours: string;
  pendingBidCount: number;
  age: string;
  shipperInfo: {
    name: string;
    email: string;
    companyName: string;
    phoneNumber: string;
    shipperInfo?: {
      user: User;
      name: string;
      email: string;
      companyName: string;
      phoneNumber: string;
    };
  };
  saveAsTemplate: boolean;
  truckType: string;
  truckTypeId: string;
  loadType: LoadType;
  length: number | undefined;
  weight: number;
  commodity: string;
  remark: string;
  contactPreference: ContactPreference;
  primaryPhone: string;
  contactEmail: string;
  isTrackingRequired: boolean;
  visibility: Visibility;
  visibleTo: string[];
  rateType: RateType;
  flatRatePrivateNetwork: number;
  flatRatePublicMarket: number;
  paymentTerm: PaymentTerm;
  advancePayment: number;
  disbursementPeriod: string;
  maxRate: number;
  allowBidsPrivateNetwork: boolean;
  allowBidsPublicMarket: boolean;
  createdAt: string;
  updatedAt: string;
  templateId: null;
  originCity: City;
  destinationCity: City;
  truckTypeRef: Truck;
  privateNetworkIds: Contact[];
  privateGroupIds: PrivateGroup<string>[];
  matchingTrucksCount: number;
};

export type User = {
  id: string;
  phoneNumber: string;
  secondaryPhone?: string;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  role: UserType;
  permissions: Permissions[];
};

export type Contact = {
  id: string;
  userId?: string;
  companyName: string;
  contactPerson: string;
  phone_number: string;
  status: "active" | "inactive" | "deleted";
  ownerId: string;
  phoneNumber: string;
  chinetId: string;
  email: string;
  isSubscriber: boolean;
  isCustomer: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: UserType;
};

export type AdminStats = {
  totalUsers: number;
  usersByRole: {
    admin: number;
    shipper: number;
    carrier: number;
    broker: number;
  };
  verificationStatus: {
    verified: number;
    pending: number;
    rejected: number;
  };
  activeProfiles: number;
  recentSignups: number;
  lastUpdated: string;
};

export type ShipperStats = {
  totalShippers?: number;
  activeStatus?: number;
  verificationRates?: number;
  subscriptionTiers?: number;
  growthMetrics?: number;
};

export type PrivateGroup<T extends string | PrivateGroupMember> = {
  id: string;
  ownerId: string;
  groupName: string;
  members: T[];
  createdAt: string;
  updatedAt: string;
};

export type PrivateGroupMember = {
  id: string;
  userId: string;
  phoneNumber: string;
  isSubscriber: boolean;
  isCustomer: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type Truck = {
  id: string;
  name: string;
  nameAm?: string;
  shortName: string;
  imageUrl: string;
  truckCategoryId: string;
  truckCategory: {
    id: string;
    name: string;
    nameAm?: string;
    isActive: boolean;
  };
  truckType: Trucktype;
  carrier: string;
  plateNumber: string;
  truckTypeId: string;
  loadType: string;
  weight: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  libreDocumentPath: string | null;
  libreStatus: string | null;
  insuranceDocumentPath: string | null;
  insuranceStatus: string | null;
};

export type TruckDocumentDetail = AsyncResponse<Truck>;

export type companyRegInfo = {
  companyName: string;
  tin: string;
  secondaryPhone?: string;

  region: string;
  city: string;
  zone: string;
  woreda: string;
  kebele: string;
  houseNumber: string;
  secondaryPhoneNumber?: string;
  businessLicense: File | string | null | string[];
  tinCertificate: File | string | null | string[];
};

export type FileResponse = {
  name: string;
  key: string;
  id: string;
  url: string;
  _id: string;
};

export type BusinessLicense = FileResponse;

export type TinCertificate = FileResponse;

export type NotificationPreferences = {
  shipmentStatusChanged: {
    system: boolean;
    email: boolean;
    sms: boolean;
  };
  newCounterOfferReceived: {
    system: boolean;
    email: boolean;
    sms: boolean;
  };
  bidRejected: {
    system: boolean;
    email: boolean;
    sms: boolean;
  };
  bidAccepted: {
    system: boolean;
    email: boolean;
    sms: boolean;
  };
  _id: string;
  id: string;
};

export type CompanyProfile = {
  _id: string;
  userId: string;
  verificationStatus: "pending" | "approved" | "rejected";

  businessLicense: BusinessLicense[];

  tinCertificate: TinCertificate[];

  createdAt: string;
  updatedAt: string;

  notificationPreferences: NotificationPreferences;

  companyName: string;
  tin: string;
  secondaryPhoneNumber?: string;
  city: string;
  region: string;
  zone: string;
  woreda: string;
  kebele: string;
  houseNumber: string;
};

export type MyProfile<T extends UserType = UserType> = {
  [Key in `${Lowercase<T>}ProfileId`]: CompanyProfile;
} & {
  _id: string;
  userId: string;

  phoneNumber: string;
  email: string;

  firstName: string;
  middleName: string;
  lastName: string;

  role: UserType;

  permissions: Permissions[];

  isVerified: boolean;
  signupStatus: "pending" | "approved" | "rejected";

  createdAt: string;
  updatedAt: string;
  chinetId: string;
  notificationPreferences: NotificationPreferences;
};

export type Trucktype = {
  id: string;
  name: string;
  nameAm?: string;
  shortName: string;
  imageUrl: string;
  truckCategoryId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MyTrucks = {
  id: string;
  carrier: string;
  plateNumber: number;
  truckTypeId: string;
  truckType: Trucktype;
  loadType: LoadType;
  weight: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  libreDocumentPath: string;
  libreStatus: string;
  insuranceDocumentPath: string;
  insuranceStatus: string;
};

// Template data type - matches backend response
export type ShipmentTemplate = {
  id: string;
  name: string;
  distance?: number;
  pickupEarliest: string;
  pickupLatest: string;
  description: string | null;
  isActive: boolean;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  lastUsedAt: string | null;
  origin: string;
  originRegion: string;
  originCityId: string;
  originLat: number;
  originLng: number;
  destination: string;
  destinationRegion: string;
  destinationCityId: string;
  destinationLat: number;
  destinationLng: number;
  truckType: string;
  truckTypeId: string;
  loadType: LoadType;
  length: number | null;
  weight: number;
  commodity: string;
  remark: string;
  contactPreference: ContactPreference;
  primaryPhone: string;
  contactEmail: string;
  isTrackingRequired: boolean;
  pickupHours: string;
  dropoffHours: string;
  age: string;
  visibility: Visibility;
  visibleTo: string[];
  rateType: RateType;
  flatRatePrivateNetwork: number;
  flatRatePublicMarket: number;
  paymentTerm: PaymentTerm;
  advancePayment: number | null;
  disbursementPeriod: string | null;
  maxRate: number;
  allowBidsPrivateNetwork: boolean;
  allowBidsPublicMarket: boolean;
  privateNetworkIds: Contact[];
  privateGroupIds: PrivateGroup<string>[];
  originCity: City;
  destinationCity: City;
  truckTypeRef: Trucktype;
};



type Vehicle = {
  _id: string;
  plateNumber: string;
  status: "available" | "unavailable" | "in_service" | string;
};

type Inspector = {
  _id: string;
  name: string;
  phone: string;
};

export type inspection = {
  _id: string;
  vehicle: Vehicle;
  inspectionDate: string; // ISO date string
  odometerReading: number;
  inspector: Inspector;
  inspectionReason: "ROUTINE" | string;
  status: "PENDING" | "COMPLETED" | "FAILED" | string;
  remarks: string;
  issuesFound: any[]; // you can refine this if you know the structure
  nextInspectionDate: string; // ISO date string
  carrier: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};