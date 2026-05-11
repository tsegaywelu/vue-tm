<template>
  <Teleport to="#page-actions" defer>
    <Button
      v-permission="'VEHICLE_LEASE_AGREEMENT:create'"
      variant="primary"
      size="md"
      @click="openAddModal"
    >
      Add Leased Vehicle
    </Button>
  </Teleport>

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
