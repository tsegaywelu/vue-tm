import { getApi } from "@/utils/getApi";
import type {
  ApprovalRequest,
  ApprovalFilterParams,
  ApprovalAction,
  ApprovalSubject,
} from "../operation.types";

const advance_api = getApi("/advance-payment");
const transaction_api = getApi("/transaction");
const prepayment_api = getApi("/pre-payment");
const lease_api = getApi("/vehicle-lease-agreement");
const order_api = getApi("/order");
const route_api = getApi("/route");
const shipment_api = getApi("/shipment");
const vehicle_api = getApi("/vehicle");
const driver_api = getApi("/driver");
const expense_type_api = getApi("/expense-type");
const inventory_api = getApi("/inventory-items");
const shipment_damage_api = getApi("/shipment-damage");
const agent_api = getApi("/agent");

// ─── Agents ───────────────────────────────────────────────────
export function fetch_agents(params?: Record<string, any>) {
  return agent_api.addAuthenticationHeader().get("", { params });
}

// ─── Shipment Damage ──────────────────────────────────────────
export function add_shipment_damage(data: any) {
  return shipment_damage_api.addAuthenticationHeader().post("", data);
}

// ─── Approval Requests ────────────────────────────────────────
export function fetch_approval_requests(params: ApprovalFilterParams) {
  return advance_api
    .addAuthenticationHeader()
    .get<ApprovalRequest[]>("/allApprovalRequests", { params });
}

export function update_advance_status(id: string, status: ApprovalAction) {
  return advance_api.addAuthenticationHeader().post(`/ ${id}/${status}`, {});
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

// ─── Advances / Settlements ──────────────────────────────────
export function fetch_advances(params: Record<string, any>) {
  return advance_api.addAuthenticationHeader().get("", { params });
}

export function fetch_settled_advances(params: Record<string, any>) {
  return advance_api
    .addAuthenticationHeader()
    .get("/settledAdvance", { params });
}

export function create_fuel_advance(data: any) {
  return advance_api.addAuthenticationHeader().post("/fuel-only", data);
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

// ─── Drivers ──────────────────────────────────────────────────
export function fetch_drivers(params?: Record<string, any>) {
  return driver_api.addAuthenticationHeader().get("", { params });
}
