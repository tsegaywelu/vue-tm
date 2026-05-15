import ApiService from "@/api/ApiService";
import { getApi } from "@/utils/getApi";

const api = new ApiService();

// ── Shipper Profile ──
export const fetch_shipper_profile = (shipperId: string) =>
  api.addAuthenticationHeader().get(`/shipper/${shipperId}`);

// ── Shipments (shipper-scoped) ──
export const fetch_shipper_shipments = (params: Record<string, any>) =>
  api.addAuthenticationHeader().get("/shipment", { params });

// ── Orders (shipper-scoped) ──
export const fetch_shipper_orders = (params: Record<string, any>) =>
  api.addAuthenticationHeader().get("/order", { params });

// ── Routes ──
export const fetch_shipper_routes = (shipperId: string, params: Record<string, any> = {}) =>
  api.addAuthenticationHeader().get(`/route/shipper/${shipperId}`, { params });

// ── Carriers ──
export const fetch_shipper_carriers = (params: Record<string, any> = {}) =>
  api.addAuthenticationHeader().get("/shipper/contractedCarriers", { params });

// ── Agents ──
export const fetch_shipper_agents = (shipperId: string, params: Record<string, any> = {}) =>
  api.addAuthenticationHeader().get(`/customer/${shipperId}/agents`, { params });

export const fetch_agent_by_id = (id: string) =>
  api.addAuthenticationHeader().get(`/agent/${id}`);

export const create_shipper_agent = (data: any) =>
  api.addAuthenticationHeader().post("/agent", data);

export const update_shipper_agent = (id: string, data: any) =>
  api.addAuthenticationHeader().patch(`/agent/${id}`, data);

// ── Facilities ──
export const fetch_shipper_facilities = (shipperId: string, params: Record<string, any> = {}) =>
  api.addAuthenticationHeader().get(`/customer/${shipperId}/facilities`, { params });

export const create_shipper_facility = (data: any) =>
  api.addAuthenticationHeader().post("/facility", data);

export const update_shipper_facility = (id: string, data: any) =>
  api.addAuthenticationHeader().patch(`/facility/${id}`, data);

export const fetch_facility_by_id = (id: string) =>
  api.addAuthenticationHeader().get(`/facility/${id}`);

// ── Contacts ──
export const fetch_shipper_contacts = (params: Record<string, any> = {}) =>
  api.addAuthenticationHeader().get("/auth/users", { params });

// ── Contracts ──
export const fetch_shipper_contracts = (params: Record<string, any> = {}) =>
  api.addAuthenticationHeader().get("/contract/shipper", { params });

export const fetch_shipper_contract_by_id = (id: string) =>
  api.addAuthenticationHeader().get(`/contract/${id}`);

export const create_shipper_contract = (data: any) =>
  api.addAuthenticationHeader().post("/contract", data);

export const add_shipper_contract_route = (contractId: string, data: any) =>
  api.addAuthenticationHeader().patch(`/contract/${contractId}/route`, data);

export const update_shipper_contract_route = (contractId: string, routeId: string, data: any) =>
  api.addAuthenticationHeader().patch(`/contract/${contractId}/route/${routeId}`, data);

export const delete_shipper_contract_route = (contractId: string, routeId: string) =>
  api.addAuthenticationHeader().delete(`/contract/${contractId}/route/${routeId}`);

// ── Finance / Invoices ──
export const fetch_shipper_invoices = (params: Record<string, any> = {}) =>
  api.addAuthenticationHeader().get("/shipment/approvedAndCollectedInvoices", { params });

export const fetch_shipper_invoices_count = (params: Record<string, any> = {}) =>
  api.addAuthenticationHeader().get("/shipment/approvedAndCollectedInvoiceCount", { params });

export const collect_shipper_invoice = (id: string, data: any) =>
  api.addAuthenticationHeader().patch(`/shipment/payPayment/shipper/${id}`, data);

export const reject_shipper_invoice = (id: string) =>
  api.addAuthenticationHeader().patch(`/shipment/rejectInvoice/${id}`, {});

// ── Users (shipper admin) ──
export const fetch_shipper_users = (params: Record<string, any> = {}) =>
  api.addAuthenticationHeader().get("/auth/users", { params });

export const create_shipper_user = (data: any) =>
  api.addAuthenticationHeader().post('/auth/register', data);

export const update_user = (id: string, data: any) =>
  api.addAuthenticationHeader().patch(`/user/${id}`, data);

export const delete_user = (id: string) =>
  api.addAuthenticationHeader().delete(`/user/${id}`);

export const fetch_shipper_roles = (params: Record<string, any> = {}) =>
  api.addAuthenticationHeader().get("/role", { params });

export const fetch_shipper_role_details = (id: string) =>
  api.addAuthenticationHeader().get(`/role/${id}`);

export const create_shipper_role = (data: any) =>
  api.addAuthenticationHeader().post("/role/shipper", data);

export const update_role = (id: string, data: any) =>
  api.addAuthenticationHeader().patch(`/role/${id}`, data);

export const delete_role = (id: string) =>
  api.addAuthenticationHeader().delete(`/role/${id}`);

// ── Settings (Commodity, Packaging, Announcements) ──
const commodity_api = getApi("/commodity");
const packaging_api = getApi("/packaging");
const announcement_api = getApi("/announcements");

// Commodity
export const fetch_commodities = (params?: any) =>
  commodity_api.addAuthenticationHeader().get("", { params });
export const fetch_commodity_details = (id: string) =>
  commodity_api.addAuthenticationHeader().get(`/${id}`);
export const create_commodity = (data: any) =>
  commodity_api.addAuthenticationHeader().post("", data);
export const update_commodity = (id: string, data: any) =>
  commodity_api.addAuthenticationHeader().patch(`/${id}`, data);
export const delete_commodity = (id: string) =>
  commodity_api.addAuthenticationHeader().delete(`/${id}`);

// Packaging
export const fetch_packagings = (params?: any) =>
  packaging_api.addAuthenticationHeader().get("", { params });
export const fetch_packaging_details = (id: string) =>
  packaging_api.addAuthenticationHeader().get(`/${id}`);
export const create_packaging = (data: any) =>
  packaging_api.addAuthenticationHeader().post("", data);
export const update_packaging = (id: string, data: any) =>
  packaging_api.addAuthenticationHeader().patch(`/${id}`, data);
export const delete_packaging = (id: string) =>
  packaging_api.addAuthenticationHeader().delete(`/${id}`);

// Announcements
export const fetch_announcements = (params?: any) =>
  announcement_api.addAuthenticationHeader().get("", { params });
export const fetch_announcement_details = (id: string) =>
  announcement_api.addAuthenticationHeader().get(`/${id}`);
export const create_announcement = (data: any) =>
  announcement_api.addAuthenticationHeader().post("", data);
export const update_announcement = (id: string, data: any) =>
  announcement_api.addAuthenticationHeader().patch(`/${id}`, data);
export const delete_announcement = (id: string) =>
  announcement_api.addAuthenticationHeader().delete(`/${id}`);
