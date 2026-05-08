import { getApi } from "@/utils/getApi";
import type {
  ApprovalRequest,
  ApprovalFilterParams,
  ApprovalAction,
  ApprovalSubject,
  Advance,
  Vehicle,
} from "../operation.types";

const advance_api = getApi("/advance-payment");
const transaction_api = getApi("/transaction");
const prepayment_api = getApi("/pre-payment");
const lease_api = getApi("/vehicle-lease-agreement");
const order_api = getApi("/order");
const route_api = getApi("/route");
const shipment_api = getApi("/shipment");
export const vehicle_api = getApi("/vehicle");
const driver_api = getApi("/driver");
const expense_type_api = getApi("/expense-type");
const inventory_api = getApi("/inventory-items");
const shipment_damage_api = getApi("/shipment-damages");
const agent_api = getApi("/agent");
const road_type_api = getApi("/road-type");
const terrain_type_api = getApi("/terrain-type");
const transporter_api = getApi("/transporter");
const region_api = getApi("/region");
const vehicle_type_api = getApi("/vehicle-type");
const vehicle_group_api = getApi("/group");
const vehicle_model_api = getApi("/vehicle-model");
const maker_api = getApi("/maker");
const type_api = getApi("/type");
const insurance_provider_api = getApi("/insurance-provider");
const insurance_api = getApi("/insurance");
const tyre_api = getApi("/tyre");
const approval_api = getApi("/approval-process");
const shipper_api = getApi("/shipper");
const bonus_api = getApi("/bonus");

export function fetch_customer_by_id(id: string) {
  return shipper_api.addAuthenticationHeader().get(`/${id}`);
}

// ─── Agents ───────────────────────────────────────────────────
export function fetch_agents(params?: Record<string, any>) {
  return agent_api.addAuthenticationHeader().get("", { params });
}

export function fetch_agent_by_id(id: string) {
  return getApi("/agent").addAuthenticationHeader().get(`/${id}/carrier`);
}

export function add_agent(data: any) {
  return getApi("/agent").addAuthenticationHeader().post("/carrier", data);
}

export function update_agent(id: string, data: any) {
  return getApi("/agent")
    .addAuthenticationHeader()
    .patch(`/${id}/carrier`, data);
}

// ─── Shipment Damage ──────────────────────────────────────────
export function fetch_shipment_damages(params?: any) {
  return shipment_damage_api.addAuthenticationHeader().get("", { params });
}

export function fetch_shipment_damage_by_id(id: string) {
  return shipment_damage_api.addAuthenticationHeader().get(`/${id}`);
}

export function add_shipment_damage(data: any) {
  return shipment_damage_api.addAuthenticationHeader().post("", data);
}

export function update_shipment_damage(id: string, data: any) {
  return shipment_damage_api.addAuthenticationHeader().patch(`/${id}`, data);
}

export function update_shipment_damage_status(id: string, status: string, data: any = {}) {
  return shipment_damage_api.addAuthenticationHeader().patch(`/${id}/${status}`, data);
}

export function delete_shipment_damage(id: string) {
  return shipment_damage_api.addAuthenticationHeader().delete(`/${id}`);
}

// ─── Vehicle Damage ───────────────────────────────────────────
const vehicle_damage_api = getApi("/vehicle-damages");

export function fetch_vehicle_damages(params?: any) {
  return vehicle_damage_api.addAuthenticationHeader().get("", { params });
}

export function fetch_vehicle_damage_by_id(id: string) {
  return vehicle_damage_api.addAuthenticationHeader().get(`/${id}`);
}

export function add_vehicle_damage(data: any) {
  return vehicle_damage_api.addAuthenticationHeader().post("", data);
}

export function update_vehicle_damage(id: string, data: any) {
  return vehicle_damage_api.addAuthenticationHeader().patch(`/${id}`, data);
}

export function update_vehicle_damage_status(id: string, status: string, data: any = {}) {
  return vehicle_damage_api.addAuthenticationHeader().patch(`/${id}/${status}`, data);
}

export function delete_vehicle_damage(id: string) {
  return vehicle_damage_api.addAuthenticationHeader().delete(`/${id}`);
}

// ─── Approval Requests ────────────────────────────────────────
export function fetch_approval_requests(params: ApprovalFilterParams) {
  return advance_api
    .addAuthenticationHeader()
    .get<ApprovalRequest[]>("/allApprovalRequests", { params });
}

