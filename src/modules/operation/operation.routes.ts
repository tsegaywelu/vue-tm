import type { RouteRecordRaw } from "vue-router";
import { RouterView } from "vue-router";
import { icons } from "@/utils/icons";

export const operation_routes: RouteRecordRaw[] = [
  {
    path: "/operation",
    name: "operation_parent",
    component: RouterView,
    redirect: "/operation/dashboard",
    children: [
      {
        path: "dashboard",
        name: "operation_dashboard",
        component: () => import("./pages/Dashboard.vue"),
        meta: {
          title: "Operation Dashboard",
          description:
            "Overview of your fleet operations and key performance metrics.",
        },
      },
      {
        path: "approvals",
        name: "operation_approvals",
        component: () => import("./pages/ApprovalRequests.vue"),
        meta: {
          title: "Approval Requests",
          description:
            "Manage and process operational payment approvals from one central hub.",
        },
      },
      {
        path: "shipments",
        name: "operation_shipments",
        component: () => import("./pages/Shipments.vue"),
        meta: {
          title: "Shipments",
          description:
            "Detailed overview and management of all active and historical shipments.",
        },
      },
      {
        path: "shipments/add",
        name: "operation_shipments_add",
        component: () => import("./pages/AddShipment.vue"),
        meta: {
          title: "Add Shipment",
          description:
            "Create a new shipment by assigning an order to a vehicle.",
        },
      },
      {
        path: "shipments/:id",
        name: "operation_shipment_details",
        component: () => import("./pages/ShipmentDetails.vue"),
        meta: {
          title: "Shipment Details",
          description: "Detailed breakdown and history of a specific shipment.",
          tabsTeleportTo: "#shipment-details-tabs",
          tabs: [
            {
              label: "Overview",
              value: "overview",
            },
            {
              label: "Document Uploads",
              value: "uploads",
            },
            {
              label: "Pre-Trip Inspections",
              value: "pre-trip-inspections",
            },
            { label: "Settlements", value: "settlements" },
            { label: "Empty Return", value: "emptyReturn" },
          ],
        },
      },
      {
        path: "shipments/bids",
        name: "operation_shipments_bids",
        component: () => import("./pages/PendingBids.vue"),
        meta: {
          title: "Pending Bids",
          description:
            "Review and manage pending carrier bids for open shipments.",
        },
      },
      {
        path: "shipment-adjustment",
        name: "operation_shipment_adjustment",
        component: () => import("./pages/ShipmentAdjustment.vue"),
        meta: {
          title: "Shipment Adjustment",
          description: "Track and manage shipment adjustments and corrections.",
        },
      },
      {
        path: "orders",
        name: "operation_orders",
        component: () => import("./pages/Orders.vue"),
        meta: {
          title: "Orders",
          description:
            "View and manage freight orders from shippers and carriers.",
        },
      },
      {
        path: "routes",
        name: "operation_routes",
        component: () => import("./pages/Routes.vue"),
        meta: {
          title: "Routes",
          description:
            "Manage transportation routes, origins, destinations and waypoints.",
        },
      },
      {
        path: "advances",
        name: "operation_advances",
        component: () => import("./pages/Advances.vue"),
        meta: {
          title: "Advances",
          description:
            "Track driver and transporter advance payments and expenses.",
          tabs: [
            {
              label: "Driver Advance Payments",
              value: "driverAdvances",
            },
            {
              label: "Transporter Advance Payments",
              value: "transporterAdvances",
            },
          ],
        },
      },
      {
        path: "settlements",
        name: "operation_settlements",
        component: () => import("./pages/Settlements.vue"),
        meta: {
          title: "Settlements",
          description: "View settled and paid advance payment records.",
        },
      },
      {
        path: "aggregated-advances",
        name: "operation_aggregated_advances",
        component: () => import("./pages/AggregatedAdvances.vue"),
        meta: {
          title: "Aggregated Advances",
          description:
            "Review aggregated and consolidated advance payment summaries.",
        },
      },
    ],
  },
  {
    path: "customers",
    name: "operation_customers",
    component: () => import("./pages/Customers.vue"),
    meta: {
      title: "Customers",
      description: "Manage customer accounts and relationships.",
    },
  },
  {
    path: "contacts",
    name: "operation_contacts",
    component: () => import("./pages/Contacts.vue"),
    meta: {
      title: "Contacts",
      description: "Manage contact information for partners and stakeholders.",
    },
  },
  {
    path: "transporters",
    name: "operation_transporters",
    component: () => import("./pages/Transporters.vue"),
    meta: {
      title: "Transporters",
      description: "Manage transporter profiles and fleet partnerships.",
    },
  },
  {
    path: "insurances",
    name: "operation_insurances",
    component: () => import("./pages/Insurances.vue"),
    meta: {
      title: "Insurances",
      description: "Track and manage vehicle and cargo insurance policies.",
    },
  },
  {
    path: "vehicle-tyres",
    name: "operation_tyres",
    component: () => import("./pages/tyres/vehicleTyres.vue"),
    meta: {
      title: "Tyres",
      description: "Monitor tyre inventory, usage and replacement schedules.",
    },
  },
  {
    path: "vehicle-tyres/:id",
    name: "operation_tyres_detail",
    component: () => import("./pages/tyres/Tyres.vue"),
    meta: {
      title: "Tyres Detail",
      description: "Manage individual tyres for a specific vehicle.",
    },
  },
  {
    path: "vehicle-tyres/add",
    name: "operation_tyres_add",
    component: () => import("./pages/tyres/addTyre.vue"),
    meta: {
      title: "Add Tyre",
      description: "Add a new tyre to a vehicle.",
    },
  },
  {
    path: "vehicle-tyres/edit/:id",
    name: "operation_tyres_edit",
    component: () => import("./pages/tyres/editTyre.vue"),
    meta: {
      title: "Edit Tyre",
      description: "Edit an existing tyre record.",
    },
  },
  {
    path: "vehicle-tyres/details/:id",
    name: "operation_tyres_details",
    component: () => import("./pages/tyres/tyreDetails.vue"),
    meta: {
      title: "Tyre Details",
      description: "View detailed information about a specific tyre.",
    },
  },
  {
    path: "maintenance",
    name: "operation_maintenance",
    component: RouterView,
    redirect: "/maintenance/mechanic",
    children: [
      {
        path: "mechanic",
        name: "operation_maintenance_mechanic",
        component: () => import("./pages/maintenance/Mechanic.vue"),
        meta: { title: "Mechanic", description: "Manage mechanics." },
      },
      {
        path: "inspection",
        name: "operation_maintenance_inspection",
        component: () => import("./pages/maintenance/Inspection.vue"),
        meta: {
          title: "Inspection",
          description: "Manage vehicle inspections.",
        },
      },
      {
        path: "service-record",
        name: "operation_maintenance_service_record",
        component: () => import("./pages/maintenance/ServiceRecord.vue"),
        meta: { title: "Service Record", description: "View service records." },
      },
      {
        path: "service-reminder",
        name: "operation_maintenance_service_reminder",
        component: () => import("./pages/maintenance/ServiceReminder.vue"),
        meta: {
          title: "Service Reminder",
          description: "Manage service reminders.",
        },
      },
      {
        path: "service-task",
        name: "operation_maintenance_service_task",
        component: () => import("./pages/maintenance/ServiceTask.vue"),
        meta: { title: "Service Task", description: "Manage service tasks." },
      },
      {
        path: "service-type",
        name: "operation_maintenance_service_type",
        component: () => import("./pages/maintenance/ServiceType.vue"),
        meta: { title: "Service Type", description: "Manage service types." },
      },
      {
        path: "work-order",
        name: "operation_maintenance_work_order",
        component: () => import("./pages/maintenance/WorkOrder.vue"),
        meta: { title: "Work Order", description: "Manage work orders." },
      },
      {
        path: "workshop",
        name: "operation_maintenance_workshop",
        component: () => import("./pages/maintenance/Workshop.vue"),
        meta: { title: "Workshop", description: "Manage workshops." },
      },
      {
        path: "issue-report",
        name: "operation_maintenance_issue_report",
        component: () => import("./pages/maintenance/IssueReport.vue"),
        meta: { title: "Issue Report", description: "Manage issue reports." },
      },
      {
        path: "tyre-handoffs",
        name: "operation_maintenance_tyre_handoffs",
        component: () => import("./pages/maintenance/TyreHandoffs.vue"),
        meta: { title: "Tyre Handoffs", description: "Manage tyre handoffs." },
      },
    ],
  },
  {
    path: "finance",
    name: "operation_finance",
    component: RouterView,
    redirect: "/finance/payable",
    children: [
      {
        path: "payable",
        name: "operation_finance_payable",
        component: () => import("./pages/finance/Payable.vue"),
        meta: { title: "Payable", description: "Manage payables." },
      },
      {
        path: "receivable",
        name: "operation_finance_receivable",
        component: () => import("./pages/finance/Receivable.vue"),
        meta: { title: "Receivable", description: "Manage receivables." },
      },
      {
        path: "invoice-report",
        name: "operation_finance_invoice_report",
        component: () => import("./pages/finance/InvoiceReport.vue"),
        meta: { title: "Invoice Report", description: "View invoice reports." },
      },
      {
        path: "payment-collection",
        name: "operation_finance_payment_collection",
        component: () => import("./pages/finance/PaymentCollection.vue"),
        meta: { title: "Payment Collection", description: "Manage payment collections." },
      },
      {
        path: "expense",
        name: "operation_finance_expense",
        component: () => import("./pages/finance/Expense.vue"),
        meta: { title: "Expense", description: "Manage expenses." },
      },
      {
        path: "paid-sub-contracts",
        name: "operation_finance_paid_sub_contracts",
        component: () => import("./pages/finance/PaidSubContracts.vue"),
        meta: { title: "Paid Sub-Contracts", description: "Manage paid sub-contracts." },
      },
      {
        path: "expense-types",
        name: "operation_finance_expense_types",
        component: () => import("./pages/finance/ExpenseTypes.vue"),
        meta: { title: "Expense Types", description: "Manage expense types." },
      },
      {
        path: "fuel-transactions",
        name: "operation_finance_fuel_transactions",
        component: () => import("./pages/finance/FuelTransactions.vue"),
        meta: { title: "Fuel Transactions", description: "Manage fuel transactions." },
      },
      {
        path: "driver-bonuses",
        name: "operation_finance_driver_bonuses",
        component: () => import("./pages/finance/DriverBonuses.vue"),
        meta: { title: "Driver Bonuses", description: "Manage driver bonuses." },
      },
    ],
  },
  {
    path: "drivers",
    name: "operation_drivers",
    component: () => import("./pages/Drivers.vue"),
    meta: {
      title: "Drivers",
      description: "Manage driver profiles, assignments and performance.",
    },
  },
  {
    path: "inventory",
    name: "operation_inventory",
    component: RouterView,
    redirect: "/inventory/categories",
    children: [
      {
        path: "categories",
        name: "operation_inventory_categories",
        component: () => import("./pages/Inventory/Categories.vue"),
        meta: { title: "Categories", description: "Manage inventory categories." },
      },
      {
        path: "item-groups",
        name: "operation_inventory_item_groups",
        component: () => import("./pages/Inventory/ItemGroups.vue"),
        meta: { title: "Item Groups", description: "Manage inventory item groups." },
      },
      {
        path: "vendor",
        name: "operation_inventory_vendor",
        component: () => import("./pages/Inventory/Vendor.vue"),
        meta: { title: "Vendor", description: "Manage inventory vendors." },
      },
      {
        path: "items",
        name: "operation_inventory_items",
        component: () => import("./pages/Inventory/Items.vue"),
        meta: { title: "Items", description: "Manage inventory items." },
      },
      {
        path: "store-requisition",
        name: "operation_inventory_store_requisition",
        component: () => import("./pages/Inventory/StoreRequisition.vue"),
        meta: { title: "Store Requisition", description: "Manage store requisition vouchers." },
      },
      {
        path: "purchase-requisition",
        name: "operation_inventory_purchase_requisition",
        component: () => import("./pages/Inventory/PurchaseRequisition.vue"),
        meta: { title: "Purchase Requisition", description: "Manage purchase requisition requests." },
      },
      {
        path: "purchase-order",
        name: "operation_inventory_purchase_order",
        component: () => import("./pages/Inventory/PurchaseOrder.vue"),
        meta: { title: "Purchase Order", description: "Manage inventory purchase orders." },
      },
      {
        path: "good-transfer",
        name: "operation_inventory_good_transfer",
        component: () => import("./pages/Inventory/GoodTransfer.vue"),
        meta: { title: "Issue / Receive", description: "Track good transfers, issues and receipts." },
      },
    ],
  },
  {
    path: "setting",
    name: "operation_setting",
    component: RouterView,
    redirect: "/setting/user-and-role",
    children: [
      {
        path: "user-and-role",
        name: "operation_setting_user_and_role",
        component: () => import("./pages/setting/UserAndRole.vue"),
        meta: { title: "User and Role", description: "Manage users, roles and permissions." },
      },
      {
        path: "base-configuration",
        name: "operation_setting_base_configuration",
        component: () => import("./pages/setting/BaseConfiguration.vue"),
        meta: { title: "Base Configuration", description: "Configure core system settings." },
      },
      {
        path: "contract",
        name: "operation_setting_contract",
        component: () => import("./pages/setting/Contract.vue"),
        meta: { title: "Contract", description: "Manage business contracts." },
      },
      {
        path: "commodity",
        name: "operation_setting_commodity",
        component: () => import("./pages/setting/Commodity.vue"),
        meta: { title: "Commodity", description: "Manage commodities." },
      },
      {
        path: "packaging",
        name: "operation_setting_packaging",
        component: () => import("./pages/setting/Packaging.vue"),
        meta: { title: "Packaging", description: "Manage packaging types." },
      },
      {
        path: "route-requests",
        name: "operation_setting_route_requests",
        component: () => import("./pages/setting/RouteRequests.vue"),
        meta: { title: "Route Requests", description: "Manage route requests." },
      },
      {
        path: "region",
        name: "operation_setting_region",
        component: () => import("./pages/setting/Region.vue"),
        meta: { title: "Region", description: "Manage regions." },
      },
      {
        path: "bonus-multipliers",
        name: "operation_setting_bonus_multipliers",
        component: () => import("./pages/setting/BonusMultipliers.vue"),
        meta: { title: "Bonus Multipliers", description: "Manage bonus multipliers." },
      },
      {
        path: "bonus-routes",
        name: "operation_setting_bonus_routes",
        component: () => import("./pages/setting/BonusRoutes.vue"),
        meta: { title: "Bonus Routes", description: "Manage bonus routes." },
      },
      {
        path: "announcements",
        name: "operation_setting_announcements",
        component: () => import("./pages/setting/Announcements.vue"),
        meta: { title: "Announcements", description: "Manage system announcements." },
      },
    ],
  },
  {
    path: "reports",
    name: "operation_reports",
    component: () => import("./pages/Reports.vue"),
    meta: {
      title: "Reports",
      description: "Comprehensive operational and financial reports.",
    },
  },
];
