import { getApi } from "@/utils/getApi";

const shipment_api = getApi("/shipment");
const order_api = getApi("/order");
const vehicle_api = getApi("/vehicle");
const driver_api = getApi("/driver");

function isoDate(date: Date) {
  return date.toISOString().split("T")[0];
}

function defaultDateRange() {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 1);
  return { startDate: isoDate(start), endDate: isoDate(end) };
}

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

export function fetchRoutesByVolume(startDate?: string, endDate?: string) {
  const range = defaultDateRange();
  shipment_api.addAuthenticationHeader();
  return shipment_api.get("/routesByShipmentVolume", {
    params: {
      startDate: startDate ?? range.startDate,
      endDate: endDate ?? range.endDate,
    },
  });
}
