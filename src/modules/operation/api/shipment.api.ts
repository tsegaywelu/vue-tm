import { getApi } from "@/utils/getApi";
import type { Shipment, ShipmentFilterParams } from "../operation.types";

const shipment_api = getApi("/shipments");

export function fetch_shipments(params: ShipmentFilterParams) {
  return shipment_api
    .addAuthenticationHeader()
    .get<Shipment[]>("/all", { params });
}

export function fetch_shipment_details(id: string) {
  return shipment_api.addAuthenticationHeader().get<Shipment>(`/${id}`);
}
