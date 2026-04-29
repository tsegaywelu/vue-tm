<template>
  <PaidSubContractsTable @action="handleAction" />
</template>

<script setup lang="ts">
import PaidSubContractsTable from "../../components/finance/PaidSubContractsTable.vue";

const handleAction = ({ row, action }: any) => {
  if (action === 'view') {
    console.log(`View sub contract details for:`, row);
  } else {
    console.log(`Action: ${action} on PaidSubContract:`, row);
  }
};
</script>
