<template>
  <Form
    id="shipment-filter"
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
          shipper: values.shipper?.length
            ? values.shipper.join(',')
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
      @select="
        (opt) => captureLabel('routeOrigin', opt, 'destination', 'routeName')
      "
    />
    <DestinationInput
      name="routeDestination"
      multiple
      size="xs"
      :initial_labels="fieldLabels['routeDestination']"
      @select="
        (opt) =>
          captureLabel('routeDestination', opt, 'destination', 'routeName')
      "
    />
    <ShipmentStatusInput name="status" size="xs" />
    <ProductTypeInput name="productType" size="xs" />
    <TripTypeInput name="tripType" size="xs" />
    <VehicleOwnershipInput name="vehicleOwnership" size="xs" />
    <DamageInput name="isDamaged" size="xs" />
    <DocumentedUploadsInput name="areDocumentsUploaded" size="xs" />
    <ShipperInput
      v-if="!isShipper"
      name="shipper"
      size="xs"
      multiple
      :params="
        (state) => {
          return {
            name: state.search,
            q: undefined,
          };
        }
      "
      :initial_labels="fieldLabels['shipper']"
      @select="
        (opt) => captureLabel('shipper', opt, 'shipper._id', 'shipper.name')
      "
    />
    <AgentInput
      name="agent"
      size="xs"
      :initial_labels="fieldLabels['agent']"
      @select="(opt) => captureLabel('agent', opt, '_id', 'name')"
    />
  </Form>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import Form from "@/components/form/Form.vue";
import OriginInput from "@/components/common/inputs/OriginInput.vue";
import DestinationInput from "@/components/common/inputs/DestinationInput.vue";
import ShipmentStatusInput from "@/components/common/inputs/ShipmentStatusInput.vue";
import ProductTypeInput from "@/components/common/inputs/ProductTypeInput.vue";
import TripTypeInput from "@/components/common/inputs/TripTypeInput.vue";
import VehicleOwnershipInput from "@/components/common/inputs/VehicleOwnershipInput.vue";
import DamageInput from "@/components/common/inputs/DamageInput.vue";
import DocumentedUploadsInput from "@/components/common/inputs/DocumentedUploadsInput.vue";
import ShipperInput from "@/components/common/inputs/ShipperInput.vue";
import { useAuthStore } from "@/store/authStore";
import AgentInput from "@/components/common/inputs/AgentInput.vue";
import {
  useTableLastParams,
  useTableLastLabels,
} from "@/composables/usePagination";
import { useTablePaginationStore } from "@/store/tablePaginationStore";

const props = defineProps<{
  paginationId?: string;
  calendarType?: "english" | "ethiopian";
  outputCalendarType?: "english" | "ethiopian";
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

const FORM_FILTER_FIELDS = [
  "routeOrigin",
  "routeDestination",
  "status",
  "productType",
  "tripType",
  "vehicleOwnership",
  "damage",
  "areDocumentsUploaded",
  "shipper",
  "agent",
];

// Start undefined so the Form's values-watcher fires when we assign saved params.
// This restores the filter UI to the previously selected state on navigation-back.
const formValues = ref<Record<string, any> | undefined>(undefined);

onMounted(() => {
  const saved = lastParams.value;
  if (Object.keys(lastLabels.value).length > 0) {
    fieldLabels.value = { ...lastLabels.value };
  }
  // Only restore fields that belong to this Form; exclude search/pagination params
  const filterOnly: Record<string, any> = {};
  for (const field of FORM_FILTER_FIELDS) {
    if (field in saved && saved[field] !== undefined) {
      filterOnly[field] = saved[field];
    }
  }
  // tableParams stores comma-joined strings for multiple selects — convert back to arrays
  if (typeof filterOnly.routeOrigin === "string") {
    filterOnly.routeOrigin = filterOnly.routeOrigin.split(",").filter(Boolean);
  }
  if (typeof filterOnly.routeDestination === "string") {
    filterOnly.routeDestination = filterOnly.routeDestination
      .split(",")
      .filter(Boolean);
  }
  if (Object.keys(filterOnly).length > 0) {
    formValues.value = filterOnly;
  }
});
</script>
