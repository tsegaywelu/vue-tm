<template>
  <div class="flex flex-col gap-6 py-4">
    <!-- Summary Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        class="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col gap-1"
      >
        <span class="text-xs text-blue-600 font-bold uppercase tracking-wider"
          >Driver App Usage</span
        >
        <div class="flex items-end gap-2">
          <span class="text-2xl font-bold text-blue-900"
            >{{ report.driverAppUsage.percentage }}%</span
          >
          <span class="text-sm text-blue-700 pb-1"
            >({{ report.driverAppUsage.count }}/{{
              report.driverAppUsage.eligibleTotal
            }})</span
          >
        </div>
      </div>
      <div
        class="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 flex flex-col gap-1"
      >
        <span class="text-xs text-purple-600 font-bold uppercase tracking-wider"
          >Driver Changes</span
        >
        <span class="text-2xl font-bold text-purple-900">{{
          report.totalChanges
        }}</span>
      </div>
      <div
        class="p-4 rounded-2xl bg-orange-50/50 border border-orange-100 flex flex-col gap-1"
      >
        <span class="text-xs text-orange-600 font-bold uppercase tracking-wider"
          >Eligible Status Changes</span
        >
        <span class="text-2xl font-bold text-orange-900">{{
          report.driverAppUsage.eligibleTotal
        }}</span>
      </div>
    </div>

    <!-- Source Distribution -->
    <div class="flex flex-col gap-3">
      <h3 class="text-sm font-bold text-gray-700 uppercase tracking-widest px-1">
        Source Distribution
      </h3>
      <div
        class="flex items-center w-full h-3 rounded-full overflow-hidden bg-gray-100"
      >
        <div
          v-for="source in report.bySource"
          :key="source.source"
          :style="{ width: source.percentage + '%' }"
          :class="getSourceColor(source.source)"
          class="h-full transition-all duration-500"
        ></div>
      </div>
      <div class="flex flex-wrap gap-4 mt-1">
        <div
          v-for="source in report.bySource"
          :key="source.source"
          class="flex items-center gap-2"
        >
          <div
            class="size-2.5 rounded-full"
            :class="getSourceColor(source.source)"
          ></div>
          <span class="text-xs font-semibold text-gray-600"
            >{{ source.source }}: {{ source.percentage }}% ({{
              source.count
            }})</span
          >
        </div>
      </div>
    </div>

    <!-- Status Breakdown -->
    <div class="flex flex-col gap-3 mt-2">
      <h3 class="text-sm font-bold text-gray-700 uppercase tracking-widest px-1">
        Detailed Status Breakdown
      </h3>
      <div class="overflow-hidden border border-gray-100 rounded-2xl">
        <table class="w-full text-left">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th
                class="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase"
              >
                Status Milestone
              </th>
              <th
                class="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase text-center"
              >
                GPS
              </th>
              <th
                class="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase text-center"
              >
                Driver
              </th>
              <th
                class="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase text-center"
              >
                Staff
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr
              v-for="item in report.statusSourceBreakdown"
              :key="item.status"
              class="hover:bg-surface-hover/50 transition-colors"
            >
              <td class="px-4 py-3 text-xs font-bold text-gray-800">
                {{ formatStatus(item.status) }}
              </td>
              <td
                v-for="s in ['GPS', 'DRIVER', 'STAFF']"
                :key="s"
                class="px-4 py-3 text-center"
              >
                <span
                  class="text-xs font-medium"
                  :class="
                    getSourceCount(item.bySource, s) > 0
                      ? 'text-gray-900 font-bold'
                      : 'text-gray-300'
                  "
                >
                  {{ getSourceCount(item.bySource, s) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StatusSourceReport, StatusSource } from "../../operation.types";
import { formatStatus } from "@/utils/utils";

defineProps<{
  report: StatusSourceReport;
}>();

const getSourceColor = (source: string) => {
  switch (source.toUpperCase()) {
    case "GPS":
      return "bg-emerald-500";
    case "DRIVER":
      return "bg-blue-500";
    case "STAFF":
      return "bg-orange-500";
    default:
      return "bg-gray-400";
  }
};

const getSourceCount = (sources: StatusSource[], name: string) => {
  return (
    sources.find((s) => s.source.toUpperCase() === name.toUpperCase())?.count ||
    0
  );
};
</script>
