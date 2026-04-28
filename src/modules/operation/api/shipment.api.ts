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

export function fetch_status_source_report(id: string) {
  return shipment_api
    .addAuthenticationHeader()
    .get<StatusSourceReport>(`/${id}/status-change-source-report`);
}
