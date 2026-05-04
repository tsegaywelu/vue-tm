import { getApi } from '@/utils/getApi'

const api = getApi('/bonus/config')

export function fetch_multipliers(params?: Record<string, any>) {
  return api.addAuthenticationHeader().get<any>('/multiplier', { params })
}

export function delete_multiplier(id: string) {
  return api.addAuthenticationHeader().delete(`/multiplier/${id}`)
}

export function fetch_bonus_routes(params?: Record<string, any>) {
  return api.addAuthenticationHeader().get<any>('/route', { params })
}

export function delete_bonus_route(id: string) {
  return api.addAuthenticationHeader().delete(`/route/${id}`)
}

export default {
  fetch_multipliers,
  delete_multiplier,
  fetch_bonus_routes,
  delete_bonus_route,
}
