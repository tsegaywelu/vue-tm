<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- New Tyres -->
    <div class="rounded-3xl p-6 border border-grey-100">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-bold text-grey-900">New Tyres</h3>
      </div>

      <Table :columns="columns" :rows="newTyres" :loading="isLoading">
        <template #cell-type="{ row }">
          <span class="font-bold text-grey-900">{{ row.type || "N/A" }}</span>
        </template>
        <template #cell-serialNumber="{ row }">
          <span class="text-primary font-bold">{{
            row.serialNumber || "N/A"
          }}</span>
        </template>
        <template #cell-installationMileage="{ row }">
          <span class="text-grey-900"
            >{{ row.installationMileage?.toLocaleString() || "0" }} km</span
          >
        </template>
      </Table>
    </div>

    <!-- Old Tyres -->
    <div class="rounded-3xl p-6 border border-grey-100">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-bold text-grey-900">Old Tyres</h3>
      </div>
      <Table :columns="columns" :rows="oldTyres" :loading="isLoading">
        <template #cell-type="{ row }">
          <span class="font-bold text-grey-900">{{ row.type || "N/A" }}</span>
        </template>
        <template #cell-serialNumber="{ row }">
          <span class="text-primary font-bold">{{
            row.serialNumber || "N/A"
          }}</span>
        </template>
        <template #cell-installationMileage="{ row }">
          <span class="text-grey-900"
            >{{ row.installationMileage?.toLocaleString() || "0" }} km</span
          >
        </template>
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import type { Vehicle } from "../../operation.types";
import { fetch_vehicle_tyres } from "../../api/operation.api";
import BaseTable from "@/components/common/Table.vue";

const props = defineProps<{
  vehicle: Vehicle;
}>();

const { data: tyres, isLoading } = useQuery({
  queryKey: ["vehicle-tyres", props.vehicle._id],
  queryFn: () => fetch_vehicle_tyres(props.vehicle._id),
});

const newTyres = computed(() => {
  return Array.isArray(tyres.value?.data)
    ? tyres.value.data.filter((t: any) => !t.oldTyre)
    : [];
});

const oldTyres = computed(() => {
  return Array.isArray(tyres.value?.data)
    ? tyres.value.data.filter((t: any) => t.oldTyre)
    : [];
});

const columns = [
  { key: "type", label: "Type" },
  { key: "serialNumber", label: "Serial Number" },
  { key: "installationMileage", label: "Mileage" },
];
</script>
