import { getApi } from '@/utils/getApi'

const service_record_api = getApi('/service-record')

export function fetch_service_records(params: Record<string, any>) {
  return service_record_api.addAuthenticationHeader().get('', { params })
}

export function fetch_service_record_by_id(id: string) {
  return service_record_api.addAuthenticationHeader().get(`/${id}`)
}

export function create_service_record(data: any) {
  return service_record_api.addAuthenticationHeader().post('', data)
}

export function update_service_record(id: string, data: any) {
  return service_record_api.addAuthenticationHeader().patch(`/${id}`, data)
}

export function delete_service_record(id: string) {
  return service_record_api.addAuthenticationHeader().delete(`/${id}`)
}
