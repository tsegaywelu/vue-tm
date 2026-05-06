<template>
  <Teleport to="#page-actions" defer>
    <Button
      variant="primary"
      size="md"
      class="flex items-center gap-2"
      @click="router.push('/inventory/good-transfer/add')"
    >
      <i v-html="icons.plus" />
      Create Transfer
    </Button>
  </Teleport>

  <GoodTransferTable
    ref="tableRef"
    @action="handleTransferAction"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import GoodTransferTable from "../../components/inventory/GoodTransferTable.vue";
import Button from "@/components/Button.vue";
import { icons } from "@/utils/icons";
import { delete_good_transfer } from "../../api/inventory.api";
import { useToastStore } from "@/store/toastStore";

const router = useRouter();
const toast = useToastStore();
const tableRef = ref();

const handleTransferAction = async ({ row, action }: any) => {
  if (action === 'edit') {
    router.push(`/inventory/good-transfer/edit/${row._id}`);
  } else if (action === 'view') {
    router.push(`/inventory/good-transfer/${row._id}`);
  } else if (action === 'delete') {
    if (confirm(`Are you sure you want to delete transfer voucher "${row.referenceNumber}"?`)) {
      try {
        const res = await delete_good_transfer(row._id);
        if (res.success) {
          toast.success("Transfer voucher deleted successfully");
          tableRef.value?.refetch();
        } else {
          toast.error(res.error || "Failed to delete transfer voucher");
        }
      } catch (error: any) {
        toast.error(error.message || "An unexpected error occurred");
      }
    }
  }
};
</script>
