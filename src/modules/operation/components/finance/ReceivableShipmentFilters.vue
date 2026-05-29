<template>
  <Form
    id="receivable-shipment-filter"
    :enable_unsaved_guard="false"
    :values="formValues"
    @change="handleChange"
    class="[&_.input-focus]:bg-grey-25 flex-1 flex flex-wrap max-h-32 min-h-16 px-2 gap-2 overflow-auto"
  >
    <template #default="{ form }">
      <SelectInput
        :show_validation_status="false"
        label="Filter By"
        name="activeFilters"
        multiple
        size="xs"
        :options="[
        'Product Type',
        'Trip Type',
        'Shipper',
        'Origin',
        'Destination',
        'Vehicle Ownership',
        'Document Uploaded',
        ]"
        :attributes="{ placeholder: 'Choose Filters' }"
      />

      <SelectInput
        v-if="form.state.values.activeFilters?.includes('tripType')"
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
        v-if="form.state.values.activeFilters?.includes('productType')"
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
        v-if="form.state.values.activeFilters?.includes('shipper')"
        searchable
        :show_validation_status="false"
        label="Shipper"
        name="shipper"
        size="xs"
        label_key="name"
        value_key="_id"
        url="/shipper"
        search_key="name"
        :attributes="{ placeholder: 'Choose Shipper' }"
        :initial_labels="fieldLabels['shipper']"
        @select="(opt: any) => captureLabel('shipper', opt, '_id', 'name')"
      />

      <SelectInput
        v-if="form.state.values.activeFilters?.includes('origin')"
        searchable
        :show_validation_status="false"
        label="Origin"
        name="routeOrigin"
        size="xs"
        :params="{ q: undefined }"
        value_key="origin"
        label_key="origin"
        url="/route"
        :attributes="{ placeholder: 'Select Origin' }"
        :initial_labels="fieldLabels['routeOrigin']"
        @select="(opt: any) => captureLabel('routeOrigin', opt, 'origin', 'origin')"
      />

      <SelectInput
        v-if="form.state.values.activeFilters?.includes('destination')"
        searchable
        :show_validation_status="false"
        label="Destination"
        name="routeDestination"
        size="xs"
        :params="{ q: undefined }"
        value_key="destination"
        label_key="destination"
        url="/route"
        :attributes="{ placeholder: 'Select Destination' }"
        :initial_labels="fieldLabels['routeDestination']"
        @select="(opt: any) => captureLabel('routeDestination', opt, 'destination', 'destination')"
      />

      <SelectInput
        v-if="form.state.values.activeFilters?.includes('vehicleOwnership')"
        :show_validation_status="false"
        label="Vehicle Ownership"
        name="vehicleOwnership"
        size="xs"
        :options="[
          { label: 'All', value: '' },
          { label: 'Owned', value: 'Owned' },
          { label: 'LTSC', value: 'LTSC' },
          { label: 'STSC', value: 'STSC' }
        ]"
        :attributes="{ placeholder: 'Select Ownership' }"
      />

      <SelectInput
        v-if="form.state.values.activeFilters?.includes('documentUploaded')"
        :show_validation_status="false"
        label="Documents"
        name="documentUploaded"
        size="xs"
        :options="[
          { label: 'All', value: '' },
          { label: 'Uploaded', value: 'true' },
          { label: 'Not Uploaded', value: 'false' }
        ]"
        :attributes="{ placeholder: 'Select Uploaded' }"
      />
    </template>
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

function captureLabel(field: string, opt: any, valueKey: string, labelKey: string) {
  const value = String(getNestedValue(opt, valueKey));
  const label = getNestedValue(opt, labelKey);
  if (!fieldLabels.value[field]) fieldLabels.value[field] = {};
  fieldLabels.value[field][value] = label;
  store.setLabels(props.paginationId ?? "", { ...fieldLabels.value });
}

const FORM_FILTER_FIELDS = [
  "activeFilters", "tripType", "productType", "shipper",
  "routeOrigin", "routeDestination", "vehicleOwnership", "documentUploaded",
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
  if (Object.keys(filterOnly).length > 0) {
    formValues.value = filterOnly;
  }
});

const handleChange = (values: any) => {
  const filters: any = { ...values };

  // Clean up values that are not in the active filters list
  const active = values.activeFilters || [];
  if (!active.includes('tripType')) delete filters.tripType;
  if (!active.includes('productType')) delete filters.productType;
  if (!active.includes('shipper')) delete filters.shipper;
  if (!active.includes('origin')) delete filters.routeOrigin;
  if (!active.includes('destination')) delete filters.routeDestination;
  if (!active.includes('vehicleOwnership')) delete filters.vehicleOwnership;
  if (!active.includes('documentUploaded')) delete filters.documentUploaded;

  delete filters.activeFilters;

  emit('change', filters);
};
</script>
