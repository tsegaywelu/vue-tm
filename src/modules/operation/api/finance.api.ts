import { getApi } from '@/utils/getApi'

const expense_type_api = getApi('/expense-type')

export function fetch_expense_types(params?: Record<string, any>) {
  return expense_type_api.addAuthenticationHeader().get('', { params })
}

export function fetch_expense_type_details(id: string) {
  return expense_type_api.addAuthenticationHeader().get(`/${id}`)
}

export function create_expense_type(data: any) {
  return expense_type_api.addAuthenticationHeader().post('', data)
}

export function update_expense_type(id: string, data: any) {
  return expense_type_api.addAuthenticationHeader().patch(`/${id}`, data)
}

export function delete_expense_type(id: string) {
  return expense_type_api.addAuthenticationHeader().delete(`/${id}`)
}
