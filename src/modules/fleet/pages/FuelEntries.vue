<template>
  <Teleport defer to="#page-actions">
    <Button variant="primary" size="md" @click="$router.push('/fleet/fuel-entries/add')">
      Add Fuel Entry
    </Button>
  </Teleport>

  <FuelEntryTable ref="tableRef" @action="handleAction" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { openModal } from "@customizer/modal-x";
import Button from "@/components/common/Button.vue";
import FuelEntryTable from "../components/FuelEntryTable.vue";
import { void_fuel_entry, cancel_void_fuel_entry } from "../api/fleet.api";
import { useToastStore } from "@/store/toastStore";

const router = useRouter();
const toast = useToastStore();
const queryClient = useQueryClient();
const tableRef = ref<any>(null);

const refresh = () => {
  queryClient.invalidateQueries({ queryKey: ["fuel-entry-list"] });
  tableRef.value?.refetch();
};

const voidMutation = useMutation({
  mutationFn: ({ id, reason }: { id: string; reason: string }) =>
    void_fuel_entry(id, reason),
});

const cancelVoidMutation = useMutation({
  mutationFn: (id: string) => cancel_void_fuel_entry(id),
});

const handleAction = async ({ row, action }: { row: any; action: string }) => {
  if (action === "view") {
    router.push(`/fleet/fuel-entries/${row._id}`);
    return;
  }

  if (action === "edit") {
    router.push(`/fleet/fuel-entries/edit/${row._id}`);
    return;
  }

  if (action === "void") {
    const confirmed = await openModal("VoidEntryModal", {
      entryId: row._id,
      voidFn: (id: string, reason: string) =>
        voidMutation.mutateAsync({ id, reason }),
    });
    if (confirmed) refresh();
    return;
  }

  if (action === "cancel-void") {
    const confirmed = await openModal("ConfirmationModal", {
      title: "Cancel Void",
      message: "Are you sure you want to restore this fuel entry?",
      confirmText: "Restore",
      cancelText: "Cancel",
    });
    if (confirmed) {
      const res = await cancelVoidMutation.mutateAsync(row._id);
      if (res.success) {
        toast.success("Fuel entry restored");
        refresh();
      } else {
        toast.error(res.error || "Failed to restore fuel entry");
      }
    }
  }
};
</script>
