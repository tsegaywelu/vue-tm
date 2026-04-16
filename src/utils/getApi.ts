import ApiService, { backendApi } from '@/api/ApiService'

export function getApi(url: string, baseUrl?: string) {
  return new ApiService(`${baseUrl ?? backendApi}${url}`)
}
