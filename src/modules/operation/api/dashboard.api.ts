import { getApi } from "@/utils/getApi";

const shipment_api          = getApi("/shipment");
const order_api             = getApi("/order");
const vehicle_api           = getApi("/vehicle");
const driver_api            = getApi("/driver");
const service_reminder_api  = getApi("/service-reminder");
const lease_api             = getApi("/vehicle-lease-agreement");



export function fetchShipmentStatusCount() {
  shipment_api.addAuthenticationHeader();
  return shipment_api.get("/statusCount");
}

export function fetchOrderStats() {
  order_api.addAuthenticationHeader();
  return order_api.get("/approvedAndPending");
}

export function fetchVehicleStatusCount() {
  vehicle_api.addAuthenticationHeader();
  return vehicle_api.get("/count-by-status");
}

export function fetchDriverStatusCount() {
  driver_api.addAuthenticationHeader();
  return driver_api.get("/count-by-status");
}

export function fetchDestinationDowntime() {
  shipment_api.addAuthenticationHeader();
  return shipment_api.get("/activeShipmentdestinationDownTime");
}

export function fetchPendingOrders() {
  order_api.addAuthenticationHeader();
  return order_api.get("", { params: { limit: 100 } });
}

// ── Expiry / alert endpoints ──────────────────────────────────────────────────

export function fetchServiceReminders() {
  service_reminder_api.addAuthenticationHeader();
  return service_reminder_api.get("/all");
}

export function fetchDriverLicenceExpiresIn(days: number) {
  driver_api.addAuthenticationHeader();
  return driver_api.get(`/drivingLicenceExpiresIn/${days}`);
}

export function fetchDriverLicenceExpired() {
  driver_api.addAuthenticationHeader();
  return driver_api.get("/drivingLicenceExpired");
}

export function fetchBoloExpiresIn(days: number) {
  vehicle_api.addAuthenticationHeader();
  return vehicle_api.get(`/boloExpiresIn/${days}`);
}

export function fetchBoloExpired() {
  vehicle_api.addAuthenticationHeader();
  return vehicle_api.get("/boloExpired");
}

export function fetchInsuranceExpiresIn(days: number) {
  vehicle_api.addAuthenticationHeader();
  return vehicle_api.get(`/insuranceExpiresIn/${days}`);
}

export function fetchInsuranceExpired() {
  vehicle_api.addAuthenticationHeader();
  return vehicle_api.get("/insuranceExpired");
}

export function fetchLeaseExpiryAlerts(days: number) {
  lease_api.addAuthenticationHeader();
  return lease_api.get("/alert/expiry-alerts", { params: { duration: days } });
}

export function fetchVehicleAlerts() {
  vehicle_api.addAuthenticationHeader();
  return vehicle_api.get("/vehicleAlerts");
}

// ─────────────────────────────────────────────────────────────────────────────

export function fetchRoutesByVolume(startDate?: string, endDate?: string) {
  shipment_api.addAuthenticationHeader();
  const params: Record<string, string> = {};
  if (startDate) params.startDate = startDate;
  if (endDate)   params.endDate   = endDate;
  return shipment_api.get("/routesByShipmentVolume", { params });
}
