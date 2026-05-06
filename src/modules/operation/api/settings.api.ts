import { getApi } from "@/utils/getApi";

// ─── User Management ──────────────────────────────────────────
const user_api = getApi('/user')
const user_api2 = getApi('/auth')

export function fetch_users(params?: Record<string, any>) {
  const queryParams = { ...params }
  if (queryParams.username) {
    queryParams['username[regex]'] = queryParams.username
    delete queryParams.username
  }
  return user_api.addAuthenticationHeader().get('', { params: queryParams })
}

export function fetch_user_details(id: string) {
  return user_api.addAuthenticationHeader().get(`/${id}`)
}

export function create_user(data: any) {
  return user_api2.addAuthenticationHeader().post('/register', data)
}

export function update_user(id: string, data: any) {
  return user_api.addAuthenticationHeader().patch(`/${id}`, data)
}

export function delete_user(id: string) {
  return user_api.addAuthenticationHeader().delete(`/${id}`)
}

export function reset_user_password(id: string, data: any) {
  return user_api.addAuthenticationHeader().patch(`/${id}/resetPassword`, data)
}

// ─── Role Management ──────────────────────────────────────────
const role_api = getApi('/role')

export function fetch_roles(params?: Record<string, any>) {
  return role_api.addAuthenticationHeader().get('', { params })
}

export function fetch_role_details(id: string) {
  return role_api.addAuthenticationHeader().get(`/${id}`)
}

export function create_role(data: any) {
  return role_api.addAuthenticationHeader().post('', data)
}

export function update_role(id: string, data: any) {
  return role_api.addAuthenticationHeader().patch(`/${id}`, data)
}

export function delete_role(id: string) {
  return role_api.addAuthenticationHeader().delete(`/${id}`)
}

// ─── Base Configuration ───────────────────────────────────────
const road_type_api = getApi('/roadType')
const terrain_type_api = getApi('/terrainType')
const bank_api = getApi('/bank')
const insurance_api = getApi('/bankInsurance')
const carrier_setting_api = getApi('/carrierSetting')

// Road Type
export const fetch_road_types = (params: any) => road_type_api.addAuthenticationHeader().get('', { params })
export const delete_road_type = (id: string) => road_type_api.addAuthenticationHeader().delete(`/${id}`)

// Terrain Type
export const fetch_terrain_types = (params: any) => terrain_type_api.addAuthenticationHeader().get('', { params })
export const delete_terrain_type = (id: string) => terrain_type_api.addAuthenticationHeader().delete(`/${id}`)

// Bank
export const fetch_banks = (params: any) => bank_api.addAuthenticationHeader().get('', { params })
export const delete_bank = (id: string) => bank_api.addAuthenticationHeader().delete(`/${id}`)

// Insurance
export const fetch_insurances = (params: any) => insurance_api.addAuthenticationHeader().get('', { params })
export const delete_insurance = (id: string) => insurance_api.addAuthenticationHeader().delete(`/${id}`)

// Carrier Setting
export const fetch_carrier_settings = (params: any) => carrier_setting_api.addAuthenticationHeader().get('', { params })
export const delete_carrier_setting = (id: string) => carrier_setting_api.addAuthenticationHeader().delete(`/${id}`)

// ─── Contract Management ──────────────────────────────────────
const contract_api = getApi('/contract')

export const fetch_contracts = (params: any) => contract_api.addAuthenticationHeader().get('', { params })
export const fetch_contract_details = (id: string) => contract_api.addAuthenticationHeader().get(`/${id}`)
export const create_contract = (data: any) => contract_api.addAuthenticationHeader().post('', data)
export const update_contract = (id: string, data: any) => contract_api.addAuthenticationHeader().patch(`/${id}`, data)
export const delete_contract = (id: string) => contract_api.addAuthenticationHeader().delete(`/${id}`)


// ─── Carrier Management ───────────────────────────────────────
const carrier_api = getApi('/carrier')
export const fetch_carriers = (params?: any) => carrier_api.addAuthenticationHeader().get('', { params })

// ─── Route Management (Contract context) ──────────────────────
const route_api = getApi('/route')
export const fetch_uncontracted_routes = (carrierId: string, params?: any) =>
  route_api.addAuthenticationHeader().get(`/carrierAllRoutes/${carrierId}`, { params })
export const fetch_route_details = (id: string) => route_api.addAuthenticationHeader().get(`/${id}`)

// ─── Vehicle Type (Carrier context) ──────────────────────────
const vehicle_type_api = getApi('/vehicle-type')
export const fetch_vehicle_types_by_carrier = (carrierId: string, params?: any) =>
  vehicle_type_api.addAuthenticationHeader().get(`/carrier/${carrierId}`, { params })

// ─── Commodity Management ─────────────────────────────────────
const commodity_api = getApi('/commodity')
export const fetch_commodities = (params?: any) => commodity_api.addAuthenticationHeader().get('', { params })
export const fetch_commodity_details = (id: string) => commodity_api.addAuthenticationHeader().get(`/${id}/carrier`)
export const create_commodity = (data: any) => commodity_api.addAuthenticationHeader().post('/carrier', data)
export const update_commodity = (id: string, data: any) => commodity_api.addAuthenticationHeader().patch(`/${id}`, data)
export const delete_commodity = (id: string) => commodity_api.addAuthenticationHeader().delete(`/${id}`)

// ─── Shipper Management ───────────────────────────────────────
const shipper_api = getApi('/shipper')
export const fetch_shippers = (params?: any) => shipper_api.addAuthenticationHeader().get('', { params })


// ─── Packaging Management ─────────────────────────────────────
const packaging_api = getApi('/packaging')
export const fetch_packagings = (params?: any) => packaging_api.addAuthenticationHeader().get('', { params })
export const fetch_packaging_details = (id: string) => packaging_api.addAuthenticationHeader().get(`/${id}/carrier`)
export const create_packaging = (data: any) => packaging_api.addAuthenticationHeader().post('/carrier', data)
export const update_packaging = (id: string, data: any) => packaging_api.addAuthenticationHeader().patch(`/${id}/carrier`, data)
export const delete_packaging = (id: string) => packaging_api.addAuthenticationHeader().delete(`/${id}`)


// ─── Agent Management ─────────────────────────────────────────
const agent_api = getApi('/agent')
export const fetch_agents = (params?: any) => agent_api.addAuthenticationHeader().get('', { params })


