<template>
  <InvoiceReportTable @action="handleInvoiceAction" />
</template>

<script setup lang="ts">
import InvoiceReportTable from "../../components/InvoiceReportTable.vue";

const handleInvoiceAction = ({ row, action }: any) => {
  if (action === 'view') {
    console.log(`View invoice details for:`, row);
  } else if (action === 'approve') {
    console.log(`Approve invoice:`, row);
  } else if (action === 'cancel') {
    console.log(`Cancel invoice:`, row);
  } else {
    console.log(`Action: ${action} on Invoice:`, row);
  }
};
</script>
