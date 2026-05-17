<template>
  <Form
    id="advance-filter"
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
      searchable
      :show_validation_status="false"
      label="Origin"
      multiple
      parent_class_name=""
      size="xs"
      :params="
        (values) => {
          return {
            sort: 'shipmentCount',
            q: undefined,
            ...(values.search
              ? {
                  routeName: {
                    regexAny: values.search,
                  },
                }
              : {}),
          };
        }
      "
      name="routeOrigin"
      value_key="destination"
      label_key="routeName"
      :url="`/route`"
      :attributes="{
        placeholder: 'Search Origin',
      }"
      :initial_labels="fieldLabels['routeOrigin']"
      @select="(opt) => captureLabel('routeOrigin', opt, 'destination', 'routeName')"
    />
    <SelectInput
      :show_validation_status="false"
      label="Destination"
      searchable
      multiple
      parent_class_name=""
      size="xs"
      :params="
        (values) => {
          return {
            sort: 'shipmentCount',
            q: undefined,
            ...(values.search
              ? {
                  routeName: {
                    regexAny: values.search,
                  },
                }
              : {}),
          };
        }
      "
      name="routeDestination"
      value_key="destination"
      label_key="routeName"
      :url="`/route`"
      :attributes="{
        placeholder: 'Search Destination',
      }"
      :initial_labels="fieldLabels['routeDestination']"
      @select="(opt) => captureLabel('routeDestination', opt, 'destination', 'routeName')"
    />
    <SelectInput
      :show_validation_status="false"
      label="Status"
      searchable
      name="status"
      size="xs"
      :options="AdvanceStatusOptions"
      :attributes="{
        placeholder: 'Select Status',
      }"
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

const FORM_FILTER_FIELDS = ["routeOrigin", "routeDestination", "status"];

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

const AdvanceStatusOptions = [
  { label: "Pending", value: "PENDING" },
  { label: "Authorized", value: "AUTHORIZED" },
  { label: "Approved", value: "APPROVED" },
  { label: "Paid", value: "PAID" },
  { label: "Success", value: "SUCCESS" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Failed", value: "FAILED" },
];
</script>
