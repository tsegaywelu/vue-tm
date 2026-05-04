import type { Navs } from "@/types/navigation";

export const core_operations_navs: Navs[] = [
  {
    name: "Dashboard",
    path: "/operation/dashboard",
    icon: "dashboard",
    show: true,
  },
  {
    name: "Operations",
    icon: "operations",
    show: true,
    children: [
      {
        name: "Shipments",
        path: "/operation/shipments",
        show: true,
        children: [
          {
            path: "/operation/shipments/add",
            name: "Add Shipment",
            show: false,
          },
          {
            path: "/operation/shipments/$id",
            name: "Shipment Details",
            show: false,
          },
          {
            path: "/operation/shipments/edit/$id",
            name: "Edit Shipment",
            show: false,
          },
        ],
      },
      {
        name: "Shipment Adjustment",
        path: "/operation/shipment-adjustment",
        show: true,
      },
      {
        name: "Orders",
        path: "/operation/orders",
        show: true,
      },
      {
        name: "Routes",
        path: "/operation/routes",
        show: true,
      },
      {
        name: "Advances",
        path: "/operation/advances",
        show: true,
      },
      {
        name: "Approval Request",
        path: "/operation/approvals",
        show: true,
      },
      {
        name: "Settlements",
        path: "/operation/settlements",
        show: true,
      },
      {
        name: "Aggregated Advances",
        path: "/operation/aggregated-advances",
        show: true,
      },
    ],
  },
];

export const stakeholders_navs: Navs[] = [
  {
    name: "Customers",
    icon: "customers",
    path: "/customers",
    show: true,
  },
  {
    name: "Contacts",
    icon: "contacts",
    path: "/contacts",
    show: true,
  },
];

export const fleet_navs: Navs[] = [
  {
    name: "Vehicles",
    icon: "shipment",
    path: "/vehicles",
    show: true,
  },
  {
    name: "Drivers",
    icon: "driver",
    path: "/drivers",
    show: true,
  },
  {
    name: "Transporters",
    icon: "trasporter",
    path: "/transporters",
    show: true,
  },
];

export const maintenance_navs: Navs[] = [
  {
    name: "Insurances",
    icon: "insurance",
    path: "/insurances",
    show: true,
  },
  {
    name: "Tyres",
    icon: "tyre",
    path: "/vehicle-tyres",
    show: true,
    children: [
      {
        path: "vehicle-tyres/$id",
        name: "Tyre Detail",
        show: false
      },
      {
        path: "/vehicle-tyres/add",
        name: "Add Tyre",
        show: false,
      },
      {
        path: "/vehicle-tyres/edit/$id",
        name: "Edit Tyre",
        show: false,
      },
      {
        path: "/vehicle-tyres/details/$id",
        name: "Tyre Details",
        show: false,
      },
    ],
  },
  {
    name: "Maintenance",
    icon: "maintenance",
    show: true,
    children: [
      {
        name: "Mechanic",
        path: "/maintenance/mechanic",
        show: true,
      },
      {
        path: "/maintenance/mechanic/add",
        name: "Add Mechanic",
        show: false,
      },
      {
        path: "/maintenance/mechanic/edit/$id",
        name: "Edit Mechanic",
        show: false,
      },
      {
        name: "Inspection",
        path: "/maintenance/inspection",
        show: true,
      },
      {
        path: "/maintenance/inspection/add",
        name: "Add Inspection",
        show: false,
      },
      {
        path: "/maintenance/inspection/edit/$id",
        name: "Edit Inspection",
        show: false,
      },
      {
        name: "Service Record",
        path: "/maintenance/service-record",
        show: true,
      },

      {
        path: "/maintenance/service-record/add",
        name: "Add Service Record",
        show: false,
      },
      {
        path: "/maintenance/service-record/edit/$id",
        name: "Edit Service Record",
        show: false,
      },
      {
        name: "Service Reminder",
        path: "/maintenance/service-reminder",
        show: true,
      },
      {
        path: "/maintenance/service-reminder/add",
        name: "Add Service Reminder",
        show: false,
      },
      {
        path: "/maintenance/service-reminder/edit/$id",
        name: "Edit Service Reminder",
        show: false,
      },
      {
        name: "Service Task",
        path: "/maintenance/service-task",
        show: true,
      },
      {
        path: "/maintenance/service-task/add",
        name: "Add Service Task",
        show: false,
      },
      {
        path: "/maintenance/service-task/edit/$id",
        name: "Edit Service Task",
        show: false,
      },
      {
        name: "Service Type",
        path: "/maintenance/service-type",
        show: true,
      },

      {
        name: "Add Service Type",
        path: "/maintenance/service-type/add",
        show: false,
      },
      {
        path: "/maintenance/service-type/edit/$id",
        name: "Edit Service Type",
        show: false,
      },
      {
        name: "Work Order",
        path: "/maintenance/work-order",
        show: true,
      },
      {
        name: "Add Work Order",
        path: "/maintenance/work-order/add",
        show: false,
      },
      {
        // path: "/maintenance/work-order/edit/:id",
        path: 'maintenance/work-order/edit/$id',
        name: "Edit Work Order",
        show: false,
      },
      {
        name: "Workshop",
        path: "/maintenance/workshop",
        show: true,
        children: [
          {
            path: "add",
            name: "Add Workshop",
            show: false,
          },
          {
            path: "edit/$id",
            name: "Edit Workshop",
            show: false,
          },
        ]
      },
      {
        name: "Issue Report",
        path: "/maintenance/issue-report",
        show: true,
      },
      {
        name: "Tyre Handoffs",
        path: "/maintenance/tyre-handoffs",
        show: true,
      },
    ],
  },
];

