<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <InfoWrapper title="Damage Information">
      <div class="space-y-4">
        <DetailItem label="Vehicle Plate" :value="damage.vehicle?.plateNumber?.toUpperCase()" />
        <DetailItem label="Shipment Code" :value="damage.shipment?.shipmentCode" />
        <DetailItem label="Severity" :value="damage.severity" />
        <DetailItem label="Damage Date" :value="formatDate(damage.damageDate)" />
        <DetailItem label="Location" :value="damage.location" />
      </div>
    </InfoWrapper>

    <InfoWrapper title="Financial Summary">
      <div class="space-y-4">
        <DetailItem label="Estimated Repair Cost" :value="currencyFormatter(damage.estimatedRepairCost || 0)" />
        <DetailItem label="Actual Repair Cost" :value="currencyFormatter(damage.actualRepairCost || 0)" />
        <DetailItem label="Labor Cost" :value="currencyFormatter(damage.laborCost || 0)" />
        <DetailItem label="Excess" :value="currencyFormatter(damage.excess || 0)" />
        <DetailItem label="Parts Contribution" :value="currencyFormatter(damage.partsContribution || 0)" />
        <DetailItem label="Amount To Receive (Insurance)" :value="currencyFormatter(damage.amountToReceiveFromInsurance || 0)" />
      </div>
    </InfoWrapper>

    <InfoWrapper title="Tax & VAT">
      <div class="space-y-4">
        <DetailItem label="Tax (3%)" :value="currencyFormatter(damage.tax || 0)" />
        <DetailItem label="VAT (15%)" :value="currencyFormatter(damage.vat || 0)" />
      </div>
    </InfoWrapper>

    <InfoWrapper title="Description" v-if="damage.description" class="lg:col-span-2">
      <p class="text-sm text-gray-700 italic border-l-4 border-primary pl-4 py-1 whitespace-pre-line">
        {{ damage.description }}
      </p>
    </InfoWrapper>
  </div>
</template>

<script setup lang="ts">
import DetailItem from "../vehicle-details/DetailItem.vue";
import InfoWrapper from "../shipment-details/InfoWrapper.vue";
import { dateFormatter, currencyFormatter } from "@/utils/utils";

const props = defineProps<{
  damage: any;
}>();

const formatDate = (date?: string) => {
  if (!date) return "N/A";
  return dateFormatter(date);
};
</script>
