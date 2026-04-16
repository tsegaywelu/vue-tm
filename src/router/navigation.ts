import { operation_navs } from '@/modules/operation/operation.navs'
import type { Navs } from '@/types/navigation'

export interface NavGroup {
  name: string
  items: Navs[]
}

export const navigationRegistry: NavGroup[] = [
  {
    name: 'CORE OPERATIONS',
    items: operation_navs
  }
]
