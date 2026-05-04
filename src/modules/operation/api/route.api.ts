import { getApi } from '@/utils/getApi'

const api = getApi('/route')

export interface Route {
  _id: string
  name: string
  origin: string
  destination: string
}

export function fetch_routes() {
  return api.addAuthenticationHeader().get<Route[]>('/all')
}

export function fetch_route_by_id(id: string) {
  return api.addAuthenticationHeader().get<any>(`/${id}`)
}

export function create_route(data: any) {
  return api.addAuthenticationHeader().post('', data)
}

export function update_route(id: string, data: any) {
  return api.addAuthenticationHeader().patch(`/${id}`, data)
}

export function delete_route(id: string) {
  return api.addAuthenticationHeader().delete(`/${id}`)
}

export default {
  fetch_routes,
  fetch_route_by_id,
  create_route,
  update_route,
  delete_route,
}
