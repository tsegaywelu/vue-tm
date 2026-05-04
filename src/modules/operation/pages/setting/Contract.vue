<template>
  <div class="flex flex-col h-full">
    <!-- Page Actions (Teleported) -->
    <Teleport to="#page-actions" defer>
      <Button
        variant="primary"
        size="md"
        class="flex items-center gap-2"
        @click="router.push('/setting/contract/add')"
      >
        <i v-html="icons.plus" />
        Add Contract
      </Button>
    </Teleport>

    <!-- Table Section -->
    <div class="flex-1 min-h-0">
      <ContractTable
        ref="tableRef"
        @action="handleAction"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import ContractTable from "../../components/settings/Contract/ContractTable.vue";
import Button from "@/components/Button.vue";
import { icons } from "@/utils/icons";
import { useToastStore } from "@/store/toastStore";
import { delete_contract } from "../../api/settings.api";

const router = useRouter();
const toast = useToastStore();
const tableRef = ref();

const handleAction = async ({ row, action }: any) => {
  if (action === "view") {
    router.push(`/setting/contract/view/${row._id}`);
  } else if (action === "delete") {
    if (confirm(`Are you sure you want to delete this contract?`)) {
      try {
        const res = await delete_contract(row._id);
        if (res.success) {
          toast.success("Contract deleted successfully");
          tableRef.value?.refetch();
        } else {
          toast.error(res.error || "Failed to delete contract");
        }
      } catch (error: any) {
        toast.error(error.message || "An unexpected error occurred");
      }
    }
  }
};
</script>
