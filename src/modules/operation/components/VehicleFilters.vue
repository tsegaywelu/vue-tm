<template>
  <Form
    id="vehicle-filter"
    :enable_unsaved_guard="false"
    :values="formValues"
    @change="handleChange"
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
    <VehicleTypeInput
      name="vehicleType"
      size="xs"
      value_key="name"
      :attributes="{ placeholder: 'Select Vehicle Type' }"
      :initial_labels="fieldLabels['vehicleType']"
      @select="(opt: any) => captureLabel('vehicleType', opt, 'name', 'name')"
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
import { ref, onMounted, watch } from "vue";
import SelectInput from "@/components/form/SelectInput.vue";
import VehicleTypeInput from "@/components/common/inputs/VehicleTypeInput.vue";
import Input from "@/components/form/Input.vue";
import Form from "@/components/form/Form.vue";
import { VehicleOwnership } from "../operation.types";
import {
  useTableLastParams,
  useTableLastLabels,
} from "@/composables/usePagination";
import { useTablePaginationStore } from "@/store/tablePaginationStore";

const props = defineProps<{
  paginationId?: string;
  filters?: Record<string, any>;
}>();

const emit = defineEmits(["change"]);

const store = useTablePaginationStore();
const lastParams = useTableLastParams(props.paginationId ?? "");
const lastLabels = useTableLastLabels(props.paginationId ?? "");

const fieldLabels = ref<Record<string, Record<string, string>>>({});

function getNestedValue(obj: any, path: string): string {
  return path.split(".").reduce((acc: any, key) => acc?.[key], obj) ?? "";
}

function captureLabel(
  field: string,
  opt: any,
  valueKey: string,
  labelKey: string,
) {
  const value = String(getNestedValue(opt, valueKey));
  const label = getNestedValue(opt, labelKey);
  if (!fieldLabels.value[field]) fieldLabels.value[field] = {};
  fieldLabels.value[field][value] = label;
  store.setLabels(props.paginationId ?? "", { ...fieldLabels.value });
}

const filterFieldOptions = [
  { label: "Plate Number", value: "vehiclePlateNumber" },
  { label: "First Name", value: "driverFirstName" },
  { label: "Middle Name", value: "driverMiddleName" },
  { label: "Last Name", value: "driverLastName" },
];

function handleChange(values: any) {
  const selectedOpt = filterFieldOptions.find(
    (o) => o.value === values.filterField,
  );
  emit("change", {
    ownership: values.ownership,
    vehicleType: values.vehicleType,
    status: values.status,
    searchQuery: values.searchQuery || undefined,
    selectedFilterOption: selectedOpt ?? undefined,
  });
}

const FORM_FILTER_FIELDS = [
  "ownership",
  "vehicleType",
  "status",
  "searchQuery",
];

const formValues = ref<Record<string, any> | undefined>(undefined);

onMounted(() => {
  const saved = lastParams.value;
  if (Object.keys(lastLabels.value).length > 0) {
    fieldLabels.value = { ...lastLabels.value };
  }
  const filterOnly: Record<string, any> = {};
  for (const field of FORM_FILTER_FIELDS) {
    if (field in saved && saved[field] !== undefined) {
      filterOnly[field] = saved[field];
    }
  }
  if (saved.selectedFilterOption?.value) {
    filterOnly.filterField = saved.selectedFilterOption.value;
  }
  const merged = { ...filterOnly, ...(props.filters || {}) };
  if (Object.keys(merged).length > 0) {
    formValues.value = merged;
  }
});

watch(
  () => props.filters,
  (newFilters) => {
    if (!newFilters) return;
    formValues.value = { ...(formValues.value || {}), ...newFilters };
  },
  { deep: true },
);

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
