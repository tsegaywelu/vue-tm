import { getApi } from "@/utils/getApi";

const tyre_handoff_api = getApi("/tyre-handoffs");

export const fetch_tyre_handoffs = async (params: Record<string, any>) => {
  return await tyre_handoff_api.addAuthenticationHeader().get("", { params });
};

export const fetch_tyre_handoff_by_id = async (id: string) => {
  return await tyre_handoff_api.addAuthenticationHeader().get(`/${id}`);
};

export const assign_tyre_handoff = async (id: string, data: any) => {
  return await tyre_handoff_api.addAuthenticationHeader().post(`/${id}/assign`, data);
};

export const complete_tyre_handoff = async (id: string, data: any) => {
  return await tyre_handoff_api.addAuthenticationHeader().post(`/${id}/complete`, data);
};

export const fail_tyre_handoff = async (id: string, data: any) => {
  return await tyre_handoff_api.addAuthenticationHeader().post(`/${id}/fail`, data);
};

export const cancel_tyre_handoff = async (id: string, data: any) => {
  return await tyre_handoff_api.addAuthenticationHeader().post(`/${id}/cancel`, data);
};
