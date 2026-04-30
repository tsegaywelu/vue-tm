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
import type { Navs } from '@/types/navigation'

export interface NavGroup {
  name: string
  items: Navs[]
}

export const navigationRegistry: NavGroup[] = [
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
