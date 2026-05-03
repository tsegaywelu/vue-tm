import { getApi } from '@/utils/getApi'

const inventory_category_api = getApi('/inventory-categories')

export function fetch_inventory_categories(params?: Record<string, any>) {
  // Map 'name' to 'name[regex]' if provided
  const queryParams = { ...params };
  if (queryParams.name) {
    queryParams['name[regex]'] = queryParams.name;
    delete queryParams.name;
  }
  return inventory_category_api.addAuthenticationHeader().get('', { params: queryParams })
}

export function fetch_inventory_category_details(id: string) {
  return inventory_category_api.addAuthenticationHeader().get(`/${id}`)
}

export function create_inventory_category(data: any) {
  return inventory_category_api.addAuthenticationHeader().post('', data)
}

export function update_inventory_category(id: string, data: any) {
  return inventory_category_api.addAuthenticationHeader().patch(`/${id}`, data)
}

export function delete_inventory_category(id: string) {
  return inventory_category_api.addAuthenticationHeader().delete(`/${id}`)
}
