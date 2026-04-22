<template>
  <AdvanceTable
    url="/advance-payment"
    pagination-id="settlement-list"
    :extra-params="{ status: 'PAID' }"
  />
</template>

<script setup lang="ts">
import AdvanceTable from "../components/AdvanceTable.vue";
</script>
