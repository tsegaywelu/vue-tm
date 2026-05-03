import { getApi } from '@/utils/getApi'

const service_task_api = getApi('/service-task')

export function fetch_service_tasks(params: Record<string, any>) {
  return service_task_api.addAuthenticationHeader().get('', { params })
}

export function fetch_service_task_by_id(id: string) {
  return service_task_api.addAuthenticationHeader().get(`/${id}`)
}

export function create_service_task(data: any) {
  return service_task_api.addAuthenticationHeader().post('', data)
}

export function update_service_task(id: string, data: any) {
  return service_task_api.addAuthenticationHeader().patch(`/${id}`, data)
}

export function delete_service_task(id: string) {
  return service_task_api.addAuthenticationHeader().delete(`/${id}`)
}
