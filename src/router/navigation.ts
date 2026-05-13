import {
  core_operations_navs,
  stakeholders_navs,
  fleet_navs,
  maintenance_navs,
  finance_navs,
  inventory_navs,
  setting_navs,
  reports_navs
} from '@/modules/operation/operation.navs'
import {
  shipper_core_navs,
  shipper_stakeholders_navs,
  shipper_finance_navs,
  shipper_settings_navs
} from '@/modules/shipper/shipper.navs'
import type { Navs } from '@/types/navigation'

export interface NavGroup {
  name: string
  items: Navs[]
}

// Carrier / Admin navigation
export const carrierNavigationRegistry: NavGroup[] = [
  {
    name: 'CORE OPERATIONS',
    items: core_operations_navs
  },
  {
    name: 'STAKEHOLDERS',
    items: stakeholders_navs
  },
  {
    name: 'FLEET',
    items: fleet_navs
  },
  {
    name: 'ASSETS & MAINTENANCE',
    items: maintenance_navs
  },
  {
    name: 'FINANCE',
    items: finance_navs
  },
  {
    name: 'INVENTORY',
    items: inventory_navs
  },
  {
    name: 'SETTINGS',
    items: setting_navs
  },
  {
    name: 'REPORTS',
    items: reports_navs
  }
]

// Shipper navigation
export const shipperNavigationRegistry: NavGroup[] = [
  {
    name: 'CORE OPERATIONS',
    items: shipper_core_navs
  },
  {
    name: 'STAKEHOLDERS',
    items: shipper_stakeholders_navs
  },
  {
    name: 'FINANCE',
    items: shipper_finance_navs
  },
  {
    name: 'SETTINGS',
    items: shipper_settings_navs
  }
]

/**
 * Returns the appropriate navigation registry based on user type.
 * @param isShipper - Whether the current user is a shipper user
 */
export function getNavigationRegistry(isShipper: boolean): NavGroup[] {
  return isShipper ? shipperNavigationRegistry : carrierNavigationRegistry
}

// Keep backward compatibility — default to carrier
export const navigationRegistry = carrierNavigationRegistry