export const finance_navs: Navs[] = [
  {
    name: "Finance",
    icon: "finance",
    show: true,
    children: [
      {
        name: "Payable",
        path: "/finance/payable",
        show: true,
      },
      {
        name: "Receivable",
        path: "/finance/receivable",
        show: true,
      },
      {
        name: "Invoice Report",
        path: "/finance/invoice-report",
        show: true,
      },
      {
        name: "Payment Collection",
        path: "/finance/payment-collection",
        show: true,
      },
      {
        name: "Expense",
        path: "/finance/expense",
        show: true,
      },
      {
        name: "Paid Sub-Contracts",
        path: "/finance/paid-sub-contracts",
        show: true,
      },
      {
        name: "Expense Types",
        path: "/finance/expense-types",
        show: true,
      },
      {
        name: "Add Expense Type",
        path: "/finance/expense-types/add",
        show: false,
      },
      {
        name: "Edit Expense Type",
        path: "/finance/expense-types/edit/$id",
        show: false,
      },
      {
        name: "Fuel Transactions",
        path: "/finance/fuel-transactions",
        show: true,
      },
      {
        name: "Driver Bonuses",
        path: "/finance/driver-bonuses",
        show: true,
      },
    ],
  },
];

export const inventory_navs: Navs[] = [
  {
    name: "Inventory",
    icon: "inventory",
    show: true,
    children: [
      {
        name: "Categories",
        path: "/inventory/categories",
        show: true,
      },
      {
        name: "Add Category",
        path: "/inventory/categories/add",
        show: false,
      },
      {
        name: "Edit Category",
        path: "/inventory/categories/edit/$id",
        show: false,
      },
      {
        name: "Item Groups",
        path: "/inventory/item-groups",
        show: true,
      },
      {
        name: "Add Item Group",
        path: "/inventory/item-groups/add",
        show: false,
      },
      {
        name: "Edit Item Group",
        path: "/inventory/item-groups/edit/$id",
        show: false,
      },
      {
        name: "Vendor",
        path: "/inventory/vendor",
        show: true,
      },
      {
        name: "Add Vendor",
        path: "/inventory/vendor/add",
        show: false,
      },
      {
        name: "Edit Vendor",
        path: "/inventory/vendor/edit/$id",
        show: false,
      },
      {
        name: "Items",
        path: "/inventory/items",
        show: true,
      },
      {
        name: "Add Inventory Item",
        path: "/inventory/items/add",
        show: false,
      },
      {
        name: "Edit Inventory Item",
        path: "/inventory/items/edit/$id",
        show: false,
      },
      {
        name: "Store Requisition",
        path: "/inventory/store-requisition",
        show: true,
      },
      {
        name: "Add Store Requisition",
        path: "/inventory/store-requisition/add",
        show: false,
      },
      {
        name: "Edit Store Requisition",
        path: "/inventory/store-requisition/edit/$id",
        show: false,
      },
      {
        name: "Purchase Requisition",
        path: "/inventory/purchase-requisition",
        show: true,
      },
      {
        name: "Add Purchase Requisition",
        path: "/inventory/purchase-requisition/add",
        show: false,
      },
      {
        name: "Edit Purchase Requisition",
        path: "/inventory/purchase-requisition/edit/$id",
        show: false,
      },
      {
        name: "Purchase Order",
        path: "/inventory/purchase-order",
        show: true,
      },
      {
        name: "Add Purchase Order",
        path: "/inventory/purchase-order/add",
        show: false,
      },
      {
        name: "Edit Purchase Order",
        path: "/inventory/purchase-order/edit/$id",
        show: false,
      },
      {
        name: "Issue / Receive",
        path: "/inventory/good-transfer",
        show: true,
      },
      {
        name: "Add Transfer Voucher",
        path: "/inventory/good-transfer/add",
        show: false,
      },
      {
        name: "Edit Transfer Voucher",
        path: "/inventory/good-transfer/edit/$id",
        show: false,
      },
    ],
  },
];

export const setting_navs: Navs[] = [
  {
    name: "Settings",
    icon: "settings",
    show: true,
    children: [
      {
        name: "User and Role",
        path: "/setting/user-and-role",
        show: true,
      },
      {
        name: "Add User",
        path: "/setting/user-and-role/user/add",
        show: false,
      },
      {
        name: "Edit User",
        path: "/setting/user-and-role/user/edit/$id",
        show: false,
      },
      {
        name: "Add Role",
        path: "/setting/user-and-role/role/add",
        show: false,
      },
      {
        name: "Edit Role",
        path: "/setting/user-and-role/role/edit/$id",
        show: false,
      },
      {
        name: "Base Configuration",
        path: "/setting/base-configuration",
        show: true,
      },
      {
        name: "Contract",
        path: "/setting/contract",
        show: true,
      },
      {
        name: "Commodity",
        path: "/setting/commodity",
        show: true,
      },
      {
        name: "Packaging",
        path: "/setting/packaging",
        show: true,
      },
      {
        name: "Route Requests",
        path: "/setting/route-request",
        show: true,
      },
      {
        name: "Region",
        path: "/setting/region",
        show: true,
      },
      {
        name: "Bonus Multipliers",
        path: "/setting/bonus-multipliers",
        show: true,
      },
      {
        name: "Bonus Routes",
        path: "/setting/bonus-routes",
        show: true,
      },
      {
        name: "Announcements",
        path: "/setting/announcements",
        show: true,
      },
    ],
  },
];

export const reports_navs: Navs[] = [
  {
    name: "Reports",
    path: "/reports",
    icon: "reports",
    show: true,
  },
];
