import type { RouteRecordRaw } from "vue-router";

export const operation_routes: RouteRecordRaw[] = [
  {
    path: "/operation",
    name: "operation_parent",
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
          description:
            "Track and manage shipment adjustments and corrections.",
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
        },
      },
      {
        path: "settlements",
        name: "operation_settlements",
        component: () => import("./pages/Settlements.vue"),
        meta: {
          title: "Settlements",
          description:
            "View settled and paid advance payment records.",
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
    path: "maintenance",
    name: "operation_maintenance",
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
        meta: { title: "Inspection", description: "Manage vehicle inspections." },
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
        meta: { title: "Service Reminder", description: "Manage service reminders." },
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
    path: "drivers",
    name: "operation_drivers",
    component: () => import("./pages/Drivers.vue"),
    meta: {
      title: "Drivers",
      description: "Manage driver profiles, assignments and performance.",
    },
  },
  {
    path: "vehicles",
    name: "operation_vehicles",
    component: () => import("./pages/Vehicles.vue"),
    meta: {
      title: "Vehicles",
      description: "Manage your fleet vehicles, trailers and assignments.",
    },
  },
];
