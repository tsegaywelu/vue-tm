import { getApi } from '@/utils/getApi';

const fleet_api = getApi('/fleet');

// ─── Meter Entries ────────────────────────────────────────────────────────────

export function fetch_meter_entries(params?: Record<string, any>) {
  return fleet_api.addAuthenticationHeader().get('/meter-entries', { params });
}

export function create_meter_entry(data: FormData) {
  return fleet_api.addAuthenticationHeader().post('/meter-entries', data);
}

export function update_meter_entry(id: string, data: FormData) {
  return fleet_api.addAuthenticationHeader().patch(`/meter-entries/${id}`, data);
}

export function fetch_latest_meter(vehicleId: string) {
  return fleet_api.addAuthenticationHeader().get(`/vehicles/${vehicleId}/latest-meter`);
}

// ─── Fuel Entries ─────────────────────────────────────────────────────────────

export function fetch_fuel_entries(params?: Record<string, any>) {
  return fleet_api.addAuthenticationHeader().get('/fuel-entries', { params });
}

export function fetch_fuel_entry_by_id(id: string) {
  return fleet_api.addAuthenticationHeader().get(`/fuel-entries/${id}`);
}

export function create_fuel_entry(data: FormData) {
  return fleet_api.addAuthenticationHeader().post('/fuel-entries', data);
}

export function update_fuel_entry(id: string, data: FormData) {
  return fleet_api.addAuthenticationHeader().patch(`/fuel-entries/${id}`, data);
}

export function void_fuel_entry(id: string, voidReason: string) {
  return fleet_api.addAuthenticationHeader().patch(`/fuel-entries/${id}/void`, { voidReason });
}

// ─── Vehicle Expense Entries ──────────────────────────────────────────────────

export function fetch_vehicle_expenses(params?: Record<string, any>) {
  return fleet_api.addAuthenticationHeader().get('/vehicle-expenses', { params });
}

export function fetch_vehicle_expense_by_id(id: string) {
  return fleet_api.addAuthenticationHeader().get(`/vehicle-expenses/${id}`);
}

export function create_vehicle_expense(data: FormData) {
  return fleet_api.addAuthenticationHeader().post('/vehicle-expenses', data);
}

export function update_vehicle_expense(id: string, data: FormData) {
  return fleet_api.addAuthenticationHeader().patch(`/vehicle-expenses/${id}`, data);
}

export function void_vehicle_expense(id: string, voidReason: string) {
  return fleet_api.addAuthenticationHeader().patch(`/vehicle-expenses/${id}/void`, { voidReason });
}

// ─── Recurring Expense Rules ──────────────────────────────────────────────────

export function fetch_recurring_rules(params?: Record<string, any>) {
  return fleet_api.addAuthenticationHeader().get('/recurring-expense-rules', { params });
}

export function fetch_recurring_rule_by_id(id: string) {
  return fleet_api.addAuthenticationHeader().get(`/recurring-expense-rules/${id}`);
}

export function create_recurring_rule(data: Record<string, any>) {
  return fleet_api.addAuthenticationHeader().post('/recurring-expense-rules', data);
}

export function update_recurring_rule(id: string, data: Record<string, any>) {
  return fleet_api.addAuthenticationHeader().patch(`/recurring-expense-rules/${id}`, data);
}

export function pause_recurring_rule(id: string) {
  return fleet_api.addAuthenticationHeader().patch(`/recurring-expense-rules/${id}/pause`,{});
}

export function resume_recurring_rule(id: string) {
  return fleet_api.addAuthenticationHeader().patch(`/recurring-expense-rules/${id}/resume`,{});
}

export function run_recurring_rules_now() {
  return fleet_api.addAuthenticationHeader().post('/recurring-expense-rules/run-now',{});
}
