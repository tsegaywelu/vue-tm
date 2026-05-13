<template>
  <Form
    id="order-filter"
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
    <OrderStatusInput name="status" size="xs" />
    <ShipperInput v-if="!isShipper" name="shipper" size="xs" />
    <ProductTypeInput name="productType" size="xs" />
    <TripTypeInput name="tripType" size="xs" />
    <PriorityInput name="priority" size="xs" />
  </Form>
</template>

<script setup lang="ts">
import Form from "@/components/form/Form.vue";
import OriginInput from "@/components/common/inputs/OriginInput.vue";
import DestinationInput from "@/components/common/inputs/DestinationInput.vue";
import OrderStatusInput from "@/components/common/inputs/OrderStatusInput.vue";
import ShipperInput from "@/components/common/inputs/ShipperInput.vue";
import { useAuthStore } from "@/store/authStore";
import ProductTypeInput from "@/components/common/inputs/ProductTypeInput.vue";
import TripTypeInput from "@/components/common/inputs/TripTypeInput.vue";
import PriorityInput from "@/components/common/inputs/PriorityInput.vue";
import { computed } from "vue";

const authStore = useAuthStore();
const isShipper = computed(() => authStore.is_shipper);

const emit = defineEmits(["change"]);
</script>
