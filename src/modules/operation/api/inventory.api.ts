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

// ─── Item Groups ─────────────────────────────────────────────
const item_group_api = getApi('/item-groups')

export function fetch_item_groups(params?: Record<string, any>) {
  const queryParams = { ...params }
  if (queryParams.name) {
    queryParams['name[regex]'] = queryParams.name
    delete queryParams.name
  }
  return item_group_api.addAuthenticationHeader().get('', { params: queryParams })
}

export function fetch_item_group_details(id: string) {
  return item_group_api.addAuthenticationHeader().get(`/${id}`)
}

export function create_item_group(data: any) {
  return item_group_api.addAuthenticationHeader().post('', data)
}

export function update_item_group(id: string, data: any) {
  return item_group_api.addAuthenticationHeader().patch(`/${id}`, data)
}

export function delete_item_group(id: string) {
  return item_group_api.addAuthenticationHeader().delete(`/${id}`)
}

// ─── Suppliers / Vendors ──────────────────────────────────────
const supplier_api = getApi('/suppliers')

export function fetch_vendors(params?: Record<string, any>) {
  const queryParams = { ...params }
  if (queryParams.name) {
    queryParams['name[regex]'] = queryParams.name
    delete queryParams.name
  }
  return supplier_api.addAuthenticationHeader().get('', { params: queryParams })
}

export function fetch_vendor_details(id: string) {
  return supplier_api.addAuthenticationHeader().get(`/${id}`)
}

export function create_vendor(data: any) {
  return supplier_api.addAuthenticationHeader().post('', data)
}

export function update_vendor(id: string, data: any) {
  return supplier_api.addAuthenticationHeader().patch(`/${id}`, data)
}

export function delete_vendor(id: string) {
  return supplier_api.addAuthenticationHeader().delete(`/${id}`)
}

// ─── Inventory Items ─────────────────────────────────────────
const inventory_item_api = getApi('/inventory-items')

export function fetch_inventory_items(params?: Record<string, any>) {
  const queryParams = { ...params }
  if (queryParams.name) {
    queryParams['name[regex]'] = queryParams.name
    delete queryParams.name
  }
  return inventory_item_api.addAuthenticationHeader().get('', { params: queryParams })
}

export function fetch_inventory_item_details(id: string) {
  return inventory_item_api.addAuthenticationHeader().get(`/${id}`)
}

export function create_inventory_item(data: any) {
  return inventory_item_api.addAuthenticationHeader().post('', data)
}

export function update_inventory_item(id: string, data: any) {
  return inventory_item_api.addAuthenticationHeader().patch(`/${id}`, data)
}

export function delete_inventory_item(id: string) {
  return inventory_item_api.addAuthenticationHeader().delete(`/${id}`)
}

// ─── Store Requisitions ──────────────────────────────────────
const store_requisition_api = getApi('/store-requisition-vouchers')

export function fetch_store_requisitions(params?: Record<string, any>) {
  const queryParams = { ...params }
  if (queryParams.referenceNumber) {
    queryParams['referenceNumber[regexAny]'] = queryParams.referenceNumber
    delete queryParams.referenceNumber
  }
  return store_requisition_api.addAuthenticationHeader().get('', { params: queryParams })
}

export function fetch_store_requisition_details(id: string) {
  return store_requisition_api.addAuthenticationHeader().get(`/${id}`)
}

export function create_store_requisition(data: any) {
  return store_requisition_api.addAuthenticationHeader().post('', data)
}

export function update_store_requisition(id: string, data: any) {
  return store_requisition_api.addAuthenticationHeader().patch(`/${id}`, data)
}

export function delete_store_requisition(id: string) {
  return store_requisition_api.addAuthenticationHeader().delete(`/${id}`)
}

export function update_store_requisition_status(id: string, status: string, data?: any) {
  return store_requisition_api.addAuthenticationHeader().patch(`/${id}/${status}`, data)
}

// ─── Purchase Requisitions ───────────────────────────────────
const purchase_requisition_api = getApi('/purchase-requisitions')