export function update_advance_status(
  id: string,
  status: ApprovalAction,
  data: any = {},
) {
  return advance_api.addAuthenticationHeader().post(`/${id}/${status}`, data);
}

export function settle_advance(id: string) {
  return advance_api.addAuthenticationHeader().post(`/${id}/settle`, {});
}

export function add_transaction_to_advance(
  id: string,
  status: string,
  data: any,
) {
  return advance_api.addAuthenticationHeader().post(`/${id}/${status}`, data);
}

export function update_transaction_status(
  id: string,
  status: ApprovalAction,
  data: any = {},
) {
  return transaction_api
    .addAuthenticationHeader()
    .post(`/${id}/${status}`, data);
}

export function update_prepayment_status(id: string, status: ApprovalAction) {
  return prepayment_api
    .addAuthenticationHeader()
    .post(`/updateStatus`, { id, status });
}

export function update_lease_status(id: string, status: ApprovalAction) {
  return lease_api
    .addAuthenticationHeader()
    .post(`/updateStatus`, { id, status });
}

// ─── Orders ───────────────────────────────────────────────────
export function fetch_orders(params: Record<string, any>) {
  return order_api.addAuthenticationHeader().get("/shipper", { params });
}

export function update_order_status(id: string, data: any) {
  return order_api.addAuthenticationHeader().patch(`/${id}`, data);
}

export function fetch_order_details(id: string) {
  return order_api.addAuthenticationHeader().get(`/${id}`);
}

// ─── Routes ───────────────────────────────────────────────────
export function fetch_routes_paginated(params: Record<string, any>) {
  return route_api.addAuthenticationHeader().get("/all", { params });
}

// ─── Shipment Adjustments ─────────────────────────────────────
export function fetch_shipment_adjustments(params: Record<string, any>) {
  return shipment_api
    .addAuthenticationHeader()
    .get("/shipmentAdjustments", { params });
}

export function fetch_prepayments(params: Record<string, any>) {
  return prepayment_api.addAuthenticationHeader().get("", { params });
}

export function fetch_advances(params: Record<string, any>) {
  return advance_api.addAuthenticationHeader().get("", { params });
}

export function fetch_settled_advances(params: Record<string, any>) {
  return advance_api
    .addAuthenticationHeader()
    .get("/settledAdvance", { params });
}

export function fetch_advance_status_count() {
  return advance_api.addAuthenticationHeader().get("/statusCount");
}

export function create_fuel_advance(data: any) {
  return advance_api.addAuthenticationHeader().post("/fuel-only", data);
}

export function fetch_advance_details(id: string) {
  return advance_api.addAuthenticationHeader().get<Advance>(`/${id}`);
}

export function create_advance(data: any) {
  return advance_api.addAuthenticationHeader().post("", data);
}

export function fetch_expense_types() {
  return expense_type_api.addAuthenticationHeader().get("");
}

export function fetch_inventory_items() {
  return inventory_api.addAuthenticationHeader().get("");
}

// ─── Vehicles ─────────────────────────────────────────────────
export function fetch_vehicles(params?: Record<string, any>) {
  return vehicle_api.addAuthenticationHeader().get("", { params });
}

export function fetch_vehicle_track_route(vehicleId: string) {
  return vehicle_api
    .addAuthenticationHeader()
    .get<
      Array<{ lat: number; lng: number }>
    >(`/vehicle/${vehicleId}/track-route`, {
      baseURL: import.meta.env?.v_STATIC_PATH,
    });
}

export function update_vehicle_status(id: string, data: any) {
  return vehicle_api
    .addAuthenticationHeader()
    .patch(`/vehicleStatus/${id}`, data);
}

export function fetch_vehicle_by_id(id: string) {
  return vehicle_api.addAuthenticationHeader().get<Vehicle>(`/${id}`);
}

export function add_vehicle(data: any) {
  return vehicle_api.addAuthenticationHeader().post("", data);
}

export function update_vehicle(id: string, data: any) {
  return vehicle_api.addAuthenticationHeader().patch(`/${id}`, data);
}

export function fetch_vehicle_types_paginated(params?: Record<string, any>) {
  return vehicle_type_api.addAuthenticationHeader().get("", { params });
}

const cleanParams = (params: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([_, v]) => v !== "" && v !== null && v !== undefined,
    ),
  );
};

