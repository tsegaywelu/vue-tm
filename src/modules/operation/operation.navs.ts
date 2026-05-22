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
        permission: { subject: "SHIPMENT", actions: ["view"] },
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
        permission: { subject: "SHIPMENT", actions: ["view"] },
      },
      {
        name: "Orders",
        path: "/operation/orders",
        show: true,
        permission: { subject: "ORDER", actions: ["view"] },
        children: [
          {
            path: "/operation/shipments/add-from-order/$id",
            name: "Create Shipment from Order",
            show: false,
          },
          {
            path: "/operation/orders/add",
            name: "Create Order",
            show: false,
          },
          {
            path: "/operation/orders/edit/$id",
            name: "Edit Order",
            show: false,
          },
          {
            path: "/operation/orders/$id",
            name: "Order Details",
            show: false,
          },
        ],
      },
      {
        name: "Routes",
        path: "/operation/routes",
        show: true,
        permission: { subject: "ROUTE", actions: ["view"] },
        children: [
          {
            path: "/operation/routes/add",
            name: "Create Route",
            show: false,
          },
          {
            path: "/operation/routes/edit/$id",
            name: "Edit Route",
            show: false,
          },
          {
            path: "/operation/routes/$id",
            name: "Route Details",
            show: false,
          },
        ],
      },
      {
        name: "Advances",
        path: "/operation/advances",
        show: true,
        permission: { subject: "ADVANCE_PAYMENT", actions: ["view"] },
        children: [
          {
            path: "/operation/advance-details/$id",
            name: "Advance Details",
            show: false,
          },
          {
            path: "/operation/advance-summary",
            name: "Advance Summary",
            show: false,
          },
          {
            path: "/operation/prepayment-summary",
            name: "Pre-Payment Summary",
            show: false,
          },
        ],
      },
      {
        name: "Approval Request",
        path: "/operation/approvals",
        show: true,
        permission: [
          { subject: "ADVANCE_PAYMENT", actions: ["approve"] },
          { subject: "TRANSACTION", actions: ["approve"] },
          { subject: "PRE_PAYMENT", actions: ["approve"] },
        ],
      },
      {
        name: "Settlements",
        path: "/operation/settlements",
        show: true,
        permission: { subject: "TRANSACTION", actions: ["view"] },
      },
      {
        name: "Aggregated Advances",
        path: "/operation/aggregated-advances",
        show: true,
        permission: { subject: "ADVANCE_PAYMENT", actions: ["view"] },
      },
    ],
  },
];

