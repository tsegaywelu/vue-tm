<template>
  <div class="flex flex-col gap-4">
    <div
      class="rounded-2xl px-3 md:px-5 py-6 bg-white flex flex-col gap-8 shadow-sm border border-gray-100"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- General Information -->
        <InfoWrapper title="General Information">
          <div class="flex flex-col gap-4">
            <DataLabel label="Status" :value="formatStatus(workOrder?.status)" />
            <DataLabel label="Work Area" :value="formatStatus(workOrder?.workArea)" />
            <DataLabel label="Work Type" :value="formatStatus(workOrder?.workType)" />
            <DataLabel label="Workshop" :value="workOrder?.workshop?.name || '-'" />
            <DataLabel label="Fuel Level" :value="workOrder?.fuelLevel || '-'" />
            <DataLabel label="Odometer" :value="workOrder?.odometer?.toLocaleString() || '-'" />
          </div>
        </InfoWrapper>

        <!-- Dates & Schedule -->
        <InfoWrapper title="Schedule">
          <div class="flex flex-col gap-4">
            <DataLabel label="Start Date" :value="workOrder?.startDate ? dateFormatter(workOrder.startDate) : '-'" />
            <DataLabel label="Estimated Completion" :value="workOrder?.estimatedCompletionDate ? dateFormatter(workOrder.estimatedCompletionDate) : '-'" />
            <DataLabel label="Created At" :value="workOrder?.createdAt ? dateTimeFormatter(workOrder.createdAt) : '-'" />
            <DataLabel label="Last Updated" :value="workOrder?.updatedAt ? dateTimeFormatter(workOrder.updatedAt) : '-'" />
          </div>
        </InfoWrapper>

        <!-- Personnel & Costs -->
        <InfoWrapper title="Personnel & Costs">
          <div class="flex flex-col gap-4">
            <DataLabel label="Mechanics" :value="mechanicsList" />
            <DataLabel label="Approved By" :value="workOrder?.approvedBy?.username || '-'" />
            <div class="pt-4 mt-4 border-t border-gray-100 flex flex-col gap-2">
              <span class="text-sm text-gray-500">Parts Cost</span>
              <span class="text-xl font-bold text-gray-900">
                {{ currencyFormatter(workOrder?.costBreakdown?.partsCost || 0) }}
              </span>
            </div>
          </div>
        </InfoWrapper>

        <!-- Description -->
        <InfoWrapper class="md:col-span-2 lg:col-span-3" title="Description / Comments">
          <p class="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {{ workOrder?.description || 'No additional description provided.' }}
          </p>
        </InfoWrapper>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { WorkOrder } from "../../operation.types";
import InfoWrapper from "../shipment-details/InfoWrapper.vue";
import DataLabel from "../shipment-details/ShipmentDataLabel.vue";
import {
  dateFormatter,
  dateTimeFormatter,
  currencyFormatter,
  formatStatus,
} from "@/utils/utils";

const props = defineProps<{
  workOrder?: WorkOrder;
}>();

const mechanicsList = computed(() => {
  if (!props.workOrder?.mechanics?.length) return "-";
  return props.workOrder.mechanics
    .map((m: any) => m.name || `${m.firstName || ""} ${m.lastName || ""}`.trim())
    .join(", ");
});
</script>
