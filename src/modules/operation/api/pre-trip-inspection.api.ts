import { getApi } from "@/utils/getApi";

const preTripApi = getApi("/pre-trip-inspection");

export function fetch_pre_trip_inspections(shipmentId: string) {
  return preTripApi
    .addAuthenticationHeader()
    .get<any>(`/shipment/${shipmentId}`);
}
