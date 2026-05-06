import { getApi } from "@/utils/utils";
import type { Order } from "../operation.types";

const api = getApi("/order");

export function fetch_order_by_id(id: string) {
  return api.addAuthenticationHeader().get<Order>(`/${id}`);
}

export function create_order(data: any) {
  return api.addAuthenticationHeader().post("/carrier", data);
}

export function update_order(id: string, data: any) {
  return api.addAuthenticationHeader().patch(`/${id}/carrier`, data);
}

export function approve_order(id: string) {
  return api.addAuthenticationHeader().patch(`/approve/${id}`, {});
}

export function cancel_order(id: string, data?: any) {
  return api.addAuthenticationHeader().patch(`/cancel/${id}`, data || {});
}

export function fetch_contract_route_details(
  shipperId: string,
  routeId: string,
) {
  return getApi("/contract")
    .addAuthenticationHeader()
    .get(`/contract-route-details-carrier/${shipperId}/${routeId}`);
}

export function fetch_order_status_count() {
  return api.addAuthenticationHeader().get<any>("/statusCount");
}
