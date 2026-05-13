<template>
  <div v-if="isLoading" class="flex justify-center py-20">
    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
  </div>

  <div v-else-if="contract" class="flex flex-col gap-6">
    <!-- Header -->
    <div
      class="bg-grey-25 rounded-[32px] p-6 md:p-10 border border-grey-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
    >
      <div class="flex flex-col gap-2">
        <h2 class="text-3xl font-black text-grey-900 tracking-tight">
          {{ contract.name || "Contract" }}
        </h2>
        <div class="flex items-center gap-2">
          <span
            class="px-3 py-1 text-xs font-bold rounded-full"
            :class="
              contract.isActive
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-red-100 text-red-700'
            "
          >
            {{ contract.isActive ? "Active" : "Inactive" }}
          </span>
          <span class="px-3 py-1 bg-grey-100 text-grey-600 text-xs font-bold rounded-full">
            {{ contract.startDate?.split("T")[0] }} → {{ contract.endDate?.split("T")[0] }}
          </span>
        </div>
      </div>
      <Button size="md" variant="outline" @click="router.back()">
        Back
      </Button>
    </div>

    <!-- Contract Details Grid -->
    <div class="bg-white rounded-[32px] p-6 border border-grey-100">
      <h3 class="text-xl font-bold text-grey-900 mb-4">Contract Information</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex flex-col gap-1 p-4 bg-grey-25 rounded-2xl border border-grey-100">
          <span class="text-xs font-bold text-grey-500 uppercase tracking-wider">Shipper</span>
          <span class="text-base font-bold text-grey-900">{{ contract.shipper?.name || "-" }}</span>
        </div>
        <div class="flex flex-col gap-1 p-4 bg-grey-25 rounded-2xl border border-grey-100">
          <span class="text-xs font-bold text-grey-500 uppercase tracking-wider">Carrier</span>
          <span class="text-base font-bold text-grey-900">{{ contract.carrier?.name || "-" }}</span>
        </div>
        <div class="flex flex-col gap-1 p-4 bg-grey-25 rounded-2xl border border-grey-100">
          <span class="text-xs font-bold text-grey-500 uppercase tracking-wider">Start Date</span>
          <span class="text-base font-bold text-grey-900">{{ contract.startDate?.split("T")[0] || "-" }}</span>
        </div>
        <div class="flex flex-col gap-1 p-4 bg-grey-25 rounded-2xl border border-grey-100">
          <span class="text-xs font-bold text-grey-500 uppercase tracking-wider">End Date</span>
          <span class="text-base font-bold text-grey-900">{{ contract.endDate?.split("T")[0] || "-" }}</span>
        </div>
      </div>
    </div>

    <!-- Routes in Contract -->
    <div
      v-if="contract.routes && contract.routes.length > 0"
      class="bg-white rounded-[32px] p-6 border border-grey-100"
    >
      <h3 class="text-xl font-bold text-grey-900 mb-4">Contract Routes</h3>
      <Table :columns="routeColumns" :rows="contract.routes">
        <template #cell-routeName="{ row }">
          <span class="font-bold text-grey-900">{{ row.routeName || row.route?.routeName || "-" }}</span>
        </template>
        <template #cell-price="{ row }">
          <span class="text-grey-600">{{ row.price || "-" }}</span>
        </template>
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import Table from "@/components/common/Table.vue";
import Button from "@/components/common/Button.vue";
import ApiService from "@/api/ApiService";

const route = useRoute();
const router = useRouter();
const api = new ApiService();
const contractId = route.params.id as string;

const { data: contractRes, isLoading } = useQuery({
  queryKey: ["shipper-contract", contractId],
  queryFn: () => api.addAuthenticationHeader().get(`/contract/${contractId}`),
});

const contract = computed(() => contractRes.value?.data);

const routeColumns: TableColumn<any>[] = [
  { key: "routeName", label: "Route", field: "routeName" },
  { key: "price", label: "Price", field: "price" },
];
</script>
