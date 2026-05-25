<template>
  <Teleport defer to="#page-actions">
    <Button variant="primary" size="md" @click="$router.push('/fleet/vehicle-expenses/add')">
      Add Expense
    </Button>
  </Teleport>

  <VehicleExpenseTable ref="tableRef" @action="handleAction" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { openModal } from "@customizer/modal-x";
import Button from "@/components/common/Button.vue";
import VehicleExpenseTable from "../components/VehicleExpenseTable.vue";
import { void_vehicle_expense } from "../api/fleet.api";

const router = useRouter();
const queryClient = useQueryClient();
const tableRef = ref<any>(null);

const voidMutation = useMutation({
  mutationFn: ({ id, reason }: { id: string; reason: string }) =>
    void_vehicle_expense(id, reason),
});

const handleAction = async ({ row, action }: { row: any; action: string }) => {
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
    if (confirmed) {
      queryClient.invalidateQueries({ queryKey: ["vehicle-expense-list"] });
      tableRef.value?.refetch();
    }
  }
};
</script>
