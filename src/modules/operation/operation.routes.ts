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
        path: "shipments/add-from-order/:orderId",
        name: "operation_shipments_add_from_order",
        component: () => import("./pages/AddShipmentFromOrder.vue"),
        meta: {
          title: "Create Shipment from Order",
          description: "Create a new shipment with order details pre-filled.",
        },
      },
      {
        path: "shipments/edit/:id",
        name: "operation_shipments_edit",
        component: () => import("./pages/EditShipment.vue"),
        meta: {
          title: "Edit Shipment",
          description: "Update existing shipment details.",
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
        path: "orders/add",
        name: "operation_orders_add",
        component: () => import("./pages/AddOrder.vue"),
        meta: {
          title: "Add Order",
          description: "Create a new freight order.",
        },
      },
      {
        path: "orders/edit/:id",
        name: "operation_orders_edit",
        component: () => import("./pages/EditOrder.vue"),
        meta: {
          title: "Edit Order",
          description: "Update an existing freight order.",
        },
      },
      {
        path: "orders/:id",
        name: "operation_order_details",
        component: () => import("./pages/OrderDetails.vue"),
        meta: {
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
          title: "Create Route",
          description: "Add a new transportation route.",
        },
      },
      {
        path: "routes/edit/:id",
        name: "operation_routes_edit",
        component: () => import("./pages/EditRoute.vue"),
        meta: {
          title: "Edit Route",
          description: "Modify an existing transportation route.",
        },
      },
      {
        path: "routes/:id",
        name: "operation_routes_details",
        component: () => import("./pages/RouteDetails.vue"),
        meta: {
          title: "Route Details",
          description: "View details and waypoints of a route.",
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
        path: "advance-details/:id",
        name: "operation_advance_details",
        component: () => import("./pages/AdvanceDetails.vue"),
        meta: {
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
          title: "Advance Summary",
          description: "View and manage consolidated advance payment records.",
        },
      },
      {
        path: "prepayment-summary",
        name: "operation_prepayment_summary",
        component: () => import("./pages/PrePaymentSummary.vue"),
        meta: {
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
      title: "Customers",
      description: "Manage customer accounts and relationships.",
    },
  },
  {
    path: "customers/:id",
    name: "operation_customer_details",
    component: () => import("./pages/CustomerDetails.vue"),
    meta: {
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
      title: "Facilities",
      description: "Manage facilities for carriers and shippers.",
    },
  },
  {
    path: "agents",
    name: "operation_agents",
    component: () => import("./pages/Agents.vue"),
    meta: {
      title: "Agents",
      description: "Manage agent profiles and locations.",
    },
  },
  {
    path: "agents/add",
    name: "operation_agents_add",
    component: () => import("./pages/AddAgent.vue"),
    meta: {
      title: "Add Agent",
      description: "Create a new agent profile.",
    },
  },
  {
    path: "agents/edit/:id",
    name: "operation_agents_edit",
    component: () => import("./pages/EditAgent.vue"),
    meta: {
      title: "Edit Agent",
      description: "Update an existing agent profile.",
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
    path: "contacts/:id",
    name: "operation_contact_details",
    component: () => import("./pages/ContactDetails.vue"),
    meta: {
      title: "Contact Details",
      description: "Detailed view of the contact profile.",
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
    path: "transporters/:id",
    name: "operation_transporter_details",
    component: () => import("./pages/TransporterDetails.vue"),
    meta: {
      title: "Transporter Details",
      description: "Detailed view of the transporter profile.",
    },
  },
  {
    path: "vehicles",
    name: "operation_vehicles",
    component: () => import("./pages/Vehicles.vue"),
    meta: {
      title: "Vehicles",
      description: "Manage fleet vehicles, tracking and registration.",
    },
  },
  {
    path: "vehicles/add",
    name: "operation_vehicles_add",
    component: () => import("./pages/AddVehicle.vue"),
    meta: {
      title: "Add Vehicle",
      description: "Register a new vehicle to the fleet.",
    },
  },
  {
    path: "vehicles/edit/:id",
    name: "operation_vehicles_edit",
    component: () => import("./pages/EditVehicle.vue"),
    meta: {
      title: "Edit Vehicle",
      description: "Update existing vehicle details and specifications.",
    },
  },
  {
    path: "vehicles/:id",
    name: "operation_vehicle_details",
    component: () => import("./pages/VehicleDetails.vue"),
    meta: {
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
      title: "Leased Vehicles",
      description: "Manage leased vehicles in the fleet.",
    },
  },
  {
    path: "vehicles/types",
    name: "operation_vehicle_types",
    component: () => import("./pages/VehicleTypes.vue"),
    meta: {
      title: "Vehicle Types",
      description: "Manage vehicle types and specifications.",
    },
  },
  {
    path: "vehicles/goals",
    name: "operation_vehicle_goals",
    component: () => import("./pages/VehicleTypeGoals.vue"),
    meta: {
      title: "Vehicle Type Goals",
      description: "Track performance goals for vehicle types.",
    },
  },
  {
    path: "vehicles/groups",
    name: "operation_vehicle_groups",
    component: () => import("./pages/VehicleGroups.vue"),
    meta: {
      title: "Vehicle Groups",
      description: "Manage vehicle group classifications.",
    },
  },
  {
    path: "vehicles/standards",
    name: "operation_vehicle_standards",
    component: () => import("./pages/VehicleStandards.vue"),
    meta: {
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
      title: "Insurances",
      description: "Track and manage vehicle and cargo insurance policies.",
    },
  },
  {
    path: "insurance/insuranceDetails/:id",
    name: "operation_insurance_details",
    component: () => import("./pages/InsuranceDetails.vue"),
    meta: {
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
        path: "mechanic/add",
        name: "operation_maintenance_mechanic_add",
        component: () => import("./pages/maintenance/MechanicAdd.vue"),
        meta: { title: "Add Mechanic", description: "Add a new mechanic." },
      },
      {
        path: "mechanic/edit/:id",
        name: "operation_maintenance_mechanic_edit",
        component: () => import("./pages/maintenance/MechanicEdit.vue"),
        meta: {
          title: "Edit Mechanic",
          description: "Edit an existing mechanic.",
        },
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
        path: "inspection/add",
        name: "operation_maintenance_inspection_add",
        component: () => import("./pages/maintenance/InspectionAdd.vue"),
        meta: { title: "Add Inspection", description: "Add a new inspection." },
      },
      {
        path: "inspection/edit/:id",
        name: "operation_maintenance_inspection_edit",
        component: () => import("./pages/maintenance/InspectionEdit.vue"),
        meta: {
          title: "Edit Inspection",
          description: "Edit an existing inspection.",
        },
      },
      {
        path: "service-record",
        name: "operation_maintenance_service_record",
        component: () => import("./pages/maintenance/ServiceRecord.vue"),
        meta: { title: "Service Record", description: "View service records." },
      },

      {
        path: "service-record/add",
        name: "operation_maintenance_service_record_add",
        component: () => import("./pages/maintenance/ServiceRecordAdd.vue"),
        meta: {
          title: "Add Service Record",
          description: "Add a new service record.",
        },
      },
      {
        path: "service-record/edit/:id",
        name: "operation_maintenance_service_record_edit",
        component: () => import("./pages/maintenance/ServiceRecordEdit.vue"),
        meta: {
          title: "Edit Service Record",
          description: "Edit an existing service record.",
        },
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
        path: "service-reminder/add",
        name: "operation_maintenance_service_reminder_add",
        component: () => import("./pages/maintenance/ServiceReminderAdd.vue"),
        meta: {
          title: "Add Service Reminder",
          description: "Add a new service reminder.",
        },
      },
      {
        path: "service-reminder/edit/:id",
        name: "operation_maintenance_service_reminder_edit",
        component: () => import("./pages/maintenance/ServiceReminderEdit.vue"),
        meta: {
          title: "Edit Service Reminder",
          description: "Edit an existing service reminder.",
        },
      },
      {
        path: "service-task",
        name: "operation_maintenance_service_task",
        component: () => import("./pages/maintenance/ServiceTask.vue"),
        meta: { title: "Service Task", description: "Manage service tasks." },
      },
      {
        path: "service-task/add",
        name: "operation_maintenance_service_task_add",
        component: () => import("./pages/maintenance/ServiceTaskAdd.vue"),
        meta: {
          title: "Add Service Task",
          description: "Add a new service task.",
        },
      },
      {
        path: "service-task/edit/:id",
        name: "operation_maintenance_service_task_edit",
        component: () => import("./pages/maintenance/ServiceTaskEdit.vue"),
        meta: {
          title: "Edit Service Task",
          description: "Edit an existing service task.",
        },
      },
      {
        path: "service-type",
        name: "operation_maintenance_service_type",
        component: () => import("./pages/maintenance/ServiceType.vue"),
        meta: { title: "Service Type", description: "Manage service types." },
      },
      {
        path: "service-type/add",
        name: "operation_maintenance_service_type_add",
        component: () => import("./pages/maintenance/ServiceTypeAdd.vue"),
        meta: {
          title: "Add Service Type",
          description: "Add a new service type.",
        },
      },
      {
        path: "service-type/edit/:id",
        name: "operation_maintenance_service_type_edit",
        component: () => import("./pages/maintenance/ServiceTypeEdit.vue"),
        meta: {
          title: "Edit Service Type",
          description: "Edit an existing service type.",
        },
      },
      {
        path: "work-order",
        name: "operation_maintenance_work_order",
        component: () => import("./pages/maintenance/WorkOrder.vue"),
        meta: { title: "Work Order", description: "Manage work orders." },
      },
      {
        path: "work-order/add",
        name: "operation_maintenance_work_order_add",
        component: () => import("./pages/maintenance/WorkOrderAdd.vue"),
        meta: { title: "Add Work Order", description: "Add a new work order." },
      },
      {
        path: "work-order/edit/:id",
        name: "operation_maintenance_work_order_edit",
        component: () => import("./pages/maintenance/WorkOrderEdit.vue"),
        meta: {
          title: "Edit Work Order",
          description: "Edit an existing work order.",
        },
      },
      {
        path: "workshop",
        name: "operation_maintenance_workshop",
        component: () => import("./pages/maintenance/Workshop.vue"),
        meta: { title: "Workshop", description: "Manage workshops." },
        children: [
          {
            path: "add",
            name: "operation_maintenance_workshop_add",
            component: () => import("./pages/maintenance/WorkshopAdd.vue"),
            meta: { title: "Add Workshop", description: "Add a new workshop." },
          },
          {
            path: "edit/:id",
            name: "operation_maintenance_workshop_edit",
            component: () => import("./pages/maintenance/WorkshopEdit.vue"),
            meta: {
              title: "Edit Workshop",
              description: "Edit an existing workshop.",
            },
          },
        ],
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
        meta: {
          title: "Payment Collection",
          description: "Manage payment collections.",
        },
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
        meta: {
          title: "Paid Sub-Contracts",
          description: "Manage paid sub-contracts.",
        },
      },
      {
        path: "expense-types",
        name: "operation_finance_expense_types",
        component: () => import("./pages/finance/ExpenseTypes.vue"),
        meta: { title: "Expense Types", description: "Manage expense types." },
      },
      {
        path: "expense-types/add",
        name: "operation_finance_expense_types_add",
        component: () => import("./pages/finance/ExpenseTypesAdd.vue"),
        meta: {
          title: "Add Expense Type",
          description: "Add a new expense type.",
        },
      },
      {
        path: "expense-types/edit/:id",
        name: "operation_finance_expense_types_edit",
        component: () => import("./pages/finance/ExpenseTypesEdit.vue"),
        meta: {
          title: "Edit Expense Type",
          description: "Edit an existing expense type.",
        },
      },
      {
        path: "fuel-transactions",
        name: "operation_finance_fuel_transactions",
        component: () => import("./pages/finance/FuelTransactions.vue"),
        meta: {
          title: "Fuel Transactions",
          description: "Manage fuel transactions.",
        },
      },
      {
        path: "driver-bonuses",
        name: "operation_finance_driver_bonuses",
        component: () => import("./pages/finance/DriverBonuses.vue"),
        meta: {
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
      title: "Drivers",
      description: "Manage driver profiles, assignments and performance.",
    },
  },
  {
    path: "drivers/add",
    name: "operation_drivers_add",
    component: () => import("./pages/AddDriver.vue"),
    meta: {
      title: "Add Driver",
      description: "Create a new driver profile.",
    },
  },
  {
    path: "drivers/edit/:id",
    name: "operation_drivers_edit",
    component: () => import("./pages/EditDriver.vue"),
    meta: {
      title: "Edit Driver",
      description: "Modify an existing driver profile.",
    },
  },
  {
    path: "drivers/:id",
    name: "operation_driver_details",
    component: () => import("./pages/DriverDetails.vue"),
    meta: {
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
          title: "Categories",
          description: "Manage inventory categories.",
        },
      },
      {
        path: "categories/add",
        name: "operation_inventory_categories_add",
        component: () => import("./pages/Inventory/InventoryCategoryAdd.vue"),
        meta: {
          title: "Add Category",
          description: "Add a new inventory category.",
        },
      },
      {
        path: "categories/edit/:id",
        name: "operation_inventory_categories_edit",
        component: () => import("./pages/Inventory/InventoryCategoryEdit.vue"),
        meta: {
          title: "Edit Category",
          description: "Edit an existing inventory category.",
        },
      },
      {
        path: "item-groups",
        name: "operation_inventory_item_groups",
        component: () => import("./pages/Inventory/ItemGroups.vue"),
        meta: {
          title: "Item Groups",
          description: "Manage inventory item groups.",
        },
      },
      {
        path: "item-groups/add",
        name: "operation_inventory_item_groups_add",
        component: () => import("./pages/Inventory/ItemGroupAdd.vue"),
        meta: {
          title: "Add Item Group",
          description: "Add a new inventory item group.",
        },
      },
      {
        path: "item-groups/edit/:id",
        name: "operation_inventory_item_groups_edit",
        component: () => import("./pages/Inventory/ItemGroupEdit.vue"),
        meta: {
          title: "Edit Item Group",
          description: "Edit an existing inventory item group.",
        },
      },
      {
        path: "vendor",
        name: "operation_inventory_vendor",
        component: () => import("./pages/Inventory/Vendor.vue"),
        meta: { title: "Vendor", description: "Manage inventory vendors." },
      },
      {
        path: "vendor/add",
        name: "operation_inventory_vendor_add",
        component: () => import("./pages/Inventory/VendorAdd.vue"),
        meta: {
          title: "Add Vendor",
          description: "Add a new inventory vendor.",
        },
      },
      {
        path: "vendor/edit/:id",
        name: "operation_inventory_vendor_edit",
        component: () => import("./pages/Inventory/VendorEdit.vue"),
        meta: {
          title: "Edit Vendor",
          description: "Edit an existing inventory vendor.",
        },
      },
      {
        path: "items",
        name: "operation_inventory_items",
        component: () => import("./pages/Inventory/Items.vue"),
        meta: { title: "Items", description: "Manage inventory items." },
      },
      {
        path: "items/add",
        name: "operation_inventory_items_add",
        component: () => import("./pages/Inventory/ItemAdd.vue"),
        meta: {
          title: "Add Inventory Item",
          description: "Add a new inventory item.",
        },
      },
      {
        path: "items/edit/:id",
        name: "operation_inventory_items_edit",
        component: () => import("./pages/Inventory/ItemEdit.vue"),
        meta: {
          title: "Edit Inventory Item",
          description: "Edit an existing inventory item.",
        },
      },
      {
        path: "store-requisition",
        name: "operation_inventory_store_requisition",
        component: () => import("./pages/Inventory/StoreRequisition.vue"),
        meta: {
          title: "Store Requisition",
          description: "Manage store requisition vouchers.",
        },
      },
      {
        path: "store-requisition/add",
        name: "operation_inventory_store_requisition_add",
        component: () => import("./pages/Inventory/StoreRequisitionAdd.vue"),
        meta: {
          title: "Add Requisition",
          description: "Create a new store requisition.",
        },
      },
      {
        path: "store-requisition/edit/:id",
        name: "operation_inventory_store_requisition_edit",
        component: () => import("./pages/Inventory/StoreRequisitionEdit.vue"),
        meta: {
          title: "Edit Requisition",
          description: "Edit an existing store requisition.",
        },
      },
      {
        path: "purchase-requisition",
        name: "operation_inventory_purchase_requisition",
        component: () => import("./pages/Inventory/PurchaseRequisition.vue"),
        meta: {
          title: "Purchase Requisition",
          description: "Manage purchase requisition requests.",
        },
      },
      {
        path: "purchase-requisition/add",
        name: "operation_inventory_purchase_requisition_add",
        component: () => import("./pages/Inventory/PurchaseRequisitionAdd.vue"),
        meta: {
          title: "Add Purchase Requisition",
          description: "Create a new purchase requisition.",
        },
      },
      {
        path: "purchase-requisition/edit/:id",
        name: "operation_inventory_purchase_requisition_edit",
        component: () =>
          import("./pages/Inventory/PurchaseRequisitionEdit.vue"),
        meta: {
          title: "Edit Purchase Requisition",
          description: "Edit an existing purchase requisition.",
        },
      },
      {
        path: "purchase-order",
        name: "operation_inventory_purchase_order",
        component: () => import("./pages/Inventory/PurchaseOrder.vue"),
        meta: {
          title: "Purchase Order",
          description: "Manage inventory purchase orders.",
        },
      },
      {
        path: "purchase-order/add",
        name: "operation_inventory_purchase_order_add",
        component: () => import("./pages/Inventory/PurchaseOrderAdd.vue"),
        meta: {
          title: "Add Purchase Order",
          description: "Create a new purchase order.",
        },
      },
      {
        path: "purchase-order/edit/:id",
        name: "operation_inventory_purchase_order_edit",
        component: () => import("./pages/Inventory/PurchaseOrderEdit.vue"),
        meta: {
          title: "Edit Purchase Order",
          description: "Edit an existing purchase order.",
        },
      },
      {
        path: "good-transfer",
        name: "operation_inventory_good_transfer",
        component: () => import("./pages/Inventory/GoodTransfer.vue"),
        meta: {
          title: "Issue / Receive",
          description: "Track good transfers, issues and receipts.",
        },
      },
      {
        path: "good-transfer/add",
        name: "operation_inventory_good_transfer_add",
        component: () => import("./pages/Inventory/GoodTransferAdd.vue"),
        meta: {
          title: "Add Transfer Voucher",
          description: "Create a new good transfer voucher.",
        },
      },
      {
        path: "good-transfer/edit/:id",
        name: "operation_inventory_good_transfer_edit",
        component: () => import("./pages/Inventory/GoodTransferEdit.vue"),
        meta: {
          title: "Edit Transfer Voucher",
          description: "Edit an existing good transfer voucher.",
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
          title: "User and Role",
          description: "Manage users, roles and permissions.",
        },
      },
      {
        path: "user-and-role/user/add",
        name: "operation_setting_user_add",
        component: () => import("./pages/setting/UserAdd.vue"),
        meta: {
          title: "Register User",
          description: "Create a new user account.",
        },
      },
      {
        path: "user-and-role/user/edit/:id",
        name: "operation_setting_user_edit",
        component: () => import("./pages/setting/UserEdit.vue"),
        meta: {
          title: "Edit User",
          description: "Edit an existing user account.",
        },
      },
      {
        path: "user-and-role/role/add",
        name: "operation_setting_role_add",
        component: () => import("./pages/setting/RoleAdd.vue"),
        meta: {
          title: "Add Role",
          description: "Create a new role with permissions.",
        },
      },
      {
        path: "user-and-role/role/edit/:id",
        name: "operation_setting_role_edit",
        component: () => import("./pages/setting/RoleEdit.vue"),
        meta: {
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
        },
      },
      // Road Type
      {
        path: "base-configuration/road-type/add",
        component: () =>
          import("./pages/setting/BaseConfiguration pages/RoadTypeAdd.vue"),
        meta: { title: "Add Road Type" },
      },
      {
        path: "base-configuration/road-type/edit/:id",
        component: () =>
          import("./pages/setting/BaseConfiguration pages/RoadTypeEdit.vue"),
        meta: { title: "Edit Road Type" },
      },
      // Terrain Type
      {
        path: "base-configuration/terrain-type/add",
        component: () =>
          import("./pages/setting/BaseConfiguration pages/TerrainTypeAdd.vue"),
        meta: { title: "Add Terrain Type" },
      },
      {
        path: "base-configuration/terrain-type/edit/:id",
        component: () =>
          import("./pages/setting/BaseConfiguration pages/TerrainTypeEdit.vue"),
        meta: { title: "Edit Terrain Type" },
      },
      // Bank
      {
        path: "base-configuration/bank/add",
        component: () =>
          import("./pages/setting/BaseConfiguration pages/BankAdd.vue"),
        meta: { title: "Add Bank" },
      },
      {
        path: "base-configuration/bank/edit/:id",
        component: () =>
          import("./pages/setting/BaseConfiguration pages/BankEdit.vue"),
        meta: { title: "Edit Bank" },
      },
      // Insurance
      {
        path: "base-configuration/insurance/add",
        component: () =>
          import("./pages/setting/BaseConfiguration pages/InsuranceAdd.vue"),
        meta: { title: "Add Insurance" },
      },
      {
        path: "base-configuration/insurance/edit/:id",
        component: () =>
          import("./pages/setting/BaseConfiguration pages/InsuranceEdit.vue"),
        meta: { title: "Edit Insurance" },
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
        meta: { title: "Contract", description: "Manage business contracts." },
      },
      {
        path: "contract/add",
        name: "operation_setting_contract_add",
        component: () => import("./pages/setting/ContractAdd.vue"),
        meta: {
          title: "Add Contract",
          description: "Create a new carrier contract.",
        },
      },

      {
        path: "commodity",
        name: "operation_setting_commodity",
        component: () => import("./pages/setting/Commodity.vue"),
        meta: { title: "Commodity", description: "Manage commodities." },
      },
      {
        path: "commodity/add",
        name: "operation_setting_commodity_add",
        component: () => import("./pages/setting/CommodityAdd.vue"),
        meta: {
          title: "Add Commodity",
          description: "Create a new commodity.",
        },
      },
      {
        path: "commodity/edit/:id",
        name: "operation_setting_commodity_edit",
        component: () => import("./pages/setting/CommodityEdit.vue"),
        meta: {
          title: "Edit Commodity",
          description: "Edit an existing commodity.",
        },
      },

      {
        path: "packaging",
        name: "operation_setting_packaging",
        component: () => import("./pages/setting/Packaging.vue"),
        meta: { title: "Packaging", description: "Manage packaging types." },
      },
      {
        path: "packaging/add",
        name: "operation_setting_packaging_add",
        component: () => import("./pages/setting/PackagingAdd.vue"),
        meta: {
          title: "Add Packaging",
          description: "Create a new packaging type.",
        },
      },
      {
        path: "packaging/edit/:id",
        name: "operation_setting_packaging_edit",
        component: () => import("./pages/setting/PackagingEdit.vue"),
        meta: {
          title: "Edit Packaging",
          description: "Edit an existing packaging type.",
        },
      },

      {
        path: "route-request",
        name: "operation_setting_route_request",
        component: () => import("./pages/setting/RouteRequests.vue"),
        meta: {
          title: "Route Requests",
          description: "Manage route requests.",
        },
      },

      {
        path: "region",
        name: "operation_setting_region",
        component: () => import("./pages/setting/Region.vue"),
        meta: { title: "Region", description: "Manage regions." },
      },
      {
        path: "region/add",
        name: "operation_setting_region_add",
        component: () => import("./pages/setting/RegionAdd.vue"),
        meta: { title: "Add Region", description: "Create a new region." },
      },
      {
        path: "region/edit/:id",
        name: "operation_setting_region_edit",
        component: () => import("./pages/setting/RegionEdit.vue"),
        meta: { title: "Edit Region", description: "Edit an existing region." },
      },
      {
        path: "bonus-multipliers",
        name: "operation_setting_bonus_multipliers",
        component: () => import("./pages/setting/BonusMultipliers.vue"),
        meta: {
          title: "Bonus Multipliers",
          description: "Manage bonus multipliers.",
        },
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
        meta: {
          title: "Announcements",
          description: "Manage system announcements.",
        },
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
