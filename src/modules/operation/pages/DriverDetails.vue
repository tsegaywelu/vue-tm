<template>
  <div v-if="isLoading" class="flex justify-center py-20">
    <i class="mdi mdi-loading mdi-spin text-4xl text-primary"></i>
  </div>

  <div v-else-if="driver" class="flex flex-col gap-6">
    <!-- Header Info Card -->
    <div
      class="bg-grey-25 rounded-[32px] p-6 md:p-10 border border-grey-100 flex flex-col md:flex-row items-center justify-between gap-8"
    >
      <div class="flex items-center gap-8">
        <div
          class="size-24 md:size-32 rounded-full bg-white flex items-center justify-center shadow-lg border border-grey-100 p-4 overflow-hidden"
        >
          <img
            v-if="driver.profilePicture"
            :src="getProfilePictureURL(driver.profilePicture)"
            alt="Driver profile picture"
            class="h-full w-full rounded-full object-cover"
          />
          <div v-else class="text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>
        <div class="flex flex-col gap-1">
          <h2
            class="text-3xl md:text-4xl font-black text-grey-900 tracking-tight"
          >
            {{ driver.firstName }} {{ driver.middleName || "" }}
            {{ driver.lastName }}
          </h2>
          <div class="flex items-center gap-2">
            <span
              class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase"
            >
              {{ driver.isEmployed ? "Employee" : "Sub Contract" }}
            </span>
            <span
              class="px-3 py-1 bg-grey-100 text-grey-600 text-xs font-bold rounded-full uppercase"
            >
              {{ driver.employeeNumber || "N/A" }}
            </span>
            <span
              v-if="driver.region?.name"
              class="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase flex items-center gap-1"
            >
              <i class="mdi mdi-map-marker-outline"></i>
              {{ driver.region.name }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-4">
        <Button
          v-permission="'DRIVER:balance_update'"
          size="md"
          variant="outline"
          @click="openAdjustBalanceModal"
        >
          Adjust Initial Settlement Balance
        </Button>
        <div @click.stop="openEditStatusModal">
          <Status
            :variant="getStatusVariant(driver.driverStatus)"
            type="wrapped"
            :label="formatCategoryType(driver.driverStatus)"
            class="cursor-pointer transition-colors hover:opacity-80"
          />
        </div>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="transition-all duration-300">
      <component :is="activeTabComponent" :driver="driver" @refresh="refetch" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import DashboardPage from "@/components/common/DashboardPage.vue";
import Status from "@/components/common/Status.vue";
import Button from "@/components/Button.vue";
import { openModal } from "@customizer/modal-x";
import { fetch_driver_by_id } from "../api/operation.api";

// Tabs
import BasicDetailsTab from "../components/driver-details/BasicDetailsTab.vue";
import DocumentsTab from "../components/driver-details/DocumentsTab.vue";
import ShipmentsTab from "../components/driver-details/ShipmentsTab.vue";
import SettlementsTab from "../components/driver-details/SettlementsTab.vue";

const route = useRoute();
const router = useRouter();
const driverId = route.params.id as string;

const {
  data: driverResponse,
  isLoading,
  refetch,
} = useQuery({
  queryKey: ["driver", driverId],
  queryFn: () => fetch_driver_by_id(driverId),
});

const driver = computed(() => driverResponse.value?.data);

const tabs = computed(() => (route.meta.tabs || []) as any[]);
const activeTab = computed(() => {
  return (
    (route.query.tab as string) || (tabs.value?.[0]?.value as string) || "basic"
  );
});

const tabComponents: Record<string, any> = {
  basic: BasicDetailsTab,
  documents: DocumentsTab,
  shipments: ShipmentsTab,
  settlements: SettlementsTab,
};

const activeTabComponent = computed(() => {
  return tabComponents[activeTab.value];
});

const openAdjustBalanceModal = async () => {
  if (!driver.value) return;
  const res = await openModal("AdjustInitialSettlementBalanceModal", {
    driver: driver.value,
  });
  if (res) refetch();
};

const openEditStatusModal = async () => {
  if (!driver.value) return;
  const res = await openModal("EditDriverStatusModal", {
    driver: driver.value,
  });
  if (res) {
    refetch();
  }
};

const formatCategoryType = (type: string | undefined) => {
  if (!type) return "N/A";
  const formatted = type
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return formatted;
};

const getStatusVariant = (status: string | undefined) => {
  switch (status) {
    case "ready_to_dispatch":
      return "active";
    case "dispatched":
      return "info";
    case "vehicle_not_assigned":
      return "wrapped";
    case "unavailable":
      return "info";
    case "suspended":
    case "terminated":
    case "fired":
      return "cancelled";
    default:
      return "info";
  }
};

const API_URL = import.meta.env.VITE_API_URL;
const getProfilePictureURL = (path: string) => {
  if (path) {
    return `${API_URL}/${path.replace(/\\/g, "/")}`;
  }
  return "";
};
</script>
