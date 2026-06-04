<template>
  <div class="flex flex-col gap-4">
    <div
      class="rounded-2xl px-3 md:px-5 py-6 bg-surface flex flex-col gap-8 shadow-sm border border-gray-100"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <InfoWrapper title="Invoice Information">
          <div class="flex flex-col gap-4">
            <DataLabel label="Reference" :value="invoice?.reference || invoice?.shipments?.[0]?.paymentDetail?.reference" />
            <DataLabel label="Status" :value="invoice?.status || invoice?.shipments?.[0]?.paymentDetail?.paymentStatus || 'PENDING'" />
            <DataLabel label="Total Amount" :value="currencyFormatter(invoice?.totalAmount || invoice?.shipments?.reduce((acc, s) => acc + (s.totalPrice || 0), 0) || 0)" />
          </div>
        </InfoWrapper>

        <InfoWrapper title="Collection Details" v-if="invoice?.status === 'paid'">
          <div class="flex flex-col gap-4">
            <DataLabel label="Collected By" :value="invoice?.paymentCollectedByCarrier?.username || '-'" />
            <DataLabel label="Collection Date" :value="dateFormatter(invoice?.paymentCollectedDateCarrier)" />
            <DataLabel label="CRV" :value="invoice?.crv || '-'" />
            <DataLabel label="CSI" :value="invoice?.csi || '-'" />
          </div>
        </InfoWrapper>
        
        <InfoWrapper title="Request Details" v-else>
          <div class="flex flex-col gap-4">
            <DataLabel label="Requested By" :value="invoice?.paymentRequestedBy?.username || invoice?.shipments?.[0]?.paymentDetail?.paymentRequestedBy?.username || '-'" />
            <DataLabel label="Requested Date" :value="dateFormatter(invoice?.paymentRequestedDate || invoice?.shipments?.[0]?.paymentDetail?.paymentRequestedDate)" />
            <DataLabel label="Approved By" :value="invoice?.paymentApprovedBy?.username || '-'" />
          </div>
        </InfoWrapper>
      </div>

      <div class="flex flex-col gap-4">
        <h3 class="text-lg font-bold text-gray-900 px-1">Associated Shipments</h3>

        <!-- Mobile card list -->
        <div class="sm:hidden flex flex-col divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div v-if="!invoice?.shipments?.length" class="px-4 py-10 text-center text-sm text-gray-500 italic">
            No shipments associated with this invoice.
          </div>
          <div
            v-for="(shipment, index) in invoice?.shipments"
            :key="shipment._id"
            class="px-4 py-3 grid grid-cols-6 gap-x-2 gap-y-1.5"
          >
            <div class="col-span-1">
              <span class="text-xs font-bold text-gray-400">#{{ index + 1 }}</span>
            </div>
            <div class="col-span-5 text-right">
              <span class="text-xs text-gray-500">{{ dateFormatter(shipment.dispatchDate) }}</span>
            </div>
            <div class="col-span-3">
              <span class="text-sm font-bold text-gray-900">{{ shipment.vehicle?.plateNumber || '-' }}</span>
            </div>
            <div class="col-span-3 text-right">
              <span class="text-sm font-bold text-primary">{{ currencyFormatter(shipment.totalPrice || 0) }}</span>
            </div>
            <div class="col-span-4">
              <span class="text-xs font-medium text-gray-600">{{ shipment.route?.origin || '-' }} → {{ shipment.route?.destination || '-' }}</span>
            </div>
            <div class="col-span-2 text-right">
              <span class="text-xs text-gray-400 uppercase tracking-wide">QTY</span>
              <span class="text-xs text-gray-600 ml-1">{{ shipment.order?.totalRequest || '-' }}</span>
            </div>
            <div v-if="shipment.shipmentCode" class="col-span-6">
              <span class="text-xs text-gray-400 uppercase tracking-wide">Code</span>
              <span class="text-xs font-medium text-primary ml-1">{{ shipment.shipmentCode }}</span>
            </div>
          </div>
          <div v-if="invoice?.shipments?.length" class="px-4 py-3 bg-gray-50 flex items-center justify-between">
            <span class="text-sm font-bold text-gray-700">TOTAL</span>
            <span class="text-sm font-bold text-gray-900">{{ currencyFormatter(invoice.shipments.reduce((sum: number, s: any) => sum + (s.totalPrice || 0), 0)) }}</span>
          </div>
        </div>

        <!-- Desktop table -->
        <div class="hidden sm:block overflow-x-auto rounded-xl border border-gray-200">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">No</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Shipment Code</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Route</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">QTY</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
              </tr>
            </thead>
            <tbody class="bg-surface divide-y divide-gray-200">
              <tr v-if="!invoice?.shipments?.length">
                <td colspan="7" class="px-4 py-10 text-center text-sm text-gray-500 italic">
                  No shipments associated with this invoice.
                </td>
              </tr>
              <tr v-for="(shipment, index) in invoice?.shipments" :key="shipment._id" class="hover:bg-gray-50 transition-colors">
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ index + 1 }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-primary">{{ shipment.shipmentCode || '-' }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{{ dateFormatter(shipment.dispatchDate) }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{{ shipment.vehicle?.plateNumber || '-' }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{{ shipment.route?.origin }} → {{ shipment.route?.destination }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{{ shipment.order?.totalRequest || '-' }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{{ currencyFormatter(shipment.totalPrice || 0) }}</td>
              </tr>
            </tbody>
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
  invoice?: any;
}>();
</script>
