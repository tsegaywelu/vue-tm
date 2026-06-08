import type { RouteRecordRaw } from 'vue-router';
import { RouterView } from 'vue-router';

export const fleet_routes: RouteRecordRaw[] = [
  {
    path: 'fleet',
    name: 'fleet_parent',
    component: RouterView,
    redirect: '/fleet/fuel-entries',
    children: [
      // ── Fuel Entries ────────────────────────────────────────────────────
      {
        path: 'fuel-entries',
        name: 'fleet_fuel_entries',
        component: () => import('./pages/FuelEntries.vue'),
        meta: {
          permission: 'VEHICLE',
          title: 'Fuel Entries',
          description: 'Track and manage vehicle fuel entries.',
        },
      },
      {
        path: 'fuel-entries/add',
        name: 'fleet_fuel_entries_add',
        component: () => import('./pages/FuelEntriesAdd.vue'),
        meta: {
          permission: 'VEHICLE',
          title: 'Add Fuel Entry',
          description: 'Record a new fuel entry for a vehicle.',
        },
      },
      {
        path: 'fuel-entries/edit/:id',
        name: 'fleet_fuel_entries_edit',
        component: () => import('./pages/FuelEntriesEdit.vue'),
        meta: {
          permission: 'VEHICLE',
          title: 'Edit Fuel Entry',
          description: 'Update an existing fuel entry.',
        },
      },
      {
        path: 'fuel-entries/:id',
        name: 'fleet_fuel_entry_detail',
        component: () => import('./pages/FuelEntryDetail.vue'),
        meta: {
          permission: 'VEHICLE',
          title: 'Fuel Entry Details',
          description: 'View fuel entry details.',
        },
      },

      // ── Meter Entries ───────────────────────────────────────────────────
      {
        path: 'meter-entries',
        name: 'fleet_meter_entries',
        component: () => import('./pages/MeterEntries.vue'),
        meta: {
          permission: 'VEHICLE',
          title: 'Meter Entries',
          description: 'Track odometer and engine hour readings.',
        },
      },
      {
        path: 'meter-entries/add',
        name: 'fleet_meter_entries_add',
        component: () => import('./pages/MeterEntriesAdd.vue'),
        meta: {
          permission: 'VEHICLE',
          title: 'Add Meter Entry',
          description: 'Record a new meter reading for a vehicle.',
        },
      },
      {
        path: 'meter-entries/edit/:id',
        name: 'fleet_meter_entries_edit',
        component: () => import('./pages/MeterEntriesEdit.vue'),
        meta: {
          permission: 'VEHICLE',
          title: 'Edit Meter Entry',
          description: 'Update an existing meter entry.',
        },
      },
      {
        path: 'meter-entries/:id',
        name: 'fleet_meter_entry_detail',
        component: () => import('./pages/MeterEntryDetail.vue'),
        meta: {
          permission: 'VEHICLE',
          title: 'Meter Entry Details',
          description: 'View meter entry details.',
        },
      },

      // ── Vehicle Expenses ─────────────────────────────────────────────────
      {
        path: 'vehicle-expenses',
        name: 'fleet_vehicle_expenses',
        component: () => import('./pages/VehicleExpenses.vue'),
        meta: {
          permission: 'VEHICLE',
          title: 'Vehicle Expenses',
          description: 'Track and manage vehicle expense entries.',
        },
      },
      {
        path: 'vehicle-expenses/add',
        name: 'fleet_vehicle_expenses_add',
        component: () => import('./pages/VehicleExpensesAdd.vue'),
        meta: {
          permission: 'VEHICLE',
          title: 'Add Vehicle Expense',
          description: 'Record a new expense entry for a vehicle.',
        },
      },
      {
        path: 'vehicle-expenses/edit/:id',
        name: 'fleet_vehicle_expenses_edit',
        component: () => import('./pages/VehicleExpensesEdit.vue'),
        meta: {
          permission: 'VEHICLE',
          title: 'Edit Vehicle Expense',
          description: 'Update an existing vehicle expense entry.',
        },
      },
      {
        path: 'vehicle-expenses/:id',
        name: 'fleet_vehicle_expense_detail',
        component: () => import('./pages/VehicleExpenseDetail.vue'),
        meta: {
          permission: 'VEHICLE',
          title: 'Vehicle Expense Details',
          description: 'View vehicle expense entry details.',
        },
      },

      // ── Recurring Expense Rules ──────────────────────────────────────────
      {
        path: 'recurring-rules',
        name: 'fleet_recurring_rules',
        component: () => import('./pages/RecurringRules.vue'),
        meta: {
          permission: 'VEHICLE',
          title: 'Recurring Expense Rules',
          description: 'Manage recurring vehicle expense schedules.',
        },
      },
      {
        path: 'recurring-rules/add',
        name: 'fleet_recurring_rules_add',
        component: () => import('./pages/RecurringRulesAdd.vue'),
        meta: {
          permission: 'VEHICLE',
          title: 'Add Recurring Rule',
          description: 'Create a new recurring expense rule.',
        },
      },
      {
        path: 'recurring-rules/edit/:id',
        name: 'fleet_recurring_rules_edit',
        component: () => import('./pages/RecurringRulesEdit.vue'),
        meta: {
          permission: 'VEHICLE',
          title: 'Edit Recurring Rule',
          description: 'Update an existing recurring expense rule.',
        },
      },
      {
        path: 'recurring-rules/:id',
        name: 'fleet_recurring_rule_detail',
        component: () => import('./pages/RecurringRuleDetail.vue'),
        meta: {
          permission: 'VEHICLE',
          title: 'Recurring Rule Details',
          description: 'View recurring expense rule details.',
        },
      },
    ],
  },
];
