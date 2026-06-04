<template>
  <div class="flex flex-col gap-4">
    <div
      class="rounded-2xl px-3 md:px-5 py-6 bg-surface flex flex-col gap-8 shadow-sm border border-line"
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
        <h3 class="text-lg font-bold text-base-text px-1">Associated Shipments</h3>

        <!-- Mobile card list -->
        <div class="sm:hidden flex flex-col divide-y divide-line rounded-xl border border-line bg-surface overflow-hidden">
          <div v-if="!invoice?.shipments?.length" class="px-4 py-10 text-center text-sm text-dim-text italic">
            No shipments associated with this invoice.
          </div>
          <div
            v-for="(shipment, index) in invoice?.shipments"
            :key="shipment._id"
            class="px-4 py-3 grid grid-cols-6 gap-x-2 gap-y-1.5"
          >
            <div class="col-span-1">
              <span class="text-xs font-bold text-faint-text">#{{ index + 1 }}</span>
            </div>
            <div class="col-span-5 text-right">
              <span class="text-xs text-dim-text">{{ dateFormatter(shipment.dispatchDate) }}</span>
            </div>
            <div class="col-span-3">
              <span class="text-sm font-bold text-base-text">{{ shipment.vehicle?.plateNumber || '-' }}</span>
            </div>
            <div class="col-span-3 text-right">
              <span class="text-sm font-bold text-primary">{{ currencyFormatter(shipment.totalPrice || 0) }}</span>
            </div>
            <div class="col-span-4">
              <span class="text-xs font-medium text-dim-text">{{ shipment.route?.origin || '-' }} → {{ shipment.route?.destination || '-' }}</span>
            </div>
            <div class="col-span-2 text-right">
              <span class="text-xs text-faint-text uppercase tracking-wide">QTY</span>
              <span class="text-xs text-dim-text ml-1">{{ shipment.order?.totalRequest || '-' }}</span>
            </div>
            <div v-if="shipment.shipmentCode" class="col-span-6">
              <span class="text-xs text-faint-text uppercase tracking-wide">Code</span>
              <span class="text-xs font-medium text-primary ml-1">{{ shipment.shipmentCode }}</span>
            </div>
          </div>
          <div v-if="invoice?.shipments?.length" class="px-4 py-3 bg-surface-muted flex items-center justify-between">
            <span class="text-sm font-bold text-dim-text">TOTAL</span>
            <span class="text-sm font-bold text-base-text">{{ currencyFormatter(invoice.shipments.reduce((sum: number, s: any) => sum + (s.totalPrice || 0), 0)) }}</span>
          </div>
        </div>

        <!-- Desktop table -->
        <div class="hidden sm:block overflow-x-auto rounded-xl border border-line">
          <table class="min-w-full divide-y divide-line">
            <thead class="bg-surface-muted">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider">No</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider">Shipment Code</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider">Date</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider">Vehicle</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider">Route</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider">QTY</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider">Price</th>
              </tr>
            </thead>
            <tbody class="bg-surface divide-y divide-line">
              <tr v-if="!invoice?.shipments?.length">
                <td colspan="7" class="px-4 py-10 text-center text-sm text-dim-text italic">
                  No shipments associated with this invoice.
                </td>
              </tr>
              <tr v-for="(shipment, index) in invoice?.shipments" :key="shipment._id" class="hover:bg-surface-muted transition-colors">
                <td class="px-4 py-4 whitespace-nowrap text-sm text-base-text">{{ index + 1 }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-primary">{{ shipment.shipmentCode || '-' }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-dim-text">{{ dateFormatter(shipment.dispatchDate) }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-base-text font-semibold">{{ shipment.vehicle?.plateNumber || '-' }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-dim-text">{{ shipment.route?.origin }} → {{ shipment.route?.destination }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-dim-text">{{ shipment.order?.totalRequest || '-' }}</td>
                <td class="px-4 py-4 whitespace-nowrap text-sm font-bold text-base-text">{{ currencyFormatter(shipment.totalPrice || 0) }}</td>
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
