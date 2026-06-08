<template>
  <div class="flex flex-col gap-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Input
        name="name"
        label="Role Name"
        :validation="{ required }"
        :attributes="{
          placeholder: 'Enter role name...'
        }"
      />
      <SelectInput
        name="type"
        label="Type"
        :options="[
          { label: 'Admin', value: 'ADMIN' },
          { label: 'User', value: 'USER' }
        ]"
        :validation="{ required }"
      />
      <div class="md:col-span-2">
        <TextareaInput
          name="description"
          label="Description"
          :attributes="{
            placeholder: 'Enter description...'
          }"
        />
      </div>
    </div>

    <!-- Permissions Section -->
    <div class="mt-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 class="text-lg font-bold text-base-text">Permissions</h3>
          <p class="text-sm text-dim-text">Grant specific access to system modules.</p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <button
            type="button"
            @click="selectAllPermissions"
            class="text-xs font-bold text-primary hover:underline"
          >
            Select All
          </button>
          <span class="text-line-strong">|</span>
          <button
            type="button"
            @click="clearAllPermissions"
            class="text-xs font-bold text-error hover:underline"
          >
            Clear All
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="subject in subjects"
          :key="subject"
          class="p-4 bg-surface rounded-2xl border border-line hover:border-primary/45 transition-all group"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-black text-faint-text group-hover:text-primary transition-colors uppercase tracking-widest">
              {{ subject.replace(/_/g, ' ') }}
            </span>
          </div>
          <div class="flex flex-wrap gap-2">
            <label
              v-for="action in getRegularActions(subject)"
              :key="action"
              class="flex items-center gap-2 px-2 py-1.5 rounded-lg border border-line bg-surface-muted hover:bg-surface-hover cursor-pointer transition-all"
            >
              <input
                type="checkbox"
                :checked="isPermissionChecked(subject, action)"
                @change="(e) => togglePermission(subject, action, (e.target as HTMLInputElement).checked)"
                class="size-4 rounded border-line-strong bg-surface text-primary focus:ring-primary"
              />
              <span class="text-[10px] font-bold text-dim-text capitalize">
                {{ action.replace(/_/g, ' ') }}
              </span>
            </label>
          </div>
          <div v-if="hasScopeActions(subject)" class="mt-2 pt-2 border-t border-gray-100">
            <p class="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Scope</p>
            <div class="flex flex-wrap gap-2">
              <label
                v-for="scope in getScopeActionsForSubject(subject)"
                :key="scope"
                class="flex items-center gap-2 px-2 py-1.5 rounded-lg border border-gray-50 hover:bg-gray-50 cursor-pointer transition-all"
              >
                <input
                  type="radio"
                  :name="`scope-${subject}`"
                  :checked="isPermissionChecked(subject, scope)"
                  @click="() => toggleScopePermission(subject, scope)"
                  class="size-4 border-gray-300 text-primary focus:ring-primary"
                />
                <span class="text-[10px] font-bold text-gray-600 capitalize">
                  {{ scope.replace(/_/g, ' ') }}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import { required } from "@/utils/validations";
import TextareaInput from "@/components/form/TextareaInput.vue";

const formContext = inject("formContext") as any;

const subjects = [
  "ALL", "ADVANCE_PAYMENT", "ANNOUNCEMENT", "AUTH", "BANK", "DRIVER_BONUS", "COMMODITY", "CONTACT", "CONTRACT",
  "DRIVER", "EXPENSE", "GROUP", "INSPECTION", "INSURANCE", "MAKER", "MECHANIC", "ORDER",
  "PACKAGING", "PAYMENT_REQUEST", "REPORT", "ROLE", "ROUTE", "SERVICE_RECORD", "SHIPMENT",
  "SHIPPER", "TRANSPORTER", "TYRE", "USER", "VEHICLE", "WORK_ORDER", "WORKSHOP",
  "INVENTORY_ITEM", "CATEGORY", "ITEM_GROUP", "PURCHASE_REQUISITION", "GOOD_TRANSFER_VOUCHER",
  "PURCHASE_ORDER", "STORE_REQUISITION_VOUCHER", "SUPPLIER"
];

