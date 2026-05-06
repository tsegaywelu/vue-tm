<template>
  <InvoiceReportTable @action="handleInvoiceAction" />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import InvoiceReportTable from "../../components/InvoiceReportTable.vue";

const router = useRouter();

const handleInvoiceAction = ({ row, action }: any) => {
  if (action === 'view') {
    router.push(`/finance/invoice-report/${row._id}`);
  } else if (action === 'approve') {
    console.log(`Approve invoice:`, row);
  } else if (action === 'cancel') {
    console.log(`Cancel invoice:`, row);
  } else {
    console.log(`Action: ${action} on Invoice:`, row);
  }
};
</script>
