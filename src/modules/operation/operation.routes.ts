import type { RouteRecordRaw } from 'vue-router'

export const operation_routes: RouteRecordRaw[] = [
  {
    path: '/operation',
    name: 'operation_parent',
    redirect: '/operation/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'operation_dashboard',
        component: () => import('./pages/Dashboard.vue'),
        meta: { title: 'Operation Dashboard' }
      },
      {
        path: 'approvals',
        name: 'operation_approvals',
        component: () => import('./pages/ApprovalRequests.vue'),
        meta: { title: 'Approval Requests' }
      },
      {
        path: 'shipments',
        name: 'operation_shipments',
        component: () => import('./pages/Shipments.vue'),
        meta: { title: 'Shipments' }
      },
      {
        path: 'shipments/bids',
        name: 'operation_shipments_bids',
        component: () => import('./pages/PendingBids.vue'),
        meta: { title: 'Pending Bids' }
      }
    ]
  }
]
