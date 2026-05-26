<template>
  <!-- Mobile trigger: teleported next to page title -->
  <Teleport to="#page-title-actions" defer>
    <button
      class="sm:hidden size-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
      @click="mobileMenuOpen = true"
    >
      <i class="*:size-4" v-html="icons.filterOptions"></i>
    </button>
  </Teleport>

  <!-- Desktop toolbar -->
  <Teleport to="#page-actions" defer>
    <div class="hidden sm:flex items-center gap-2">
      <Dropdown>
        <template #trigger>
          <Button variant="secondary" size="md">
            <i v-html="icons.longArrow"></i> Download
          </Button>
        </template>
        <template #default="{ close }">
          <DropDownItem label="Raw Material" @click="handleDownload('Raw Material')">
            Raw Material
            <template #icon>
              <i class="*:size-5" v-html="icons.excell"></i>
            </template>
          </DropDownItem>
          <DropDownItem label="Full Product" @click="handleDownload('Full Product')">
            <template #icon>
              <i class="*:size-5" v-html="icons.excell"></i>
            </template>
          </DropDownItem>
          <DropDownItem label="All" @click="handleDownload('All')">
            <template #icon>
              <i class="*:size-5" v-html="icons.excell"></i>
            </template>
          </DropDownItem>
          <DropDownItem label="Report" @click="handleDownload('Report')">
            <template #icon>
              <i class="*:size-5" v-html="icons.excell"></i>
            </template>
          </DropDownItem>
        </template>
      </Dropdown>
      <DateRangePicker
        v-model="dateRange"
        pagination-id="shipment-list"
        start-key="dispatchStartDate"
        end-key="dispatchEndDate"
      />
      <Button
        v-role="UserRoles.CARRIER"
        v-permission="'SHIPMENT:create'"
        @click="router.push(`${basePath}/add`)"
      >
        <template #leading>
          <div class="size-5" v-html="all_icons.plus"></div>
        </template>
        New Shipment
      </Button>
    </div>
  </Teleport>

  <!-- Mobile FAB: New Shipment -->
  <button
    v-role="UserRoles.CARRIER"
    v-permission="'SHIPMENT:create'"
    @click="router.push(`${basePath}/add`)"
    class="sm:hidden fixed bottom-6 right-6 z-40 size-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center"
  >
    <div class="size-6" v-html="all_icons.plus"></div>
  </button>

  <!-- Mobile: main options sheet (Date Range + Download) -->
  <BottomSheet v-model="mobileMenuOpen" title="Options">
    <div class="flex flex-col py-2">
      <button
        class="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left"
        @click="mobileMenuOpen = false; mobileDateOpen = true"
      >
        <i class="*:size-5 shrink-0 text-gray-500" v-html="icons.calender"></i>
        <div class="flex flex-col flex-1">
          <span class="font-medium text-gray-900">Date Range</span>
          <span v-if="dateRange.start" class="text-xs text-primary mt-0.5">
            {{ dateRange.start }} — {{ dateRange.end || "…" }}
          </span>
        </div>
        <button v-if="dateRange.start" type="button" class="*:size-4 text-primary/60 shrink-0" v-html="icons.close" @click.stop.prevent="dateRange = { start: '', end: '' }"></button>
      </button>
      <button
        class="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left"
        @click="mobileMenuOpen = false; mobileDownloadOpen = true"
      >
        <i class="*:size-5 shrink-0 text-gray-500" v-html="icons.export"></i>
        <span class="font-medium text-gray-900">Download</span>
      </button>
      <button
        class="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left"
        @click="mobileMenuOpen = false; mobileSearchOpen = true"
      >
        <i class="*:size-5 shrink-0 text-gray-500" v-html="icons.filter"></i>
        <div class="flex flex-col flex-1">
          <span class="font-medium text-gray-900">Search By</span>
          <span class="text-xs text-gray-400 mt-0.5">
            {{ shipmentTableRef?.searchFieldOptions?.find((o: any) => o.value === shipmentTableRef?.selectedSearchField)?.label || 'Plate Number' }}
          </span>
        </div>
      </button>
    </div>
  </BottomSheet>

  <!-- Mobile: download options sheet -->
  <BottomSheet v-model="mobileDownloadOpen" title="Download">
    <div class="flex flex-col py-2 px-4 gap-1">
      <button
        class="flex items-center gap-3 py-3 px-2 hover:bg-gray-50 rounded-xl transition-colors"
        @click="handleDownload('Raw Material'); mobileDownloadOpen = false"
      >
        <i class="*:size-5" v-html="icons.excell"></i>
        <span class="font-medium">Raw Material</span>
      </button>
      <button
        class="flex items-center gap-3 py-3 px-2 hover:bg-gray-50 rounded-xl transition-colors"
        @click="handleDownload('Full Product'); mobileDownloadOpen = false"
      >
        <i class="*:size-5" v-html="icons.excell"></i>
        <span class="font-medium">Full Product</span>
      </button>
      <button
        class="flex items-center gap-3 py-3 px-2 hover:bg-gray-50 rounded-xl transition-colors"
        @click="handleDownload('All'); mobileDownloadOpen = false"
      >
        <i class="*:size-5" v-html="icons.excell"></i>
        <span class="font-medium">All</span>
      </button>
      <button
        class="flex items-center gap-3 py-3 px-2 hover:bg-gray-50 rounded-xl transition-colors"
        @click="handleDownload('Report'); mobileDownloadOpen = false"
      >
        <i class="*:size-5" v-html="icons.excell"></i>
        <span class="font-medium">Report</span>
      </button>
    </div>
  </BottomSheet>

  <!-- Mobile: search field picker sheet -->
  <BottomSheet v-model="mobileSearchOpen" title="Search By">
    <div class="flex flex-col py-2 px-4 gap-1">
      <button
        v-for="opt in shipmentTableRef?.searchFieldOptions"
        :key="opt.value"
        class="flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-xl transition-colors"
        @click="shipmentTableRef.selectedSearchField = opt.value; mobileSearchOpen = false"
      >
        <span class="font-medium">{{ opt.label }}</span>
        <i
          v-if="shipmentTableRef?.selectedSearchField === opt.value"
          class="*:size-4 text-primary"
          v-html="icons.check"
        ></i>
      </button>
    </div>
  </BottomSheet>

  <!-- Mobile: date picker sheet -->
  <BottomSheet v-model="mobileDateOpen" title="Date Range">
    <div class="w-full overflow-x-auto">
      <DatePicker class="w-full min-w-0! rounded-none! shadow-none! p-4!" is-range :value="dateRange" @select="onMobileDateSelect" />
    </div>
  </BottomSheet>

  <div
    v-if="isDropdownOpen"
    class="fixed inset-0 z-9999"
    @click="isDropdownOpen = false"
  />

  <Teleport to="#extra-page-data" defer>
    <StatsCards :stats="shipmentStats" :loading="isLoadingStats" />
  </Teleport>

  <ShipmentTable
    ref="shipmentTableRef"
    :filters="{
      ...shipperFilters,
      dispatchStartDate: dateRange.start,
      dispatchEndDate: dateRange.end,
    }"
    @action="handleShipmentAction"
  />
