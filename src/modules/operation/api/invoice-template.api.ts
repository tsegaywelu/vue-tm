import { getApi } from "@/utils/getApi";

const api = getApi("/invoice-template");

export const fetch_invoice_templates = (params?: any) =>
  api.addAuthenticationHeader().get("", { params });

export const fetch_invoice_template = (id: string) =>
  api.addAuthenticationHeader().get(`/${id}`);

export const create_invoice_template = (data: any) =>
  api.addAuthenticationHeader().post("", data);

export const update_invoice_template = (id: string, data: any) =>
  api.addAuthenticationHeader().patch(`/${id}`, data);

export const delete_invoice_template = (id: string) =>
  api.addAuthenticationHeader().delete(`/${id}`);
