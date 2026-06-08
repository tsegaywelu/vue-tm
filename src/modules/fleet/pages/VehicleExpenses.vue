<template>

  <Teleport defer to="#page-actions">
    <div class="hidden sm:flex items-center gap-2">
      <Button variant="primary" size="md" @click="router.push('/fleet/vehicle-expenses/add')">
        Add Expense
      </Button>
    </div>
  </Teleport>

  <button
    class="fixed bottom-6 right-6 sm:hidden z-50 w-14 h-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center active:scale-95 transition-transform"
    @click="router.push('/fleet/vehicle-expenses/add')"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  </button>

  <VehicleExpenseTable ref="tableRef" @action="handleAction" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { openModal } from "@customizer/modal-x";
import Button from "@/components/common/Button.vue";
import VehicleExpenseTable from "../components/VehicleExpenseTable.vue";
import { void_vehicle_expense, cancel_void_vehicle_expense } from "../api/fleet.api";
import { useToastStore } from "@/store/toastStore";

const router = useRouter();
const toast = useToastStore();
const queryClient = useQueryClient();
const tableRef = ref<any>(null);

const refresh = () => {
  queryClient.invalidateQueries({ queryKey: ["vehicle-expense-list"] });
  tableRef.value?.refetch();
};

const voidMutation = useMutation({
  mutationFn: ({ id, reason }: { id: string; reason: string }) =>
    void_vehicle_expense(id, reason),
});

const cancelVoidMutation = useMutation({
  mutationFn: (id: string) => cancel_void_vehicle_expense(id),
});

const handleAction = async ({ row, action }: { row: any; action: string }) => {
  if (action === "view") {
    router.push(`/fleet/vehicle-expenses/${row._id}`);
    return;
  }

  if (action === "edit") {
    router.push(`/fleet/vehicle-expenses/edit/${row._id}`);
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
      message: "Are you sure you want to restore this expense entry?",
      confirmText: "Restore",
      cancelText: "Cancel",
    });
    if (confirmed) {
      const res = await cancelVoidMutation.mutateAsync(row._id);
      if (res.success) {
        toast.success("Expense entry restored");
        refresh();
      } else {
        toast.error(res.error || "Failed to restore expense entry");
      }
    }
  }
};
</script>
