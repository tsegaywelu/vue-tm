<template>
  <div class="flex flex-col h-full">
    <!-- Page Actions (Teleported) -->
    <Teleport to="#page-actions" defer>
      <Button
        variant="primary"
        size="md"
        class="flex items-center gap-2"
        @click="router.push('/setting/region/add')"
      >
        <i v-html="icons.plus" />
        Add Region
      </Button>
    </Teleport>

    <!-- Table Section -->
    <div class="flex-1 min-h-0">
      <RegionTable
        ref="tableRef"
        @action="handleAction"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import RegionTable from "../../components/settings/Region/RegionTable.vue";
import Button from "@/components/Button.vue";
import { icons } from "@/utils/icons";
import { useToastStore } from "@/store/toastStore";
import { delete_region } from "../../api/region.api";

const router = useRouter();
const toast = useToastStore();
const tableRef = ref();

const handleAction = async ({ row, action }: any) => {
  if (action === "edit") {
    router.push(`/setting/region/edit/${row._id}`);
  } else if (action === "delete") {
    if (confirm(`Are you sure you want to delete region "${row.name}"?`)) {
      try {
        const res = await delete_region(row._id);
        if (res.success) {
          toast.success("Region deleted successfully");
          tableRef.value?.refetch();
        } else {
          toast.error(res.error || "Failed to delete region");
        }
      } catch (error: any) {
        toast.error(error.message || "An unexpected error occurred");
      }
    }
  }
};
</script>
