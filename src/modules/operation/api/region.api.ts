import { getApi } from '@/utils/getApi'
import type { Region } from '../operation.types'

const api = getApi('/region')

export function fetch_regions(params?: Record<string, any>) {
  return api.addAuthenticationHeader().get<any>('', { params })
}

export function fetch_region_details(id: string) {
  return api.addAuthenticationHeader().get<Region>(`/${id}`)
}

export function create_region(data: any) {
  return api.addAuthenticationHeader().post('', data)
}

export function update_region(id: string, data: any) {
  return api.addAuthenticationHeader().patch(`/${id}`, data)
}

export function delete_region(id: string) {
  return api.addAuthenticationHeader().delete(`/${id}`)
}

export default {
  fetch_regions,
  fetch_region_details,
  create_region,
  update_region,
  delete_region,
}
