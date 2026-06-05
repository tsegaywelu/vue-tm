import { getApi } from "@/utils/getApi";

const expense_api = getApi("/expense");
const shipment_api = getApi("/shipment");
const vehicle_api = getApi("/vehicle");
const fuel_alert_api = getApi("/fuel-alerts");

export interface DateRangeParams {
  startDate: string;
  endDate: string;
}

export function fetch_expense_and_revenue(params: DateRangeParams) {
  return expense_api
    .addAuthenticationHeader()
    .get("/expenseAndRevenue", { params });
}

export function fetch_expense_and_revenue_monthly(params: DateRangeParams) {
  return expense_api
    .addAuthenticationHeader()
    .get("/expenseAndRevenue/monthly", { params });
}

export function fetch_month_comparison() {
  return expense_api
    .addAuthenticationHeader()
    .get("/expenseAndRevenue/perMonth");
}

export function fetch_shipments_per_region(params: DateRangeParams) {
  return expense_api
    .addAuthenticationHeader()
    .get("/shipmentsPerRegion", { params });
}

export function fetch_performance_per_route(params: DateRangeParams) {
  return shipment_api
    .addAuthenticationHeader()
    .get("/performancePerRoute", { params });
}

export function fetch_delayed_receivable() {
  return shipment_api.addAuthenticationHeader().get("/delayedReceivable");
}

export function fetch_delayed_invoice() {
  return shipment_api.addAuthenticationHeader().get("/delayedInvoice");
}

export function fetch_shipment_report_counts(params: DateRangeParams) {
  return shipment_api
    .addAuthenticationHeader()
    .get("/delayUploadReport", { params });
}

export function fetch_delayed_available_vehicles() {
  return vehicle_api
    .addAuthenticationHeader()
    .get("/delayedAvailableVehicles");
}

export function fetch_fuel_alerts(params?: Record<string, any>) {
  return fuel_alert_api.addAuthenticationHeader().get("", { params });
}
