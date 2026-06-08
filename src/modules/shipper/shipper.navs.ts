import type { Navs } from "@/types/navigation";

export const shipper_core_navs: Navs[] = [
  {
    name: "Dashboard",
    path: "/shipper/dashboard",
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
        path: "/shipper/shipments",
        show: true,
        children: [
          {
            path: "/shipper/shipments/$id",
            name: "Shipment Details",
            show: false,
          },
        ],
      },
      {
        name: "Orders",
        path: "/shipper/orders",
        show: true,
        children: [
          {
            path: "/shipper/orders/add",
            name: "Create Order",
            show: false,
          },
          {
            path: "/shipper/orders/$id",
            name: "Order Details",
            show: false,
          },
          {
            path: "/shipper/orders/edit/$id",
            name: "Edit Order",
            show: false,
          },
        ],
      },
      {
        name: "Routes",
        path: "/shipper/routes",
        show: true,
        children: [
          {
            path: "/shipper/routes/add",
            name: "Create Route",
            show: false,
          },
          {
            path: "/shipper/routes/$id",
            name: "Route Details",
            show: false,
          },
          {
            path: "/shipper/routes/edit/$id",
            name: "Edit Route",
            show: false,
          },
        ],
      },
    ],
  },
];

export const shipper_stakeholders_navs: Navs[] = [
  {
    name: "Carriers",
    icon: "trasporter",
    path: "/shipper/carriers",
    show: true,
  },
  {
    name: "Agents",
    icon: "customers",
    path: "/shipper/agents",
    show: true,
    children: [
      {
        path: "/shipper/agents/add",
        name: "Add Agent",
        show: false,
      },
      {
        path: "/shipper/agents/edit/$id",
        name: "Edit Agent",
        show: false,
      },
    ],
  },
  {
    name: "Facilities",
    icon: "inventory",
    path: "/shipper/facilities",
    show: true,
    children: [
      {
        path: "/shipper/facilities/add",
        name: "Add Facility",
        show: false,
      },
      {
        path: "/shipper/facilities/edit/$id",
        name: "Edit Facility",
        show: false,
      },
    ],
  },
];

export const shipper_finance_navs: Navs[] = [
  {
    name: "Finance",
    icon: "finance",
    show: true,
    children: [
      {
        name: "Invoices",
        path: "/shipper/invoices",
        show: true,
      },
    ],
  },
];

export const shipper_settings_navs: Navs[] = [
  {
    name: "Settings",
    icon: "settings",
    show: true,
    children: [
      {
        name: "Commodities",
        path: "/shipper/setting/commodities",
        show: true,
        children: [
          {
            path: "/shipper/setting/commodities/add",
            name: "Add Commodity",
            show: false,
          },
          {
            path: "/shipper/setting/commodities/edit/$id",
            name: "Edit Commodity",
            show: false,
          },
        ],
      },
      {
        name: "Packaging",
        path: "/shipper/setting/packaging",
        show: true,
        children: [
          {
            path: "/shipper/setting/packaging/add",
            name: "Add Packaging",
            show: false,
          },
          {
            path: "/shipper/setting/packaging/edit/$id",
            name: "Edit Packaging",
            show: false,
          },
        ],
      },
      {
        name: "Announcements",
        path: "/shipper/setting/announcements",
        show: true,
        children: [
          {
            path: "/shipper/setting/announcements/add",
            name: "Add Announcement",
            show: false,
          },
          {
            path: "/shipper/setting/announcements/edit/$id",
            name: "Edit Announcement",
            show: false,
          },
        ],
      },
      {
        name: "Invoice Templates",
        path: "/shipper/setting/invoice-templates",
        show: true,
        children: [
          {
            name: "New Invoice Template",
            path: "/shipper/setting/invoice-templates/new",
            show: false,
          },
          {
            name: "Edit Invoice Template",
            path: "/shipper/setting/invoice-templates/:id",
            show: false,
          },
        ],
      },
      {
        name: "Contracts",
        path: "/shipper/contracts",
        show: true,
        children: [
          {
            path: "/shipper/contracts/$id",
            name: "Contract Details",
            show: false,
          },
        ],
      },
      {
        name: "City Shipper Codes",
        path: "/shipper/setting/city-shipper-codes",
        show: true,
      },
      {
        name: "User Management",
        path: "/shipper/users",
        show: true,
        children: [
          {
            path: "/shipper/users/add",
            name: "Add User",
            show: false,
          },
          {
            path: "/shipper/users/edit/$id",
            name: "Edit User",
            show: false,
          },
        ],
      },
    ],
  },
];
