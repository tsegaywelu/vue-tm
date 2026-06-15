<template>
  <Form
    id="payment-collection-filter"
    :enable_unsaved_guard="false"
    :values="formValues"
    @change="handleChange"
    class="[&_.input-focus]:bg-grey-25 flex-1 flex max-h-16 h-16 min-h-16 *:w-[220px] *:shrink-0 px-2 gap-2 overflow-auto"
  >
    <ShipperInput
      searchable
      :show_validation_status="false"
      label="Shipper"
      size="xs"
      name="shipper"
      :params="
        (state: any) => ({
          name: state.search,
          q: undefined,
        })
      "
      :attributes="{ placeholder: 'Select Shipper' }"
      :initial_labels="fieldLabels['shipper']"
      @select="(opt: any) => captureLabel('shipper', opt, '_id', 'name')"
    />
    <SelectInput
      :show_validation_status="false"
      label="Status"
      name="status"
      size="xs"
      :options="[
        { label: 'All', value: '' },
        { label: 'Approved', value: 'payment_approved' },
        { label: 'Collected', value: 'paid' },
        { label: 'Rejected', value: 'rejected' }
      ]"
      :attributes="{ placeholder: 'Select Status' }"
    />
  </Form>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import SelectInput from "@/components/form/SelectInput.vue";
import Form from "@/components/form/Form.vue";
import { useTableLastParams, useTableLastLabels } from "@/composables/usePagination";
import { useTablePaginationStore } from "@/store/tablePaginationStore";
import ShipperInput from "@/components/common/inputs/ShipperInput.vue";

const props = defineProps<{
  paginationId?: string;
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

const FORM_FILTER_FIELDS = ["shipper", "status"];

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

const handleChange = (values: any) => {
  emit('change', values);
};
</script>
