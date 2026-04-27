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
    path: "tyres",
    name: "operation_tyres",
    component: () => import("./pages/Tyres.vue"),
    meta: {
      title: "Tyres",
      description: "Monitor tyre inventory, usage and replacement schedules.",
    },
  },
  {
    path: "maintenance",
    name: "operation_maintenance",
    component: () => import("./pages/Maintenance.vue"),
    meta: {
      title: "Maintenance",
      description:
        "Schedule and track vehicle maintenance and service records.",
    },
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
