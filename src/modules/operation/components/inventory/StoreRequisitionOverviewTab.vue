<template>
  <div class="flex flex-col gap-4 pb-8">
    <div
      class="rounded-2xl px-3 md:px-5 py-6 bg-white flex flex-col gap-8 shadow-sm border border-gray-100"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <InfoWrapper title="General Information">
          <div class="flex flex-col gap-4">
            <DataLabel label="Reference No." :value="requisition?.referenceNumber" />
            <DataLabel label="Date" :value="dateFormatter(requisition?.date)" />
            <DataLabel label="Required Date" :value="dateFormatter(requisition?.requiredDate)" />
          </div>
        </InfoWrapper>

        <InfoWrapper title="Classification Details">
          <div class="flex flex-col gap-4">
            <DataLabel label="Department" :value="requisition?.department || '-'" />
            <DataLabel label="Classification" :value="requisition?.classification || '-'" />
            <DataLabel label="Cost Center" :value="requisition?.costCenter || '-'" />
          </div>
        </InfoWrapper>

        <InfoWrapper title="Personnel">
          <div class="flex flex-col gap-4">
            <DataLabel label="Prepared By" :value="requisition?.preparedBy?.username || '-'" />
            <DataLabel label="Approved By" :value="requisition?.approvedBy?.username || '-'" />
            <DataLabel label="Authorized By" :value="requisition?.authorizedBy?.username || '-'" />
          </div>
        </InfoWrapper>
      </div>

      <div class="flex flex-col gap-4">
        <h3 class="text-lg font-bold text-gray-900 px-1">Requisition Items</h3>

        <!-- Mobile card list -->
        <div class="sm:hidden flex flex-col divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div v-if="!requisition?.items?.length" class="px-4 py-10 text-center text-sm text-gray-500 italic">
            No items in this requisition.
          </div>
          <div v-for="(item, index) in requisition?.items" :key="index" class="px-4 py-3 grid grid-cols-6 gap-x-2 gap-y-1.5">
            <div class="col-span-1"><span class="text-xs font-bold text-gray-400">#{{ index + 1 }}</span></div>
            <div class="col-span-5 text-right"><span class="text-xs text-gray-500">{{ item.item?.uom || '-' }}</span></div>
            <div class="col-span-6"><span class="text-sm font-bold text-gray-900">{{ item.item?.name || '-' }}</span></div>
            <div class="col-span-2"><span class="text-xs text-gray-500">Qty</span><span class="text-sm font-semibold text-gray-900 ml-1">{{ item.quantity }}</span></div>
            <div class="col-span-2"><span class="text-xs text-gray-500">Stock</span><span class="text-sm text-gray-600 ml-1">{{ item.storeBalance || 0 }}</span></div>
            <div class="col-span-2 text-right"><span class="text-xs text-gray-500">Approved</span><span class="text-sm font-bold text-primary ml-1">{{ item.approvedQuantity || 0 }}</span></div>
            <div v-if="item.remark" class="col-span-6"><span class="text-xs text-gray-500">{{ item.remark }}</span></div>
          </div>
        </div>

        <!-- Desktop table -->
        <div class="hidden sm:block overflow-x-auto rounded-xl border border-gray-200">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50 text-white">
              <tr class="bg-primary/90 text-white">
                <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">No</th>
                <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Item Description</th>
                <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">U/M</th>
                <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-right">Qty</th>
                <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-right">Stock Bal.</th>
                <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-right">Approved Qty</th>
                <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Remark</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="!requisition?.items?.length">
                <td colspan="7" class="px-4 py-10 text-center text-sm text-gray-500 italic">
                  No items in this requisition.
                </td>
              </tr>
              <tr v-for="(item, index) in requisition?.items" :key="index" class="hover:bg-gray-50 transition-colors">
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ index + 1 }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.item?.name || '-' }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{{ item.item?.uom || '-' }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold text-right">{{ item.quantity }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600 text-right">{{ item.storeBalance || 0 }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm font-bold text-primary text-right">{{ item.approvedQuantity || 0 }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{{ item.remark || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div class="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100" v-if="requisition.remark">
        <h4 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Overall Remark</h4>
        <p class="text-sm text-gray-700 leading-relaxed">{{ requisition.remark }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InfoWrapper from "../shipment-details/InfoWrapper.vue";
import DataLabel from "../shipment-details/ShipmentDataLabel.vue";
import { dateFormatter } from "@/utils/utils";

defineProps<{
  requisition?: any;
}>();
</script>
