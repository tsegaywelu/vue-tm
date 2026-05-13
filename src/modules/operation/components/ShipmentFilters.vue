<template>
  <Form
    id="shipment-filter"
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
    <OriginInput name="routeOrigin" multiple size="xs" />
    <DestinationInput name="routeDestination" multiple size="xs" />
    <ShipmentStatusInput name="status" size="xs" />
    <ProductTypeInput name="productType" size="xs" />
    <TripTypeInput name="tripType" size="xs" />
    <VehicleOwnershipInput name="vehicleOwnership" size="xs" />
    <DamageInput name="damage" size="xs" />
    <DocumentedUploadsInput name="documentedUploads" size="xs" />
    <ShipperInput v-if="!isShipper" name="shipper" size="xs" />
    <AgentInput name="agent" size="xs" />
  </Form>
</template>

<script setup lang="ts">
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
import { computed } from "vue";

const authStore = useAuthStore();
const isShipper = computed(() => authStore.is_shipper);

const props = defineProps<{
  calendarType?: "english" | "ethiopian";
  outputCalendarType?: "english" | "ethiopian";
}>();

const emit = defineEmits(["change"]);
</script>
