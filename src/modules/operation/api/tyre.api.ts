import { getApi } from "@/utils/getApi";

const tyre_api = getApi("/tyre");

export const update_tyre_status = async (
  id: string,
  status: string,
  data: any
) => {
  return await tyre_api.addAuthenticationHeader().patch(`/${id}/${status}`, data);
};

export const create_tyre = async (data: any) => {
  return await tyre_api.addAuthenticationHeader().post("", data);
};

export const fetch_tyre_by_id = async (id: string) => {
  return await tyre_api.addAuthenticationHeader().get(`/${id}`);
};

export const update_tyre = async (id: string, data: any) => {
  return await tyre_api.addAuthenticationHeader().patch(`/${id}`, data);
};

export const delete_tyre = async (id: string) => {
  return await tyre_api.addAuthenticationHeader().delete(`/${id}`);
};

