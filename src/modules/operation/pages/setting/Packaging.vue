<template>
  <div class="flex flex-col h-full">
    <!-- Page Actions (Teleported) -->
    <Teleport to="#page-actions" defer>
      <Button
        v-permission="'PACKAGING:create'"
        variant="primary"
        size="md"
        class="flex items-center gap-2"
        @click="router.push('/setting/packaging/add')"
      >
        <i v-html="icons.plus" />
        Add Packaging
      </Button>
    </Teleport>

    <!-- Table Section -->
    <div class="flex-1 min-h-0">
      <PackagingTable
        ref="tableRef"
        @action="handleAction"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import PackagingTable from "../../components/settings/Packaging/PackagingTable.vue";
import Button from "@/components/Button.vue";
import { icons } from "@/utils/icons";
import { useToastStore } from "@/store/toastStore";
import { delete_packaging } from "../../api/settings.api";

const router = useRouter();
const toast = useToastStore();
const tableRef = ref();

const handleAction = async ({ row, action }: any) => {
  if (action === "edit") {
    router.push(`/setting/packaging/edit/${row._id}`);
  } else if (action === "delete") {
    if (confirm(`Are you sure you want to delete "${row.name}"?`)) {
      try {
        const res = await delete_packaging(row._id);
        if (res.success) {
          toast.success("Packaging deleted successfully");
          tableRef.value?.refetch();
        } else {
          toast.error(res.error || "Failed to delete packaging");
        }
      } catch (error: any) {
        toast.error(error.message || "An unexpected error occurred");
      }
    }
  }
};
</script>
