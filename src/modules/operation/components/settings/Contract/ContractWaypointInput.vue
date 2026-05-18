<script setup lang="ts">
import BaseSelect from "@/components/common/Select.vue";
import Input from "@/components/common/Input.vue";
import Button from "@/components/Button.vue";
import { icons } from "@/utils/icons";

type PricingRow = {
  fakeId: string;
  vehicleType: string;
  type: string;
  productType: string;
  pricePerUnit: number | string;
};

type TempWaypoint = {
  waypoint: string;
  name: string;
  vehiclePricing: PricingRow[];
};

const props = defineProps<{
  waypoint: TempWaypoint;
  waypointIndex: number;
  carrierId: string;
  errors: Record<string, string>;
  vehicleTypeOptions?: any[];
}>();

const emit = defineEmits<{
  (e: "add-pricing"): void;
  (e: "remove-pricing", pIndex: number): void;
}>();

function getVehicleTypeLabel(id: string): string {
  return props.vehicleTypeOptions?.find((o: any) => o._id === id)?.name || "";
}
</script>

<template>
  <div class="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
    <h3 class="text-sm font-semibold text-gray-800 mb-4">
      Waypoint {{ waypointIndex + 1 }}: {{ waypoint.name }}
    </h3>

    <div
      v-for="(pricing, pIndex) in waypoint.vehiclePricing"
      :key="pricing.fakeId"
      class="p-4 border border-gray-100 rounded-lg mb-4 space-y-4 relative"
    >
      <button
        type="button"
        class="absolute top-2 right-2 size-6 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
        @click="emit('remove-pricing', pIndex)"
      >
        <i v-html="icons.close"></i>
      </button>

      <div
        class="grid [&_.input-focus]:bg-white grid-cols-1 md:grid-cols-4 gap-4 pr-8"
      >
        <BaseSelect
          size="xs"
          label="Product Type"
          :options="[
            { label: 'Inbound', value: 'IN_BOUND' },
            { label: 'Outbound', value: 'OUT_BOUND' },
            { label: 'Site Transfer', value: 'SITE_TRANSFER' },
          ]"
          v-model="pricing.productType"
          :error="errors[`productType_${pricing.fakeId}`]"
        />
        <BaseSelect
          size="xs"
          label="Vehicle Type"
          :url="`/vehicle-type/carrier/${carrierId}`"
          label_key="name"
          value_key="_id"
          searchable
          :params="{ limit: 20 }"
          :options="vehicleTypeOptions || []"
          :display_value="getVehicleTypeLabel(pricing.vehicleType)"
          v-model="pricing.vehicleType"
          :error="errors[`vehicleType_${pricing.fakeId}`]"
        />
        <BaseSelect
          size="xs"
          label="Pricing Type"
          :options="[
            { label: 'Per Kilometer', value: 'per_kilometer' },
            { label: 'Per Quintal', value: 'per_quintal' },
            { label: 'Per Truck', value: 'per_truck' },
          ]"
          v-model="pricing.type"
          :error="errors[`type_${pricing.fakeId}`]"
        />

        <Input
          size="xs"
          :modelValue="pricing.pricePerUnit"
          @update:modelValue="pricing.pricePerUnit = Number($event)"
          label="Amount"
          type="number"
          :error="errors[`pricePerUnit_${pricing.fakeId}`]"
          :attributes="{ placeholder: 'Enter amount' }"
        />
      </div>
    </div>

    <button
      type="button"
      class="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs hover:opacity-80 transition-opacity"
      @click="emit('add-pricing')"
    >
      <i class="mdi mdi-plus-circle-outline text-lg"></i>
      Add Pricing
    </button>
  </div>
</template>
