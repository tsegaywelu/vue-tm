<template>
  <PaymentCollectionTable @action="handlePaymentCollectionAction" />
</template>

<script setup lang="ts">
import PaymentCollectionTable from "../../components/finance/PaymentCollectionTable.vue";

const handlePaymentCollectionAction = ({ row, action }: any) => {
  if (action === 'view') {
    console.log(`View payment collection details for:`, row);
  } else if (action === 'collect') {
    console.log(`Collect payment:`, row);
  } else if (action === 'edit') {
    console.log(`Edit payment:`, row);
  } else {
    console.log(`Action: ${action} on PaymentCollection:`, row);
  }
};
</script>