export const fleet_navs: Navs[] = [
  {
    name: "Vehicles",
    icon: "shipment",
    show: true,
    path: "/vehicles",
    permission: { subject: "VEHICLE", actions: ["view"] },
    children: [
      {
        path: "/vehicles/add",
        name: "Add Vehicle",
        show: false,
      },
      {
        path: "/vehicles/edit/$id",
        name: "Edit Vehicle",
        show: false,
      },
      {
        path: "/vehicles/leased",
        name: "Leased Vehicles",
        show: true,
      },
      {
        path: "/vehicles/metrics",
        name: "Vehicle Metrics",
        show: true,
      },
      {
        path: "/vehicles/types",
        name: "Vehicle Types",
        show: true,
      },
      {
        path: "/vehicles/goals",
        name: "Vehicle Type Goals",
        show: true,
      },
      {
        path: "/vehicles/groups",
        name: "Vehicle Groups",
        show: true,
      },
      {
        path: "/vehicles/standards",
        name: "Vehicle Standards",
        show: true,
      },
      {
        path: "/vehicles/$id",
        name: "Vehicle Details",
        show: false,
      },
    ],
  },
  {
    name: "Drivers",
    icon: "driver",
    path: "/drivers",
    show: true,
    permission: { subject: "DRIVER", actions: ["view"] },
    children: [
      {
        path: "/drivers/add",
        name: "Add Driver",
        show: false,
      },
      {
        path: "/drivers/edit/$id",
        name: "Edit Driver",
        show: false,
      },
      {
        path: "drivers/$id",
        name: "Driver Details",
        show: false,
      },
      {
        name: "Infractions",
        path: "/infractions",
        show: true,
        permission: { subject: "INFRACTION", actions: ["view"] },
        children: [
          {
            path: "/infractions/$id",
            name: "Infraction Details",
            show: false,
          },
          {
            path: "/infractions/add",
            name: "Add Infraction",
            show: false,
          },
          {
            path: "/infractions/edit/$id",
            name: "Edit Infraction",
            show: false,
          },
        ],
      },
      {
        name: "Infraction Types",
        path: "/infractions?tab=types",
        show: true,
        permission: { subject: "INFRACTION", actions: ["view"] },
      },
    ],
  },
  {
    name: "Transporters",
    icon: "trasporter",
    path: "/transporters",
    show: true,
    permission: { subject: "TRANSPORTER", actions: ["view"] },
    children: [
      {
        path: "/transporters/$id",
        name: "Transporter Details",
        show: false,
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
    permission: { subject: "CONTACT", actions: ["view"] },
    children: [
      {
        path: "/customers/$id",
        name: "Customer Details",
        show: false,
      },
      {
        path: "/agents",
        name: "Agents",
        show: true,
        permission: { subject: "AGENT", actions: ["view"] },
        children: [
          {
            path: "/agents/add",
            name: "Add Agent",
            show: false,
          },
          {
            path: "/agents/edit/$id",
            name: "Edit Agent",
            show: false,
          },
        ],
      },
      {
        path: "/facilities",
        name: "Facilities",
        show: true,
        permission: { subject: "FACILITY", actions: ["view"] },
      },
    ],
  },
  {
    name: "Contacts",
    icon: "contacts",
    path: "/contacts",
    show: true,
    permission: { subject: "CONTACT", actions: ["view"] },
    children: [
      {
        path: "/contacts/$id",
        name: "Contact Details",
        show: false,
      },
    ],
  },
];

export const maintenance_navs: Navs[] = [
  {
    name: "Insurances",
    icon: "insurance",
    path: "/insurances",
    show: true,
    permission: { subject: "INSURANCE", actions: ["view"] },
    children: [
      {
        path: "/shipment-damages",
        name: "ShipmentDamages",
        show: true,
        permission: { subject: "INSURANCE", actions: ["view"] },
        children: [
          {
            path: "/shipment-damages/$id",
            name: "Shipment Damage Details",
            show: false,
          },
        ],
      },
      {
        path: "/vehicle-damages",
        name: "Vehicle Damages",
        show: true,
        permission: { subject: "INSURANCE", actions: ["view"] },
      },
      {
        path: "/insurances/$id",
        name: "Insurance Details",
        show: false,
      },
      {
        path: "/insurances/add",
        name: "Add Insurance",
        show: false,
      },
      {
        path: "/insurances/edit/$id",
        name: "Edit Insurance",
        show: false,
      },
    ],
  },
  {
    name: "Tyres",
    icon: "tyre",
    path: "/vehicle-tyres",
    show: true,
    permission: { subject: "TYRE", actions: ["view"] },
    children: [
      {
        path: "/vehicle-tyres/add",
        name: "Add Tyre",
        show: false,
      },
      {
        path: "/vehicle-tyres/$id",
        name: "Tyre Detail",
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
        permission: { subject: "MECHANIC", actions: ["view"] },
        children: [
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
        ],
      },

      {
        name: "Inspection",
        path: "/maintenance/inspection",
        show: true,
        permission: { subject: "INSPECTION", actions: ["view"] },
        children: [
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
        ],
      },

      {
        name: "Service Record",
        path: "/maintenance/service-record",
        show: true,
        permission: { subject: "SERVICE_RECORD", actions: ["view"] },
        children: [
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
        ],
      },

      {
        name: "Service Reminder",
        path: "/maintenance/service-reminder",
        show: true,
        permission: { subject: "SERVICE_REMINDER", actions: ["view"] },
        children: [
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
        ],
      },

      {
        name: "Service Task",
        path: "/maintenance/service-task",
        show: true,
        permission: { subject: "SERVICE_TASK", actions: ["view"] },
        children: [
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
        ],
      },

      {
        name: "Service Type",
        path: "/maintenance/service-type",
        show: true,
        permission: { subject: "SERVICE_TYPE", actions: ["view"] },
        children: [
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
        ],
      },

      {
        name: "Work Order",
        path: "/maintenance/work-order",
        show: true,
        permission: { subject: "WORK_ORDER", actions: ["view"] },
        children: [
          {
            name: "Add Work Order",
            path: "/maintenance/work-order/add",
            show: false,
          },
          {
            path: "maintenance/work-order/edit/$id",
            name: "Edit Work Order",
            show: false,
          },
          {
            path: "/maintenance/work-order/$id",
            name: "Work Order Details",
            show: false,
          },
        ],
      },

      {
        name: "Workshop",
        path: "/maintenance/workshop",
        show: true,
        permission: { subject: "WORKSHOP", actions: ["view"] },
        children: [
          {
            path: "/maintenance/workshop/add",
            name: "Add Workshop",
            show: false,
          },
          {
            path: "/maintenance/workshop/edit/$id",
            name: "Edit Workshop",
            show: false,
          },
        ],
      },
      {
        name: "Issue Report",
        path: "/maintenance/issue-report",
        show: true,
        permission: { subject: "ISSUE_REPORT", actions: ["view"] },
      },
      {
        name: "Tyre Handoffs",
        path: "/maintenance/tyre-handoffs",
        show: true,
        permission: { subject: "TYRE_HANDOFF", actions: ["view"] },
        children: [
          {
            path: "/maintenance/tyre-handoffs/$id",
            name: "Tyre Handoff Details",
            show: false,
          },
        ],
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
        permission: [
          { subject: "ADVANCE_PAYMENT", actions: ["pay", "authorize", "cancel"] },
          { subject: "TRANSACTION", actions: ["pay", "authorize", "cancel"] },
          { subject: "SHIPMENT", actions: ["pay", "authorize", "cancel"] },
          { subject: "PRE_PAYMENT", actions: ["pay", "authorize", "cancel"] },
        ],
      },
      {
        name: "Receivable",
        path: "/finance/receivable",
        show: true,
        permission: [
          { subject: "SHIPMENT", actions: ["generate_invoice"] },
          { subject: "TRANSACTION", actions: ["pay", "authorize", "cancel"] },
        ],
        children: [
          {
            path: "/finance/receivable/$id",
            name: "Receivable Details",
            show: false,
          },
        ],
      },
      {
        name: "Invoice Report",
        path: "/finance/invoice-report",
        show: true,
        permission: { subject: "SHIPMENT", actions: ["generate_invoice"] },
        children: [
          {
            path: "/finance/invoice-report/$id",
            name: "Invoice Report Details",
            show: false,
          },
          {
            path: "/finance/invoice-report/edit/$id",
            name: "Edit Invoice Report",
            show: false,
          },
        ],
      },
      {
        name: "Payment Collection",
        path: "/finance/payment-collection",
        show: true,
        permission: { subject: "SHIPMENT", actions: ["generate_invoice"] },
        children: [
          {
            path: "/finance/payment-collection/$id",
            name: "Payment Collection Details",
            show: false,
          },
          {
            path: "/finance/payment-collection/edit/$id",
            name: "Edit Payment Collection",
            show: false,
          },
        ],
      },
      {
        name: "Expense",
        path: "/finance/expense",
        show: true,
        permission: { subject: "EXPENSE", actions: ["view"] },
      },
      {
        name: "Paid Sub-Contracts",
        path: "/finance/paid-sub-contracts",
        show: true,
        permission: { subject: "SHIPMENT", actions: ["pay", "authorize"] },
      },
      {
        name: "Expense Types",
        path: "/finance/expense-types",
        show: true,
        permission: { subject: "EXPENSE_TYPE", actions: ["view"] },
        children: [
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
        ],
      },

      {
        name: "Fuel Transactions",
        path: "/finance/fuel-transactions",
        show: true,
        permission: { subject: "TRANSACTION", actions: ["view"] },
      },
      {
        name: "Driver Bonuses",
        path: "/finance/driver-bonuses",
        show: true,
        permission: { subject: "DRIVER_BONUS", actions: ["view"] },
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
        permission: { subject: "CATEGORY", actions: ["view"] },
        children: [
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
        ],
      },

      {
        name: "Item Groups",
        path: "/inventory/item-groups",
        show: true,
        permission: { subject: "ITEM_GROUP", actions: ["view"] },
        children: [
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
        ],
      },

      {
        name: "Vendor",
        path: "/inventory/vendor",
        show: true,
        permission: { subject: "SUPPLIER", actions: ["view"] },
        children: [
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
        ],
      },

      {
        name: "Items",
        path: "/inventory/items",
        show: true,
        permission: { subject: "INVENTORY_ITEM", actions: ["view"] },
        children: [
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
        ],
      },

      {
        name: "Store Requisition",
        path: "/inventory/store-requisition",
        show: true,
        permission: { subject: "STORE_REQUISITION_VOUCHER", actions: ["view"] },
        children: [
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
            name: "Store Requisition Details",
            path: "/inventory/store-requisition/$id",
            show: false,
          },
        ],
      },

      {
        name: "Purchase Requisition",
        path: "/inventory/purchase-requisition",
        show: true,
        permission: { subject: "PURCHASE_REQUISITION", actions: ["view"] },
        children: [
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
            name: "Purchase Requisition Details",
            path: "/inventory/purchase-requisition/$id",
            show: false,
          },
        ],
      },

      {
        name: "Purchase Order",
        path: "/inventory/purchase-order",
        show: true,
        permission: { subject: "PURCHASE_ORDER", actions: ["view"] },
        children: [
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
            name: "Purchase Order Details",
            path: "/inventory/purchase-order/$id",
            show: false,
          },
        ],
      },

      {
        name: "Issue / Receive",
        path: "/inventory/good-transfer",
        show: true,
        permission: { subject: "GOOD_TRANSFER_VOUCHER", actions: ["view"] },
        children: [
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
          {
            name: "Transfer Voucher Details",
            path: "/inventory/good-transfer/$id",
            show: false,
          },
        ],
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
        permission: { subject: "USER", actions: ["view"] },
        children: [
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
        ],
      },

      {
        name: "Base Configuration",
        path: "/setting/base-configuration",
        show: true,
        children: [
          {
            name: "Add Setting",
            path: "/setting/base-configuration/settings/add",
            show: false,
          },
          {
            name: "Edit Setting",
            path: "setting/base-configuration/settings/edit/$id",
            show: false,
          },
          {
            name: "Add Road Type",
            path: "setting/base-configuration/road-type/add",
            show: false,
          },
          {
            name: "Edit Road Type",
            path: "setting/base-configuration/road-type/edit/$id",
            show: false,
          },
          {
            name: "Add Terrain Type",
            path: "/setting/base-configuration/terrain-type/add",
            show: false,
          },
          {
            name: "Edit Terrain Type",
            path: "/setting/base-configuration/terrain-type/edit/$id",
            show: false,
          },
          {
            name: "Add Bank",
            path: "/setting/base-configuration/bank/add",
            show: false,
          },
          {
            name: "Edit Bank",
            path: "/setting/base-configuration/bank/edit/$id",
            show: false,
          },
          {
            name: "Add Insurance Provider",
            path: "setting/base-configuration/insurance/add",
            show: false,
          },
          {
            name: "Edit Insurance Provider",
            path: "setting/base-configuration/insurance/edit/$id",
            show: false,
          },
        ],
      },
      {
        name: "Contract",
        path: "/setting/contract",
        show: true,
        permission: { subject: "CONTRACT", actions: ["view"] },
        children: [
          {
            name: "Add Contract",
            path: "/setting/contract/add",
            show: false,
          },
          {
            name: "Edit Contract",
            path: "/setting/contract/edit/$id",
            show: false,
          },
          {
            name: "Contract Details",
            path: "/setting/contract/view/$id",
            show: false,
          },
        ],
      },
      {
        name: "Commodity",
        path: "/setting/commodity",
        show: true,
        permission: { subject: "COMMODITY", actions: ["view"] },
        children: [
          {
            name: "Add Commodity",
            path: "/setting/commodity/add",
            show: false,
          },
          {
            name: "Edit Commodity",
            path: "/setting/commodity/edit/$id",
            show: false,
          },
        ],
      },
      {
        name: "Packaging",
        path: "/setting/packaging",
        show: true,
        permission: { subject: "COMMODITY", actions: ["view"] },
        children: [
          {
            name: "Add Packaging",
            path: "/setting/packaging/add",
            show: false,
          },
          {
            name: "Edit Packaging",
            path: "/setting/packaging/edit/$id",
            show: false,
          },
        ],
      },
      {
        name: "Route Requests",
        path: "/setting/route-request",
        show: true,
        permission: { subject: "ROUTE", actions: ["view"] },
      },
      {
        name: "Region",
        path: "/setting/region",
        show: true,
        children: [
          {
            name: "Add Region",
            path: "/setting/region/add",
            show: false,
          },
          {
            name: "Edit Region",
            path: "/setting/region/edit/$id",
            show: false,
          },
        ],
      },
      {
        name: "Bonus Multipliers",
        path: "/setting/bonus-multipliers",
        show: true,
        permission: { subject: "DRIVER_BONUS", actions: ["view"] },
        children: [
          {
            name: "Add Multiplier",
            path: "/setting/bonus-multipliers/add",
            show: false,
          },
          {
            name: "Edit Multiplier",
            path: "/setting/bonus-multipliers/edit/$id",
            show: false,
          },
        ],
      },
      {
        name: "Bonus Routes",
        path: "/setting/bonus-routes",
        show: true,
        permission: { subject: "DRIVER_BONUS", actions: ["view"] },
        children: [
          {
            name: "Add Bonus Route",
            path: "/setting/bonus-routes/add",
            show: false,
          },
          {
            name: "Edit Bonus Route",
            path: "/setting/bonus-routes/edit/$id",
            show: false,
          },
        ],
      },
      {
        name: "Announcements",
        path: "/setting/announcements",
        show: true,
        permission: { subject: "ANNOUNCEMENT", actions: ["view"] },
        children: [
          {
            name: "Add Announcement",
            path: "/setting/announcements/add",
            show: false,
          },
          {
            name: "Edit Announcement",
            path: "/setting/announcements/edit/:id",
            show: false,
          },
        ],
      },
      {
        name: "Invoice Templates",
        path: "/setting/invoice-templates",
        show: true,
        permission: { subject: "SHIPMENT", actions: ["generate_invoice"] },
        children: [
          {
            name: "New Invoice Template",
            path: "/setting/invoice-templates/new",
            show: false,
          },
          {
            name: "Edit Invoice Template",
            path: "/setting/invoice-templates/:id",
            show: false,
          },
        ],
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
