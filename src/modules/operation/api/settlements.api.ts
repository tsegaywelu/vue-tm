import { getApi } from "@/utils/getApi";

const transactionApi = getApi("/transaction");
const advanceApi = getApi("/advance-payment");

export function fetch_shipment_transactions(shipmentId: string) {
  return transactionApi
    .addAuthenticationHeader()
    .get<any[]>(`/shipments/${shipmentId}`);
}

export function settle_advance_payment(advanceId: string) {
  return advanceApi
    .addAuthenticationHeader()
    .post<any>(`/${advanceId}/settle`, {});
}

export function approve_transaction(transactionId: string, approvedAmount: number) {
  return transactionApi
    .addAuthenticationHeader()
    .post<any>(`/${transactionId}/approve`, { approvedAmount });
}

export function authorize_transaction(transactionId: string) {
  return transactionApi
    .addAuthenticationHeader()
    .post<any>(`/${transactionId}/authorize`, {});
}

export function reject_transaction(transactionId: string) {
  return transactionApi
    .addAuthenticationHeader()
    .post<any>(`/${transactionId}/reject`, {});
}

export function pay_transaction(transactionId: string) {
  return transactionApi
    .addAuthenticationHeader()
    .post<any>(`/${transactionId}/pay`, {});
}

export function cancel_transaction(transactionId: string) {
  return transactionApi
    .addAuthenticationHeader()
    .post<any>(`/${transactionId}/cancel`, {});
}
