<template>
  <div class="flex flex-col gap-8">
    <!-- Requisition Header -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Input
        name="date"
        label="Date"
        :attributes="{ type: 'date' }"
        :validation="{ required }"
      />
      <Input
        name="requiredDate"
        label="Required Date"
        :attributes="{ type: 'date' }"
        :validation="{ required }"
      />
      <SelectInput
        name="department"
        label="Department"
        :options="departmentOptions"
        :validation="{ required }"
      />
      <Input
        name="classification"
        label="Classification"
        :attributes="{ placeholder: 'Enter classification' }"
      />
      <Input
        name="costCenter"
        label="Cost Center"
        :attributes="{ placeholder: 'Enter cost center' }"
      />
      <Input
        name="siv"
        label="SIV"
        :attributes="{ placeholder: 'Enter SIV' }"
      />
    </div>

    <!-- Requested Items Section -->
    <RequisitionItemsInput name="items" />
  </div>
</template>

<script setup lang="ts">
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import RequisitionItemsInput from "../inputs/RequisitionItemsInput.vue";
import { required } from "@/utils/validations";

const departmentOptions = [
  { label: "Operation", value: "Operation" },
  { label: "Finance", value: "Finance" },
  { label: "Maintenance", value: "Maintenance" },
  { label: "Management", value: "Management" },
  { label: "Human Resource", value: "Human Resource" },
  { label: "IT", value: "IT" },
];
</script>
