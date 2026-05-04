<template>
  <Form
    id="vehicle-filter"
    @change="
      (values) => {
        emit('change', values);
      }
    "
    class="[&_.input-focus]:bg-grey-25 flex-1 flex max-h-16 h-16 min-h-16 *:w-[220px] *:shrink-0 px-2 gap-2 overflow-auto"
  >
    <SelectInput
      :show_validation_status="false"
      label="Vehicle Ownership"
      name="ownership"
      size="xs"
      :options="ownershipOptions"
      :attributes="{
        placeholder: 'Select Ownership',
      }"
    />
    <SelectInput
      :show_validation_status="false"
      label="Vehicle Type"
      name="vehicleType"
      size="xs"
      url="/vehicle-type"
      label_key="name"
      value_key="name"
      searchable
      :attributes="{
        placeholder: 'Select Vehicle Type',
      }"
    />
    <SelectInput
      :show_validation_status="false"
      label="Status"
      name="status"
      size="xs"
      :options="statusOptions"
      :attributes="{
        placeholder: 'Select Status',
      }"
    />
  </Form>
</template>

<script setup lang="ts">
import SelectInput from "@/components/form/SelectInput.vue";
import Form from "@/components/form/Form.vue";
import { VehicleOwnership } from "../operation.types";

const emit = defineEmits(["change"]);

const ownershipOptions = Object.values(VehicleOwnership).map((v) => ({
  label: v,
  value: v,
}));

const statusOptions = [
  { label: "Available", value: "available" },
  { label: "Assigned", value: "assigned" },
  { label: "Inactive", value: "inactive" },
  { label: "Maintenance", value: "maintenance" },
  { label: "Accident", value: "accident" },
  { label: "Retired", value: "retired" },
  { label: "Sold", value: "sold" },
];
</script>
