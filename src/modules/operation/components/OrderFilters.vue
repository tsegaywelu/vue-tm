<template>
  <Form
    id="order-filter"
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
    <OriginInput
      name="routeOrigin"
      multiple
      size="xs"
      :initial_labels="fieldLabels['routeOrigin']"
      @select="(opt: any) => captureLabel('routeOrigin', opt, 'destination', 'routeName')"
    />
    <DestinationInput
      name="routeDestination"
      multiple
      size="xs"
      :initial_labels="fieldLabels['routeDestination']"
      @select="(opt: any) => captureLabel('routeDestination', opt, 'destination', 'routeName')"
    />
    <OrderStatusInput name="status" size="xs" />
    <ShipperInput
      v-if="!isShipper"
      name="shipper"
      size="xs"
      :initial_labels="fieldLabels['shipper']"
      @select="(opt: any) => captureLabel('shipper', opt, 'shipper._id', 'shipper.name')"
    />
    <ProductTypeInput name="productType" size="xs" />
    <TripTypeInput name="tripType" size="xs" />
    <PriorityInput name="priority" size="xs" />
  </Form>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import Form from "@/components/form/Form.vue";
import OriginInput from "@/components/common/inputs/OriginInput.vue";
import DestinationInput from "@/components/common/inputs/DestinationInput.vue";
import OrderStatusInput from "@/components/common/inputs/OrderStatusInput.vue";
import ShipperInput from "@/components/common/inputs/ShipperInput.vue";
import { useAuthStore } from "@/store/authStore";
import ProductTypeInput from "@/components/common/inputs/ProductTypeInput.vue";
import TripTypeInput from "@/components/common/inputs/TripTypeInput.vue";
import PriorityInput from "@/components/common/inputs/PriorityInput.vue";
import { useTableLastParams, useTableLastLabels } from "@/composables/usePagination";
import { useTablePaginationStore } from "@/store/tablePaginationStore";

const props = defineProps<{
  paginationId?: string;
}>();

const emit = defineEmits(["change"]);

const authStore = useAuthStore();
const isShipper = computed(() => authStore.is_shipper);

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
  "routeOrigin", "routeDestination", "status", "shipper",
  "productType", "tripType", "priority",
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
</script>
