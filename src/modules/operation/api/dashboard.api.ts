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
  return shipment_api.get("/statusCount");
}

export function fetchOrderStats() {
  return order_api.get("/approvedAndPending");
}

export function fetchVehicleStatusCount() {
  return vehicle_api.get("/count-by-status");
}

export function fetchDriverStatusCount() {
  return driver_api.get("/count-by-status");
}

export function fetchDestinationDowntime() {
  return shipment_api.get("/activeShipmentdestinationDownTime");
}

export function fetchRoutesByVolume(
  startDate?: string,
  endDate?: string
) {
  const range = defaultDateRange();
  return shipment_api.get("/routesByShipmentVolume", {
    params: {
      startDate: startDate ?? range.startDate,
      endDate: endDate ?? range.endDate,
    },
  });
}
