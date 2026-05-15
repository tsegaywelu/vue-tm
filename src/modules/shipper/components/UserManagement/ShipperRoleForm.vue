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
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-lg font-bold text-gray-900">Permissions</h3>
          <p class="text-sm text-gray-500">Grant specific access to system modules.</p>
        </div>
        <div class="flex gap-2">
          <button
            type="button"
            @click="selectAllPermissions"
            class="text-xs font-bold text-primary hover:underline"
          >
            Select All
          </button>
          <span class="text-gray-300">|</span>
          <button
            type="button"
            @click="clearAllPermissions"
            class="text-xs font-bold text-error-500 hover:underline"
          >
            Clear All
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="subject in subjects"
          :key="subject"
          class="p-4 bg-white rounded-2xl border border-gray-100 hover:border-primary/20 transition-all group"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-black text-gray-400 group-hover:text-primary transition-colors uppercase tracking-widest">
              {{ subject.replace(/_/g, ' ') }}
            </span>
          </div>
          <div class="flex flex-wrap gap-2">
            <label
              v-for="action in getActionsForSubject(subject)"
              :key="action"
              class="flex items-center gap-2 px-2 py-1.5 rounded-lg border border-gray-50 hover:bg-gray-50 cursor-pointer transition-all"
            >
              <input
                type="checkbox"
                :checked="isPermissionChecked(subject, action)"
                @change="(e) => togglePermission(subject, action, (e.target as HTMLInputElement).checked)"
                class="size-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span class="text-[10px] font-bold text-gray-600 capitalize">
                {{ action.replace(/_/g, ' ') }}
              </span>
            </label>
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
  "ALL", "ADVANCE_PAYMENT", "ANNOUNCEMENT", "AUTH", "BANK", "COMMODITY", "CONTACT", "CONTRACT",
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
};

const getActionsForSubject = (subject: string) => {
  const actions = [...baseActions];
  if (specificActions[subject]) {
    actions.push(...specificActions[subject]);
  }
  return [...new Set(actions)];
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

const selectAllPermissions = () => {
  const allPerms = subjects.map(s => ({
    subject: s,
    action: getActionsForSubject(s)
  }));
  formContext.form.setFieldValue("permissions", allPerms);
};

const clearAllPermissions = () => {
  formContext.form.setFieldValue("permissions", []);
};
</script>
