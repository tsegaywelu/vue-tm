import { getApi } from "@/utils/getApi";

const empty_return_api = getApi("/empty-return");

export function fetch_empty_returns_by_shipment(shipmentId: string) {
  return empty_return_api
    .addAuthenticationHeader()
    .get<any>(`/by-shipment/${shipmentId}`);
}

export function create_empty_return(data: any) {
  return empty_return_api
    .addAuthenticationHeader()
    .post<any>("", data);
}

export function update_empty_return(id: string, data: any) {
  return empty_return_api
    .addAuthenticationHeader()
    .patch<any>(`/${id}`, data);
}

export function delete_empty_return(id: string) {
  return empty_return_api
    .addAuthenticationHeader()
    .delete<any>(`/${id}`);
}
