<template>
  <Teleport to="#page-actions" defer>
    <Button
      variant="primary"
      size="md"
      class="flex items-center gap-2"
      @click="router.push('/inventory/purchase-requisition/add')"
    >
      <i v-html="icons.plus" />
      Create Requisition
    </Button>
  </Teleport>

  <PurchaseRequisitionTable
    ref="tableRef"
    @action="handleRequisitionAction"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import PurchaseRequisitionTable from "../../components/inventory/PurchaseRequisitionTable.vue";
import Button from "@/components/Button.vue";
import { icons } from "@/utils/icons";
import { delete_purchase_requisition } from "../../api/inventory.api";
import { useToastStore } from "@/store/toastStore";

const router = useRouter();
const toast = useToastStore();
const tableRef = ref();

const handleRequisitionAction = async ({ row, action }: any) => {
  if (action === 'edit') {
    router.push(`/inventory/purchase-requisition/edit/${row._id}`);
  } else if (action === 'view') {
    router.push(`/inventory/purchase-requisition/details/${row._id}`);
  } else if (action === 'delete') {
    if (confirm(`Are you sure you want to delete requisition "${row.referenceNumber}"?`)) {
      try {
        const res = await delete_purchase_requisition(row._id);
        if (res.success) {
          toast.success("Requisition deleted successfully");
          tableRef.value?.refetch();
        } else {
          toast.error(res.error || "Failed to delete requisition");
        }
      } catch (error: any) {
        toast.error(error.message || "An unexpected error occurred");
      }
    }
  }
};
</script>
