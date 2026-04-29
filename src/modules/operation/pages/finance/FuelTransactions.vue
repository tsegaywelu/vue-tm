<template>
  <FuelTransactionsTable @action="handleAction" />
</template>

<script setup lang="ts">
import FuelTransactionsTable from "../../components/finance/FuelTransactionsTable.vue";

const handleAction = ({ row, action }: any) => {
  if (action === 'view') {
    console.log(`View fuel transaction details:`, row);
  } else {
    console.log(`Action: ${action} on FuelTransaction:`, row);
  }
};
</script>
