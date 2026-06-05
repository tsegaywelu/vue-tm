import { getApi } from '@/utils/getApi'

const api = getApi('/city-shipper-code')

export function fetch_city_shipper_codes(params?: Record<string, any>) {
  return api.addAuthenticationHeader().get<any[]>('/contracted', { params })
}

export function create_city_shipper_code(shipperId: string, data: any) {
  return api.addAuthenticationHeader().post(`/carrier/${shipperId}`, data)
}

export function update_city_shipper_code(shipperId: string, id: string, data: any) {
  return api.addAuthenticationHeader().patch(`/carrier/${shipperId}/${id}`, data)
}

export function delete_city_shipper_code(shipperId: string, id: string) {
  return api.addAuthenticationHeader().delete(`/carrier/${shipperId}/${id}`)
}
