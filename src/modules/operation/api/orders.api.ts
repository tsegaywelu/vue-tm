import { getApi } from "@/utils/utils";
import type { Order } from "../operation.types";

const api = getApi("/order");

export function fetch_order_by_id(id: string) {
  return api.addAuthenticationHeader().get<Order>(`/${id}`);
}

export function create_order(data: any) {
  return api.addAuthenticationHeader().post("", data);
}

export function update_order(id: string, data: any) {
  return api.addAuthenticationHeader().patch(`/${id}`, data);
}

export function approve_order(id: string) {
  return api.addAuthenticationHeader().patch(`/approve/${id}`, {});
}

export function cancel_order(id: string, data?: any) {
  return api.addAuthenticationHeader().patch(`/cancel/${id}`, data || {});
}

export function fetch_contract_route_details(carrierId: string, routeId: string) {
  return getApi("/contract").addAuthenticationHeader().get(`/contract-route-details-shipper/${carrierId}/${routeId}`);
}
