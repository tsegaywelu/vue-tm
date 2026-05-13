<template>
  <Table :columns="columns" :rows="response">
    <template #cell-logo="{ row }">
      <div
        class="size-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200"
      >
        <img
          v-if="row.carrier?.logo"
          :src="
            row.carrier.logo.startsWith('http')
              ? row.carrier.logo
              : `${API_URL}/${row.carrier.logo.replace(/\\/g, '/')}`
          "
          class="w-full h-full object-cover"
        />
        <i v-else class="mdi mdi-image-outline text-gray-400 text-xl"></i>
      </div>
    </template>
    <template #cell-name="{ row }">
      <span class="font-bold text-grey-900">{{
        row.carrier?.name || "-"
      }}</span>
    </template>
    <template #cell-tradeName="{ row }">
      <span class="text-grey-600">{{ row.carrier?.tradeName || "-" }}</span>
    </template>
    <template #cell-tin="{ row }">
      <span class="text-grey-600 font-mono text-xs">{{
        row.carrier?.tin || "-"
      }}</span>
    </template>
    <template #cell-phone="{ row }">
      <span class="text-grey-600">{{
        formatPhoneNumberForDisplay(row.carrier?.phone) || "-"
      }}</span>
    </template>
    <template #cell-email="{ row }">
      <span class="text-grey-600">{{ row.carrier?.email || "-" }}</span>
    </template>
    <template #cell-address="{ row }">
      <span class="text-grey-600">{{ row.carrier?.address || "-" }}</span>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { usePagination } from "@/composables/usePagination";
import Table, { type TableColumn } from "@/components/common/Table.vue";
import { formatPhoneNumberForDisplay } from "@/utils/utils";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const { response } = usePagination({
  id: "shipper-carriers-list",
  url: "/carrier/contractedCarriers",
  params(state) {
    return {
      name: state.search,
      q: undefined,
    };
  },
});

const columns: TableColumn<any>[] = [
  { key: "logo", label: "Logo", field: "carrier.logo" },
  { key: "name", label: "Name", field: "carrier.name" },
  { key: "tradeName", label: "Trade Name", field: "carrier.tradeName" },
  { key: "tin", label: "TIN", field: "carrier.tin" },
  { key: "phone", label: "Phone", field: "carrier.phone" },
  { key: "email", label: "Email", field: "carrier.email" },
  { key: "address", label: "Address", field: "carrier.address" },
];
</script>
