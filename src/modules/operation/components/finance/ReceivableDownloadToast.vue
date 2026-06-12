<template>
  <div class="flex flex-col gap-2.5 p-4 min-w-[320px] bg-surface rounded-xl">
    <div
      v-if="progress === 0"
      class="flex items-center gap-2.5 text-xs font-semibold text-gray-800"
    >
      <i class="*:size-5" v-html="icons.spinner"></i>
      <span>Initializing download for {{ type }}...</span>
    </div>

    <template v-else>
      <div class="flex justify-between items-center text-xs font-semibold text-gray-800">
        <span class="flex items-center gap-1.5">
          <i class="mdi mdi-file-excel-outline text-green-600 text-lg"></i>
          <span>Generating {{ type }} Excel</span>
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
import { fetch_all_receivable_shipments_unpaginated } from "../../api/operation.api";
import { icons } from "@/utils/icons";

const props = defineProps<{
  type: string;
  toastId: string;
  filters?: Record<string, any>;
}>();

const toastStore = useToastStore();
const progress = ref(0);
const statusText = ref("Fetching receivable dataset...");
let hasExported = false;

const closeToast = () => toastStore.removeToast(props.toastId);

const { data: response, isError, isFetching } = useQuery({
  queryKey: ["unpaginated_receivable_shipments", props.filters],
  queryFn: () =>
    fetch_all_receivable_shipments_unpaginated(props.filters ?? {}, {
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

function getShipments(): any[] | null {
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
  const shipments = getShipments();
  if (progress.value !== 100 || !shipments) return;

  hasExported = true;

  let data = shipments;
  if (props.type === "Raw Material") {
    data = shipments.filter((s: any) => s.productType === "IN_BOUND" || s.productType === "SITE_TRANSFER");
  } else if (props.type === "Full Product") {
    data = shipments.filter((s: any) => s.productType === "OUT_BOUND");
  }

  const rows = data.map((s: any) => ({
    "Date of Request": s.dispatchDate?.split("T")[0] || "N/A",
    "Supplier Name": s.order?.agent?.name || s.agent?.name || "N/A",
    "Origin": s.route?.origin || "N/A",
    "Destination": s.route?.destination || "N/A",
    "Plate Number": `${s.vehicle?.plateNumber || "N/A"}/${s.vehicle?.trailerPlate || "N/A"}`,
    "Driver Name": `${s.driver?.firstName || ""} ${s.driver?.lastName || ""}`.trim() || "N/A",
    "Issue Voucher": s.shipperIssueVoucher || "N/A",
    "Receive Voucher": s.agentReceiveVoucher || "N/A",
    "Document Uploaded": s.areDocumentsUploaded ? "Yes" : "No",
    "Product Type": s.productType || "N/A",
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const headers = Object.keys(rows[0] || {});
  worksheet["!cols"] = headers.map((h) => ({ wch: Math.max(h.length + 4, 20) }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Receivables");

  const suffix = props.type === "Raw Material" ? "Raw_Material"
    : props.type === "Full Product" ? "Full_Product"
    : "All";
  XLSX.writeFile(workbook, `Receivable_${suffix}_${new Date().toISOString().split("T")[0]}.xlsx`);

  statusText.value = "Excel file generated!";
}

onMounted(() => {
  if (getShipments()) {
    progress.value = 100;
    statusText.value = "Dataset retrieved successfully!";
    tryExport();
    return;
  }

  const interval = setInterval(() => {
    if (progress.value < 100 && getShipments()) {
      progress.value = Math.min(100, progress.value + 20);
    } else if (getShipments() && progress.value >= 100) {
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
      if (getShipments()) statusText.value = "Dataset retrieved successfully!";
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
      toastStore.error(`Failed to download ${props.type} Excel.`);
    }
  },
);
</script>
