import { getApi } from "@/utils/getApi";

const carrierApi = getApi("/carrier");
const authApi = getApi("/auth");

export function getCarrierById(id: string) {
  return carrierApi.addAuthenticationHeader().get(`/${id}`);
}

export function createCarrier(data: FormData) {
  return carrierApi.addAuthenticationHeader().post("", data);
}

export function updateCarrier(id: string, data: FormData) {
  return carrierApi.addAuthenticationHeader().patch(`/${id}`, data);
}

export function getAllCarriers(params?: Record<string, any>) {
  return carrierApi.addAuthenticationHeader().get("", { params });
}

export function createCarrierAdmin(carrierId: string, data: Record<string, any>) {
  return authApi.addAuthenticationHeader().post(`/register/carrier/${carrierId}`, data);
}

export function updateCarrierAdmin(id: string, data: Record<string, any>) {
  return authApi.addAuthenticationHeader().patch(`/register/carrier/${id}`, data);
}
