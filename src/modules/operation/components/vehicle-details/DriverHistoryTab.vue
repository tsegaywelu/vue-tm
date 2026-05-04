<template>
  <div class="flex flex-col gap-6">
    <div class="rounded-3xl p-6 border border-grey-100">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-bold text-grey-900">Driver History</h3>
      </div>

      <Table :columns="columns" :rows="driverHistory" :loading="false">
        <template #cell-no="{ index }">
          <span class="text-grey-500 font-medium">{{ index + 1 }}</span>
        </template>
        <template #cell-name="{ row }">
          <div class="flex items-center gap-3">
            <div
              class="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs"
            >
              {{ row.driver?.firstName?.[0] }}{{ row.driver?.lastName?.[0] }}
            </div>
            <span class="font-bold text-grey-900">
              {{ row.driver?.firstName }} {{ row.driver?.middleName }}
              {{ row.driver?.lastName }}
            </span>
          </div>
        </template>
        <template #cell-assignedDate="{ row }">
          <span class="text-grey-900 font-medium">{{
            formatDate(row.assignedDate)
          }}</span>
        </template>
        <template #cell-leaveDate="{ row }">
          <div v-if="row.leaveDate" class="flex items-center gap-2">
            <div class="size-2 rounded-full bg-red-400"></div>
            <span class="text-grey-900 font-medium">{{
              formatDate(row.leaveDate)
            }}</span>
          </div>
          <div v-else class="flex items-center gap-2">-</div>
        </template>
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Vehicle } from "../../operation.types";
import Table from "@/components/common/Table.vue";

const props = defineProps<{
  vehicle: Vehicle;
}>();

const driverHistory = computed(() => {
  return Array.isArray(props.vehicle.driverHistory)
    ? props.vehicle.driverHistory
    : [];
});

const columns = [
  { key: "name", label: "Driver Name" },
  { key: "assignedDate", label: "Assigned Date" },
  { key: "leaveDate", label: "Leave Date" },
];

const formatDate = (date?: string) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString();
};
</script>
