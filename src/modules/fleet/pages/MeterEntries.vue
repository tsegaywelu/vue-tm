<template>

  <Teleport defer to="#page-actions">
    <div class="hidden sm:flex items-center gap-2">
      <Button variant="primary" size="md" @click="router.push('/fleet/meter-entries/add')">
        Add Meter Entry
      </Button>
    </div>
  </Teleport>

  <button
    class="fixed bottom-6 right-6 sm:hidden z-50 w-14 h-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center active:scale-95 transition-transform"
    @click="router.push('/fleet/meter-entries/add')"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  </button>

  <MeterEntryTable @action="handleAction" />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import Button from "@/components/common/Button.vue";
import MeterEntryTable from "../components/MeterEntryTable.vue";

const router = useRouter();

const handleAction = ({ row, action }: { row: any; action: string }) => {
  if (action === "view") {
    router.push(`/fleet/meter-entries/${row._id}`);
    return;
  }
  if (action === "edit") {
    router.push(`/fleet/meter-entries/edit/${row._id}`);
  }
};
</script>
