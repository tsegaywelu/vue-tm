import { getApi } from "@/utils/getApi";
import type {
  Shipment,
  ShipmentFilterParams,
  StatusSourceReport,
} from "../operation.types";

const shipment_api = getApi("/shipment");

export function fetch_shipments(params: ShipmentFilterParams) {
  return shipment_api
    .addAuthenticationHeader()
    .get<Shipment[]>("/all", { params });
}

export function fetch_shipment_details(id: string) {
  return shipment_api.addAuthenticationHeader().get<Shipment>(`/${id}`);
}

export function update_shipment_status(id: string, statusData: any) {
  return shipment_api
    .addAuthenticationHeader()
    .patch(`/updateStatus/${id}`, statusData);
}

export function add_issue_voucher(id: string, voucherData: any) {
  return shipment_api
    .addAuthenticationHeader()
    .patch(`/addIssueVoucher/${id}`, voucherData);
}

export function add_other_voucher(id: string, voucherData: any) {
  return shipment_api
    .addAuthenticationHeader()
    .patch(`/addVouchers/${id}`, voucherData);
}

export function add_follow_up(id: string, data: any) {
  return shipment_api
    .addAuthenticationHeader()
    .patch(`/${id}/addFollowUp`, data);
}

export function create_shipment(data: any) {
  return shipment_api.addAuthenticationHeader().post("", data);
}

export function create_shipment_shipper(data: any) {
  return shipment_api.addAuthenticationHeader().post("/shipper", data);
}

export function update_shipment(id: string, data: any) {
  return shipment_api.addAuthenticationHeader().patch(`/${id}`, data);
}

export function update_shipment_shipper(id: string, data: any) {
  return shipment_api.addAuthenticationHeader().patch(`/${id}/shipper`, data);
}

export function set_payable_shipment_paid(id: string) {
  return shipment_api.addAuthenticationHeader().patch(`/setPayableShipmentPaid/${id}`, {});
}

export function set_payable_shipment_authorized(id: string) {
  return shipment_api.addAuthenticationHeader().patch(`/setPayableShipmentAuthorized/${id}`, {});
}

export function set_payable_shipment_cancelled(id: string) {
  return shipment_api.addAuthenticationHeader().patch(`/setPayableShipmentCancelled/${id}`, {});
}

export function fetch_status_source_report(id: string) {
  return shipment_api
    .addAuthenticationHeader()
    .get<StatusSourceReport>(`/${id}/status-change-source-report`);
}

export function remove_document(id: string, data?: any) {
  return shipment_api
    .addAuthenticationHeader()
    .patch(`/${id}/remove-document`, data);
}

export function reject_document(id: string, data?: any) {
  return shipment_api
    .addAuthenticationHeader()
    .patch(`/${id}/reject-document`, data);
}

export function upload_aiv(id: string, data: FormData, config?: any) {
  return shipment_api
    .addAuthenticationHeader()
    .patch(`/${id}/uploadFileAIV`, data, config);
}

export function upload_civ(id: string, data: FormData, config?: any) {
  return shipment_api
    .addAuthenticationHeader()
    .patch(`/${id}/uploadFileCIV`, data, config);
}

export function upload_arv(id: string, data: FormData, config?: any) {
  return shipment_api
    .addAuthenticationHeader()
    .patch(`/${id}/uploadFileARV`, data, config);
}

export function upload_crv(id: string, data: FormData, config?: any) {
  return shipment_api
    .addAuthenticationHeader()
    .patch(`/${id}/uploadFileCRV`, data, config);
}

export function upload_closing_documents(
  id: string,
  data: FormData,
  config?: any,
) {
  return shipment_api
    .addAuthenticationHeader()
    .patch(`/${id}/uploadClosingDocuments`, data, config);
}
