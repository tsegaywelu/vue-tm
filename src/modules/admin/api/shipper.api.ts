import { getApi } from "@/utils/getApi";

const shipperApi = getApi("/shipper");
const authApi = getApi("/auth");

export function getShipperById(id: string) {
  return shipperApi.addAuthenticationHeader().get(`/${id}`);
}

export function createShipper(data: FormData) {
  return shipperApi.addAuthenticationHeader().post("", data);
}

export function updateShipper(id: string, data: FormData) {
  return shipperApi.addAuthenticationHeader().patch(`/${id}`, data);
}

export function getAllShippers(params?: Record<string, any>) {
  return shipperApi.addAuthenticationHeader().get("", { params });
}

export function createShipperAdmin(shipperId: string, data: Record<string, any>) {
  return authApi.addAuthenticationHeader().post(`/register/shipper/${shipperId}`, data);
}

export function updateShipperAdmin(id: string, data: Record<string, any>) {
  return authApi.addAuthenticationHeader().patch(`/register/shipper/${id}`, data);
}
