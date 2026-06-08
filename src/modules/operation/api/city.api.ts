import { getApi } from '@/utils/getApi'

const api = getApi('/city')

export function fetch_cities(params?: Record<string, any>) {
  return api.addAuthenticationHeader().get<any[]>('', { params })
}

export function create_city(data: Record<string, any>) {
  return api.addAuthenticationHeader().post('', data)
}

export function update_city(id: string, data: Record<string, any>) {
  return api.addAuthenticationHeader().patch(`/${id}`, data)
}
