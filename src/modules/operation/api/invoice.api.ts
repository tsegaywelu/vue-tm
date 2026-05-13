import { getApi } from "@/utils/getApi";

const shipment_api = getApi("/shipment");

export function fetch_invoice_details(id: string) {
  return shipment_api.addAuthenticationHeader().get(`/invoices/${id}`);
}

export function approve_invoice(id: string, data: any) {
  return shipment_api
    .addAuthenticationHeader()
    .patch(`/approveInvoice/${id}`, data);
}

export function cancel_invoice(id: string, data: any) {
  return shipment_api
    .addAuthenticationHeader()
    .patch(`/cancelInvoice/${id}`, data);
}

export function collect_invoice(id: string, data: any) {
  return shipment_api
    .addAuthenticationHeader()
    .patch(`/collectInvoice/${id}`, data);
}

export function update_payment_request(id: string, data: any) {
  return shipment_api
    .addAuthenticationHeader()
    .patch(`/paymentRequest/${id}`, data);
}

export function fetch_receivable_shipments(params: any = {}) {
  return shipment_api
    .addAuthenticationHeader()
    .get("/receivableShipment", { params });
}
