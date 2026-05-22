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
          <span>Generating Invoice Report Excel</span>
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
import * as XLSX from "xlsx-js-style";
import { useToastStore } from "@/store/toastStore";
import { fetch_all_invoice_reports_unpaginated } from "../api/operation.api";
import { dateFormatter, currencyFormatter } from "@/utils/utils";
import { icons } from "@/utils/icons";

const props = defineProps<{
  toastId: string;
  filters?: Record<string, any>;
}>();

const toastStore = useToastStore();
const progress = ref(0);
const statusText = ref("Fetching invoice reports...");
let hasExported = false;

const closeToast = () => toastStore.removeToast(props.toastId);

const { data: response, isError, isFetching } = useQuery({
  queryKey: ["unpaginated_invoice_reports", props.filters],
  queryFn: () =>
    fetch_all_invoice_reports_unpaginated(props.filters ?? {}, {
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
  const candidates = [d?.results, d?.items, d?.docs, d?.documents, d?.data];
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

    const headerStyle = {
      fill: { fgColor: { rgb: "1565C0" } },
      font: { bold: true, color: { rgb: "FFFFFF" }, sz: 10 },
      alignment: { horizontal: "center", wrapText: true },
      border: {
        top: { style: "thin" }, bottom: { style: "thin" },
        left: { style: "thin" }, right: { style: "thin" },
      },
    };
    const cellStyle = {
      font: { sz: 10 },
      border: {
        top: { style: "thin" }, bottom: { style: "thin" },
        left: { style: "thin" }, right: { style: "thin" },
      },
    };

    const headers = [
      "Reference", "Shipment Count", "Total Amount", "Request Date",
      "Requested By", "Status",
    ];

    const wsData: any[][] = [
      headers.map((h) => ({ v: h, t: "s", s: headerStyle })),
      ...rows.map((row: any) => [
        row.reference || "-",
        row.shipments?.length ?? 0,
        row.totalAmount || 0,
        dateFormatter(row.paymentRequestedDate) || "-",
        row.paymentRequestedBy?.username || "-",
        (row.status || "pending").replace(/_/g, " "),
      ].map((v, i) => ({
        v,
        t: i === 1 || i === 2 ? "n" : "s",
        s: cellStyle,
      }))),
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws["!cols"] = headers.map((h) => ({ wch: Math.max(h.length + 2, 14) }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Invoice Reports");
    XLSX.writeFile(wb, `InvoiceReports_${new Date().toISOString().split("T")[0]}.xlsx`);

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
  (val) => { if (val === 100) tryExport(); },
);

watch(
  () => isError.value,
  (err) => {
    if (err) {
      statusText.value = "Failed to fetch dataset";
      progress.value = 0;
      toastStore.error("Failed to download Invoice Reports Excel.");
    }
  },
);
</script>
