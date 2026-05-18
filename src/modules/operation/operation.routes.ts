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
          permission: "REPORT",
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
          permission: [
            { subject: "ADVANCE_PAYMENT", actions: ["approve"] },
            { subject: "TRANSACTION", actions: ["approve"] },
            { subject: "PRE_PAYMENT", actions: ["approve"] },
          ],
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
          permission: "SHIPMENT",
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
          permission: "SHIPMENT",
          title: "Add Shipment",
          description:
            "Create a new shipment by assigning an order to a vehicle.",
        },
      },
      {
        path: "shipments/add-from-order/:orderId",
        name: "operation_shipments_add_from_order",
        component: () => import("./pages/AddShipmentFromOrder.vue"),
        meta: {
          permission: "SHIPMENT",
          title: "Create Shipment from Order",
          description: "Create a new shipment with order details pre-filled.",
        },
      },
      {
        path: "shipments/edit/:id",
        name: "operation_shipments_edit",
        component: () => import("./pages/EditShipment.vue"),
        meta: {
          permission: "SHIPMENT",
          title: "Edit Shipment",
          description: "Update existing shipment details.",
        },
      },
      {
        path: "shipments/:id",
        name: "operation_shipment_details",
        component: () => import("./pages/ShipmentDetails.vue"),
        meta: {
          permission: "SHIPMENT",
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
          permission: "SHIPMENT",
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
          permission: "SHIPMENT",
          title: "Shipment Adjustment",
          description: "Track and manage shipment adjustments and corrections.",
        },
      },
      {
        path: "orders",
        name: "operation_orders",
        component: () => import("./pages/Orders.vue"),
        meta: {
          permission: "ORDER",
          title: "Orders",
          description:
            "View and manage freight orders from shippers and carriers.",
        },
      },
      {
        path: "orders/add",
        name: "operation_orders_add",
        component: () => import("./pages/AddOrder.vue"),
        meta: {
          permission: "ORDER",
          title: "Add Order",
          description: "Create a new freight order.",
        },
      },
      {
        path: "orders/edit/:id",
        name: "operation_orders_edit",
        component: () => import("./pages/EditOrder.vue"),
        meta: {
          permission: "ORDER",
          title: "Edit Order",
          description: "Update an existing freight order.",
        },
      },
      {
        path: "orders/:id",
        name: "operation_order_details",
        component: () => import("./pages/OrderDetails.vue"),
        meta: {
          permission: "ORDER",
          title: "Order Details",
          description: "Detailed view of the freight order.",
          tabsTeleportTo: "#order-details-tabs",
          tabs: [
            {
              label: "Overview",
              value: "overview",
            },
          ],
        },
      },
      {
        path: "routes",
        name: "operation_routes",
        component: () => import("./pages/Routes.vue"),
        meta: {
          permission: "ROUTE",
          title: "Routes",
          description:
            "Manage transportation routes, origins, destinations and waypoints.",
        },
      },
      {
        path: "routes/add",
        name: "operation_routes_add",
        component: () => import("./pages/AddRoute.vue"),
        meta: {
          permission: "ROUTE",
          title: "Create Route",
          description: "Add a new transportation route.",
        },
      },
      {
        path: "routes/edit/:id",
        name: "operation_routes_edit",
        component: () => import("./pages/EditRoute.vue"),
        meta: {
          permission: "ROUTE",
          title: "Edit Route",
          description: "Modify an existing transportation route.",
        },
      },
      {
        path: "routes/:id",
        name: "operation_routes_details",
        component: () => import("./pages/RouteDetails.vue"),
        meta: {
          permission: "ROUTE",
          title: "Route Details",
          description: "View details and waypoints of a route.",
        },
      },
      {
        path: "advances",
        name: "operation_advances",
        component: () => import("./pages/Advances.vue"),
        meta: {
          permission: "ADVANCE_PAYMENT",
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
          permission: "TRANSACTION",
          title: "Settlements",
          description: "View settled and paid advance payment records.",
        },
      },
      {
        path: "advance-details/:id",
        name: "operation_advance_details",
        component: () => import("./pages/AdvanceDetails.vue"),
        meta: {
          permission: "ADVANCE_PAYMENT",
          title: "Advance Details",
          description: "Detailed view of an advance and its transactions.",
          tabs: [
            { label: "Advances", value: "advances" },
            { label: "Settlements", value: "settlements" },
          ],
        },
      },
      {
        path: "aggregated-advances",
        name: "operation_aggregated_advances",
        component: () => import("./pages/AggregatedAdvances.vue"),
        meta: {
          permission: "ADVANCE_PAYMENT",
          title: "Aggregated Advances",
          description:
            "Review aggregated and consolidated advance payment summaries.",
        },
      },
      {
        path: "advance-summary",
        name: "operation_advance_summary",
        component: () => import("./pages/AdvanceSummary.vue"),
        meta: {
          permission: "ADVANCE_PAYMENT",
          title: "Advance Summary",
          description: "View and manage consolidated advance payment records.",
        },
      },
      {
        path: "prepayment-summary",
        name: "operation_prepayment_summary",
        component: () => import("./pages/PrePaymentSummary.vue"),
        meta: {
          permission: "PRE_PAYMENT",
          title: "Pre-Payment Summary",
          description: "View and manage consolidated pre-payment records.",
        },
      },
    ],
  },
  {
    path: "customers",
    name: "operation_customers",
    component: () => import("./pages/Customers.vue"),
    meta: {
      permission: "SHIPPER",
      title: "Customers",
      description: "Manage customer accounts and relationships.",
    },
  },
  {
    path: "customers/:id",
    name: "operation_customer_details",
    component: () => import("./pages/CustomerDetails.vue"),
    meta: {
      permission: "SHIPPER",
      title: "Customer Details",
      description: "Detailed view of the customer profile.",
      tabs: [
        { label: "Basic Information", value: "basic" },
        { label: "Facility", value: "facility" },
        { label: "Contact", value: "contact" },
        { label: "Agent", value: "agent" },
        { label: "Order", value: "order" },
        { label: "Shipment", value: "shipment" },
      ],
    },
  },
  {
    path: "facilities",
    name: "operation_facilities",
    component: () => import("./pages/Facilities.vue"),
    meta: {
      permission: "FACILITY",
      title: "Facilities",
      description: "Manage facilities for carriers and shippers.",
    },
  },
  {
    path: "agents",
    name: "operation_agents",
    component: () => import("./pages/Agents.vue"),
    meta: {
      permission: "AGENT",
      title: "Agents",
      description: "Manage agent profiles and locations.",
    },
  },
  {
    path: "agents/add",
    name: "operation_agents_add",
    component: () => import("./pages/AddAgent.vue"),
    meta: {
      permission: "AGENT",
      title: "Add Agent",
      description: "Create a new agent profile.",
    },
  },
  {
    path: "agents/edit/:id",
    name: "operation_agents_edit",
    component: () => import("./pages/EditAgent.vue"),
    meta: {
      permission: "AGENT",
      title: "Edit Agent",
      description: "Update an existing agent profile.",
    },
  },
  {
    path: "contacts",
    name: "operation_contacts",
    component: () => import("./pages/Contacts.vue"),
    meta: {
      permission: "CONTACT",
      title: "Contacts",
      description: "Manage contact information for partners and stakeholders.",
    },
  },
  {
    path: "contacts/:id",
    name: "operation_contact_details",
    component: () => import("./pages/ContactDetails.vue"),
    meta: {
      permission: "CONTACT",
      title: "Contact Details",
      description: "Detailed view of the contact profile.",
    },
  },
  {
    path: "transporters",
    name: "operation_transporters",
    component: () => import("./pages/Transporters.vue"),
    meta: {
      permission: "TRANSPORTER",
      title: "Transporters",
      description: "Manage transporter profiles and fleet partnerships.",
    },
  },
  {
    path: "transporters/:id",
    name: "operation_transporter_details",
    component: () => import("./pages/TransporterDetails.vue"),
    meta: {
      permission: "TRANSPORTER",
      title: "Transporter Details",
      description: "Detailed view of the transporter profile.",
    },
  },
  {
    path: "vehicles",
    name: "operation_vehicles",
    component: () => import("./pages/Vehicles.vue"),
    meta: {
      permission: "VEHICLE",
      title: "Vehicles",
      description: "Manage fleet vehicles, tracking and registration.",
    },
  },
  {
    path: "vehicles/add",
    name: "operation_vehicles_add",
    component: () => import("./pages/AddVehicle.vue"),
    meta: {
      permission: "VEHICLE",
      title: "Add Vehicle",
      description: "Register a new vehicle to the fleet.",
    },
  },
  {
    path: "vehicles/edit/:id",
    name: "operation_vehicles_edit",
    component: () => import("./pages/EditVehicle.vue"),
    meta: {
      permission: "VEHICLE",
      title: "Edit Vehicle",
      description: "Update existing vehicle details and specifications.",
    },
  },
  {
    path: "vehicles/:id",
    name: "operation_vehicle_details",
    component: () => import("./pages/VehicleDetails.vue"),
    meta: {
      permission: "VEHICLE",
      title: "Vehicle Details",
      description: "Comprehensive view of vehicle history and specifications.",
      tabs: [
        { label: "Basic Details", value: "basic" },
        { label: "Documents Uploaded", value: "documents" },
        { label: "Shipments Completed", value: "shipments" },
        { label: "Insurance History", value: "insurance" },
        { label: "Fuel History", value: "fuel" },
        { label: "Driver History", value: "drivers" },
        { label: "Tyre History", value: "tyres" },
      ],
    },
  },
  {
    path: "vehicles/metrics",
    name: "operation_vehicle_metrics",
    component: () => import("./pages/VehicleMetrics.vue"),
    meta: {
      permission: "REPORT",
      title: "Vehicle Metrics",
      description: "Global monitoring of vehicle performance and KPIs.",
      tabs: [
        { label: "Vehicle Metrics", value: "metrics" },
        { label: "Financial KPIs", value: "financial" },
        { label: "Productivity KPIs", value: "productivity" },
        { label: "Goal Achievement", value: "goal-achievement" },
      ],
    },
  },
  {
    path: "vehicles/leased",
    name: "operation_leased_vehicles",
    component: () => import("./pages/LeasedVehicles.vue"),
    meta: {
      permission: "VEHICLE_LEASE_AGREEMENT",
      title: "Leased Vehicles",
      description: "Manage leased vehicles in the fleet.",
    },
  },
  {
    path: "vehicles/types",
    name: "operation_vehicle_types",
    component: () => import("./pages/VehicleTypes.vue"),
    meta: {
      permission: "VEHICLE_TYPE",
      title: "Vehicle Types",
      description: "Manage vehicle types and specifications.",
    },
  },
  {
    path: "vehicles/goals",
    name: "operation_vehicle_goals",
    component: () => import("./pages/VehicleTypeGoals.vue"),
    meta: {
      permission: "VEHICLE",
      title: "Vehicle Type Goals",
      description: "Track performance goals for vehicle types.",
    },
  },
  {
    path: "vehicles/groups",
    name: "operation_vehicle_groups",
    component: () => import("./pages/VehicleGroups.vue"),
    meta: {
      permission: "GROUP",
      title: "Vehicle Groups",
      description: "Manage vehicle group classifications.",
    },
  },
  {
    path: "vehicles/standards",
    name: "operation_vehicle_standards",
    component: () => import("./pages/VehicleStandards.vue"),
    meta: {
      permission: "VEHICLE",
      title: "Vehicle Standards",
      description: "Manage vehicle performance and safety standards.",
      tabs: [
        { label: "Marker", value: "marker" },
        { label: "Vehicle Model", value: "vehicle-model" },
        { label: "Type", value: "type" },
      ],
    },
  },
  {
    path: "insurances",
    name: "operation_insurances",
    component: () => import("./pages/Insurances.vue"),
    meta: {
      permission: "INSURANCE",
      title: "Insurances",
      description: "Track and manage vehicle and cargo insurance policies.",
    },
  },
  {
    path: "insurance/insuranceDetails/:id",
    name: "operation_insurance_details",
    component: () => import("./pages/InsuranceDetails.vue"),
    meta: {
      permission: "INSURANCE",
      title: "Insurance Details",
      description: "Detailed view of an insurance record.",
      tabs: [
        { label: "Basic Information", value: "basic" },
        { label: "Uploaded Documents", value: "documents" },
      ],
    },
  },
  {
    path: "shipment-damages",
    name: "operation_shipment_damages",
    component: () => import("./pages/ShipmentDamages.vue"),
    meta: {
      permission: "SHIPMENT_DAMAGE",
      title: "Shipment Damages",
      description: "Track and manage damages related to shipments.",
      tabs: [
        { label: "All List", value: "list" },
        { label: "Payable", value: "payable" },
        { label: "Receivable", value: "receivable" },
      ],
    },
  },
  {
    path: "shipment-damages/:id",
    name: "operation_shipment_damage_details",
    component: () => import("./pages/ShipmentDamageDetails.vue"),
    meta: {
      permission: "SHIPMENT_DAMAGE",
      title: "Shipment Damage Details",
      description: "Detailed view of a shipment damage record.",
      tabs: [
        { label: "Basic Details", value: "basic" },
        { label: "Damaged Items", value: "items" },
      ],
    },
  },
  {
    path: "vehicle-damages",
    name: "operation_vehicle_damages",
    component: () => import("./pages/VehicleDamages.vue"),
    meta: {
      permission: "VEHICLE_DAMAGE",
      title: "Vehicle Damages",
      description: "Track and manage damages related to vehicles.",
      tabs: [
        { label: "All List", value: "list" },
        { label: "Payable", value: "payable" },
        { label: "Receivable", value: "receivable" },
      ],
    },
  },
  {
    path: "vehicle-damages/:id",
    name: "operation_vehicle_damage_details",
    component: () => import("./pages/VehicleDamageDetails.vue"),
    meta: {
      permission: "VEHICLE_DAMAGE",
      title: "Vehicle Damage Details",
      description: "Detailed view of a vehicle damage record.",
      tabs: [
        { label: "Basic Details", value: "basic" },
        { label: "Vehicle Parts", value: "parts" },
      ],
    },
  },
  {
    path: "vehicle-tyres",
    name: "operation_tyres",
    component: () => import("./pages/tyres/vehicleTyres.vue"),
    meta: {
      permission: "TYRE",
      title: "Tyres",
      description: "Monitor tyre inventory, usage and replacement schedules.",
    },
  },
  {
    path: "vehicle-tyres/:id",
    name: "operation_tyres_detail",
    component: () => import("./pages/tyres/Tyres.vue"),
    meta: {
      permission: "TYRE",
      title: "Tyres Detail",
      description: "Manage individual tyres for a specific vehicle.",
    },
  },
  {
    path: "vehicle-tyres/add",
    name: "operation_tyres_add",
    component: () => import("./pages/tyres/addTyre.vue"),
    meta: {
      permission: "TYRE",
      title: "Add Tyre",
      description: "Add a new tyre to a vehicle.",
    },
  },
  {
    path: "vehicle-tyres/edit/:id",
    name: "operation_tyres_edit",
    component: () => import("./pages/tyres/editTyre.vue"),
    meta: {
      permission: "TYRE",
      title: "Edit Tyre",
      description: "Edit an existing tyre record.",
    },
  },
  {
    path: "vehicle-tyres/details/:id",
    name: "operation_tyres_details",
    component: () => import("./pages/tyres/tyreDetails.vue"),
    meta: {
      permission: "TYRE",
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
        meta: {
          permission: "MECHANIC",
          title: "Mechanic",
          description: "Manage mechanics.",
        },
      },
      {
        path: "mechanic/add",
        name: "operation_maintenance_mechanic_add",
        component: () => import("./pages/maintenance/MechanicAdd.vue"),
        meta: {
          permission: "MECHANIC",
          title: "Add Mechanic",
          description: "Add a new mechanic.",
        },
      },
      {
        path: "mechanic/edit/:id",
        name: "operation_maintenance_mechanic_edit",
        component: () => import("./pages/maintenance/MechanicEdit.vue"),
        meta: {
          permission: "MECHANIC",
          title: "Edit Mechanic",
          description: "Edit an existing mechanic.",
        },
      },
      {
        path: "inspection",
        name: "operation_maintenance_inspection",
        component: () => import("./pages/maintenance/Inspection.vue"),
        meta: {
          permission: "INSPECTION",
          title: "Inspection",
          description: "Manage vehicle inspections.",
        },
      },

      {
        path: "inspection/add",
        name: "operation_maintenance_inspection_add",
        component: () => import("./pages/maintenance/InspectionAdd.vue"),
        meta: {
          permission: "INSPECTION",
          title: "Add Inspection",
          description: "Add a new inspection.",
        },
      },
      {
        path: "inspection/edit/:id",
        name: "operation_maintenance_inspection_edit",
        component: () => import("./pages/maintenance/InspectionEdit.vue"),
        meta: {
          permission: "INSPECTION",
          title: "Edit Inspection",
          description: "Edit an existing inspection.",
        },
      },
      {
        path: "service-record",
        name: "operation_maintenance_service_record",
        component: () => import("./pages/maintenance/ServiceRecord.vue"),
        meta: {
          permission: "SERVICE_RECORD",
          title: "Service Record",
          description: "View service records.",
        },
      },

      {
        path: "service-record/add",
        name: "operation_maintenance_service_record_add",
        component: () => import("./pages/maintenance/ServiceRecordAdd.vue"),
        meta: {
          permission: "SERVICE_RECORD",
          title: "Add Service Record",
          description: "Add a new service record.",
        },
      },
      {
        path: "service-record/edit/:id",
        name: "operation_maintenance_service_record_edit",
        component: () => import("./pages/maintenance/ServiceRecordEdit.vue"),
        meta: {
          permission: "SERVICE_RECORD",
          title: "Edit Service Record",
          description: "Edit an existing service record.",
        },
      },
      {
        path: "service-reminder",
        name: "operation_maintenance_service_reminder",
        component: () => import("./pages/maintenance/ServiceReminder.vue"),
        meta: {
          permission: "SERVICE_REMINDER",
          title: "Service Reminder",
          description: "Manage service reminders.",
        },
      },
      {
        path: "service-reminder/add",
        name: "operation_maintenance_service_reminder_add",
        component: () => import("./pages/maintenance/ServiceReminderAdd.vue"),
        meta: {
          permission: "SERVICE_REMINDER",
          title: "Add Service Reminder",
          description: "Add a new service reminder.",
        },
      },
      {
        path: "service-reminder/edit/:id",
        name: "operation_maintenance_service_reminder_edit",
        component: () => import("./pages/maintenance/ServiceReminderEdit.vue"),
        meta: {
          permission: "SERVICE_REMINDER",
          title: "Edit Service Reminder",
          description: "Edit an existing service reminder.",
        },
      },
      {
        path: "service-task",
        name: "operation_maintenance_service_task",
        component: () => import("./pages/maintenance/ServiceTask.vue"),
        meta: {
          permission: "SERVICE_TASK",
          title: "Service Task",
          description: "Manage service tasks.",
        },
      },
      {
        path: "service-task/add",
        name: "operation_maintenance_service_task_add",
        component: () => import("./pages/maintenance/ServiceTaskAdd.vue"),
        meta: {
          permission: "SERVICE_TASK",
          title: "Add Service Task",
          description: "Add a new service task.",
        },
      },
      {
        path: "service-task/edit/:id",
        name: "operation_maintenance_service_task_edit",
        component: () => import("./pages/maintenance/ServiceTaskEdit.vue"),
        meta: {
          permission: "SERVICE_TASK",
          title: "Edit Service Task",
          description: "Edit an existing service task.",
        },
      },
      {
        path: "service-type",
        name: "operation_maintenance_service_type",
        component: () => import("./pages/maintenance/ServiceType.vue"),
        meta: {
          permission: "TYPE",
          title: "Service Type",
          description: "Manage service types.",
        },
      },
      {
        path: "service-type/add",
        name: "operation_maintenance_service_type_add",
        component: () => import("./pages/maintenance/ServiceTypeAdd.vue"),
        meta: {
          permission: "TYPE",
          title: "Add Service Type",
          description: "Add a new service type.",
        },
      },
      {
        path: "service-type/edit/:id",
        name: "operation_maintenance_service_type_edit",
        component: () => import("./pages/maintenance/ServiceTypeEdit.vue"),
        meta: {
          permission: "TYPE",
          title: "Edit Service Type",
          description: "Edit an existing service type.",
        },
      },
      {
        path: "work-order",
        name: "operation_maintenance_work_order",
        component: () => import("./pages/maintenance/WorkOrder.vue"),
        meta: {
          permission: "WORK_ORDER",
          title: "Work Order",
          description: "Manage work orders.",
        },
      },
      {
        path: "work-order/add",
        name: "operation_maintenance_work_order_add",
        component: () => import("./pages/maintenance/WorkOrderAdd.vue"),
        meta: {
          permission: "WORK_ORDER",
          title: "Add Work Order",
          description: "Add a new work order.",
        },
      },
      {
        path: "work-order/edit/:id",
        name: "operation_maintenance_work_order_edit",
        component: () => import("./pages/maintenance/WorkOrderEdit.vue"),
        meta: {
          permission: "WORK_ORDER",
          title: "Edit Work Order",
          description: "Edit an existing work order.",
        },
      },
      {
        path: "work-order/:id",
        name: "operation_maintenance_work_order_details",
        component: () => import("./pages/maintenance/WorkOrderDetail.vue"),
        meta: {
          permission: "WORK_ORDER",
          title: "Work Order Details",
          description: "Detailed view of the maintenance work order.",
          tabsTeleportTo: "#work-order-details-tabs",
          tabs: [
            { label: "Overview", value: "overview" },
            { label: "Tasks", value: "tasks" },
          ],
        },
      },
      {
        path: "workshop",
        name: "operation_maintenance_workshop",
        component: () => import("./pages/maintenance/Workshop.vue"),
        meta: {
          permission: "WORKSHOP",
          title: "Workshop",
          description: "Manage workshops.",
        },
      },
      {
        path: "workshop/add",
        name: "operation_maintenance_workshop_add",
        component: () => import("./pages/maintenance/WorkshopAdd.vue"),
        meta: {
          permission: "WORKSHOP",
          title: "Add Workshop",
          description: "Add a new workshop.",
        },
      },
      {
        path: "workshop/edit/:id",
        name: "operation_maintenance_workshop_edit",
        component: () => import("./pages/maintenance/WorkshopEdit.vue"),
        meta: {
          permission: "WORKSHOP",
          title: "Edit Workshop",
          description: "Edit an existing workshop.",
        },
      },
      {
        path: "issue-report",
        name: "operation_maintenance_issue_report",
        component: () => import("./pages/maintenance/IssueReport.vue"),
        meta: {
          permission: "ISSUE_REPORT",
          title: "Issue Report",
          description: "Manage issue reports.",
        },
      },
      {
        path: "issue-report/:id",
        name: "operation_maintenance_issue_report_details",
        component: () => import("./pages/maintenance/IssueReportDetail.vue"),
        meta: {
          permission: "ISSUE_REPORT",
          title: "Issue Report Details",
          description: "View detailed information about an issue report.",
          tabsTeleportTo: "#issue-report-details-tabs",
          tabs: [{ label: "Overview", value: "overview" }],
        },
      },
      {
        path: "tyre-handoffs",
        name: "operation_maintenance_tyre_handoffs",
        component: () => import("./pages/maintenance/TyreHandoffs.vue"),
        meta: {
          permission: "TYRE",
          title: "Tyre Handoffs",
          description: "Manage tyre handoffs.",
        },
      },
      {
        path: "tyre-handoffs/:id",
        name: "operation_maintenance_tyre_handoffs_details",
        component: () => import("./pages/maintenance/TyreHandoffsDetail.vue"),
        meta: {
          permission: "TYRE",
          title: "Tyre Handoff Details",
          description: "Detailed view of the tyre handoff event.",
          tabsTeleportTo: "#tyre-handoff-details-tabs",
          tabs: [{ label: "Overview", value: "overview" }],
        },
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
        meta: {
          permission: "TRANSACTION",
          title: "Payable",
          description: "Manage payables.",
        },
      },
      {
        path: "receivable",
        name: "operation_finance_receivable",
        component: () => import("./pages/finance/Receivable.vue"),
        meta: {
          permission: "TRANSACTION",
          title: "Receivable",
          description: "Manage receivables.",
        },
      },
      {
        path: "receivable/:id",
        name: "operation_finance_receivable_detail",
        component: () => import("./pages/finance/ReceivableDetail.vue"),
        meta: {
          permission: "TRANSACTION",
          title: "Receivable Details",
          description: "Detailed breakdown of a receivable shipment.",
          tabsTeleportTo: "#shipment-details-tabs",
          tabs: [
            { label: "Overview", value: "overview" },
            { label: "Document Uploads", value: "uploads" },
            { label: "Pre-Trip Inspections", value: "pre-trip-inspections" },
            { label: "Settlements", value: "settlements" },
            { label: "Empty Return", value: "emptyReturn" },
          ],
        },
      },
      {
        path: "invoice-report",
        name: "operation_finance_invoice_report",
        component: () => import("./pages/finance/InvoiceReport.vue"),
        meta: {
          permission: [{ subject: "SHIPMENT", actions: ["generate_invoice"] }],
          title: "Invoice Report",
          description: "View invoice reports.",
        },
      },
      {
        path: "invoice-report/:id",
        name: "operation_finance_invoice_report_details",
        component: () => import("./pages/finance/InvoiceReportDetail.vue"),
        meta: {
          permission: "REPORT",
          title: "Invoice Report Details",
          description: "Detailed breakdown of the invoice report.",
          tabsTeleportTo: "#invoice-report-details-tabs",
          tabs: [{ label: "Overview", value: "overview" }],
        },
      },
      {
        path: "invoice-report/edit/:id",
        name: "operation_finance_invoice_report_edit",
        component: () => import("./pages/finance/InvoiceReportEdit.vue"),
        meta: {
          permission: "REPORT",
          title: "Edit Invoice Report",
          description: "Update existing invoice report details.",
        },
      },
      {
        path: "generateInvoice/:id",
        name: "operation_finance_generate_invoice",
        component: () => import("./pages/finance/GenerateInvoice.vue"),
        meta: {
          permission: "REPORT",
          title: "Generate Invoice",
          description: "Generate and print shipment invoices.",
        },
      },
      {
        path: "editPaymentRequest/:id",
        name: "operation_finance_edit_payment_request",
        component: () => import("./pages/finance/InvoiceReportEdit.vue"), // Shared component or similar logic
        meta: {
          permission: "REPORT",
          title: "Edit Payment Request",
          description: "Update existing payment request details.",
        },
      },
      {
        path: "payment-collection",
        name: "operation_finance_payment_collection",
        component: () => import("./pages/finance/PaymentCollection.vue"),
        meta: {
          permission: "TRANSACTION",
          title: "Payment Collection",
          description: "Manage payment collections.",
        },
      },
      {
        path: "payment-collection/:id",
        name: "operation_finance_payment_collection_details",
        component: () => import("./pages/finance/PaymentCollectionDetail.vue"),
        meta: {
          permission: "TRANSACTION",
          title: "Payment Collection Details",
          description: "Detailed breakdown of the payment collection.",
          tabsTeleportTo: "#payment-collection-details-tabs",
          tabs: [{ label: "Overview", value: "overview" }],
        },
      },
      {
        path: "payment-collection/edit/:id",
        name: "operation_finance_payment_collection_edit",
        component: () => import("./pages/finance/PaymentCollectionEdit.vue"),
        meta: {
          permission: "TRANSACTION",
          title: "Edit Payment Collection",
          description: "Update existing payment collection details.",
        },
      },
      {
        path: "expense",
        name: "operation_finance_expense",
        component: () => import("./pages/finance/Expense.vue"),
        meta: {
          permission: "TRANSACTION",
          title: "Expense",
          description: "Manage expenses.",
        },
      },
      {
        path: "paid-sub-contracts",
        name: "operation_finance_paid_sub_contracts",
        component: () => import("./pages/finance/PaidSubContracts.vue"),
        meta: {
          permission: "TRANSACTION",
          title: "Paid Sub-Contracts",
          description: "Manage paid sub-contracts.",
        },
      },
      {
        path: "expense-types",
        name: "operation_finance_expense_types",
        component: () => import("./pages/finance/ExpenseTypes.vue"),
        meta: {
          permission: "EXPENSE_TYPE",
          title: "Expense Types",
          description: "Manage expense types.",
        },
      },
      {
        path: "expense-types/add",
        name: "operation_finance_expense_types_add",
        component: () => import("./pages/finance/ExpenseTypesAdd.vue"),
        meta: {
          permission: "EXPENSE_TYPE",
          title: "Add Expense Type",
          description: "Add a new expense type.",
        },
      },
      {
        path: "expense-types/edit/:id",
        name: "operation_finance_expense_types_edit",
        component: () => import("./pages/finance/ExpenseTypesEdit.vue"),
        meta: {
          permission: "EXPENSE_TYPE",
          title: "Edit Expense Type",
          description: "Edit an existing expense type.",
        },
      },
      {
        path: "fuel-transactions",
        name: "operation_finance_fuel_transactions",
        component: () => import("./pages/finance/FuelTransactions.vue"),
        meta: {
          permission: "TRANSACTION",
          title: "Fuel Transactions",
          description: "Manage fuel transactions.",
        },
      },
      {
        path: "driver-bonuses",
        name: "operation_finance_driver_bonuses",
        component: () => import("./pages/finance/DriverBonuses.vue"),
        meta: {
          permission: "DRIVER_BONUS",
          title: "Driver Bonuses",
          description: "Manage driver bonuses.",
        },
      },
    ],
  },
  {
    path: "drivers",
    name: "operation_drivers",
    component: () => import("./pages/Drivers.vue"),
    meta: {
      permission: "DRIVER",
      title: "Drivers",
      description: "Manage driver profiles, assignments and performance.",
    },
  },
  {
    path: "drivers/add",
    name: "operation_drivers_add",
    component: () => import("./pages/AddDriver.vue"),
    meta: {
      permission: "DRIVER",
      title: "Add Driver",
      description: "Create a new driver profile.",
    },
  },
  {
    path: "drivers/edit/:id",
    name: "operation_drivers_edit",
    component: () => import("./pages/EditDriver.vue"),
    meta: {
      permission: "DRIVER",
      title: "Edit Driver",
      description: "Modify an existing driver profile.",
    },
  },
  {
    path: "drivers/:id",
    name: "operation_driver_details",
    component: () => import("./pages/DriverDetails.vue"),
    meta: {
      permission: "DRIVER",
      title: "Driver Details",
      description:
        "Comprehensive overview of driver profiles, documents, shipments, and settlements.",
      tabs: [
        { label: "Basic Driver Information", value: "basic" },
        { label: "Documents", value: "documents" },
        { label: "Shipments", value: "shipments" },
        { label: "Settlements", value: "settlements" },
      ],
    },
  },
  {
    path: "infractions",
    name: "operation_infractions",
    component: () => import("./pages/Infractions.vue"),
    meta: {
      permission: "INFRACTION",
      title: "Infractions",
      description: "Driver infraction reports and penalty management.",
      tabs: [
        { label: "Infractions List", value: "infractions" },
        { label: "Infraction Types", value: "types" },
      ],
    },
  },
  {
    path: "infractions/:id",
    name: "operation_infraction_details",
    component: () => import("./pages/InfractionDetails.vue"),
    meta: {
      permission: "INFRACTION",
      title: "Infraction Details",
      description: "Detailed overview of infraction report and penalties.",
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
        meta: {
          permission: "CATEGORY",
          title: "Categories",
          description: "Manage inventory categories.",
        },
      },
      {
        path: "item-groups",
        name: "operation_inventory_item_groups",
        component: () => import("./pages/Inventory/ItemGroups.vue"),
        meta: {
          permission: "ITEM_GROUP",
          title: "Item Groups",
          description: "Manage inventory item groups.",
        },
      },
      {
        path: "vendor",
        name: "operation_inventory_vendor",
        component: () => import("./pages/Inventory/Vendor.vue"),
        meta: {
          permission: "SUPPLIER",
          title: "Vendor",
          description: "Manage inventory vendors.",
        },
      },
      {
        path: "items",
        name: "operation_inventory_items",
        component: () => import("./pages/Inventory/Items.vue"),
        meta: {
          permission: "INVENTORY_ITEM",
          title: "Items",
          description: "Manage inventory items.",
        },
      },
      {
        path: "store-requisition",
        name: "operation_inventory_store_requisition",
        component: () => import("./pages/Inventory/StoreRequisition.vue"),
        meta: {
          permission: "STORE_REQUISITION_VOUCHER",
          title: "Store Requisition",
          description: "Manage store requisition vouchers.",
        },
      },
      {
        path: "store-requisition/:id",
        name: "operation_inventory_store_requisition_details",
        component: () => import("./pages/Inventory/StoreRequisitionDetail.vue"),
        meta: {
          permission: "STORE_REQUISITION_VOUCHER",
          title: "Store Requisition Details",
          description: "Detailed view of the store requisition.",
          tabsTeleportTo: "#store-requisition-details-tabs",
          tabs: [{ label: "Overview", value: "overview" }],
        },
      },
      {
        path: "purchase-requisition",
        name: "operation_inventory_purchase_requisition",
        component: () => import("./pages/Inventory/PurchaseRequisition.vue"),
        meta: {
          permission: "PURCHASE_REQUISITION",
          title: "Purchase Requisition",
          description: "Manage purchase requisition requests.",
        },
      },
      {
        path: "purchase-requisition/:id",
        name: "operation_inventory_purchase_requisition_details",
        component: () =>
          import("./pages/Inventory/PurchaseRequisitionDetail.vue"),
        meta: {
          permission: "PURCHASE_REQUISITION",
          title: "Purchase Requisition Details",
          description: "Detailed view of the purchase requisition.",
          tabsTeleportTo: "#purchase-requisition-details-tabs",
          tabs: [{ label: "Overview", value: "overview" }],
        },
      },
      {
        path: "purchase-order",
        name: "operation_inventory_purchase_order",
        component: () => import("./pages/Inventory/PurchaseOrder.vue"),
        meta: {
          permission: "PURCHASE_ORDER",
          title: "Purchase Order",
          description: "Manage inventory purchase orders.",
        },
      },
      {
        path: "purchase-order/:id",
        name: "operation_inventory_purchase_order_details",
        component: () => import("./pages/Inventory/PurchaseOrderDetail.vue"),
        meta: {
          permission: "PURCHASE_ORDER",
          title: "Purchase Order Details",
          description: "Detailed view of the purchase order.",
          tabsTeleportTo: "#purchase-order-details-tabs",
          tabs: [{ label: "Overview", value: "overview" }],
        },
      },
      {
        path: "good-transfer",
        name: "operation_inventory_good_transfer",
        component: () => import("./pages/Inventory/GoodTransfer.vue"),
        meta: {
          permission: "GOOD_TRANSFER_VOUCHER",
          title: "Issue / Receive",
          description: "Track good transfers, issues and receipts.",
        },
      },
      {
        path: "good-transfer/:id",
        name: "operation_inventory_good_transfer_details",
        component: () => import("./pages/Inventory/GoodTransferDetail.vue"),
        meta: {
          permission: "GOOD_TRANSFER_VOUCHER",
          title: "Transfer Voucher Details",
          description: "Detailed view of the good transfer voucher.",
          tabs: [{ label: "Overview", value: "overview" }],
        },
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
        meta: {
          permission: "USER",
          title: "User and Role",
          description: "Manage users, roles and permissions.",
          tabs: [
            { value: "user", label: "Users" },
            { value: "role", label: "Roles" },
          ],
        },
      },
      {
        path: "user-and-role/user/add",
        name: "operation_setting_user_add",
        component: () => import("./pages/setting/UserAdd.vue"),
        meta: {
          permission: "USER",
          title: "Register User",
          description: "Create a new user account.",
        },
      },
      {
        path: "user-and-role/user/edit/:id",
        name: "operation_setting_user_edit",
        component: () => import("./pages/setting/UserEdit.vue"),
        meta: {
          permission: "USER",
          title: "Edit User",
          description: "Edit an existing user account.",
        },
      },
      {
        path: "user-and-role/role/add",
        name: "operation_setting_role_add",
        component: () => import("./pages/setting/RoleAdd.vue"),
        meta: {
          permission: "USER",
          title: "Add Role",
          description: "Create a new role with permissions.",
        },
      },
      {
        path: "user-and-role/role/edit/:id",
        name: "operation_setting_role_edit",
        component: () => import("./pages/setting/RoleEdit.vue"),
        meta: {
          permission: "USER",
          title: "Edit Role",
          description: "Edit an existing role and its permissions.",
        },
      },
      {
        path: "base-configuration",
        name: "operation_setting_base_configuration",
        component: () => import("./pages/setting/BaseConfiguration.vue"),
        meta: {
          title: "Base Configuration",
          description: "Configure core system settings.",
          tabs: [
            { value: "settings", label: "Settings" },
            { value: "roadType", label: "Road Type" },
            { value: "terrainType", label: "Terrain Type" },
            { value: "bank", label: "Bank" },
            { value: "insurance", label: "Insurance Provider" },
          ],
        },
      },
      // Road Type
      {
        path: "base-configuration/road-type/add",
        component: () =>
          import("./pages/setting/BaseConfiguration pages/RoadTypeAdd.vue"),
        meta: {
          permission: "ROAD_TYPE",
          title: "Add Road Type",
        },
      },
      {
        path: "base-configuration/road-type/edit/:id",
        component: () =>
          import("./pages/setting/BaseConfiguration pages/RoadTypeEdit.vue"),
        meta: {
          permission: "ROAD_TYPE",
          title: "Edit Road Type",
        },
      },
      // Terrain Type
      {
        path: "base-configuration/terrain-type/add",
        component: () =>
          import("./pages/setting/BaseConfiguration pages/TerrainTypeAdd.vue"),
        meta: {
          permission: "TERRAIN_TYPE",
          title: "Add Terrain Type",
        },
      },
      {
        path: "base-configuration/terrain-type/edit/:id",
        component: () =>
          import("./pages/setting/BaseConfiguration pages/TerrainTypeEdit.vue"),
        meta: {
          permission: "TERRAIN_TYPE",
          title: "Edit Terrain Type",
        },
      },
      // Bank
      {
        path: "base-configuration/bank/add",
        component: () =>
          import("./pages/setting/BaseConfiguration pages/BankAdd.vue"),
        meta: {
          permission: "BANK",
          title: "Add Bank",
        },
      },
      {
        path: "base-configuration/bank/edit/:id",
        component: () =>
          import("./pages/setting/BaseConfiguration pages/BankEdit.vue"),
        meta: {
          permission: "BANK",
          title: "Edit Bank",
        },
      },
      // Insurance
      {
        path: "base-configuration/insurance/add",
        component: () =>
          import("./pages/setting/BaseConfiguration pages/InsuranceAdd.vue"),
        meta: {
          permission: "INSURANCE",
          title: "Add Insurance",
        },
      },
      {
        path: "base-configuration/insurance/edit/:id",
        component: () =>
          import("./pages/setting/BaseConfiguration pages/InsuranceEdit.vue"),
        meta: {
          permission: "INSURANCE",
          title: "Edit Insurance",
        },
      },
      // Settings (Carrier)
      {
        path: "base-configuration/settings/add",
        component: () =>
          import("./pages/setting/BaseConfiguration pages/CarrierSettingAdd.vue"),
        meta: { title: "Add Carrier Setting" },
      },
      {
        path: "base-configuration/settings/edit/:id",
        component: () =>
          import("./pages/setting/BaseConfiguration pages/CarrierSettingEdit.vue"),
        meta: { title: "Edit Carrier Setting" },
      },

      {
        path: "contract",
        name: "operation_setting_contract",
        component: () => import("./pages/setting/Contract.vue"),
        meta: {
          permission: "CONTRACT",
          title: "Contract",
          description: "Manage business contracts.",
        },
      },
      {
        path: "contract/view/:id",
        name: "operation_setting_contract_details",
        component: () => import("./pages/setting/ContractDetail.vue"),
        meta: {
          permission: "CONTRACT",
          title: "Contract Details",
          description: "Detailed view of the contract.",
          tabsTeleportTo: "#contract-details-tabs",
          tabs: [{ label: "Overview", value: "overview" }],
        },
      },
      {
        path: "contract/add",
        name: "operation_setting_contract_add",
        component: () => import("./pages/setting/ContractAdd.vue"),
        meta: {
          permission: "CONTRACT",
          title: "Add Contract",
          description: "Create a new carrier contract.",
        },
      },

      {
        path: "commodity",
        name: "operation_setting_commodity",
        component: () => import("./pages/setting/Commodity.vue"),
        meta: {
          permission: "COMMODITY",
          title: "Commodity",
          description: "Manage commodities.",
        },
      },
      {
        path: "commodity/add",
        name: "operation_setting_commodity_add",
        component: () => import("./pages/setting/CommodityAdd.vue"),
        meta: {
          permission: "COMMODITY",
          title: "Add Commodity",
          description: "Create a new commodity.",
        },
      },
      {
        path: "commodity/edit/:id",
        name: "operation_setting_commodity_edit",
        component: () => import("./pages/setting/CommodityEdit.vue"),
        meta: {
          permission: "COMMODITY",
          title: "Edit Commodity",
          description: "Edit an existing commodity.",
        },
      },

      {
        path: "packaging",
        name: "operation_setting_packaging",
        component: () => import("./pages/setting/Packaging.vue"),
        meta: {
          permission: "PACKAGING",
          title: "Packaging",
          description: "Manage packaging types.",
        },
      },
      {
        path: "packaging/add",
        name: "operation_setting_packaging_add",
        component: () => import("./pages/setting/PackagingAdd.vue"),
        meta: {
          permission: "PACKAGING",
          title: "Add Packaging",
          description: "Create a new packaging type.",
        },
      },
      {
        path: "packaging/edit/:id",
        name: "operation_setting_packaging_edit",
        component: () => import("./pages/setting/PackagingEdit.vue"),
        meta: {
          permission: "PACKAGING",
          title: "Edit Packaging",
          description: "Edit an existing packaging type.",
        },
      },

      {
        path: "route-request",
        name: "operation_setting_route_request",
        component: () => import("./pages/setting/RouteRequests.vue"),
        meta: {
          permission: "ROUTEREGISTER",
          title: "Route Requests",
          description: "Manage route requests.",
        },
      },

      {
        path: "region",
        name: "operation_setting_region",
        component: () => import("./pages/setting/Region.vue"),
        meta: {
          permission: "REGION",
          title: "Region",
          description: "Manage regions.",
        },
      },
      {
        path: "region/add",
        name: "operation_setting_region_add",
        component: () => import("./pages/setting/RegionAdd.vue"),
        meta: {
          permission: "REGION",
          title: "Add Region",
          description: "Create a new region.",
        },
      },
      {
        path: "region/edit/:id",
        name: "operation_setting_region_edit",
        component: () => import("./pages/setting/RegionEdit.vue"),
        meta: {
          permission: "REGION",
          title: "Edit Region",
          description: "Edit an existing region.",
        },
      },
      {
        path: "bonus-multipliers",
        name: "operation_setting_bonus_multipliers",
        component: () => import("./pages/setting/BonusMultipliers.vue"),
        meta: {
          permission: "DRIVER_BONUS",
          title: "Bonus Multipliers",
          description: "Manage bonus multipliers.",
        },
      },
      {
        path: "bonus-multipliers/add",
        name: "operation_setting_bonus_multipliers_add",
        component: () => import("./pages/setting/BonusMultipliersAdd.vue"),
        meta: {
          permission: "DRIVER_BONUS",
          title: "Add Bonus Multiplier",
          description: "Create a new bonus multiplier.",
        },
      },
      {
        path: "bonus-multipliers/edit/:id",
        name: "operation_setting_bonus_multipliers_edit",
        component: () => import("./pages/setting/BonusMultipliersEdit.vue"),
        meta: {
          permission: "DRIVER_BONUS",
          title: "Edit Bonus Multiplier",
          description: "Update an existing bonus multiplier.",
        },
      },
      {
        path: "bonus-routes",
        name: "operation_setting_bonus_routes",
        component: () => import("./pages/setting/BonusRoutes.vue"),
        meta: {
          permission: "DRIVER_BONUS",
          title: "Bonus Routes",
          description: "Manage bonus routes.",
        },
      },
      {
        path: "bonus-routes/add",
        name: "operation_setting_bonus_routes_add",
        component: () => import("./pages/setting/BonusRoutesAdd.vue"),
        meta: {
          permission: "DRIVER_BONUS",
          title: "Add Bonus Route",
          description: "Create a new bonus route.",
        },
      },
      {
        path: "bonus-routes/edit/:id",
        name: "operation_setting_bonus_routes_edit",
        component: () => import("./pages/setting/BonusRoutesEdit.vue"),
        meta: {
          permission: "DRIVER_BONUS",
          title: "Edit Bonus Route",
          description: "Update an existing bonus route.",
        },
      },
      {
        path: "announcements",
        name: "operation_setting_announcements",
        component: () => import("./pages/setting/Announcements.vue"),
        meta: {
          permission: "ANNOUNCEMENT",
          title: "Announcements",
          description: "Manage system announcements.",
        },
      },
      {
        path: "announcements/add",
        name: "operation_setting_announcements_add",
        component: () => import("./pages/setting/AnnouncementsAdd.vue"),
        meta: {
          permission: "ANNOUNCEMENT",
          title: "Add Announcement",
          description: "Create a new announcement.",
        },
      },
      {
        path: "announcements/edit/:id",
        name: "operation_setting_announcements_edit",
        component: () => import("./pages/setting/AnnouncementsEdit.vue"),
        meta: {
          permission: "ANNOUNCEMENT",
          title: "Edit Announcement",
          description: "Update an existing announcement.",
        },
      },
    ],
  },
  {
    path: "reports",
    name: "operation_reports",
    component: () => import("./pages/Reports.vue"),
    meta: {
      permission: "REPORT",
      title: "Reports",
      description: "Comprehensive operational and financial reports.",
    },
  },
];
