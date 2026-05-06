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
    const shipmentId = row.shipmentId || row.shipment?._id || row._id;
    router.push(`/operation/shipments/${shipmentId}`);
  } else {
    console.log(`Action: ${action} on Payable:`, row);
  }
};
</script>
