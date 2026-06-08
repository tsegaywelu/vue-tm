<template>
  <Form
    id="paid-sub-contracts-filter"
    :enable_unsaved_guard="false"
    :values="formValues"
    @change="handleChange"
    class="[&_.input-focus]:bg-grey-25 flex-1 flex max-h-16 h-16 min-h-16 *:w-[200px] *:shrink-0 px-2 gap-2 overflow-auto items-center"
  >
    <SelectInput
      :show_validation_status="false"
      label="Transporter"
      name="transporterType"
      size="xs"
      :options="[
        { label: 'All', value: '' },
        { label: 'LTSC', value: 'LTSC' },
        { label: 'STSC', value: 'STSC' }
      ]"
      :attributes="{ placeholder: 'Select Transporter' }"
    />

    <SelectInput
      :show_validation_status="false"
      label="Product Type"
      name="productType"
      size="xs"
      :options="[
        { label: 'All', value: '' },
        { label: 'Inbound', value: 'IN_BOUND' },
        { label: 'Outbound', value: 'OUT_BOUND' },
        { label: 'Site Transfer', value: 'SITE_TRANSFER' }
      ]"
      :attributes="{ placeholder: 'Select Product Type' }"
    />

    <SelectInput
      :show_validation_status="false"
      label="Trip Type"
      name="tripType"
      size="xs"
      :options="[
        { label: 'All', value: '' },
        { label: 'Single Trip', value: 'single_trip' },
        { label: 'Round Trip', value: 'round_trip' }
      ]"
      :attributes="{ placeholder: 'Select Trip Type' }"
    />

    <SelectInput
      :show_validation_status="false"
      label="Document Uploaded"
      name="areDocumentsUploaded"
      size="xs"
      :options="[
        { label: 'All', value: '' },
        { label: 'Uploaded', value: 'true' },
        { label: 'Not Uploaded', value: 'false' }
      ]"
      :attributes="{ placeholder: 'Select Status' }"
    />

    <SelectInput
      searchable
      :show_validation_status="false"
      label="Shipper"
      name="shipperName"
      size="xs"
      label_key="name"
      value_key="_id"
      url="/shipper"
      :attributes="{ placeholder: 'Select Shipper' }"
      :initial_labels="fieldLabels['shipperName']"
      @select="(opt: any) => captureLabel('shipperName', opt, '_id', 'name')"
    />

    <SelectInput
      searchable
      :show_validation_status="false"
      label="Origin City"
      multiple
      parent_class_name=""
      size="xs"
      name="routeOrigin"
      url="/city"
      value_key="name"
      label_key="name"
      :display_label_fn="(c: any) => c.code || c.name"
      :params="(values: any) => ({ q: undefined, ...(values.search ? { name: { regexAny: values.search } } : {}) })"
      :attributes="{ placeholder: 'Select Origin City' }"
      :initial_labels="fieldLabels['routeOrigin']"
      @select="(opt: any) => captureLabel('routeOrigin', opt, 'name', (c: any) => c.code || c.name)"
    />
    <SelectInput
      searchable
      :show_validation_status="false"
      label="Destination City"
      multiple
      parent_class_name=""
      size="xs"
      name="routeDestination"
      url="/city"
      value_key="name"
      label_key="name"
      :display_label_fn="(c: any) => c.code || c.name"
      :params="(values: any) => ({ q: undefined, ...(values.search ? { name: { regexAny: values.search } } : {}) })"
      :attributes="{ placeholder: 'Select Destination City' }"
      :initial_labels="fieldLabels['routeDestination']"
      @select="(opt: any) => captureLabel('routeDestination', opt, 'name', (c: any) => c.code || c.name)"
    />
  </Form>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import SelectInput from "@/components/form/SelectInput.vue";
import Form from "@/components/form/Form.vue";
import { useTableLastParams, useTableLastLabels } from "@/composables/usePagination";
import { useTablePaginationStore } from "@/store/tablePaginationStore";

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

function captureLabel(field: string, opt: any, valueKey: string, labelKeyOrFn: string | ((item: any) => string)) {
  const value = String(getNestedValue(opt, valueKey));
  const label = typeof labelKeyOrFn === "function"
    ? labelKeyOrFn(opt)
    : getNestedValue(opt, labelKeyOrFn);
  if (!fieldLabels.value[field]) fieldLabels.value[field] = {};
  fieldLabels.value[field][value] = label;
  store.setLabels(props.paginationId ?? "", { ...fieldLabels.value });
}

const FORM_FILTER_FIELDS = [
  "transporterType", "productType", "tripType", "areDocumentsUploaded", "shipperName",
  "routeOrigin", "routeDestination",
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
  if (typeof filterOnly.routeOrigin === "string") {
    filterOnly.routeOrigin = filterOnly.routeOrigin.split(",").filter(Boolean);
  }
  if (typeof filterOnly.routeDestination === "string") {
    filterOnly.routeDestination = filterOnly.routeDestination.split(",").filter(Boolean);
  }
  if (Object.keys(filterOnly).length > 0) {
    formValues.value = filterOnly;
  }
});

const handleChange = (values: any) => {
  emit('change', {
    ...values,
    routeOrigin: values.routeOrigin?.length ? values.routeOrigin.join(',') : undefined,
    routeDestination: values.routeDestination?.length ? values.routeDestination.join(',') : undefined,
  });
};
</script>
