<template>
  <Form
    id="approval-filter"
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
      name="select"
      :show_validation_status="false"
      label="Type"
      size="xs"
      :clearable="true"
      :options="typeOptions"
      :attributes="{ placeholder: 'All Types' }"
    />
    <OriginInput
      name="routeOrigin"
      multiple
      size="xs"
      :params="{ sort: 'shipmentCount' }"
      :attributes="{ placeholder: 'Search Origin' }"
      :initial_labels="fieldLabels['routeOrigin']"
      @select="(opt: any) => captureLabel('routeOrigin', opt, 'destination', 'routeName')"
    />
    <DestinationInput
      name="routeDestination"
      multiple
      size="xs"
      :attributes="{ placeholder: 'Search Destination' }"
      :initial_labels="fieldLabels['routeDestination']"
      @select="(opt: any) => captureLabel('routeDestination', opt, 'destination', 'routeName')"
    />
  </Form>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import SelectInput from "@/components/form/SelectInput.vue";
import OriginInput from "@/components/common/inputs/OriginInput.vue";
import DestinationInput from "@/components/common/inputs/DestinationInput.vue";
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

const FORM_FILTER_FIELDS = ["select", "routeOrigin", "routeDestination"];

const formValues = ref<Record<string, any>>({ select: "all" });

onMounted(() => {
  const saved = lastParams.value;
  if (Object.keys(lastLabels.value).length > 0) {
    fieldLabels.value = { ...lastLabels.value };
  }
  const filterOnly: Record<string, any> = { select: "all" };
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
  formValues.value = filterOnly;
});

const typeOptions = [
  { label: "All", value: "all" },
  { label: "Driver Advance", value: "advance" },
  { label: "Transporter Advance", value: "prePayment" },
  { label: "Settlements", value: "transaction" },
];
</script>
