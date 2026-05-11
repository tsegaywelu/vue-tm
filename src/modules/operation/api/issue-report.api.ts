import { getApi } from "@/utils/getApi";

const issue_report_api = getApi("/issue-report");

export function fetch_issue_reports(params: Record<string, any>) {
  return issue_report_api.addAuthenticationHeader().get("", { params });
}

export function fetch_issue_report_by_id(id: string) {
  return issue_report_api.addAuthenticationHeader().get(`/${id}`);
}

export function create_issue_report(data: any) {
  return issue_report_api.addAuthenticationHeader().post("", data);
}

export function update_issue_report(id: string, data: any) {
  return issue_report_api.addAuthenticationHeader().patch(`/${id}`, data);
}

export function update_issue_report_status(id: string, status: string) {
  return issue_report_api.addAuthenticationHeader().patch(`/${id}/status`, { status });
}

export function delete_issue_report(id: string) {
  return issue_report_api.addAuthenticationHeader().delete(`/${id}`);
}
