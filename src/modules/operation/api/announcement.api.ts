import { getApi } from '@/utils/getApi'

const api = getApi('/announcement')

export function fetch_announcements(params?: Record<string, any>) {
  return api.addAuthenticationHeader().get<any>('', { params })
}

export function create_announcement(data: any) {
  return api.addAuthenticationHeader().post('', data)
}

export function update_announcement(id: string, data: any) {
  return api.addAuthenticationHeader().patch(`/${id}`, data)
}

export function delete_announcement(id: string) {
  return api.addAuthenticationHeader().delete(`/${id}`)
}

export default {
  fetch_announcements,
  create_announcement,
  update_announcement,
  delete_announcement,
}