export function fetch_purchase_requisitions(params?: Record<string, any>) {
  const queryParams = { ...params }
  if (queryParams.referenceNumber) {
    queryParams['referenceNumber[regexAny]'] = queryParams.referenceNumber
    delete queryParams.referenceNumber
  }
  if (queryParams.supplierName) {
    queryParams['supplierName[regex]'] = queryParams.supplierName
    delete queryParams.supplierName
  }
  return purchase_requisition_api.addAuthenticationHeader().get('', { params: queryParams })
}

export function fetch_purchase_requisition_details(id: string) {
  return purchase_requisition_api.addAuthenticationHeader().get(`/${id}`)
}

export function create_purchase_requisition(data: any) {
  return purchase_requisition_api.addAuthenticationHeader().post('', data)
}

export function update_purchase_requisition(id: string, data: any) {
  return purchase_requisition_api.addAuthenticationHeader().patch(`/${id}`, data)
}

export function delete_purchase_requisition(id: string) {
  return purchase_requisition_api.addAuthenticationHeader().delete(`/${id}`)
}

export function update_purchase_requisition_status(id: string, status: string, data?: any) {
  return purchase_requisition_api.addAuthenticationHeader().patch(`/${id}/${status}`, data)
}

// ─── Purchase Orders ─────────────────────────────────────────
const purchase_order_api = getApi('/purchase-orders')

export function fetch_purchase_orders(params?: Record<string, any>) {
  const queryParams = { ...params }
  if (queryParams.referenceNumber) {
    queryParams['referenceNumber[regexAny]'] = queryParams.referenceNumber
    delete queryParams.referenceNumber
  }
  if (queryParams.supplierName) {
    queryParams['supplierName[regex]'] = queryParams.supplierName
    delete queryParams.supplierName
  }
  return purchase_order_api.addAuthenticationHeader().get('', { params: queryParams })
}

export function fetch_purchase_order_details(id: string) {
  return purchase_order_api.addAuthenticationHeader().get(`/${id}`)
}

export function create_purchase_order(data: any) {
  return purchase_order_api.addAuthenticationHeader().post('', data)
}

export function update_purchase_order(id: string, data: any) {
  return purchase_order_api.addAuthenticationHeader().patch(`/${id}`, data)
}

export function delete_purchase_order(id: string) {
  return purchase_order_api.addAuthenticationHeader().delete(`/${id}`)
}

export function update_purchase_order_status(id: string, status: string, data?: any) {
  return purchase_order_api.addAuthenticationHeader().patch(`/${id}/${status}`, data)
}

export function update_purchase_order_payment_status(id: string, status: string) {
  return purchase_order_api.addAuthenticationHeader().patch(`/${id}/${status}-payment`)
}

// ─── Good Transfers ──────────────────────────────────────────
const good_transfer_api = getApi('/good-transfer-vouchers')

export function fetch_good_transfers(params?: Record<string, any>) {
  const queryParams = { ...params }
  if (queryParams.referenceNumber) {
    queryParams['referenceNumber[regexAny]'] = queryParams.referenceNumber
    delete queryParams.referenceNumber
  }
  return good_transfer_api.addAuthenticationHeader().get('', { params: queryParams })
}

export function fetch_good_transfer_details(id: string) {
  return good_transfer_api.addAuthenticationHeader().get(`/${id}`)
}

export function create_good_transfer(data: any) {
  const endpoint = data.type === 'RECEIVE' ? '/receive' : '/issue'
  return good_transfer_api.addAuthenticationHeader().post(endpoint, data)
}

export function update_good_transfer(id: string, data: any) {
  return good_transfer_api.addAuthenticationHeader().patch(`/${id}`, data)
}

export function delete_good_transfer(id: string) {
  return good_transfer_api.addAuthenticationHeader().delete(`/${id}`)
}

export function update_good_transfer_status(id: string, status: string, type?: string) {
  const endpoint = type ? `/${id}/approve-${type.toLowerCase()}` : `/${id}/${status}`
  return good_transfer_api.addAuthenticationHeader().patch(endpoint)
}