export function fetch_vehicle_metrics(params: Record<string, any>) {
  return vehicle_api
    .addAuthenticationHeader()
    .get("/metrics", { params: cleanParams(params) });
}

export function fetch_vehicle_financial_kpis(params: Record<string, any>) {
  return vehicle_api
    .addAuthenticationHeader()
    .get("/financial-kpi", { params: cleanParams(params) });
}

export function fetch_vehicle_productivity_vehicles(
  params: Record<string, any>,
) {
  return vehicle_api
    .addAuthenticationHeader()
    .get("/productivity-kpi", { params: cleanParams(params) });
}

export function fetch_vehicle_goal_achievement(params: Record<string, any>) {
  return vehicle_api
    .addAuthenticationHeader()
    .get("/goal-achievement", { params: cleanParams(params) });
}
export function fetch_vehicle_shipment_financial_kpis(
  id: string,
  params: Record<string, any>,
) {
  return vehicle_api
    .addAuthenticationHeader()
    .get(`/${id}/shipment-financial-kpi`, { params });
}

export function fetch_vehicle_productivity_kpis(
  id: string,
  params: Record<string, any>,
) {
  return vehicle_api
    .addAuthenticationHeader()
    .get(`/${id}/productivity-kpi`, { params });
}

export function fetch_vehicle_type_monthly_goals(params: Record<string, any>) {
  return vehicle_api
    .addAuthenticationHeader()
    .get("/goals/vehicle-type", { params });
}

export function upsert_vehicle_monthly_goal(vehicleId: string, data: any) {
  return vehicle_api
    .addAuthenticationHeader()
    .patch(`/goals/vehicle/${vehicleId}`, data);
}

export function upsert_vehicle_type_monthly_goal(
  vehicleTypeId: string,
  data: any,
) {
  return vehicle_api
    .addAuthenticationHeader()
    .patch(`/goals/vehicle-type/${vehicleTypeId}`, data);
}

export function add_vehicle_type(data: any) {
  return vehicle_type_api.addAuthenticationHeader().post("", data);
}

export function update_vehicle_type(id: string, data: any) {
  return vehicle_type_api.addAuthenticationHeader().patch(`/${id}`, data);
}

export function fetch_vehicle_groups_paginated(params?: Record<string, any>) {
  return vehicle_group_api.addAuthenticationHeader().get("", { params });
}

export function add_vehicle_group(data: any) {
  return vehicle_group_api.addAuthenticationHeader().post("", data);
}

export function update_vehicle_group(id: string, data: any) {
  return vehicle_group_api.addAuthenticationHeader().patch(`/${id}`, data);
}

export function fetch_vehicle_models_paginated(params?: Record<string, any>) {
  return vehicle_model_api.addAuthenticationHeader().get("", { params });
}

export function fetch_makers_paginated(params?: Record<string, any>) {
  return maker_api.addAuthenticationHeader().get("", { params });
}

export function fetch_types_paginated(params?: Record<string, any>) {
  return type_api.addAuthenticationHeader().get("", { params });
}

export function fetch_insurance_providers(params?: Record<string, any>) {
  return insurance_provider_api.addAuthenticationHeader().get("", { params });
}

export function fetch_makers(params?: Record<string, any>) {
  return maker_api.addAuthenticationHeader().get("", { params });
}

export function fetch_vehicle_insurances(vehicleId: string) {
  return insurance_api
    .addAuthenticationHeader()
    .get("", { params: { vehicle: vehicleId } });
}

export function fetch_vehicle_fuel_usage(params: Record<string, any>) {
  return advance_api
    .addAuthenticationHeader()
    .get("/fuel-usage-per-vehicle", { params });
}

export function fetch_vehicle_tyres(vehicleId: string) {
  return tyre_api.addAuthenticationHeader().get(`/vehicle/${vehicleId}`);
}

export function fetch_regions_paginated(params?: Record<string, any>) {
  return region_api.addAuthenticationHeader().get("", { params });
}

export function fetch_transporters_paginated(params?: Record<string, any>) {
  return transporter_api.addAuthenticationHeader().get("", { params });
}

export function fetch_transporter_by_id(id: string) {
  return transporter_api.addAuthenticationHeader().get(`/${id}`);
}

export function add_transporter(data: any) {
  return transporter_api.addAuthenticationHeader().post("", data);
}

