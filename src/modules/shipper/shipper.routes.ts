import type { RouteRecordRaw } from "vue-router";
import { RouterView } from "vue-router";

export const shipper_routes: RouteRecordRaw[] = [
  {
    path: "/shipper",
    name: "shipper_parent",
    component: RouterView,
    redirect: "/shipper/dashboard",
    children: [
      {
        path: "dashboard",
        name: "shipper_dashboard",
        component: () => import("./pages/ShipperDashboard.vue"),
        meta: {
          title: "Dashboard",
          description: "Shipper dashboard overview.",
        },
      },
      // ── Shipments ──
      {
        path: "shipments",
        name: "shipper_shipments",
        component: () => import("../operation/pages/Shipments.vue"),
        meta: {
          permission: "SHIPMENT",
          title: "Shipments",
          description: "View and track all your shipments.",
        },
      },
      {
        path: "shipments/add",
        name: "shipper_shipment_add",
        component: () => import("../operation/pages/AddShipment.vue"),
        meta: {
          permission: "SHIPMENT",
          title: "Add Shipment",
          description: "Create a new shipment.",
        },
      },
      {
        path: "shipments/edit/:id",
        name: "shipper_shipment_edit",
        component: () => import("../operation/pages/EditShipment.vue"),
        meta: {
          permission: "SHIPMENT",
          title: "Edit Shipment",
          description: "Modify shipment details.",
        },
      },
      {
        path: "shipments/:id",
        name: "shipper_shipment_details",
        component: () => import("./pages/ShipperShipmentDetails.vue"),
        meta: {
          permission: "SHIPMENT",
          title: "Shipment Details",
          description: "Detailed breakdown and history of a specific shipment.",
          tabsTeleportTo: "#shipment-details-tabs",
          tabs: [
            { label: "Overview", value: "overview" },
            { label: "Uploads", value: "uploads" },
            // { label: "Empty Return", value: "emptyReturn" },
          ],
        },
      },
      // ── Orders ──
      {
        path: "orders",
        name: "shipper_orders",
        component: () => import("../operation/pages/Orders.vue"),
        meta: {
          permission: "ORDER",
          title: "Orders",
          description: "Manage your transportation orders.",
        },
      },
      {
        path: "orders/add",
        name: "ShipperAddOrder",
        component: () => import("./pages/ShipperAddOrder.vue"),
        meta: {
          title: "Add Order",
          description: "Create a new transport order.",
        },
      },
      {
        path: "orders/edit/:id",
        name: "ShipperEditOrder",
        component: () => import("./pages/ShipperEditOrder.vue"),
        meta: {
          title: "Edit Order",
          description: "Modify an existing order.",
        },
      },
      {
        path: "orders/:id",
        name: "shipper_order_details",
        component: () => import("./pages/ShipperOrderDetails.vue"),
        meta: {
          permission: "ORDER",
          title: "Order Details",
          description: "View order details.",
          tabsTeleportTo: "#order-details-tabs",
          tabs: [{ label: "Overview", value: "overview" }],
        },
      },
      // ── Routes ──
      {
        path: "routes",
        name: "shipper_routes",
        component: () => import("./pages/ShipperRoutes.vue"),
        meta: {
          permission: "ROUTE",
          title: "Routes",
          description: "View available routes.",
        },
      },
      {
        path: "routes/add",
        name: "shipper_route_add",
        component: () => import("./pages/ShipperAddRoute.vue"),
        meta: {
          permission: "ROUTE",
          title: "Add Route",
          description: "Create a new route request.",
        },
      },
      {
        path: "routes/edit/:id",
        name: "shipper_route_edit",
        component: () => import("./pages/ShipperEditRoute.vue"),
        meta: {
          permission: "ROUTE",
          title: "Edit Route",
          description: "Modify an existing route request.",
        },
      },
      {
        path: "routes/:id",
        name: "shipper_route_details",
        component: () => import("./pages/ShipperRouteDetails.vue"),
        meta: {
          permission: "ROUTE",
          title: "Route Details",
          description: "Detailed breakdown of a specific route request.",
        },
      },
      // ── Carriers ──
      {
        path: "carriers",
        name: "shipper_carriers",
        component: () => import("./pages/ShipperCarriers.vue"),
        meta: {
          permission: "CARRIER",
          title: "Carriers",
          description: "View contracted carriers.",
        },
      },
      // ── Agents ──
      {
        path: "agents",
        name: "shipper_agents",
        component: () => import("./pages/ShipperAgents.vue"),
        meta: {
          permission: "AGENT",
          title: "Agents",
          description: "Manage your agents.",
        },
      },
      {
        path: "agents/add",
        name: "shipper_agent_add",
        component: () => import("./pages/ShipperAddAgent.vue"),
        meta: {
          permission: "AGENT",
          title: "Add Agent",
          description: "Create a new agent.",
        },
      },
      {
        path: "agents/edit/:id",
        name: "shipper_agent_edit",
        component: () => import("./pages/ShipperEditAgent.vue"),
        meta: {
          permission: "AGENT",
          title: "Edit Agent",
          description: "Modify an existing agent.",
        },
      },
      {
        path: "facilities",
        name: "shipper_facilities",
        component: () => import("./pages/ShipperFacilities.vue"),
        meta: {
          permission: "FACILITY",
          title: "Facilities",
          description: "Manage your facilities.",
        },
      },
      // ── Contacts ──
      {
        path: "contacts",
        name: "shipper_contacts",
        component: () => import("./pages/ShipperContacts.vue"),
        meta: {
          title: "Contacts",
          description: "View and manage contacts.",
        },
      },
      // ── Finance / Invoices ──
      {
        path: "invoices",
        name: "shipper_invoices",
        component: () => import("./pages/ShipperInvoices.vue"),
        meta: {
          title: "Invoices",
          description: "Manage invoice payments and collections.",
        },
      },
      // ── Contracts ──
      {
        path: "contracts",
        name: "shipper_contracts",
        component: () => import("./pages/ShipperContracts.vue"),
        meta: {
          permission: "CONTRACT",
          title: "Contracts",
          description: "View and manage contracts.",
        },
      },
      {
        path: "contracts/add",
        name: "shipper_contract_add",
        component: () => import("./pages/ShipperContractAdd.vue"),
        meta: {
          permission: "CONTRACT",
          title: "Add Contract",
          description: "Create a new contract.",
        },
      },
      {
        path: "contracts/:id",
        name: "shipper_contract_details",
        component: () => import("./pages/ShipperContractDetail.vue"),
        meta: {
          permission: "CONTRACT",
          title: "Contract Details",
          description: "View contract details.",
          tabsTeleportTo: "#contract-details-tabs",
          tabs: [{ label: "Overview", value: "overview" }],
        },
      },
      // ── Settings ──
      {
        path: "setting/commodities",
        name: "shipper_setting_commodities",
        component: () => import("./pages/setting/ShipperCommodities.vue"),
        meta: {
          title: "Commodities",
          description: "Manage commodities.",
        },
      },
      {
        path: "setting/commodities/add",
        name: "shipper_setting_commodity_add",
        component: () => import("./pages/setting/ShipperCommodityAdd.vue"),
        meta: {
          title: "Add Commodity",
          description: "Create a new commodity.",
        },
      },
      {
        path: "setting/commodities/edit/:id",
        name: "shipper_setting_commodity_edit",
        component: () => import("./pages/setting/ShipperCommodityEdit.vue"),
        meta: {
          title: "Edit Commodity",
          description: "Modify an existing commodity.",
        },
      },
      {
        path: "setting/packaging",
        name: "shipper_setting_packaging",
        component: () => import("./pages/setting/ShipperPackaging.vue"),
        meta: {
          title: "Packaging",
          description: "Manage packaging types.",
        },
      },
      {
        path: "setting/packaging/add",
        name: "shipper_setting_packaging_add",
        component: () => import("./pages/setting/ShipperPackagingAdd.vue"),
        meta: {
          title: "Add Packaging",
          description: "Create a new packaging type.",
        },
      },
      {
        path: "setting/packaging/edit/:id",
        name: "shipper_setting_packaging_edit",
        component: () => import("./pages/setting/ShipperPackagingEdit.vue"),
        meta: {
          title: "Edit Packaging",
          description: "Modify an existing packaging type.",
        },
      },
      {
        path: "setting/announcements",
        name: "shipper_setting_announcements",
        component: () => import("./pages/setting/ShipperAnnouncements.vue"),
        meta: {
          title: "Announcements",
          description: "View and manage announcements.",
        },
      },
      {
        path: "setting/announcements/add",
        name: "shipper_setting_announcement_add",
        component: () => import("./pages/setting/ShipperAnnouncementAdd.vue"),
        meta: {
          title: "Add Announcement",
          description: "Create a new announcement.",
        },
      },
      {
        path: "setting/announcements/edit/:id",
        name: "shipper_setting_announcement_edit",
        component: () => import("./pages/setting/ShipperAnnouncementEdit.vue"),
        meta: {
          title: "Edit Announcement",
          description: "Modify an existing announcement.",
        },
      },
      {
        path: "setting/invoice-templates",
        name: "shipper_setting_invoice_templates",
        component: () => import("./pages/setting/ShipperInvoiceTemplates.vue"),
        meta: {
          title: "Invoice Templates",
          description: "Configure Excel invoice export templates.",
        },
      },
      {
        path: "setting/invoice-templates/new",
        name: "shipper_setting_invoice_template_new",
        component: () => import("./pages/setting/ShipperInvoiceTemplateEdit.vue"),
        meta: {
          title: "New Invoice Template",
          description: "Create a new invoice export template.",
        },
      },
      {
        path: "setting/invoice-templates/:id",
        name: "shipper_setting_invoice_template_edit",
        component: () => import("./pages/setting/ShipperInvoiceTemplateEdit.vue"),
        meta: {
          title: "Edit Invoice Template",
          description: "Modify an invoice export template.",
        },
      },
      // ── User Management ──
      {
        path: "users",
        name: "shipper_users",
        component: () => import("./pages/ShipperUserManagement.vue"),
        meta: {
          title: "User Management",
          description: "Manage shipper users and roles.",
          tabs: [
            { label: "Users", value: "users" },
            { label: "Roles", value: "roles" },
          ],
        },
      },
      {
        path: "users/role/add",
        name: "shipper_role_add",
        component: () => import("./pages/setting/ShipperRoleAdd.vue"),
        meta: {
          title: "Add Role",
          description: "Create a new role with specific permissions.",
        },
      },
      {
        path: "users/role/edit/:id",
        name: "shipper_role_edit",
        component: () => import("./pages/setting/ShipperRoleEdit.vue"),
        meta: {
          title: "Edit Role",
          description: "Modify an existing role.",
        },
      },
    ],
  },
];
