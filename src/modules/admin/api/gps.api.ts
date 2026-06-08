import { getApi } from "@/utils/getApi";

const api = getApi("/gps-config/providers");

export function listProviders(params?: Record<string, any>) {
  return api.addAuthenticationHeader().get<any[]>("", { params });
}

export function createProvider(payload: Record<string, any>) {
  return api.addAuthenticationHeader().post("", payload);
}

export function updateProvider(id: string, payload: Record<string, any>) {
  return api.addAuthenticationHeader().patch(`/${id}`, payload);
}

export function deleteProvider(id: string) {
  return api.addAuthenticationHeader().delete(`/${id}`);
}
