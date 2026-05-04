<template>
  <Teleport to="#page-actions" defer>
    <Button
      variant="primary"
      size="md"
      class="flex items-center gap-2"
      @click="router.push('/inventory/vendor/add')"
    >
      <i v-html="icons.plus" />
      Add Vendor
    </Button>
  </Teleport>

  <VendorTable
    ref="tableRef"
    @action="handleVendorAction"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import VendorTable from "../../components/inventory/VendorTable.vue";
import Button from "@/components/Button.vue";
import { icons } from "@/utils/icons";
import { delete_vendor } from "../../api/inventory.api";
import { useToastStore } from "@/store/toastStore";

const router = useRouter();
const toast = useToastStore();
const tableRef = ref();

const handleVendorAction = async ({ row, action }: any) => {
  if (action === 'edit') {
    router.push(`/inventory/vendor/edit/${row._id}`);
  } else if (action === 'delete') {
    if (confirm(`Are you sure you want to delete vendor "${row.name}"?`)) {
      try {
        const res = await delete_vendor(row._id);
        if (res.success) {
          toast.success("Vendor deleted successfully");
          tableRef.value?.refetch();
        } else {
          toast.error(res.error || "Failed to delete vendor");
        }
      } catch (error: any) {
        toast.error(error.message || "An unexpected error occurred");
      }
    }
  }
};
</script>
