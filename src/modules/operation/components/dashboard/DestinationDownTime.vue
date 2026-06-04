<template>
  <div class="bg-surface rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-gray-800">Destination Down Time</h3>
      <button @click="refetch()" class="text-gray-400 hover:text-gray-600 transition-colors">
        <span class="mdi mdi-refresh text-lg" :class="isFetching ? 'animate-spin' : ''" />
      </button>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center flex-1 py-8">
      <span class="mdi mdi-loading mdi-spin text-2xl text-indigo-400" />
    </div>

    <div v-else-if="!items.length" class="text-sm text-gray-400 text-center py-8">
      No active downtime
    </div>

    <div v-else class="flex flex-col gap-3 overflow-y-auto max-h-72 pr-1">
      <div
        v-for="item in items"
        :key="item.id"
        class="flex items-center justify-between gap-3 py-2 border-b border-gray-50 last:border-0"
      >
        <!-- route -->
        <div class="flex items-center gap-1.5 min-w-0">
          <span
            class="w-1.5 h-1.5 rounded-full shrink-0"
            :class="item.isCritical ? 'bg-red-500' : 'bg-indigo-500'"
          />
          <span class="text-xs font-medium text-gray-700 truncate">{{ item.route }}</span>
        </div>

        <!-- elapsed time -->
        <div class="flex items-center gap-1 shrink-0">
          <CountdownUnit :value="item.elapsed.days" label="Days" />
          <span class="text-red-400 font-bold text-xs">:</span>
          <CountdownUnit :value="item.elapsed.hours" label="Hours" />
          <span class="text-red-400 font-bold text-xs">:</span>
          <CountdownUnit :value="item.elapsed.minutes" label="Min" />
          <span class="text-red-400 font-bold text-xs">:</span>
          <CountdownUnit :value="item.elapsed.seconds" label="Sec" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, h } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { fetchDestinationDowntime } from "../../api/dashboard.api";

const CountdownUnit = {
  props: ["value", "label"],
  setup(props: any) {
    return () =>
      h("div", { class: "flex flex-col items-center" }, [
        h(
          "span",
          { class: "text-xs font-bold text-red-500 bg-red-50 border border-red-100 rounded px-1.5 py-0.5 min-w-[28px] text-center" },
          String(props.value).padStart(2, "0"),
        ),
        h("span", { class: "text-[9px] text-gray-400 mt-0.5" }, props.label),
      ]);
  },
};

const { data, isLoading, isFetching, refetch } = useQuery({
  queryKey: ["dashboard-destination-downtime"],
  queryFn: fetchDestinationDowntime,
});

// seconds elapsed since page load — ticked by interval
const tick = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  timer = setInterval(() => tick.value++, 1000);
});
onUnmounted(() => {
  if (timer) clearInterval(timer);
});

interface DowntimeItem {
  id: string;
  route: string;
  isCritical: boolean;
  elapsed: { days: number; hours: number; minutes: number; seconds: number };
}

const items = computed<DowntimeItem[]>(() => {
  const raw: any[] = (data.value as any)?.data ?? [];
  return raw.map((item: any) => {
    // totalHours is elapsed downtime from the API (exact field from original)
    const totalSeconds = Math.round(Number(item.totalHours ?? 0) * 3600) + tick.value;

    const days    = Math.floor(totalSeconds / 86400);
    const hours   = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      id: item._id ?? (item.shipment?._id ?? item.shipment) ?? String(Math.random()),
      route: item.route ?? "—",
      isCritical: !!item.isCritical,
      elapsed: { days, hours, minutes, seconds },
    };
  });
});
</script>
