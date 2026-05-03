import { getApi } from '@/utils/getApi'

const service_reminder_api = getApi('/service-reminder')

export function fetch_service_reminders(params: Record<string, any>) {
  return service_reminder_api.addAuthenticationHeader().get('', { params })
}

export function fetch_service_reminder_by_id(id: string) {
  return service_reminder_api.addAuthenticationHeader().get(`/${id}`)
}

export function create_service_reminder(data: any) {
  return service_reminder_api.addAuthenticationHeader().post('', data)
}

export function update_service_reminder(id: string, data: any) {
  return service_reminder_api.addAuthenticationHeader().patch(`/${id}`, data)
}

export function delete_service_reminder(id: string) {
  return service_reminder_api.addAuthenticationHeader().delete(`/${id}`)
}
