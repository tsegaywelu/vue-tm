<template>
  <div class="flex flex-col gap-4 pb-8">
    <div
      class="rounded-2xl px-3 md:px-5 py-6 bg-surface flex flex-col gap-8 shadow-sm border border-gray-100"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <InfoWrapper title="Voucher Information">
          <div class="flex flex-col gap-4">
            <DataLabel label="Reference No." :value="transfer?.referenceNumber" />
            <DataLabel label="Date" :value="dateFormatter(transfer?.createdAt)" />
            <DataLabel label="Type" :value="transfer?.type" />
          </div>
        </InfoWrapper>

        <InfoWrapper title="References">
          <div class="flex flex-col gap-4">
            <DataLabel label="PR No." :value="transfer?.pr?.referenceNumber || '-'" />
            <DataLabel label="PO No." :value="transfer?.po?.referenceNumber || '-'" />
            <DataLabel label="CSI No." :value="transfer?.creditSalesInvoiceNumber || transfer?.cashSalesInvoiceNumber || '-'" />
          </div>
        </InfoWrapper>

        <InfoWrapper title="Entity Details">
          <div class="flex flex-col gap-4">
            <DataLabel label="Supplier" :value="transfer?.supplier?.name || '-'" v-if="transfer?.type === 'RECEIVE'" />
            <DataLabel label="Issued To" :value="transfer?.issuedToBody || '-'" v-else />
            <DataLabel label="Classification" :value="transfer?.classification || '-'" />
          </div>
        </InfoWrapper>
      </div>

      <div class="flex flex-col gap-4">
        <h3 class="text-lg font-bold text-gray-900 px-1">Transfer Items</h3>

        <!-- Mobile card list -->
        <div class="sm:hidden flex flex-col divide-y divide-gray-100 rounded-xl border border-line bg-white overflow-hidden">
          <div v-if="!transfer?.items?.length" class="px-4 py-10 text-center text-sm text-gray-500 italic">
            No items in this voucher.
          </div>
          <div v-for="(item, index) in transfer?.items" :key="index" class="px-4 py-3 grid grid-cols-6 gap-x-2 gap-y-1.5">
            <div class="col-span-1"><span class="text-xs font-bold text-gray-400">#{{ index + 1 }}</span></div>
            <div class="col-span-5 text-right"><span class="text-xs text-gray-500">{{ item.item?.uom || 'pcs' }}</span></div>
            <div class="col-span-6"><span class="text-sm font-bold text-gray-900">{{ item.item?.name || '-' }}</span></div>
            <div v-if="item.serials?.length" class="col-span-6"><span class="text-[10px] text-gray-500 font-mono">SN: {{ item.serials.join(', ') }}</span></div>
            <div class="col-span-3">
              <span class="text-xs text-gray-500">{{ transfer?.type === 'RECEIVE' ? 'Received' : 'Issued' }}</span>
              <span class="text-sm font-semibold text-gray-900 ml-1">{{ item.quantity }}</span>
            </div>
            <div class="col-span-3 text-right"><span class="text-sm font-bold text-primary">{{ currencyFormatter(item.totalPrice) }}</span></div>
          </div>
        </div>

        <!-- Desktop table -->
        <div class="hidden sm:block overflow-x-auto rounded-xl border border-line">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50 text-white">
              <tr class="bg-primary/90 text-white">
                <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">No</th>
                <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Item Description</th>
                <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">U/M</th>
                <th class="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">Received</th>
                <th class="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">Issued</th>
                <th class="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">Unit Price</th>
                <th class="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">Total Price</th>
                <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Remark</th>
              </tr>
            </thead>
            <tbody class="bg-surface divide-y divide-gray-200">
              <tr v-if="!transfer?.items?.length">
                <td colspan="8" class="px-4 py-10 text-center text-sm text-gray-500 italic">
                  No items in this voucher.
                </td>
              </tr>
              <tr v-for="(item, index) in transfer?.items" :key="index" class="hover:bg-surface-hover transition-colors">
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ index + 1 }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div>{{ item.item?.name || '-' }}</div>
                  <div v-if="item.serials?.length" class="text-[10px] text-gray-500 font-mono mt-1 opacity-70">
                    SN: {{ item.serials.join(', ') }}
                  </div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{{ item.item?.uom || 'pcs' }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold text-right">{{ transfer.type === 'RECEIVE' ? item.quantity : '-' }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold text-right">{{ transfer.type === 'ISSUE' ? item.quantity : '-' }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600 text-right">{{ currencyFormatter(item.price) }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">{{ currencyFormatter(item.totalPrice) }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{{ item.remark || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        <InfoWrapper title="Personnel">
          <div class="flex flex-col gap-3">
            <DataLabel label="Prepared By" :value="transfer?.preparedBy?.username || '-'" />
            <DataLabel label="Inspected By" :value="transfer?.inspectedBy?.username || '-'" />
            <DataLabel label="Approved By" :value="transfer?.approvedBy?.username || '-'" />
          </div>
        </InfoWrapper>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InfoWrapper from "../shipment-details/InfoWrapper.vue";
import DataLabel from "../shipment-details/ShipmentDataLabel.vue";
import { dateFormatter, currencyFormatter } from "@/utils/utils";

defineProps<{
  transfer?: any;
}>();
</script>
