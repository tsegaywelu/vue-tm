<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <InfoWrapper title="Damage Information">
      <div class="space-y-4">
        <DetailItem label="Shipment Code" :value="damage.shipment?.shipmentCode" />
        <DetailItem label="Route" :value="damage.shipment?.routeName" />
        <DetailItem label="Vehicle Plate Number" :value="damage.shipment?.vehiclePlateNumber?.toUpperCase()" />
        <DetailItem label="Responsible Driver" :value="damage.responsibleDriver?.name" />
        <DetailItem label="Damage Date" :value="formatDate(damage.damageDate)" />
        <DetailItem label="Location" :value="damage.location" />
      </div>
    </InfoWrapper>

    <InfoWrapper title="Payment Information">
      <div class="space-y-4">
        <DetailItem label="Payment Received From" :value="damage.paymentToBeReceivedFrom" />
        <DetailItem label="Total Amount" :value="currencyFormatter(damage.total || 0)" />
        <DetailItem label="Prepared By" :value="damage.preparedBy?.username" />
        <DetailItem label="Created At" :value="formatDate(damage.createdAt)" />
      </div>
    </InfoWrapper>

    <InfoWrapper title="Remark" v-if="damage.remark" class="lg:col-span-2">
      <p class="text-sm text-gray-700 italic border-l-4 border-primary pl-4 py-1">
        "{{ damage.remark }}"
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
