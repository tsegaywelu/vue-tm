import { getApi } from '@/utils/getApi'

const work_order_api = getApi('/work-order')

export function fetch_work_orders(params: Record<string, any>) {
  return work_order_api.addAuthenticationHeader().get('', { params })
}

export function fetch_work_order_by_id(id: string) {
  return work_order_api.addAuthenticationHeader().get(`/${id}`)
}

export function create_work_order(data: any) {
  return work_order_api.addAuthenticationHeader().post('', data)
}

export function update_work_order(id: string, data: any) {
  return work_order_api.addAuthenticationHeader().patch(`/${id}`, data)
}

export function delete_work_order(id: string) {
  return work_order_api.addAuthenticationHeader().delete(`/${id}`)
}
