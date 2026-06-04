<template>
  <div class="bg-surface rounded-[32px] p-6 border border-gray-100 shadow-sm">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-bold text-gray-900 tracking-tight">Vehicle Parts & Prices</h3>
      <div class="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
        {{ damage.vehiclePartsAndPrices?.length || 0 }} Parts
      </div>
    </div>

    <div v-if="damage.vehiclePartsAndPrices?.length" class="overflow-x-auto rounded-xl border border-line">
      <table class="w-full text-left text-sm text-gray-600">
        <thead class="bg-gray-50 text-gray-700 text-xs uppercase font-semibold">
          <tr>
            <th class="px-6 py-4">Vehicle Part</th>
            <th class="px-6 py-4 text-center">Is Repair</th>
            <th class="px-6 py-4 text-right">Price</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="(part, index) in damage.vehiclePartsAndPrices" :key="index" class="hover:bg-surface-hover transition-colors">
            <td class="px-6 py-4 font-medium text-gray-900">
              {{ part.vehiclePart || 'Unknown Part' }}
            </td>
            <td class="px-6 py-4 text-center">
              <i class="mdi text-xl" :class="part.isRepair ? 'mdi-check-circle text-green-500' : 'mdi-minus-circle text-gray-300'"></i>
            </td>
            <td class="px-6 py-4 text-right font-medium">
              {{ currencyFormatter(part.price) }}
            </td>
          </tr>
        </tbody>
        <tfoot class="bg-gray-50 font-bold text-gray-900">
          <tr>
            <td colspan="2" class="px-6 py-4 text-right">Parts Total:</td>
            <td class="px-6 py-4 text-right text-primary">
              {{ currencyFormatter(damage.vehiclePartsAndPrices.reduce((sum: number, p: any) => sum + Number(p.price || 0), 0)) }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div v-else class="py-12 flex flex-col items-center justify-center text-center">
      <div class="size-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <i class="mdi mdi-car-wrench text-3xl text-gray-400"></i>
      </div>
      <h4 class="text-lg font-bold text-gray-900 mb-1">No parts logged</h4>
      <p class="text-sm text-gray-500 max-w-md mx-auto">
        This vehicle damage report does not contain any itemized parts or repairs.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { currencyFormatter } from "@/utils/utils";

const props = defineProps<{
  damage: any;
}>();
</script>
