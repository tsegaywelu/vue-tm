<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <InfoWrapper title="Insurance Information">
      <div class="space-y-4">
        <DetailItem label="Insurer" :value="insurance.insurer?.name" />
        <DetailItem label="Vehicle" :value="insurance.vehicle?.plateNumber" />
        <DetailItem label="Pre Payment Date" :value="formatDate(insurance.prePaymentDate)" />
        <DetailItem label="Pre Payment Mature Date" :value="formatDate(insurance.prePaymentMatureDate)" />
        <DetailItem label="JV" :value="insurance.JV" />
        <DetailItem label="CPV" :value="insurance.CPV" />
        <DetailItem label="Withhold Tax" :value="currencyFormatter(insurance.withHoldTax || 0)" />
        <DetailItem label="Total" :value="currencyFormatter(insurance.total || 0)" />
      </div>
    </InfoWrapper>

    <InfoWrapper title="Insurance Categories">
      <div class="space-y-4">
        <div v-for="(category, index) in insuranceCategories" :key="index" class="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
          <span class="text-sm font-medium text-gray-600">{{ formatCategoryType(category.type) }}</span>
          <span class="text-sm font-bold text-gray-900">{{ currencyFormatter(category.amount) }}</span>
        </div>
        <div v-if="!insuranceCategories.length" class="text-sm text-gray-500 italic">No categories added.</div>
      </div>
    </InfoWrapper>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import DetailItem from "../vehicle-details/DetailItem.vue";
import InfoWrapper from "../shipment-details/InfoWrapper.vue";
import { dateFormatter, currencyFormatter } from "@/utils/utils";

const props = defineProps<{
  insurance: any;
}>();

const formatDate = (date?: string) => {
  if (!date) return "N/A";
  return dateFormatter(date);
};

const insuranceCategories = computed(() => {
  try {
    if (typeof props.insurance.insuranceCategoryAmount === 'string') {
      return JSON.parse(props.insurance.insuranceCategoryAmount);
    }
    return props.insurance.insuranceCategoryAmount || [];
  } catch (e) {
    return [];
  }
});

const formatCategoryType = (type: string) => {
  if (!type) return "N/A";
  return type
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
</script>