</template>

<script setup lang="ts">
import { ref, computed, type ComponentPublicInstance } from "vue";
import { useRouter } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import ShipmentTable from "../components/ShipmentTable.vue";
import StatsCards from "@/components/common/StatsCards.vue";
import Button from "@/components/Button.vue";
import { UserRoles, type Shipment } from "../operation.types";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";
import { useToastStore } from "@/store/toastStore";
import ShipmentDownloadToast from "../components/ShipmentDownloadToast.vue";
import { fetch_shipment_status_count } from "../api/operation.api";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import { useAuthStore } from "@/store/authStore";
import DateRangePicker from "@/components/common/DateRangePicker.vue";
import BottomSheet from "@/components/BottomSheet.vue";
import DatePicker from "@/components/DatePicker.vue";

const all_icons = { ...icons, ...raaz_icons };
const router = useRouter();
const toast = useToastStore();
const authStore = useAuthStore();
const dateRange = ref({
  start: "",
  end: "",
});
const basePath = computed(() =>
  authStore.is_shipper ? "/shipper/shipments" : "/operation/shipments",
);

// Shipper users see only their scoped shipments
const shipperFilters = computed(() =>
  authStore.is_shipper
    ? { shipper: authStore.current_user?.user?.shipper?._id }
    : undefined,
);

const isDropdownOpen = ref(false);
const shipmentTableRef = ref<any>(null);
const mobileMenuOpen = ref(false);
const mobileDownloadOpen = ref(false);
const mobileDateOpen = ref(false);
const mobileSearchOpen = ref(false);

const { data: statsResponse, isLoading: isLoadingStats } = useQuery({
  queryKey: ["shipmentStatusCount", shipperFilters],
  queryFn: () => fetch_shipment_status_count(shipperFilters.value),
});

const shipmentStats = computed(() => {
  const data = statsResponse.value?.data || {};
  return [
    { label: "InProgress", value: data.InProgress, class: "text-primary" },
    { label: "Completed", value: data.completed },
    { label: "In Bound", value: data.IN_BOUND },
    { label: "Out Bound", value: data.OUT_BOUND },
    { label: "Site Transfer", value: data.SITE_TRANSFER },
    { label: "Owned", value: data.owned },
    { label: "Rental", value: data.rental },
    { label: "Leased", value: data.leased },
    {
      label: "Power & Trailer",
      value: data["power & trailer"] || data["power & trailor"],
    },
    { label: "MDV", value: data.mdv },
  ];
});

const handleShipmentAction = ({
  row,
  action,
}: {
  row: Shipment;
  action: string;
}) => {
  if (action === "view") {
    router.push(`${basePath.value}/${row._id}`);
  } else if (action === "edit") {
    router.push(`${basePath.value}/edit/${row._id}`);
  } else if (action === "create_advance") {
    router.push(`/operation/advances?shipmentCode=${row.shipmentCode}`);
  } else {
    console.log(`Action: ${action} on Shipment: ${row.shipmentCode}`);
  }
};

function onMobileDateSelect(val: any) {
  if (val && typeof val === "object" && val.start) {
    dateRange.value = { start: val.start || "", end: val.end || "" };
    if (val.end) mobileDateOpen.value = false;
  }
}

const handleDownload = (type: string) => {
  isDropdownOpen.value = false;
  const raw = shipmentTableRef.value?.activeParams ?? {};
  const filters = Object.fromEntries(
    Object.entries(raw).filter(
      ([, v]) => v !== "" && v !== null && v !== undefined,
    ),
  );
  toast.addCustomToast(ShipmentDownloadToast, {
    type,
    filters: {
      ...filters,
      selectedFilterOption: undefined,
    },
  });
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
