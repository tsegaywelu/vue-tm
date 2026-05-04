<template>
  <Teleport to="#page-actions" defer>
    <div class="flex items-center gap-2">
      <!-- Download Dropdown -->
      <div class="relative inline-block text-left">
        <Button
          variant="secondary"
          size="md"
          @click="isDropdownOpen = !isDropdownOpen"
        >
          <i class="mdi mdi-download mr-1"></i> Download
        </Button>
        <div
          v-if="isDropdownOpen"
          class="absolute right-0 mt-2 p-1 bg-white border border-grey-100 rounded-xl shadow-2xl z-[9999] w-48 flex flex-col gap-1"
        >
          <button
            class="flex items-center gap-2 w-full p-2 text-sm text-grey-700 hover:bg-grey-50 rounded-lg text-left"
            @click="handleDownload('Raw Material')"
          >
            <i class="mdi mdi-file-excel-outline text-lg text-green-600"></i>
            <span>Raw Material</span>
          </button>
          <button
            class="flex items-center gap-2 w-full p-2 text-sm text-grey-700 hover:bg-grey-50 rounded-lg text-left"
            @click="handleDownload('Full Product')"
          >
            <i class="mdi mdi-file-excel-outline text-lg text-green-600"></i>
            <span>Full Product</span>
          </button>
          <button
            class="flex items-center gap-2 w-full p-2 text-sm text-grey-700 hover:bg-grey-50 rounded-lg text-left"
            @click="handleDownload('All')"
          >
            <i class="mdi mdi-file-excel-outline text-lg text-green-600"></i>
            <span>All</span>
          </button>
          <button
            class="flex items-center gap-2 w-full p-2 text-sm text-grey-700 hover:bg-grey-50 rounded-lg text-left"
            @click="handleDownload('Report')"
          >
            <i class="mdi mdi-file-excel-outline text-lg text-green-600"></i>
            <span>Report</span>
          </button>
        </div>
      </div>

      <!-- Add Shipment Button -->
      <Button @click="router.push('/operation/shipments/add')">
        <template #leading>
          <div class="size-5" v-html="all_icons.plus"></div>
        </template>
        New Shipment
      </Button>
    </div>
  </Teleport>

  <!-- Backdrop for dropdown -->
  <div
    v-if="isDropdownOpen"
    class="fixed inset-0 z-[9998]"
    @click="isDropdownOpen = false"
  />

  <!-- Shipment Statistics Cards Component -->
  <Teleport to="#extra-page-data" defer>
    <ShipmentStatsCards />
  </Teleport>

  <!-- Shipment Data Table -->
  <ShipmentTable @action="handleShipmentAction" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import ShipmentTable from "../components/ShipmentTable.vue";
import ShipmentStatsCards from "../components/ShipmentStatsCards.vue";
import Button from "@/components/Button.vue";
import { type Shipment } from "../operation.types";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";
import { useToastStore } from "@/store/toastStore";
import ShipmentDownloadToast from "../components/ShipmentDownloadToast.vue";

const all_icons = { ...icons, ...raaz_icons };
const router = useRouter();
const toast = useToastStore();

const isDropdownOpen = ref(false);

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
