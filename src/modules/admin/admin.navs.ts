import type { Navs } from "@/types/navigation";

export const admin_core_navs: Navs[] = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: "dashboard",
    show: true,
  },
  {
    name: "Cities",
    path: "/admin/cities",
    icon: "city",
    show: true,
  },
  {
    name: "GPS Providers",
    path: "/admin/gps-providers",
    icon: "GPSIcon",
    show: true,
  },
];

export const admin_shipper_navs: Navs[] = [
  {
    name: "Shipper",
    icon: "customers",
    show: true,
    children: [
      {
        name: "Shippers",
        path: "/admin/shippers",
        show: true,
        children: [
          { name: "Add Shipper", path: "/admin/shippers/add", show: false },
          { name: "Edit Shipper", path: "/admin/shippers/edit/$id", show: false },
        ],
      },
      {
        name: "Shipper Admins",
        path: "/admin/shipper-admins",
        show: true,
      },
    ],
  },
];

export const admin_carrier_navs: Navs[] = [
  {
    name: "Carrier",
    icon: "trasporter",
    show: true,
    children: [
      {
        name: "Carriers",
        path: "/admin/carriers",
        show: true,
        children: [
          { name: "Add Carrier", path: "/admin/carriers/add", show: false },
          { name: "Edit Carrier", path: "/admin/carriers/edit/$id", show: false },
        ],
      },
      {
        name: "Carrier Admins",
        path: "/admin/carrier-admins",
        show: true,
      },
    ],
  },
];
