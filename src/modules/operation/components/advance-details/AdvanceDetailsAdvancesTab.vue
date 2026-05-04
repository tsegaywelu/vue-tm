<template>
  <div class="flex flex-col gap-8">
    <!-- Fuel Advances -->
    <div
      v-for="(item, index) in advance.fuelAdvances"
      :key="`fuel-${index}`"
    >
      <InfoWrapper :title="`Fuel Advance ${index + 1}`">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <ShipmentDataLabel label="Payment Type" :value="item.paymentType" />
          <ShipmentDataLabel label="Fuel Station" :value="item.fuelStation" />
          <ShipmentDataLabel
            label="Refueled Amount"
            :value="item.refueledAmount"
          />
          <ShipmentDataLabel
            label="Fuel Price"
            :value="`${item.fuelPrice} Birr`"
          />
          <ShipmentDataLabel
            label="Total Amount"
            :value="`${item.amount} Birr`"
            is-bold
          />
        </div>
      </InfoWrapper>
    </div>

    <!-- Per Diem Expenses -->
    <div
      v-for="(item, index) in advance.perDiemExpenses"
      :key="`per-diem-${index}`"
    >
      <InfoWrapper :title="`Perdiem Expense ${index + 1}`">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <ShipmentDataLabel
            label="Category"
            :value="formatCategory(item.category)"
          />
          <ShipmentDataLabel
            v-if="item.daysDriven"
            label="Days Driven"
            :value="item.daysDriven"
          />
          <ShipmentDataLabel
            v-if="item.weight"
            label="Weight"
            :value="item.weight"
          />
          <ShipmentDataLabel
            label="Total Amount"
            :value="`${item.amount} Birr`"
            is-bold
          />
        </div>
      </InfoWrapper>
    </div>

    <!-- Other Expenses -->
    <template v-if="advance.otherExpenses && advance.otherExpenses.length">
      <InfoWrapper title="Other Expenses">
        <div class="flex flex-col gap-6">
          <div
            v-for="(item, index) in advance.otherExpenses"
            :key="`other-${index}`"
            class="grid grid-cols-2 md:grid-cols-4 gap-6 border-b border-gray-50 last:border-none pb-4 last:pb-0"
          >
            <ShipmentDataLabel
              label="Expense Type"
              :value="item.expenseType?.name || '-'"
            />
            <ShipmentDataLabel
              label="Total Amount"
              :value="`${item.amount} Birr`"
              is-bold
            />
          </div>
        </div>
      </InfoWrapper>
    </template>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  advance: Record<string, any>;
}>();

import InfoWrapper from "../shipment-details/InfoWrapper.vue";
import ShipmentDataLabel from "../shipment-details/ShipmentDataLabel.vue";
import { icons } from "@/utils/icons";

const formatCategory = (category?: string) => {
  if (!category) return "-";
  return category.toLowerCase().replace(/_/g, " ");
};
</script>
