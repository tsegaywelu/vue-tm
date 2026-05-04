import { getApi } from '@/utils/getApi'

const service_type_api = getApi('/service-type')

export function fetch_service_types(params: Record<string, any>) {
  return service_type_api.addAuthenticationHeader().get('', { params })
}

export function fetch_service_type_by_id(id: string) {
  return service_type_api.addAuthenticationHeader().get(`/${id}`)
}

export function create_service_type(data: any) {
  return service_type_api.addAuthenticationHeader().post('', data)
}

export function update_service_type(id: string, data: any) {
  return service_type_api.addAuthenticationHeader().patch(`/${id}`, data)
}

export function delete_service_type(id: string) {
  return service_type_api.addAuthenticationHeader().delete(`/${id}`)
}
