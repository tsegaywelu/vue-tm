<template>
  <div class="flex flex-col gap-2.5 p-4 min-w-[320px] bg-white rounded-xl">
    <div
      v-if="progress === 0"
      class="flex items-center gap-2.5 text-xs font-semibold text-gray-800"
    >
      <i class="*:size-5" v-html="icons.spinner"></i>
      <span>Initializing download...</span>
    </div>

    <template v-else>
      <div class="flex justify-between items-center text-xs font-semibold text-gray-800">
        <span class="flex items-center gap-1.5">
          <i class="mdi mdi-file-excel-outline text-green-600 text-lg"></i>
          <span>Generating Paid Sub-Contracts Excel</span>
        </span>
        <span class="text-primary font-bold">{{ progress }}%</span>
      </div>

      <div class="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden border border-gray-100 flex">
        <div
          class="bg-primary h-full rounded-full transition-all duration-200 ease-out"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>

      <div class="flex justify-between items-center text-[11px] text-gray-400 mt-0.5">
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
import * as XLSX from "xlsx";
import { useToastStore } from "@/store/toastStore";
import { fetch_all_sub_contracts_unpaginated } from "../../api/operation.api";
import { dateFormatter } from "@/utils/utils";
import { icons } from "@/utils/icons";

const props = defineProps<{
  toastId: string;
  filters?: Record<string, any>;
}>();

const toastStore = useToastStore();
const progress = ref(0);
const statusText = ref("Fetching sub-contracts dataset...");
let hasExported = false;

const closeToast = () => toastStore.removeToast(props.toastId);

const { data: response, isError, isFetching } = useQuery({
  queryKey: ["unpaginated_sub_contracts", props.filters],
  queryFn: () =>
    fetch_all_sub_contracts_unpaginated(props.filters ?? {}, {
      onDownloadProgress: (progressEvent: any) => {
        if (progressEvent.total) {
          progress.value = Math.min(
            99,
            Math.round((progressEvent.loaded * 100) / progressEvent.total),
          );
        } else {
          progress.value = Math.min(94, progress.value + 5);
        }
      },
    }),
  staleTime: 0,
});

function getRows(): any[] | null {
  const raw = response.value?.data as any;
  if (!raw) return null;
  const d = raw.result || raw.data || raw;
  if (Array.isArray(d)) return d;
  const candidates = [d?.shipments, d?.items, d?.results, d?.docs, d?.documents, d?.data, d?.vehicles];
  for (const c of candidates) {
    if (Array.isArray(c)) return c;
  }
  return null;
}

function tryExport() {
  if (hasExported) return;
  const rows = getRows();
  if (progress.value === 100 && rows) {
    hasExported = true;

    const formattedData = rows.map((row: any) => {
      const advance = row?.prePayments?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) ?? 0;
      const grossProfit = Number(((row.totalPrice || 0) - ((row.transporterPrice || 0) + advance)).toFixed(2));
      return {
        "Shipment Code": row.shipmentCode || "N/A",
        Transporter: row.transporter?.name || "N/A",
        "Dispatch Date": dateFormatter(row.dispatchDate),
        "Plate Number": row.vehicle?.plateNumber || "N/A",
        Driver: `${row.driver?.firstName || ""} ${row.driver?.lastName || ""}`.trim() || "N/A",
        Route: row.route?.routeName || "N/A",
        "Total Price": row.totalPrice || 0,
        "Transporter Price": row.transporterPrice || 0,
        Advance: advance,
        "Gross Profit": grossProfit,
      };
    });

    const headers = Object.keys(formattedData[0] || {});
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    worksheet["!cols"] = headers.map((h) => ({ wch: Math.max(h.length, 15) }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Paid Sub-Contracts");
    XLSX.writeFile(workbook, `PaidSubContracts_${new Date().toISOString().split("T")[0]}.xlsx`);

    statusText.value = "Excel file generated!";
  }
}

onMounted(() => {
  if (getRows()) {
    progress.value = 100;
    statusText.value = "Dataset retrieved successfully!";
    tryExport();
    return;
  }

  const interval = setInterval(() => {
    if (progress.value < 100 && getRows()) {
      progress.value = Math.min(100, progress.value + 20);
    } else if (getRows() && progress.value >= 100) {
      clearInterval(interval);
      tryExport();
    }
  }, 100);
});

watch(
  () => isFetching.value,
  (fetching) => {
    if (!fetching) {
      progress.value = 100;
      if (getRows()) statusText.value = "Dataset retrieved successfully!";
      tryExport();
    }
  },
);

watch(
  () => progress.value,
  (val) => {
    if (val === 100) tryExport();
  },
);

watch(
  () => isError.value,
  (err) => {
    if (err) {
      statusText.value = "Failed to fetch dataset";
      progress.value = 0;
      toastStore.error("Failed to download Paid Sub-Contracts Excel.");
    }
  },
);
</script>
