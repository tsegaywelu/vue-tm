<template>
  <PayableTable @action="handlePayableAction" />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import PayableTable from "../../components/finance/PayableTable.vue";

const router = useRouter();

const handlePayableAction = ({
  row,
  action,
}: {
  row: any;
  action: string;
}) => {
  if (action === 'view') {
    // Navigate to detail page if applicable, e.g.:
    // router.push(`/operation/finance/payable/${row._id}`);
  } else {
    console.log(`Action: ${action} on Payable:`, row);
  }
};
</script>
