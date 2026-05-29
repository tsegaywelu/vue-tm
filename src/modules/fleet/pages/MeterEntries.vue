<template>
  <Teleport defer to="#page-actions">
    <Button variant="primary" size="md" @click="$router.push('/fleet/meter-entries/add')">
      Add Meter Entry
    </Button>
  </Teleport>

  <MeterEntryTable @action="handleAction" />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import Button from "@/components/common/Button.vue";
import MeterEntryTable from "../components/MeterEntryTable.vue";

const router = useRouter();

const handleAction = ({ row, action }: { row: any; action: string }) => {
  if (action === "edit") {
    router.push(`/fleet/meter-entries/edit/${row._id}`);
  }
};
</script>
