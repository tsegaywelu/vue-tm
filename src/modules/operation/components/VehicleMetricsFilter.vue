<template>
  <Form
    id="vehicle-metrics-filter"
    @change="(values) => emit('change', values)"
    class="[&_.input-focus]:bg-grey-25 flex-1 flex max-h-16 h-16 min-h-16 *:w-[220px] *:shrink-0 px-2 gap-2 overflow-auto"
  >
    <RegionInput name="region" size="xs" class="w-40" />
    <VehicleTypeInput name="vehicleType" size="xs" class="w-40" />
    <VehicleOwnershipInput name="ownership" size="xs" class="w-40" />
    <ProductTypeInput
      v-if="showVehicleUse"
      name="vehicleUse"
      label="Vehicle Use"
      size="xs"
      class="w-40"
      :options="vehicleUseOptions"
    />
  </Form>
</template>

<script setup lang="ts">
import Form from "@/components/form/Form.vue";
import RegionInput from "@/components/common/inputs/RegionInput.vue";
import VehicleTypeInput from "@/components/common/inputs/VehicleTypeInput.vue";
import VehicleOwnershipInput from "@/components/common/inputs/VehicleOwnershipInput.vue";
import ProductTypeInput from "@/components/common/inputs/ProductTypeInput.vue";

const props = defineProps<{
  showVehicleUse?: boolean;
  vehicleUseOptions?: { label: string; value: string }[];
}>();

const emit = defineEmits(["change"]);
</script>
