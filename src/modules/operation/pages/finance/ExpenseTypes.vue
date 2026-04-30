<template>
  <ExpenseTypeTable @action="handleExpenseTypeAction" />
</template>

<script setup lang="ts">
import ExpenseTypeTable from "../../components/finance/ExpenseTypeTable.vue";

const handleExpenseTypeAction = ({ row, action }: any) => {
  if (action === 'edit') {
    console.log(`Edit expense type:`, row);
  } else if (action === 'delete') {
    console.log(`Delete expense type:`, row);
  } else {
    console.log(`Action: ${action} on ExpenseType:`, row);
  }
};
</script>