export function update_transporter(id: string, data: any) {
  return transporter_api.addAuthenticationHeader().patch(`/${id}`, data);
}

export function delete_transporter(id: string) {
  return transporter_api.addAuthenticationHeader().delete(`/${id}`);
}

// ─── Drivers ──────────────────────────────────────────────────
export function fetch_drivers(params?: Record<string, any>) {
  return driver_api.addAuthenticationHeader().get("", { params });
}
export function fetch_driver_by_id(id: string) {
  return driver_api.addAuthenticationHeader().get(`/${id}`);
}
export function add_driver(data: any) {
  return driver_api.addAuthenticationHeader().post("", data);
}
export function update_driver(id: string, data: any) {
  return driver_api.addAuthenticationHeader().patch(`/${id}`, data);
}
export function update_driver_status(id: string, data: any) {
  return driver_api
    .addAuthenticationHeader()
    .patch(`/driverStatus/${id}`, data);
}
export function upload_driver_documents(
  id: string,
  data: FormData,
  config?: any,
) {
  return driver_api
    .addAuthenticationHeader()
    .post(`/${id}/uploadDriverDocuments`, data, config);
}
// ─── Road & Terrain Types ────────────────────────────────────
export function fetch_road_types() {
  return road_type_api.addAuthenticationHeader().get("");
}

export function fetch_terrain_types() {
  return terrain_type_api.addAuthenticationHeader().get("");
}

// ─── Facilities ───────────────────────────────────────────────
export function add_facility(data: any) {
  return getApi("/facility").addAuthenticationHeader().post("/carrier", data);
}

export function update_facility(id: string, data: any) {
  return getApi("/facility")
    .addAuthenticationHeader()
    .patch(`/${id}/carrier`, data);
}

export function delete_facility(id: string) {
  return getApi("/facility").addAuthenticationHeader().delete(`/${id}`);
}

// ─── Contacts ───────────────────────────────────────────────
export function add_contact(data: any) {
  return getApi("/contact").addAuthenticationHeader().post("", data);
}

export function update_contact(id: string, data: any) {
  return getApi("/contact").addAuthenticationHeader().patch(`/${id}`, data);
}

export function delete_contact(id: string) {
  return getApi("/contact").addAuthenticationHeader().delete(`/${id}`);
}

export function fetch_contact_by_id(id: string) {
  return getApi("/contact").addAuthenticationHeader().get(`/${id}`);
}

export function generate_invoice(data: any) {
  return getApi("").addAuthenticationHeader().patch("/shipment/generateInvoice", data);
}

export function approve_invoice(id: string, data: any) {
  return getApi("").addAuthenticationHeader().patch(`/shipment/approveInvoice/${id}`, data);
}

export function cancel_invoice(id: string, data: any) {
  return getApi("").addAuthenticationHeader().patch(`/shipment/cancelInvoice/${id}`, data);
}

export function fetch_requested_invoice_count() {
  return shipment_api.addAuthenticationHeader().get("/requestedInvoiceCount");
}

export function fetch_approved_and_collected_invoice_count(params?: any) {
  return shipment_api.addAuthenticationHeader().get("/approvedAndCollectedInvoiceCount", { params });
}

export function collect_invoice(id: string, data: any) {
  return getApi("").addAuthenticationHeader().patch(`/shipment/payPayment/${id}`, data);
}

export function fetch_shippers(params?: any) {
  return shipper_api.addAuthenticationHeader().get("", { params });
}

export function collect_bonus(id: string) {
  return bonus_api.addAuthenticationHeader().post(`/admin/${id}/collect`);
}

export function fetch_shipment_status_count() {
  return shipment_api.addAuthenticationHeader().get("/statusCount");
}

export function fetch_all_shipments_unpaginated(
  params?: Record<string, any>,
  config?: any,
) {
  return shipment_api.addAuthenticationHeader().get("", config);
}

export function add_insurance(data: any) {
  const config = data instanceof FormData
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : {};
  return insurance_api.addAuthenticationHeader().post("", data, config);
}

export function update_insurance(id: string, data: any) {
  const config = data instanceof FormData
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : {};
  return insurance_api.addAuthenticationHeader().put(`/${id}`, data, config);
}

export function fetch_insurance_by_id(id: string) {
  return insurance_api.addAuthenticationHeader().get(`/${id}`);
}
