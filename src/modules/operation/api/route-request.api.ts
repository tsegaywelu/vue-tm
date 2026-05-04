import { getApi } from '@/utils/getApi'
import type { RouteRequest } from '../operation.types'

const api = getApi('/route-request')

export function fetch_route_requests(params?: Record<string, any>) {
  return api.addAuthenticationHeader().get<any>('', { params })
}

export function fetch_route_request_details(id: string) {
  return api.addAuthenticationHeader().get<RouteRequest>(`/${id}`)
}

export function create_route_request(data: any) {
  return api.addAuthenticationHeader().post('', data)
}

export function update_route_request(id: string, data: any) {
  return api.addAuthenticationHeader().patch(`/${id}`, data)
}

export function delete_route_request(id: string) {
  return api.addAuthenticationHeader().delete(`/${id}`)
}

export default {
  fetch_route_requests,
  fetch_route_request_details,
  create_route_request,
  update_route_request,
  delete_route_request,
}