const baseActions = ["manage", "view", "read", "create", "update", "delete"];
const specificActions: Record<string, string[]> = {
  SHIPMENT: ["approve", "pay", "authorize", "cancel", "reject", "change_status", "generate_invoice", "receivable_shipment", "payable_shipment"],
  PURCHASE_REQUISITION: ["approve", "authorize", "cancel", "reject"],
  PURCHASE_ORDER: ["approve", "authorize", "cancel", "reject", "pay"],
  GOOD_TRANSFER_VOUCHER: ["approve", "authorize", "cancel", "reject"],
  STORE_REQUISITION_VOUCHER: ["approve", "authorize", "cancel", "reject"],
  ADVANCE_PAYMENT: ["approve", "authorize", "pay"],
  WORK_ORDER: ["approve"],
  DRIVER: ["self", "region", "all_regions"],
  DRIVER_BONUS: ["self", "region", "all_regions"],
  CONTACT: ["self", "region", "all_regions"],
  MECHANIC: ["self", "region", "all_regions"],
  ROUTE: ["self", "region", "all_regions"],
  TRANSPORTER: ["self", "region", "all_regions"],
  VEHICLE: ["self", "region", "all_regions"],
  WORKSHOP: ["self", "region", "all_regions"],
};

const scopeActionsList = ["self", "region", "all_regions"];

const hasScopeActions = (subject: string) =>
  (specificActions[subject] || []).some(a => scopeActionsList.includes(a));

const getScopeActionsForSubject = (subject: string) =>
  (specificActions[subject] || []).filter(a => scopeActionsList.includes(a));

const getRegularActions = (subject: string) => {
  const specific = (specificActions[subject] || []).filter(a => !scopeActionsList.includes(a));
  return [...new Set([...baseActions, ...specific])];
};

const isPermissionChecked = (subject: string, action: string) => {
  const permissions = formContext.form.state.values.permissions || [];
  const perm = permissions.find((p: any) => p.subject === subject);
  return perm?.action?.includes(action) || false;
};

const togglePermission = (subject: string, action: string, checked: boolean) => {
  const permissions = [...(formContext.form.state.values.permissions || [])];
  const permIndex = permissions.findIndex((p: any) => p.subject === subject);

  if (checked) {
    if (permIndex > -1) {
      if (!permissions[permIndex].action.includes(action)) {
        permissions[permIndex].action.push(action);
      }
    } else {
      permissions.push({ subject, action: [action] });
    }
  } else {
    if (permIndex > -1) {
      permissions[permIndex].action = permissions[permIndex].action.filter((a: string) => a !== action);
      if (permissions[permIndex].action.length === 0) {
        permissions.splice(permIndex, 1);
      }
    }
  }
  formContext.form.setFieldValue("permissions", permissions);
};

const toggleScopePermission = (subject: string, scope: string) => {
  const permissions = [...(formContext.form.state.values.permissions || [])];
  const permIndex = permissions.findIndex((p: any) => p.subject === subject);
  const scopeActions = getScopeActionsForSubject(subject);

  if (permIndex > -1) {
    const alreadySelected = permissions[permIndex].action.includes(scope);
    permissions[permIndex].action = permissions[permIndex].action.filter((a: string) => !scopeActions.includes(a));
    if (!alreadySelected) {
      permissions[permIndex].action.push(scope);
    }
    if (permissions[permIndex].action.length === 0) {
      permissions.splice(permIndex, 1);
    }
  } else {
    permissions.push({ subject, action: [scope] });
  }
  formContext.form.setFieldValue("permissions", permissions);
};

const selectAllPermissions = () => {
  const allPerms = subjects.map(s => {
    const actions = getRegularActions(s);
    const scopeActions = getScopeActionsForSubject(s);
    if (scopeActions.length > 0) actions.push(scopeActions[scopeActions.length - 1]);
    return { subject: s, action: actions };
  });
  formContext.form.setFieldValue("permissions", allPerms);
};

const clearAllPermissions = () => {
  formContext.form.setFieldValue("permissions", []);
};
</script>
