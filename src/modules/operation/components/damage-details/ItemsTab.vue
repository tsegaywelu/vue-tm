<template>
  <div class="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-bold text-gray-900 tracking-tight">Damaged Items</h3>
      <div class="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
        {{ damage.items?.length || 0 }} Items
      </div>
    </div>

    <div v-if="damage.items?.length" class="overflow-x-auto rounded-xl border border-gray-200">
      <table class="w-full text-left text-sm text-gray-600">
        <thead class="bg-gray-50 text-gray-700 text-xs uppercase font-semibold">
          <tr>
            <th class="px-6 py-4">Item Name</th>
            <th class="px-6 py-4">UOM</th>
            <th class="px-6 py-4 text-right">Unit Price</th>
            <th class="px-6 py-4 text-right">Quantity</th>
            <th class="px-6 py-4 text-right">Total Price</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="(item, index) in damage.items" :key="index" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 font-medium text-gray-900">
              {{ item.item?.name || 'Unknown Item' }}
            </td>
            <td class="px-6 py-4 uppercase">
              <span class="bg-gray-100 px-2 py-1 rounded text-xs font-bold">{{ item.uom }}</span>
            </td>
            <td class="px-6 py-4 text-right font-medium">
              {{ currencyFormatter(item.unitPrice) }}
            </td>
            <td class="px-6 py-4 text-right font-medium">
              {{ item.quantity }}
            </td>
            <td class="px-6 py-4 text-right font-bold text-gray-900">
              {{ currencyFormatter(item.totalPrice) }}
            </td>
          </tr>
        </tbody>
        <tfoot class="bg-gray-50 font-bold text-gray-900">
          <tr>
            <td colspan="4" class="px-6 py-4 text-right">Grand Total:</td>
            <td class="px-6 py-4 text-right text-primary">{{ currencyFormatter(damage.total) }}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div v-else class="py-12 flex flex-col items-center justify-center text-center">
      <div class="size-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <i class="mdi mdi-package-variant-closed text-3xl text-gray-400"></i>
      </div>
      <h4 class="text-lg font-bold text-gray-900 mb-1">No items logged</h4>
      <p class="text-sm text-gray-500 max-w-md mx-auto">
        This damage report does not contain any itemized breakdown.
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
