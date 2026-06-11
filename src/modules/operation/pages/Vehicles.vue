<template>
  <!-- Mobile: icon buttons next to page title -->
  <Teleport to="#page-title-actions" defer>
    <button
      class="sm:hidden size-8 rounded-xl border border-line flex items-center justify-center text-faint-text hover:bg-surface-hover transition-colors"
      @click="() => $router.push({ path: '/vehicles/metrics' })"
      title="Vehicle Metrics"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    </button>
    <button
      class="sm:hidden size-8 rounded-xl border border-line flex items-center justify-center text-faint-text hover:bg-surface-hover transition-colors"
      @click="mobileMenuOpen = true"
    >
      <i class="*:size-4" v-html="icons.filterOptions"></i>
    </button>
  </Teleport>

  <!-- Desktop toolbar -->
  <Teleport to="#page-actions" defer>
    <div class="hidden sm:flex items-center gap-2">
      <Button
        variant="outline"
        size="md"
        @click="() => $router.push({ path: '/vehicles/metrics' })"
      >
        Vehicle Metrics
      </Button>
      <Button v-permission="'VEHICLE:create'" variant="primary" size="md" @click="handleRegisterVehicle">
        Register Vehicle
      </Button>
    </div>
  </Teleport>

  <!-- Mobile FAB: Register Vehicle -->
  <button
    v-permission="'VEHICLE:create'"
    class="fixed bottom-6 right-6 sm:hidden z-50 w-14 h-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center active:scale-95 transition-transform"
    @click="handleRegisterVehicle"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  </button>

  <!-- Mobile: options sheet -->
  <BottomSheet v-model="mobileMenuOpen" title="Search By">
    <div class="flex flex-col py-2 px-4 gap-1">
      <button
        v-for="opt in tableRef?.filterFieldOptions"
        :key="opt.value"
        class="flex items-center justify-between py-3 px-2 hover:bg-surface-hover rounded-xl transition-colors"
        @click="tableRef.selectedSearchField = opt.value; mobileMenuOpen = false"
      >
        <span class="font-medium">{{ opt.label }}</span>
        <i
          v-if="tableRef?.selectedSearchField === opt.value"
          class="*:size-4 text-primary"
          v-html="icons.check"
        ></i>
      </button>
    </div>
  </BottomSheet>

  <VehicleTable
    ref="tableRef"
    :filters="route.query.status ? { status: route.query.status, ownership: 'Owned' } : undefined"
    @action="handleAction"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import Button from "@/components/common/Button.vue";
import VehicleTable from "../components/VehicleTable.vue";
import BottomSheet from "@/components/BottomSheet.vue";
import { icons } from "@/utils/icons";
import { openModal } from "@customizer/modal-x";

const router = useRouter();
const route = useRoute();
const tableRef = ref<any>(null);
const mobileMenuOpen = ref(false);

const handleRegisterVehicle = () => {
  router.push("/vehicles/add");
};

const handleAction = async ({ row, action }: { row: any; action: string }) => {
  if (action === "view") {
    router.push(`/vehicles/${row._id}`);
  } else if (action === "edit") {
    router.push(`/vehicles/edit/${row._id}`);
  } else if (action === "edit-status") {
    const res = await openModal("EditVehicleStatusModal", { vehicle: row });
    if (res) {
      tableRef.value?.refetch();
    }
  } else if (action === "track") {
    openModal("VehicleMapModal", {
      vehicleId: row._id,
      plateNumber: row.plateNumber,
    });
  }
};
</script>
