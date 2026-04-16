import { getApi } from '@/utils/getApi'
import type { ApprovalRequest, ApprovalFilterParams, ApprovalAction, ApprovalSubject } from '../operation.types'

const advance_api = getApi('/advance-payment')
const transaction_api = getApi('/transaction')
const prepayment_api = getApi('/pre-payment')
const lease_api = getApi('/vehicle-lease-agreement')

export function fetch_approval_requests(params: ApprovalFilterParams) {
  return advance_api.addAuthenticationHeader().get<ApprovalRequest[]>('/allApprovalRequests', { params })
}

export function update_advance_status(id: string, status: ApprovalAction) {
  return advance_api.addAuthenticationHeader().post(`/ ${id}/${status}`, {})
}

export function update_transaction_status(id: string, status: ApprovalAction, data: any = {}) {
  return transaction_api.addAuthenticationHeader().post(`/${id}/${status}`, data)
}

export function update_prepayment_status(id: string, status: ApprovalAction) {
  return prepayment_api.addAuthenticationHeader().post(`/updateStatus`, { id, status })
}

export function update_lease_status(id: string, status: ApprovalAction) {
  return lease_api.addAuthenticationHeader().post(`/updateStatus`, { id, status })
}
