import { getApi } from '@/utils/getApi'

const workshop_api = getApi('/workshop')

export function fetch_workshops(params: Record<string, any>) {
  return workshop_api.addAuthenticationHeader().get('', { params })
}

export function fetch_workshop_by_id(id: string) {
  return workshop_api.addAuthenticationHeader().get(`/${id}`)
}

export function create_workshop(data: any) {
  return workshop_api.addAuthenticationHeader().post('', data)
}

export function update_workshop(id: string, data: any) {
  return workshop_api.addAuthenticationHeader().patch(`/${id}`, data)
}

export function delete_workshop(id: string) {
  return workshop_api.addAuthenticationHeader().delete(`/${id}`)
}
