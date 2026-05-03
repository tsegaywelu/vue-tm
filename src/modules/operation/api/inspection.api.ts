import { getApi } from '@/utils/getApi'

const inspection_api = getApi('/inspection')

export function fetch_inspections(params: Record<string, any>) {
  return inspection_api.addAuthenticationHeader().get('', { params })
}

export function fetch_inspection_by_id(id: string) {
  return inspection_api.addAuthenticationHeader().get(`/${id}`)
}

export function create_inspection(data: any) {
  return inspection_api.addAuthenticationHeader().post('', data)
}

export function update_inspection(id: string, data: any) {
  return inspection_api.addAuthenticationHeader().patch(`/${id}`, data)
}

export function delete_inspection(id: string) {
  return inspection_api.addAuthenticationHeader().delete(`/${id}`)
}
