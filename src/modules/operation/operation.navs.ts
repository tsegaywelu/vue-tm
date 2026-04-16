import type { Navs } from '@/types/navigation'

export const operation_navs: Navs[] = [
  {
    name: 'Dashboard',
    path: '/operation/dashboard',
    icon: 'dashboard',
    show: true,
  },
  {
    name: 'Approval Requests',
    path: '/operation/approvals',
    icon: 'approval',
    show: true,
  },
  {
    name: 'Shipments',
    icon: 'shipment',
    show: true,
    children: [
      {
        name: 'All Shipments',
        path: '/operation/shipments',
        show: true,
      },
      {
        name: 'Pending Bids',
        path: '/operation/shipments/bids',
        show: true,
      }
    ]
  }
]
