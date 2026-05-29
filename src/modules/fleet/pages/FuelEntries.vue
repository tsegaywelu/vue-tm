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
import { void_fuel_entry } from "../api/fleet.api";
import { useToastStore } from "@/store/toastStore";

const router = useRouter();
const toast = useToastStore();
const queryClient = useQueryClient();
const tableRef = ref<any>(null);

const voidMutation = useMutation({
  mutationFn: ({ id, reason }: { id: string; reason: string }) =>
    void_fuel_entry(id, reason),
});

const handleAction = async ({ row, action }: { row: any; action: string }) => {
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
    if (confirmed) {
      queryClient.invalidateQueries({ queryKey: ["fuel-entry-list"] });
      tableRef.value?.refetch();
    }
  }
};
</script>
