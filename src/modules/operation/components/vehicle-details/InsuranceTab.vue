<template>
  <div class="flex flex-col gap-6">
    <div class="rounded-3xl p-6 border border-grey-100">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-bold text-grey-900">Insurance History</h3>
      </div>

      <Table
        :columns="columns"
        :rows="insurances?.data?.results || []"
        :loading="isLoading"
      >
        <template #cell-insurer="{ row }">
          <span class="font-bold text-grey-900">{{
            row.insurer?.name || "N/A"
          }}</span>
        </template>
        <template #cell-prePaymentDate="{ row }">
          <span class="text-grey-500">{{
            formatDate(row.prePaymentDate)
          }}</span>
        </template>
        <template #cell-prePaymentMatureDate="{ row }">
          <span class="text-grey-500">{{
            formatDate(row.prePaymentMatureDate)
          }}</span>
        </template>
        <template #cell-JV="{ row }">
          <span class="text-grey-900">{{ row.JV || "N/A" }}</span>
        </template>
        <template #cell-CPV="{ row }">
          <span class="text-grey-900">{{ row.CPV || "N/A" }}</span>
        </template>
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import type { Vehicle } from "../../operation.types";
import { fetch_vehicle_insurances } from "../../api/operation.api";
import BaseTable from "@/components/common/Table.vue";

const props = defineProps<{
  vehicle: Vehicle;
}>();

const { data: insurances, isLoading } = useQuery({
  queryKey: ["vehicle-insurances", props.vehicle._id],
  queryFn: () => fetch_vehicle_insurances(props.vehicle._id),
});

const columns = [
  { key: "insurer", label: "Insurance Provider" },
  { key: "prePaymentDate", label: "Pre Payment Date" },
  { key: "prePaymentMatureDate", label: "Pre Payment Mature Date" },
  { key: "JV", label: "JV" },
  { key: "CPV", label: "CPV" },
];

const formatDate = (date?: string) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString();
};
</script>
