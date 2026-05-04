import { getApi } from "@/utils/getApi";

const infraction_api = getApi("/infraction");

export function fetch_infractions(params?: Record<string, any>) {
  return infraction_api.addAuthenticationHeader().get("", { params });
}

export function fetch_infraction_by_id(id: string) {
  return infraction_api.addAuthenticationHeader().get(`/${id}`);
}

export function add_infraction(data: any) {
  return infraction_api.addAuthenticationHeader().post("", data);
}

export function update_infraction(id: string, data: any) {
  return infraction_api.addAuthenticationHeader().patch(`/${id}`, data);
}

export function update_infraction_status(
  id: string,
  action: string,
  data: any = {},
) {
  return infraction_api
    .addAuthenticationHeader()
    .patch(`/${id}/${action}`, data);
}

const infraction_type_api = getApi("/infraction-type");

export function fetch_infraction_types(params?: Record<string, any>) {
  return infraction_type_api.addAuthenticationHeader().get("", { params });
}

export function add_infraction_type(data: any) {
  return infraction_type_api.addAuthenticationHeader().post("", data);
}

export function update_infraction_type(id: string, data: any) {
  return infraction_type_api.addAuthenticationHeader().patch(`/${id}`, data);
}
