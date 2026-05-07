<template>
  <div class="flex flex-col h-full">
    <!-- Page Actions (Teleported) -->
    <Teleport to="#page-actions" defer>
      <Button
        v-permission="'COMMODITY:create'"
        variant="primary"
        size="md"
        class="flex items-center gap-2"
        @click="router.push('/setting/commodity/add')"
      >
        <i v-html="icons.plus" />
        Add Commodity
      </Button>
    </Teleport>

    <!-- Table Section -->
    <div class="flex-1 min-h-0">
      <CommodityTable
        ref="tableRef"
        @action="handleAction"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import CommodityTable from "../../components/settings/Commodity/CommodityTable.vue";
import Button from "@/components/Button.vue";
import { icons } from "@/utils/icons";
import { useToastStore } from "@/store/toastStore";
import { delete_commodity } from "../../api/settings.api";

const router = useRouter();
const toast = useToastStore();
const tableRef = ref();

const handleAction = async ({ row, action }: any) => {
  if (action === "edit") {
    router.push(`/setting/commodity/edit/${row._id}`);
  } else if (action === "delete") {
    if (confirm(`Are you sure you want to delete "${row.name}"?`)) {
      try {
        const res = await delete_commodity(row._id);
        if (res.success) {
          toast.success("Commodity deleted successfully");
          tableRef.value?.refetch();
        } else {
          toast.error(res.error || "Failed to delete commodity");
        }
      } catch (error: any) {
        toast.error(error.message || "An unexpected error occurred");
      }
    }
  }
};
</script>
