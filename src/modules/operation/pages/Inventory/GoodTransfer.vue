<template>
  <!-- Mobile FAB -->
  <button
    v-permission="'GOOD_TRANSFER_VOUCHER:create'"
    class="fixed bottom-6 right-6 sm:hidden z-50 w-14 h-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center active:scale-95 transition-transform"
    @click="handleCreateTransfer"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  </button>
  <Teleport to="#page-actions" defer>
    <Button
      v-permission="'GOOD_TRANSFER_VOUCHER:create'"
      variant="primary"
      size="md"
      class="hidden sm:flex items-center gap-2"
      @click="handleCreateTransfer"
    >
      <i v-html="icons.plus" />
      Add Good Transfer
    </Button>
  </Teleport>

  <Teleport to="#page-title-actions" defer>
    <button
      class="sm:hidden size-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
      @click="mobileSearchOpen = true"
    >
      <i class="*:size-4" v-html="icons.filterOptions"></i>
    </button>
  </Teleport>

  <BottomSheet v-model="mobileSearchOpen" title="Search By">
    <div class="flex flex-col py-2 px-4 gap-1">
      <button
        v-for="opt in tableRef?.searchFieldOptions"
        :key="opt.value"
        class="flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-xl transition-colors"
        @click="tableRef.selectedSearchField = opt.value; mobileSearchOpen = false"
      >
        <span class="font-medium">{{ opt.label }}</span>
        <i v-if="tableRef?.selectedSearchField === opt.value" class="*:size-4 text-primary" v-html="icons.check"></i>
      </button>
    </div>
  </BottomSheet>

  <GoodTransferTable ref="tableRef" @action="handleTransferAction" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import GoodTransferTable from "../../components/inventory/GoodTransferTable.vue";
import Button from "@/components/common/Button.vue";
import BottomSheet from "@/components/BottomSheet.vue";
import { icons } from "@/utils/icons";
import { delete_good_transfer } from "../../api/inventory.api";
import { useToastStore } from "@/store/toastStore";
import { openModal } from "@customizer/modal-x";

const router = useRouter();
const toast = useToastStore();
const tableRef = ref<any>(null);
const mobileSearchOpen = ref(false);

const handleCreateTransfer = () => {
  openModal("GoodTransferModal", {
    onSuccess: () => tableRef.value?.refetch(),
  });
};

const handleTransferAction = async ({ row, action }: any) => {
  if (action === "edit") {
    openModal("GoodTransferModal", {
      transfer: row,
      onSuccess: () => tableRef.value?.refetch(),
    });
  } else if (action === "view") {
    router.push(`/inventory/good-transfer/${row._id}`);
  } else if (action === "delete") {
    if (
      confirm(
        `Are you sure you want to delete transfer voucher "${row.referenceNumber}"?`,
      )
    ) {
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
