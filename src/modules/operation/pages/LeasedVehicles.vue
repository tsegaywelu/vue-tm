<template>
  <Teleport to="#page-actions" defer>
    <Button
      v-permission="'VEHICLE_LEASE_AGREEMENT:create'"
      variant="primary"
      size="md"
      class="hidden sm:flex"
      @click="openAddModal"
    >
      Add Leased Vehicle
    </Button>
  </Teleport>

  <!-- Floating action button — mobile only -->
  <button
    v-permission="'VEHICLE_LEASE_AGREEMENT:create'"
    class="fixed bottom-6 right-6 sm:hidden z-50 w-14 h-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center active:scale-95 transition-transform"
    @click="openAddModal"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  </button>

  <LeasedVehicleTable ref="tableRef" @action="handleAction" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { openModal } from "@customizer/modal-x";
import Button from "@/components/common/Button.vue";
import LeasedVehicleTable from "../components/LeasedVehicleTable.vue";
import { useToastStore } from "@/store/toastStore";
import ApiService from "@/api/ApiService";

const router = useRouter();
const tableRef = ref();
const toast = useToastStore();
const api = new ApiService();
const queryClient = useQueryClient();

const terminateMutation = useMutation({
  mutationFn: (id: string) =>
    api
      .addAuthenticationHeader()
      .patch(`/vehicle-lease-agreement/${id}/change-status`, {
        status: "TERMINATED",
      }),
  onSuccess: () => {
    toast.success("Agreement terminated successfully");
    queryClient.invalidateQueries({ queryKey: ["leased-vehicle-list"] });
  },
  onError: (error: any) => {
    toast.error(
      error.response?.data?.description || "Failed to terminate agreement",
    );
  },
});

const openAddModal = async () => {
  await openModal("AddLeasedVehicleModal");
};

const handleAction = async ({ row, action }: { row: any; action: string }) => {
  if (action === "view" && row.vehicle?._id) {
    router.push(`/vehicles/${row.vehicle._id}`);
  } else if (action === "edit") {
    await openModal("EditLeasedVehicleModal", { lease: row });
  } else if (action === "extend") {
    await openModal("ExtendLeaseModal", { lease: row });
  } else if (action === "renew") {
    await openModal("RenewLeaseModal", { lease: row });
  } else if (action === "terminate") {
    const res = await openModal("ConfirmationModal", {
      title: "Terminate Agreement",
      message: "Are you sure you want to terminate this agreement?",
      confirmText: "Yes, Terminate",
      action: "terminate",
    });

    if (res) {
      await terminateMutation.mutateAsync(row._id);
    }
  }
};
</script>
