import { getApi } from '@/utils/getApi'

const mechanic_api = getApi('/mechanic')

export function fetch_mechanics(params: Record<string, any>) {
  return mechanic_api.addAuthenticationHeader().get('', { params })
}

export function fetch_mechanic_by_id(id: string) {
  return mechanic_api.addAuthenticationHeader().get(`/${id}`)
}

export function create_mechanic(data: any) {
  return mechanic_api.addAuthenticationHeader().post('', data)
}

export function update_mechanic(id: string, data: any) {
  return mechanic_api.addAuthenticationHeader().patch(`/${id}`, data)
}

export function delete_mechanic(id: string) {
  return mechanic_api.addAuthenticationHeader().delete(`/${id}`)
}
