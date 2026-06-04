<template>
  <div class="flex flex-col gap-4 pb-8">
    <div
      class="rounded-2xl px-3 md:px-5 py-6 bg-surface flex flex-col gap-8 shadow-sm border border-gray-100 relative"
    >
      <!-- Void Watermark -->
      <div
        v-if="purchaseOrder?.status === 'VOID'"
        class="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
      >
        <div class="text-red-600 opacity-5 text-9xl font-bold -rotate-12 uppercase tracking-widest">
          VOID
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <InfoWrapper title="General Information">
          <div class="flex flex-col gap-4">
            <DataLabel label="Reference No." :value="purchaseOrder?.referenceNumber" />
            <DataLabel label="Date" :value="dateFormatter(purchaseOrder?.date)" />
            <DataLabel label="Supplier" :value="purchaseOrder?.to?.name || '-'" />
          </div>
        </InfoWrapper>

        <InfoWrapper title="Payment Info">
          <div class="flex flex-col gap-4">
            <DataLabel label="Payment Status" :value="purchaseOrder?.paymentStatus || 'PENDING'" />
            <DataLabel label="Include VAT" :value="purchaseOrder?.includeVAT ? 'Yes' : 'No'" />
            <DataLabel label="VAT Rate" :value="`${purchaseOrder?.vatRate || 15}%`" v-if="purchaseOrder?.includeVAT" />
          </div>
        </InfoWrapper>

        <InfoWrapper title="Personnel">
          <div class="flex flex-col gap-4">
            <DataLabel label="Prepared By" :value="purchaseOrder?.preparedBy?.username || '-'" />
            <DataLabel label="Approved By" :value="purchaseOrder?.approvedBy?.username || '-'" />
            <DataLabel label="Authorized By" :value="purchaseOrder?.authorizedBy?.username || '-'" />
          </div>
        </InfoWrapper>
      </div>

      <div class="flex flex-col gap-4" v-if="purchaseOrder?.status === 'VOID'">
        <h4 class="text-xs font-bold text-red-600 uppercase tracking-widest px-1">Void Information</h4>
        <div class="p-4 bg-red-50 rounded-xl border border-red-100 flex flex-col gap-2">
          <p class="text-sm text-gray-700"><strong>Reason:</strong> {{ purchaseOrder.voidReason || '-' }}</p>
          <p class="text-sm text-gray-700"><strong>Voided By:</strong> {{ purchaseOrder.voidedBy?.username || '-' }}</p>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <h3 class="text-lg font-bold text-gray-900 px-1">Order Items</h3>
        <div class="overflow-x-auto rounded-xl border border-gray-200">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr class="bg-primary/90 text-white">
                <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">No</th>
                <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Item Description</th>
                <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">U/M</th>
                <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-right">Qty</th>
                <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-right">Unit Price</th>
                <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-right">Total</th>
                <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Remark</th>
              </tr>
            </thead>
            <tbody class="bg-surface divide-y divide-gray-200">
              <tr v-if="!purchaseOrder?.items?.length">
                <td colspan="7" class="px-4 py-10 text-center text-sm text-gray-500 italic">
                  No items in this order.
                </td>
              </tr>
              <tr v-for="(item, index) in purchaseOrder?.items" :key="index" class="hover:bg-gray-50 transition-colors">
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ index + 1 }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.item?.name || '-' }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{{ item.item?.uom || '-' }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold text-right">{{ item.quantity }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600 text-right">{{ currencyFormatter(item.price) }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">{{ currencyFormatter(item.totalPrice) }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{{ item.remark || '-' }}</td>
              </tr>
            </tbody>
            <tfoot class="bg-gray-50">
              <tr>
                <td colspan="5" class="px-4 py-3 text-right text-sm font-bold text-gray-700">Sub Total</td>
                <td class="px-4 py-3 text-right text-sm font-bold text-gray-900">{{ currencyFormatter(purchaseOrder?.total) }}</td>
                <td></td>
              </tr>
              <tr v-if="purchaseOrder?.includeVAT">
                <td colspan="5" class="px-4 py-3 text-right text-sm font-bold text-gray-700">VAT ({{ purchaseOrder?.vatRate || 15 }}%)</td>
                <td class="px-4 py-3 text-right text-sm font-bold text-gray-900 text-error-600">+ {{ currencyFormatter(purchaseOrder?.vat) }}</td>
                <td></td>
              </tr>
              <tr class="bg-primary/5">
                <td colspan="5" class="px-4 py-3 text-right text-base font-bold text-primary">Grand Total</td>
                <td class="px-4 py-3 text-right text-lg font-black text-primary">{{ currencyFormatter(purchaseOrder?.grandTotal) }}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InfoWrapper from "../shipment-details/InfoWrapper.vue";
import DataLabel from "../shipment-details/ShipmentDataLabel.vue";
import { dateFormatter, currencyFormatter } from "@/utils/utils";

defineProps<{
  purchaseOrder?: any;
}>();
</script>
