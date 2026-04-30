<template>
  <ExpenseTable @action="handleExpenseAction" />
</template>

<script setup lang="ts">
import ExpenseTable from "../../components/ExpenseTable.vue";

const handleExpenseAction = ({ row, action }: any) => {
  if (action === 'view') {
    console.log(`View expense details for:`, row);
  } else {
    console.log(`Action: ${action} on Expense:`, row);
  }
};
</script>
