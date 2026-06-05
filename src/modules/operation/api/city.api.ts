import { getApi } from '@/utils/getApi'

const api = getApi('/city')

export function fetch_cities(params?: Record<string, any>) {
  return api.addAuthenticationHeader().get<any[]>('', { params })
}
