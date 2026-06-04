<template>
  <Teleport to="#page-actions" defer>
    <div class="hidden sm:flex">
      <Button
        variant="primary"
        size="md"
        class="flex items-center gap-2"
        @click="router.push('/finance/expense-types/add')"
      >
        <i v-html="icons.plus" />
        Add Expense Type
      </Button>
    </div>
  </Teleport>

  <button
    class="sm:hidden fixed bottom-6 right-6 z-40 size-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center"
    @click="router.push('/finance/expense-types/add')"
  >
    <i class="*:size-6" v-html="icons.plus"></i>
  </button>

  <ExpenseTypeTable
    ref="tableRef"
    @action="handleExpenseTypeAction"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import ExpenseTypeTable from "../../components/finance/ExpenseTypeTable.vue";
import Button from "@/components/Button.vue";
import { icons } from "@/utils/icons";
import { delete_expense_type } from "../../api/finance.api";
import { useToastStore } from "@/store/toastStore";

const router = useRouter();
const toast = useToastStore();
const tableRef = ref();

const handleExpenseTypeAction = async ({ row, action }: any) => {
  if (action === 'edit') {
    router.push(`/finance/expense-types/edit/${row._id}`);
  } else if (action === 'delete') {
    if (confirm(`Are you sure you want to delete "${row.name}"?`)) {
      try {
        const res = await delete_expense_type(row._id);
        if (res.success) {
          toast.success("Expense type deleted successfully");
          tableRef.value?.refetch();
        } else {
          toast.error(res.error || "Failed to delete expense type");
        }
      } catch (error: any) {
        toast.error(error.message || "An unexpected error occurred");
      }
    }
  } else {
    console.log(`Action: ${action} on ExpenseType:`, row);
  }
};
</script>
