<template>
  <div class="flex flex-col gap-6 p-4">
    <!-- Loading state -->
    <div
      v-if="isLoading"
      class="flex flex-col items-center justify-center p-12 min-h-[300px] bg-surface rounded-2xl border border-gray-100 shadow-sm gap-4"
    >
      <div class="w-12 h-12 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin"></div>
      <p class="text-sm font-medium text-gray-500">Loading pre-trip inspections...</p>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="!inspections || inspections.length === 0"
      class="flex flex-col items-center justify-center p-12 min-h-[300px] bg-surface rounded-2xl border border-gray-100 shadow-sm gap-4 text-center"
    >
      <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 border border-gray-100/80">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <div class="flex flex-col gap-1">
        <h3 class="text-base font-semibold text-gray-900">No Pre-Trip Inspections Found</h3>
        <p class="text-sm text-gray-500 max-w-sm">No inspection records are available for this shipment at the moment.</p>
      </div>
    </div>

    <!-- Display inspection list -->
    <template v-else>
      <div
        v-for="(inspection, index) in inspections"
        :key="inspection._id || index"
        class="flex flex-col gap-6 p-6 bg-surface rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
      >
        <!-- Inspection Top Header (Overview Details) -->
        <div class="flex flex-col md:flex-row justify-between gap-4 border-b border-gray-50 pb-5">
          <div class="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <div class="flex flex-col gap-1">
              <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Inspection Date</span>
              <span class="text-base font-bold text-gray-900">
                {{ dateTimeFormatter(inspection.createdAt) || "-" }}
              </span>
            </div>

            <div class="flex flex-col gap-1">
              <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Vehicle Plate</span>
              <span class="text-base font-bold text-blue-600 bg-blue-50/60 px-3 py-1 rounded-lg border border-blue-100/60 inline-flex items-center w-fit">
                {{ inspection.shipment?.vehiclePlateNumber || inspection.vehiclePlate || "-" }}
              </span>
            </div>
          </div>

          <div class="flex flex-col gap-1 md:items-end flex-1 md:max-w-md">
            <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Remarks</span>
            <span class="text-sm text-gray-600 md:text-right">
              {{ inspection.remarks || "No remarks provided" }}
            </span>
          </div>
        </div>

        <!-- 3-Column Visual Sub-Cards Grid for Checked Items -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="(item, i) in getInspectionCards(inspection)"
            :key="i"
            class="flex flex-col justify-between p-4 bg-gray-50/40 hover:bg-surface rounded-xl border border-gray-100/60 hover:border-gray-200 hover:shadow-sm transition-all duration-200 gap-4 group"
          >
            <!-- Sub-card header: Label & Status Badge -->
            <div class="flex justify-between items-start gap-2">
              <div class="flex flex-col gap-1">
                <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider group-hover:text-gray-500 transition-colors duration-200">
                  Inspected Component
                </span>
                <span class="text-sm font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-200">
                  {{ item.label }}
                </span>
              </div>

              <!-- Status Badge with custom dynamic styling -->
              <span
                :class="getStatusColor(item.status)"
                class="px-2.5 py-1 text-xs font-bold rounded-lg tracking-wide shadow-sm"
              >
                {{ formatStatusText(item.status) }}
              </span>
            </div>

            <!-- Sub-card footer: Level or Location Details -->
            <div class="flex flex-col border-t border-gray-100/50 pt-2.5 gap-0.5">
              <span class="text-[11px] font-semibold text-gray-400">
                {{ item.isLocation ? "Location Detail" : "Level / Measurement" }}
              </span>
              <span class="text-sm font-semibold text-gray-700">
                <template v-if="item.level !== undefined && item.level !== null && item.level !== ''">
                  {{ item.level }}{{ item.unit || "" }}
                </template>
                <template v-else>
                  <span class="text-gray-400 text-xs italic font-normal">N/A</span>
                </template>
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { fetch_pre_trip_inspections } from "../../api/pre-trip-inspection.api";
import { dateTimeFormatter } from "@/utils/utils";

const props = defineProps<{
  shipment?: Record<string, any>;
}>();

const shipmentId = computed(() => props.shipment?._id);

const { data: inspectionResponse, isLoading } = useQuery({
  queryKey: ["pre-trip-inspections", shipmentId],
  queryFn: () => fetch_pre_trip_inspections(shipmentId.value!),
  enabled: computed(() => !!shipmentId.value),
  staleTime: 1000 * 60 * 5, // 5 minutes cache
});

const inspections = computed(() => {
  if (!inspectionResponse.value?.data) return [];
  if (Array.isArray(inspectionResponse.value.data)) {
    return inspectionResponse.value.data;
  }
  return [inspectionResponse.value.data];
});

const getInspectionCards = (inspection: any) => [
  {
    label: "Engine Oil",
    status: inspection.engineOilStatus,
    level: inspection.engineOilLevel,
    unit: "%",
  },
  {
    label: "Steering Oil",
    status: inspection.steeringOilStatus,
    level: inspection.steeringOilLevel,
    unit: "%",
  },
  {
    label: "Coolant",
    status: inspection.coolantStatus,
    level: inspection.coolantLevel,
    unit: "%",
  },
  {
    label: "Gearbox Oil",
    status: inspection.gearboxOilStatus,
    level: inspection.gearboxOilLevel,
    unit: "%",
  },
  {
    label: "Differential Oil",
    status: inspection.differentialOilStatus,
    level: inspection.differentialOilLevel,
    unit: "%",
  },
  {
    label: "Tyre Quality",
    status: inspection.tyreQualityStatus,
    level: inspection.tyreQualityLevel,
    unit: "%",
  },
  {
    label: "Tyre Air Inflation",
    status: inspection.tyreAirInflation,
    level: null,
    unit: null,
  },
  {
    label: "Air Cleaner",
    status: inspection.airCleanerStatus,
    level: null,
    unit: null,
  },
  {
    label: "Leakage",
    status: inspection.leakageStatus,
    level: Array.isArray(inspection.leakagePlace)
      ? inspection.leakagePlace.join(", ")
      : inspection.leakagePlace,
    unit: "",
    isLocation: true,
  },
];

const getStatusColor = (status?: string) => {
  if (!status) return "bg-gray-50 text-gray-600 border border-gray-200/50";
  const s = status.toLowerCase().replace(/_/g, " ").trim();

  // Pass / OK / Good / Clean / No Leak
  if (["pass", "ok", "good", "clean", "no leak"].includes(s)) {
    return "bg-green-50 text-green-700 border border-green-200/50";
  }
  // Fail / Bad / Low / Leak
  if (["fail", "bad", "low", "leak"].includes(s)) {
    return "bg-red-50 text-red-700 border border-red-200/50";
  }
  // Other
  return "bg-yellow-50 text-yellow-700 border border-yellow-200/50";
};

const formatStatusText = (status?: string) => {
  if (!status) return "N/A";
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};
</script>
