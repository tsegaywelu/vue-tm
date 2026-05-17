<template>
    <Form
      id="payable-filter"
      :enable_unsaved_guard="false"
      :values="formValues"
      @change="
        (values) => {
          emit('change', {
            ...values,
            routeOrigin: values.routeOrigin?.length
              ? values.routeOrigin.join(',')
              : undefined,
            routeDestination: values.routeDestination?.length
              ? values.routeDestination.join(',')
              : undefined,
          });
        }
      "
      class="[&_.input-focus]:bg-grey-25 flex-1 flex max-h-16 h-16 min-h-16 *:w-[220px] *:shrink-0 px-2 gap-2 overflow-auto"
    >



    <SelectInput
      :show_validation_status="false"
      label="Type"
      name="select"
      size="xs"
      :options="[
        { label: 'Showing all', value: 'all' },
        { label: 'Driver Advance', value: 'advance' },
        { label: 'Sub-Contract Advance', value: 'prePayment' },
        { label: 'Drivers Additional', value: 'transaction' },
        { label: 'Shipment', value: 'shipment' },
        { label: 'Purchase Order', value: 'purchaseOrders' },
        { label: 'Vehicle Lease', value: 'vehicleLeaseAgreements' }
      ]"
      :attributes="{ placeholder: 'Select a Type' }"
    />
    <SelectInput
      :show_validation_status="false"
      label="Status"
      name="status"
      size="xs"
      :options="[
        { label: 'All', value: '' },

        { label: 'Approved', value: 'APPROVED' },
        { label: 'Authorized', value: 'AUTHORIZED' },

      ]"
      :attributes="{ placeholder: 'Select a Status' }"
    />
    <SelectInput
      searchable
      :show_validation_status="false"
      label="Origin"
      multiple
      parent_class_name=""
      size="xs"
      :params="(values) => ({ sort: 'shipmentCount', q: undefined, ...(values.search ? { routeName: { regexAny: values.search } } : {}) })"
      name="routeOrigin"
      value_key="destination"
      label_key="routeName"
      :url="`/route`"
      :attributes="{ placeholder: 'Select a City' }"
      :initial_labels="fieldLabels['routeOrigin']"
      @select="(opt: any) => captureLabel('routeOrigin', opt, 'destination', 'routeName')"
    />
    <SelectInput
      searchable
      :show_validation_status="false"
      label="Destination"
      multiple
      parent_class_name=""
      size="xs"
      :params="(values) => ({ sort: 'shipmentCount', q: undefined, ...(values.search ? { routeName: { regexAny: values.search } } : {}) })"
      name="routeDestination"
      value_key="destination"
      label_key="routeName"
      :url="`/route`"
      :attributes="{ placeholder: 'Select a City' }"
      :initial_labels="fieldLabels['routeDestination']"
      @select="(opt: any) => captureLabel('routeDestination', opt, 'destination', 'routeName')"
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

function captureLabel(field: string, opt: any, valueKey: string, labelKey: string) {
  const value = String(getNestedValue(opt, valueKey));
  const label = getNestedValue(opt, labelKey);
  if (!fieldLabels.value[field]) fieldLabels.value[field] = {};
  fieldLabels.value[field][value] = label;
  store.setLabels(props.paginationId ?? "", { ...fieldLabels.value });
}

const FORM_FILTER_FIELDS = ["select", "status", "routeOrigin", "routeDestination"];

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
  formValues.value = { select: 'all', ...filterOnly };
});
</script>
