import { getApi } from "@/utils/getApi";

const api = getApi("/invoice-template");

export const fetch_invoice_templates = (params?: any) =>
  api.addAuthenticationHeader().get("", { params });

export const fetch_invoice_template = (shipperId: string, productType: string) =>
  api.addAuthenticationHeader().get(`/${shipperId}/${productType}`);

export const create_invoice_template = (data: {
  shipperId: string;
  productType: string;
  content: string;
}) => api.addAuthenticationHeader().post("", data);

export const update_invoice_template = (
  shipperId: string,
  productType: string,
  content: string,
) => api.addAuthenticationHeader().patch(`/${shipperId}/${productType}`, { content });

export const delete_invoice_template = (shipperId: string, productType: string) =>
  api.addAuthenticationHeader().delete(`/${shipperId}/${productType}`);
