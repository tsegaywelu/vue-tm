<template>
  <div class="flex flex-col gap-8 p-8 max-w-[1600px] mx-auto min-h-screen animate-fade-in">
    <!-- Header Area -->
    <div class="flex justify-between items-center">
      <div class="flex flex-col gap-2">
        <h1 class="text-3xl font-extrabold text-primary tracking-tight">Shipments</h1>
        <p class="text-gray-500 font-medium text-lg">Detailed overview and management of all active and historical shipments.</p>
      </div>
      <Button
        variant="primary"
        size="lg"
        class="rounded-3xl px-8 shadow-lg shadow-primary/20"
      >
        <template #leading>
          <div class="size-5" v-html="all_icons.plus"></div>
        </template>
        New Shipment
      </Button>
    </div>

    <!-- Filters Section -->
    <ShipmentFilters
      @change="handleFilterChange"
      calendar-type="english"
      output-calendar-type="english"
    />

    <!-- Table Section -->
    <div class="flex-1">
      <ShipmentTable
        :filters="activeFilters"
        @action="handleShipmentAction"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import ShipmentFilters from '../components/ShipmentFilters.vue'
import ShipmentTable from '../components/ShipmentTable.vue'
import Button from '@/components/Button.vue'
import { useTablePagination } from '@/composables/usePagination'
import type { ShipmentFilterParams, Shipment } from '../operation.types'
import { icons } from '@/utils/icons'
import { raaz_icons } from '@/utils/raaz_icons'

const all_icons = { ...icons, ...raaz_icons }

// Sync with global pagination store for the shipment-list table
const { setPage } = useTablePagination('shipment-list')

const activeFilters = reactive<ShipmentFilterParams>({
  page: 1,
  limit: 10
})

const handleFilterChange = (newFilters: ShipmentFilterParams) => {
  Object.assign(activeFilters, newFilters)
  setPage(1)
}

const handleShipmentAction = ({ row, action }: { row: Shipment, action: string }) => {
  console.log(`Action: ${action} on Shipment: ${row.shipmentCode}`)
  // TODO: Implement modal views or navigation for shipment details
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
