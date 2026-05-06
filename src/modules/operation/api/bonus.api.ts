import { getApi } from '@/utils/getApi'

const api = getApi('/bonus/config')


export function fetch_multipliers(params?: Record<string, any>) {
  return api.addAuthenticationHeader().get<any>('/multiplier', { params })
}

export function fetch_multiplier_details(id: string) {
  return api.addAuthenticationHeader().get<any>(`/multiplier/${id}`)
}

export function create_multiplier(data: any) {
  return api.addAuthenticationHeader().post('/multiplier', data)
}

export function update_multiplier(id: string, data: any) {
  return api.addAuthenticationHeader().patch(`/multiplier/${id}`, data)
}

export function delete_multiplier(id: string) {
  return api.addAuthenticationHeader().delete(`/multiplier/${id}`)
}

export function fetch_bonus_routes(params?: Record<string, any>) {
  return api.addAuthenticationHeader().get<any>('/route', { params })
}

export function fetch_bonus_route_details(id: string) {
  return api.addAuthenticationHeader().get<any>(`/route/${id}`)
}

export function create_bonus_route(data: any) {
  return api.addAuthenticationHeader().post('/route', data)
}

export function update_bonus_route(id: string, data: any) {
  return api.addAuthenticationHeader().patch(`/route/${id}`, data)
}

export function delete_bonus_route(id: string) {
  return api.addAuthenticationHeader().delete(`/route/${id}`)
}

export default {
  fetch_multipliers,
  fetch_multiplier_details,
  create_multiplier,
  update_multiplier,
  delete_multiplier,
  fetch_bonus_routes,
  fetch_bonus_route_details,
  create_bonus_route,
  update_bonus_route,
  delete_bonus_route,
}
