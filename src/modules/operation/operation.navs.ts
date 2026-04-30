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
        name: "Inspection",
        path: "/maintenance/inspection",
        show: true,
      },
      {
        name: "Service Record",
        path: "/maintenance/service-record",
        show: true,
      },
      {
        name: "Service Reminder",
        path: "/maintenance/service-reminder",
        show: true,
      },
      {
        name: "Service Task",
        path: "/maintenance/service-task",
        show: true,
      },
      {
        name: "Service Type",
        path: "/maintenance/service-type",
        show: true,
      },
      {
        name: "Work Order",
        path: "/maintenance/work-order",
        show: true,
      },
      {
        name: "Workshop",
        path: "/maintenance/workshop",
        show: true,
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
