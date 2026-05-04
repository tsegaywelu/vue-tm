<template>
  <div class="flex flex-col gap-2.5 p-4 min-w-[320px] bg-white rounded-xl">
    <!-- Header: Spinner or Progress -->
    <div
      v-if="progress === 0"
      class="flex items-center gap-2.5 text-xs font-semibold text-gray-800"
    >
      <i class="*:size-5" v-html="icons.spinner"></i>
      <span>Initializing download for {{ type }}...</span>
    </div>

    <template v-else>
      <div
        class="flex justify-between items-center text-xs font-semibold text-gray-800"
      >
        <span class="flex items-center gap-1.5">
          <i class="mdi mdi-file-excel-outline text-green-600 text-lg"></i>
          <span>Generating {{ type }} Excel</span>
        </span>
        <span class="text-primary font-bold">{{ progress }}%</span>
      </div>

      <!-- Custom Progress bar -->
      <div
        class="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden border border-gray-100 flex"
      >
        <div
          class="bg-primary h-full rounded-full transition-all duration-200 ease-out"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>

      <!-- Footer -->
      <div
        class="flex justify-between items-center text-[11px] text-gray-400 mt-0.5"
      >
        <span>{{ statusText }}</span>
        <button
          @click="closeToast"
          class="text-gray-400 hover:text-gray-600 underline transition-colors cursor-pointer"
        >
          Dismiss
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { useToastStore } from "@/store/toastStore";
import { fetch_all_shipments_unpaginated } from "../api/operation.api";
import {
  exportToExcel,
  exportToExcelFullProduct,
  exportToExcelAll,
  exportToExcelReport,
} from "../utils/shipmentExport";
import { icons } from "@/utils/icons";

const props = defineProps<{
  type: string;
  toastId: string;
}>();

const toastStore = useToastStore();
const progress = ref(0);
const statusText = ref("Fetching shipment dataset...");
let hasExported = false;

const closeToast = () => {
  toastStore.removeToast(props.toastId);
};

// Use TanStack useQuery for caching and to pass progress config
const { data: response, isError } = useQuery({
  queryKey: ["unpaginated_shipments"],
  queryFn: () =>
    fetch_all_shipments_unpaginated(
      {},
      {
        onDownloadProgress: (progressEvent: any) => {
          if (progressEvent.total) {
            progress.value = Math.min(
              100,
              Math.round((progressEvent.loaded * 100) / progressEvent.total),
            );
          } else {
            progress.value = Math.min(95, progress.value + 5);
          }
        },
      },
    ),
  staleTime: 5 * 60 * 1000, // Caches for 5 minutes
});

function tryExport() {
  if (hasExported) return;
  if (progress.value === 100 && response.value?.data?.result) {
    hasExported = true;
    if (props.type === "Raw Material") {
      exportToExcel(response.value.data.result);
    } else if (props.type === "Full Product") {
      exportToExcelFullProduct(response.value.data.result);
    } else if (props.type === "All") {
      exportToExcelAll(response.value.data.result);
    } else if (props.type === "Report") {
      exportToExcelReport(response.value.data.result);
    }
    statusText.value = "Excel file generated!";
  }
}

onMounted(() => {
  if (response.value?.data?.result) {
    progress.value = 100;
    statusText.value = "Dataset retrieved successfully!";
    tryExport();
    return;
  }

  // Smooth initial loading steps
  const interval = setInterval(() => {
    if (progress.value < 100 && response.value?.data?.result) {
      progress.value = Math.min(100, progress.value + 20);
    } else if (response.value?.data?.result && progress.value >= 100) {
      clearInterval(interval);
      tryExport();
    }
  }, 100);
});

// Watch data fetch completion to start progress
watch(
  () => response.value,
  (res) => {
    if (res && res.data?.result) {
      if (progress.value < 100) {
        progress.value = 100;
      }
      statusText.value = "Dataset retrieved successfully!";
      tryExport();
    }
  },
);

// Watch the progress value to trigger download precisely when progress reaches 100
watch(
  () => progress.value,
  (val) => {
    if (val === 100) {
      tryExport();
    }
  },
);

watch(
  () => isError.value,
  (err) => {
    if (err) {
      statusText.value = "Failed to fetch dataset";
      progress.value = 0;
      toastStore.error(`Failed to download ${props.type} Excel.`);
    }
  },
);
</script>
