<template>
  <Form
    id="vehicle-metrics-filter"
    :enable_unsaved_guard="false"
    :values="formValues"
    @change="(values) => emit('change', values)"
    class="[&_.input-focus]:bg-grey-25 flex-1 flex max-h-16 h-16 min-h-16 *:w-[220px] *:shrink-0 px-2 gap-2 overflow-auto"
  >
    <RegionInput
      name="region"
      size="xs"
      class="w-40"
      :initial_labels="fieldLabels['region']"
      @select="(opt: any) => captureLabel('region', opt, '_id', 'name')"
    />
    <VehicleTypeInput
      name="vehicleType"
      size="xs"
      class="w-40"
      :initial_labels="fieldLabels['vehicleType']"
      @select="(opt: any) => captureLabel('vehicleType', opt, '_id', 'name')"
    />
    <VehicleOwnershipInput name="ownership" size="xs" class="w-40" />
    <ProductTypeInput
      v-if="showVehicleUse"
      name="vehicleUse"
      label="Vehicle Use"
      size="xs"
      class="w-40"
      :options="vehicleUseOptions"
    />
  </Form>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Form from "@/components/form/Form.vue";
import RegionInput from "@/components/common/inputs/RegionInput.vue";
import VehicleTypeInput from "@/components/common/inputs/VehicleTypeInput.vue";
import VehicleOwnershipInput from "@/components/common/inputs/VehicleOwnershipInput.vue";
import ProductTypeInput from "@/components/common/inputs/ProductTypeInput.vue";
import { useTableLastParams, useTableLastLabels } from "@/composables/usePagination";
import { useTablePaginationStore } from "@/store/tablePaginationStore";

const props = defineProps<{
  paginationId?: string;
  showVehicleUse?: boolean;
  vehicleUseOptions?: { label: string; value: string }[];
}>();

const emit = defineEmits(["change"]);

const store = useTablePaginationStore();
const lastParams = useTableLastParams(props.paginationId ?? "");
const lastLabels = useTableLastLabels(props.paginationId ?? "");

const fieldLabels = ref<Record<string, Record<string, string>>>({});

function getNestedValue(obj: any, path: string): string {
  return path.split(".").reduce((acc: any, key) => acc?.[key], obj) ?? "";
}

function captureLabel(field: string, opt: any, valueKey: string, labelKey: string) {
  const value = String(getNestedValue(opt, valueKey));
  const label = getNestedValue(opt, labelKey);
  if (!fieldLabels.value[field]) fieldLabels.value[field] = {};
  fieldLabels.value[field][value] = label;
  store.setLabels(props.paginationId ?? "", { ...fieldLabels.value });
}

const FORM_FILTER_FIELDS = ["region", "vehicleType", "ownership", "vehicleUse"];

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
  if (Object.keys(filterOnly).length > 0) {
    formValues.value = filterOnly;
  }
});
</script>
