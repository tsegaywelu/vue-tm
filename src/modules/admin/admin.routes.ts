import type { RouteRecordRaw } from "vue-router";
import { RouterView } from "vue-router";

export const admin_routes: RouteRecordRaw[] = [
  {
    path: "/admin",
    component: RouterView,
    redirect: "/admin/dashboard",
    children: [
      {
        path: "dashboard",
        name: "admin_dashboard",
        component: () => import("./pages/Dashboard.vue"),
        meta: {
          title: "Dashboard",
          description: "Super Admin overview.",
        },
      },
      {
        path: "shippers",
        name: "admin_shippers",
        component: () => import("./pages/Shippers.vue"),
        meta: {
          title: "Shippers",
          description: "Manage all shippers on the platform.",
        },
      },
      {
        path: "shippers/add",
        name: "admin_shippers_add",
        component: () => import("./pages/AddShipper.vue"),
        meta: {
          title: "Add Shipper",
          description: "Register a new shipper on the platform.",
        },
      },
      {
        path: "shippers/edit/:id",
        name: "admin_shippers_edit",
        component: () => import("./pages/EditShipper.vue"),
        meta: {
          title: "Edit Shipper",
          description: "Update shipper information.",
        },
      },
      {
        path: "shipper-admins",
        name: "admin_shipper_admins",
        component: () => import("./pages/ShipperAdmins.vue"),
        meta: {
          title: "Shipper Admins",
          description: "All shipper admin users.",
        },
      },
      {
        path: "carriers",
        name: "admin_carriers",
        component: () => import("./pages/Carriers.vue"),
        meta: {
          title: "Carriers",
          description: "Manage all carriers on the platform.",
        },
      },
      {
        path: "carriers/add",
        name: "admin_carriers_add",
        component: () => import("./pages/AddCarrier.vue"),
        meta: {
          title: "Add Carrier",
          description: "Register a new carrier on the platform.",
        },
      },
      {
        path: "carriers/edit/:id",
        name: "admin_carriers_edit",
        component: () => import("./pages/EditCarrier.vue"),
        meta: {
          title: "Edit Carrier",
          description: "Update carrier information.",
        },
      },
      {
        path: "carrier-admins",
        name: "admin_carrier_admins",
        component: () => import("./pages/CarrierAdmins.vue"),
        meta: {
          title: "Carrier Admins",
          description: "All carrier admin users.",
        },
      },
      {
        path: "cities",
        name: "admin_cities",
        component: () => import("./pages/City.vue"),
        meta: {
          title: "Cities",
          description: "Manage cities on the platform.",
        },
      },
      {
        path: "gps-providers",
        name: "admin_gps_providers",
        component: () => import("./pages/Provider.vue"),
        meta: {
          title: "GPS Providers",
          description: "Manage GPS tracking providers.",
        },
      },
    ],
  },
];
