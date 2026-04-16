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

export default {
  fetch_routes
}
