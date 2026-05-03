<template>
  <Teleport to="#page-actions" defer>
    <Button
      variant="primary"
      size="md"
      class="flex items-center gap-2"
      @click="router.push('/finance/expense-types/add')"
    >
      <i v-html="icons.plus" />
      Add Expense Type
    </Button>
  </Teleport>

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
