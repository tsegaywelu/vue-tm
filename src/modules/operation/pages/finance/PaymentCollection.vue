<template>
  <PaymentCollectionTable @action="handlePaymentCollectionAction" />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import PaymentCollectionTable from "../../components/finance/PaymentCollectionTable.vue";

const router = useRouter();

const handlePaymentCollectionAction = ({ row, action }: any) => {
  if (action === 'view') {
    router.push(`/finance/payment-collection/${row._id}`);
  } else if (action === 'collect') {
    router.push(`/finance/payment-collection/${row._id}`);
  } else if (action === 'edit') {
    console.log(`Edit payment:`, row);
  } else {
    console.log(`Action: ${action} on PaymentCollection:`, row);
  }
};
</script>
