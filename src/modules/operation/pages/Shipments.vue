<template>
  <Teleport to="#page-actions" defer>
    <div class="flex items-center gap-2">
      <Dropdown>
        <template #trigger>
          <Button variant="secondary" size="md">
            <i v-html="icons.longArrow"></i> Download
          </Button>
        </template>
        <template #default="{ close }">
          <DropDownItem
            label="Raw Material"
            @click="handleDownload('Raw Material')"
          >
            <template #icon>
              <i class="mdi mdi-file-excel-outline text-lg text-green-600"></i>
            </template>
          </DropDownItem>
          <DropDownItem
            label="Full Product"
            @click="handleDownload('Full Product')"
          >
            <template #icon>
              <i class="mdi mdi-file-excel-outline text-lg text-green-600"></i>
            </template>
          </DropDownItem>
          <DropDownItem label="All" @click="handleDownload('All')">
            <template #icon>
              <i class="mdi mdi-file-excel-outline text-lg text-green-600"></i>
            </template>
          </DropDownItem>
          <DropDownItem label="Report" @click="handleDownload('Report')">
            <template #icon>
              <i class="mdi mdi-file-excel-outline text-lg text-green-600"></i>
            </template>
          </DropDownItem>
        </template>
      </Dropdown>

      <!-- Add Shipment Button -->
      <Button v-permission="'SHIPMENT:create'" @click="router.push('/operation/shipments/add')">
        <template #leading>
          <div class="size-5" v-html="all_icons.plus"></div>
        </template>
        New Shipment
      </Button>
    </div>
  </Teleport>

  <div
    v-if="isDropdownOpen"
    class="fixed inset-0 z-9999"
    @click="isDropdownOpen = false"
  />

  <Teleport to="#extra-page-data" defer>
    <StatsCards :stats="shipmentStats" :loading="isLoadingStats" />
  </Teleport>

  <ShipmentTable @action="handleShipmentAction" />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import ShipmentTable from "../components/ShipmentTable.vue";
import StatsCards from "@/components/common/StatsCards.vue";
import Button from "@/components/Button.vue";
import { type Shipment } from "../operation.types";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";
import { useToastStore } from "@/store/toastStore";
import ShipmentDownloadToast from "../components/ShipmentDownloadToast.vue";
import { fetch_shipment_status_count } from "../api/operation.api";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";

const all_icons = { ...icons, ...raaz_icons };
const router = useRouter();
const toast = useToastStore();

const isDropdownOpen = ref(false);

const { data: statsResponse, isLoading: isLoadingStats } = useQuery({
  queryKey: ["shipmentStatusCount"],
  queryFn: () => fetch_shipment_status_count(),
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
    router.push(`/operation/shipments/${row._id}`);
  } else if (action === "edit") {
    router.push(`/operation/shipments/edit/${row._id}`);
  } else if (action === "create_advance") {
    router.push(`/operation/advances?shipmentCode=${row.shipmentCode}`);
  } else {
    console.log(`Action: ${action} on Shipment: ${row.shipmentCode}`);
  }
};

const handleDownload = (type: string) => {
  isDropdownOpen.value = false;
  toast.addCustomToast(ShipmentDownloadToast, { type });
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
