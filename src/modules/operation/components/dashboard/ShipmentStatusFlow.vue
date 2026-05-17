<template>
  <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
    <div class="flex items-center justify-between mb-1">
      <div>
        <p class="text-xs text-gray-400 font-medium">Shipment Status</p>
        <p class="text-2xl font-extrabold text-gray-800">
          {{ isLoading ? '—' : total.toLocaleString() }}
        </p>
      </div>
      <button @click="refetch()" class="text-gray-400 hover:text-gray-600 transition-colors">
        <span class="mdi mdi-refresh text-lg" :class="isFetching ? 'animate-spin' : ''" />
      </button>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-10">
      <span class="mdi mdi-loading mdi-spin text-2xl text-indigo-400" />
    </div>

    <div v-else class="mt-4">
      <!-- two columns: left flow and right flow -->
      <div class="grid grid-cols-2 gap-2">
        <FlowColumn :steps="leftSteps" />
        <FlowColumn :steps="rightSteps" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { fetchShipmentStatusCount } from "../../api/dashboard.api";

const { data, isLoading, isFetching, refetch } = useQuery({
  queryKey: ["dashboard-shipment-status"],
  queryFn: fetchShipmentStatusCount,
});

const s = computed(() => (data.value as any)?.data ?? {});

const total = computed(() =>
  Object.values(s.value).reduce((a: number, b: unknown) => a + (Number(b) || 0), 0)
);

const leftSteps = computed(() => [
  { label: "Vehicle Assigned", value: s.value.vehicle_assigned ?? 0, color: "#6366f1" },
  { label: "En Route to Origin", value: s.value.en_route_to_origin ?? 0, color: "#818cf8" },
  { label: "Arrived at Origin", value: s.value.arrived_at_origin ?? 0, color: "#a5b4fc" },
  { label: "Loading at Origin", value: s.value.loading_at_origin ?? 0, color: "#c7d2fe" },
  { label: "Loaded at Origin", value: s.value.loaded_at_origin ?? 0, color: "#e0e7ff" },
]);

const rightSteps = computed(() => [
  { label: "Departed", value: s.value.departed ?? 0, color: "#3b82f6" },
  { label: "Arrived at Destination", value: s.value.arrived_at_destination ?? 0, color: "#60a5fa" },
  { label: "Offloading", value: s.value.offloading_at_destination ?? 0, color: "#93c5fd" },
  { label: "Completed", value: s.value.completed ?? 0, color: "#22c55e" },
]);

// Inline sub-component to avoid extra files
const FlowColumn = {
  props: ["steps"],
  setup(props: { steps: { label: string; value: number; color: string }[] }) {
    return () =>
      h(
        "div",
        { class: "flex flex-col gap-1" },
        props.steps.map((step, i) =>
          h("div", { key: i, class: "flex flex-col" }, [
            h("div", { class: "flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors" }, [
              h("div", {
                class: "w-2 h-2 rounded-full flex-shrink-0",
                style: { background: step.color },
              }),
              h("span", { class: "text-xs text-gray-600 flex-1 truncate" }, step.label),
              h("span", { class: "text-xs font-bold text-gray-800" }, step.value.toLocaleString()),
            ]),
            i < props.steps.length - 1
              ? h("div", { class: "w-0.5 h-3 bg-gray-100 ml-3.5" })
              : null,
          ])
        )
      );
  },
};
</script>
