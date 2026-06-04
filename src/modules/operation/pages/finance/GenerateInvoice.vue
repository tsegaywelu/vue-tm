<template>
  <div class="generate-invoice p-6 bg-surface rounded-2xl shadow-sm border border-grey-100 min-h-screen">
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="loader ease-linear rounded-full border-4 border-t-4 border-primary h-12 w-12 animate-spin"></div>
    </div>

    <div v-else-if="invoice">
      <!-- Actions Header (screen only) -->
      <div class="flex justify-between items-center mb-6 no-print">
        <h1 class="text-2xl font-black text-grey-900">Invoice Report</h1>
        <div class="flex gap-3">
          <Button variant="outline" size="md" @click="handleExport">
            <template #leading>
              <i class="mdi mdi-microsoft-excel text-lg text-emerald-600"></i>
            </template>
            Export to Excel
          </Button>
          <Button variant="primary" size="md" @click="printInvoice">
            <template #leading>
              <i class="mdi mdi-printer text-lg"></i>
            </template>
            Print Invoice
          </Button>
        </div>
      </div>

      <!-- Company Header (print + screen) -->
      <div class="flex items-center gap-4 border-2 border-gray-300 p-4 mb-4 print-header">
        <img src="@/assets/rlogo.png" alt="Company Logo" class="h-16 w-auto object-contain" />
        <div class="flex-1 text-center">
          <h1 class="text-xl font-bold">RaAZ Transport S/C</h1>
          <p class="text-sm text-gray-600">TIN: 0043617352</p>
          <h2 class="text-base font-bold uppercase mt-1">Transport Payment Request</h2>
        </div>
      </div>
      <p class="text-sm mb-3"><b>Ref:</b> <u>{{ (invoice as any)?.reference }}</u></p>

      <!-- IN_BOUND / SITE_TRANSFER Layout -->
      <div v-if="productType === 'IN_BOUND' || productType === 'SITE_TRANSFER'">
        <table class="table-auto w-full mt-4 border-collapse border border-grey-800 text-xs font-serif report-table">
          <thead class="bg-grey-50">
            <tr>
              <th class="border border-grey-800 px-2 py-1 text-center bg-amber-400 text-black font-bold" colspan="3">
                Transporter Name
              </th>
              <th class="border border-grey-800 px-2 py-1 text-left text-grey-700" colspan="13">
                {{ invoice.carrier?.name }}
              </th>
            </tr>
            <tr>
              <th class="border border-grey-800 px-2 py-1 text-center bg-amber-400 text-black font-bold" colspan="3">
                REQUESTING MONTH
              </th>
              <th class="border border-grey-800 px-2 py-1 text-left text-grey-700" colspan="13">
                {{ requestingMonth }}
              </th>
            </tr>
            <tr>
              <th class="border border-grey-800 px-2 py-1 text-center bg-amber-400 text-black font-bold" colspan="3">
                INVOICE NO
              </th>
              <th class="border border-grey-800 px-2 py-1 text-left text-grey-700" colspan="13">
                {{ invoice.reference }}
              </th>
            </tr>
            <tr class="bg-emerald-800 text-white font-bold">
              <th class="border border-grey-800 px-1 py-1 w-8">No</th>
              <th class="border border-grey-800 px-1 py-1">Business Unit</th>
              <th class="border border-grey-800 px-1 py-1">Date</th>
              <th class="border border-grey-800 px-1 py-1">Allocation Num</th>
              <th class="border border-grey-800 px-1 py-1">Material Type</th>
              <th class="border border-grey-800 px-1 py-1">Truck Type</th>
              <th class="border border-grey-800 px-1 py-1">Supplier Name</th>
              <th class="border border-grey-800 px-1 py-1">Origin</th>
              <th class="border border-grey-800 px-1 py-1">Destination</th>
              <th class="border border-grey-800 px-1 py-1">Route</th>
              <th class="border border-grey-800 px-1 py-1">Truck Plate</th>
              <th class="border border-grey-800 px-1 py-1">Driver Name</th>
              <th class="border border-grey-800 px-1 py-1">GRN</th>
              <th class="border border-grey-800 px-1 py-1">QTY</th>
              <th class="border border-grey-800 px-1 py-1">Tariff</th>
              <th class="border border-grey-800 px-1 py-1">Remark</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(shipment, index) in invoice.shipments" :key="shipment._id">
              <td class="border border-grey-800 px-1 py-1 text-center font-bold">{{ index + 1 }}</td>
              <td class="border border-grey-800 px-1 py-1 font-bold">{{ shipment.routeDestination || shipment.route?.destination }}</td>
              <td class="border border-grey-800 px-1 py-1 font-bold">{{ formatShortDate(shipment.dispatchDate) }}</td>
              <td class="border border-grey-800 px-1 py-1 font-bold">{{ shipment.allocationNumber || shipment.order?.allocationNumber }}</td>
              <td class="border border-grey-800 px-1 py-1 font-bold">
                {{ shipment.materialType || shipment.order?.commodity?.map((c: any) => c.name).join(', ') }}
              </td>
              <td class="border border-grey-800 px-1 py-1 font-bold">{{ shipment.vehicleTypeName }}</td>
              <td class="border border-grey-800 px-1 py-1 font-bold">
                {{ shipment.productType === 'SITE_TRANSFER' ? 'Site Transfer' : (shipment.agentName || shipment.agent?.name) }}
              </td>
              <td class="border border-grey-800 px-1 py-1 font-bold">{{ shipment.routeOrigin || shipment.route?.origin }}</td>
              <td class="border border-grey-800 px-1 py-1 font-bold">{{ shipment.routeDestination || shipment.route?.destination }}</td>
              <td class="border border-grey-800 px-1 py-1 font-bold">
                {{ shipment.routeOrigin || shipment.route?.origin }}_{{ shipment.routeDestination || shipment.route?.destination }}
              </td>
              <td class="border border-grey-800 px-1 py-1 font-bold">
                {{ shipment.vehiclePlateNumber || (shipment.vehicle?.plateNumber + ' / ' + shipment.vehicle?.trailerPlate) }}
              </td>
              <td class="border border-grey-800 px-1 py-1 font-bold">{{ shipment.driverName }}</td>
              <td class="border border-grey-800 px-1 py-1 font-bold">{{ shipment.agentReceiveVoucher }}</td>
              <td class="border border-grey-800 px-1 py-1 font-bold text-center">{{ shipment.quantity || shipment.order?.totalRequest }}</td>
              <td class="border border-grey-800 px-1 py-1 font-bold text-right">{{ formatNumber(shipment.totalPrice) }}</td>
              <td class="border border-grey-800 px-1 py-1 font-bold">{{ shipment.remark }}</td>
            </tr>
            <tr class="bg-grey-50 font-bold">
              <td colspan="13" class="border border-grey-800 px-1 py-1"></td>
              <td class="border border-grey-800 px-1 py-1 text-center">TOTAL</td>
              <td colspan="2" class="border border-grey-800 px-1 py-1 text-right underline">{{ totalSum }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- OUT_BOUND Layout -->
      <div v-else-if="productType === 'OUT_BOUND'">
        <table class="table-auto w-full mt-4 border-collapse border border-grey-800 text-[10px] font-serif report-table">
          <thead class="bg-grey-50">
             <tr>
              <th class="border border-grey-800 px-2 py-1 text-center bg-amber-400 text-black font-bold" colspan="3">
                Transporter Name
              </th>
              <th class="border border-grey-800 px-2 py-1 text-left text-grey-700" colspan="15">
                {{ invoice.carrier?.name }}
              </th>
            </tr>
            <tr>
              <th class="border border-grey-800 px-2 py-1 text-center bg-amber-400 text-black font-bold" colspan="3">
                REQUESTING MONTH
              </th>
              <th class="border border-grey-800 px-2 py-1 text-left text-grey-700" colspan="15">
                {{ requestingMonth }}
              </th>
            </tr>
            <tr>
              <th class="border border-grey-800 px-2 py-1 text-center bg-amber-400 text-black font-bold" colspan="3">
                INVOICE NO
              </th>
              <th class="border border-grey-800 px-2 py-1 text-left text-grey-700" colspan="15">
                {{ invoice.reference }}
              </th>
            </tr>
            <tr class="bg-emerald-800 text-white font-bold">
              <th class="border border-grey-800 px-1 py-1">No</th>
              <th class="border border-grey-800 px-1 py-1">Posting Date</th>
              <th class="border border-grey-800 px-1 py-1">Dist No</th>
              <th class="border border-grey-800 px-1 py-1">Dist Name</th>
              <th class="border border-grey-800 px-1 py-1">Orig Doc</th>
              <th class="border border-grey-800 px-1 py-1">Doc No</th>
              <th class="border border-grey-800 px-1 py-1">Sr Doc No</th>
              <th class="border border-grey-800 px-1 py-1">UoM</th>
              <th class="border border-grey-800 px-1 py-1">BU</th>
              <th class="border border-grey-800 px-1 py-1">R_Code</th>
              <th class="border border-grey-800 px-1 py-1">R_Desc</th>
              <th class="border border-grey-800 px-1 py-1">Vehicle</th>
              <th class="border border-grey-800 px-1 py-1">Method</th>
              <th class="border border-grey-800 px-1 py-1">Shipped</th>
              <th class="border border-grey-800 px-1 py-1">Return</th>
              <th class="border border-grey-800 px-1 py-1">Tariff</th>
              <th class="border border-grey-800 px-1 py-1">Rate</th>
              <th class="border border-grey-800 px-1 py-1">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(shipment, index) in invoice.shipments" :key="shipment._id">
              <td class="border border-grey-800 px-1 py-1 text-center font-bold">{{ index + 1 }}</td>
              <td class="border border-grey-800 px-1 py-1 font-bold">{{ shipment.dispatchDate?.split("T")[0] }}</td>
              <td class="border border-grey-800 px-1 py-1 font-bold text-center">-</td>
              <td class="border border-grey-800 px-1 py-1 font-bold">{{ shipment.agentName || shipment.agent?.name }}</td>
              <td class="border border-grey-800 px-1 py-1 font-bold">{{ shipment.shipperIssueVoucher }}</td>
              <td class="border border-grey-800 px-1 py-1 font-bold">{{ shipment.agentReceiveVoucher }}</td>
              <td class="border border-grey-800 px-1 py-1 font-bold text-center">-</td>
              <td class="border border-grey-800 px-1 py-1 font-bold">{{ shipment.packagingName || shipment.packaging?.name }}</td>
              <td class="border border-grey-800 px-1 py-1 font-bold">{{ shipment.routeOrigin || shipment.route?.origin }}</td>
              <td class="border border-grey-800 px-1 py-1 font-bold text-center">{{ shipment.route?.routeCode || shipment.order?.route?.routeCode || generateRouteCode(shipment) }}</td>
              <td class="border border-grey-800 px-1 py-1 font-bold">
                {{ shipment.routeOrigin || shipment.route?.origin }}_{{ shipment.routeDestination || shipment.route?.destination }}
              </td>
              <td class="border border-grey-800 px-1 py-1 font-bold">
                {{ shipment.vehiclePlateNumber || shipment.vehicle?.plateNumber }}
              </td>
              <td class="border border-grey-800 px-1 py-1 font-bold text-center">Delivery</td>
              <td class="border border-grey-800 px-1 py-1 font-bold text-center">{{ shipment.quantity || shipment.order?.totalRequest }}</td>
              <td class="border border-grey-800 px-1 py-1 font-bold text-center">{{ shipment.returnQty ?? '-' }}</td>
              <td class="border border-grey-800 px-1 py-1 font-bold text-right">{{ formatNumber(shipment.totalPrice) }}</td>
              <td class="border border-grey-800 px-1 py-1 font-bold text-center">{{ computeRate(shipment) }}</td>
              <td class="border border-grey-800 px-1 py-1 font-bold text-right">{{ formatNumber(shipment.totalPrice) }}</td>
            </tr>
             <tr class="bg-grey-50 font-bold">
              <td colspan="16" class="border border-grey-800 px-1 py-1"></td>
              <td class="border border-grey-800 px-1 py-1 text-center">TOTAL</td>
              <td class="border border-grey-800 px-1 py-1 text-right underline">{{ totalSum }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer / Signatures -->
      <div class="grid grid-cols-2 mt-8 gap-10 report-footer">
        <div class="flex flex-col gap-6">
          <h3 class="font-bold border-b border-grey-900 pb-1">Transporter: {{ invoice.carrier?.name }}</h3>
          <div class="flex flex-col gap-4">
            <div>
              <p class="font-bold">Prepared By:</p>
              <p>Name: {{ invoice.paymentRequestedBy?.username }}</p>
              <p class="mt-4">Signature: ____________________________</p>
            </div>
            <div>
              <p class="font-bold">Approved By:</p>
              <p>Name: {{ invoice.paymentApprovedBy?.username || '-' }}</p>
              <p class="mt-4">Signature: ____________________________</p>
            </div>
            <div v-if="invoice.paymentCollectedDate">
               <p class="font-bold">Payment Collected Date:</p>
               <p>{{ invoice.paymentCollectedDate?.split("T")[0] }}</p>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-6">
          <h3 class="font-bold border-b border-grey-900 pb-1 text-center">
            {{ invoice.shipments?.[0]?.order?.shipper?.name || 'Shipper' }} (Supply Chain)
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <p class="font-bold">Checked By:</p>
              <p>Name: ____________________________</p>
              <p class="mt-4">Signature: ____________________________</p>
            </div>
            <div>
              <p class="font-bold">Validated By:</p>
              <p>Name: ____________________________</p>
              <p class="mt-4">Signature: ____________________________</p>
            </div>
            <div>
              <p class="font-bold">Approved By:</p>
              <p>Name: ____________________________</p>
              <p class="mt-4">Signature: ____________________________</p>
            </div>
             <div class="col-span-2 mt-2">
              <p class="font-bold">Remark:</p>
              <p class="italic text-grey-600">{{ invoice.remark || 'N/A' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { fetch_invoice_details } from "../../api/invoice.api";
import Button from "@/components/common/Button.vue";
import { formatNumber } from "@/utils/utils";
import { exportInvoiceToExcel } from "@/utils/excel";
import { exportInvoiceWithTemplate } from "@/utils/invoice-template-export";
import { generateRouteCode } from "@/utils/shipment-export-utils";
import { fetch_invoice_template } from "../../api/invoice-template.api";

const route = useRoute();
const invoiceId = route.params.id as string;

const { data: response, isLoading } = useQuery({
  queryKey: ["invoice-details", invoiceId],
  queryFn: () => fetch_invoice_details(invoiceId),
  enabled: !!invoiceId,
});

const invoice = computed(() => response.value?.data);

const productType = computed(() => {
  return invoice.value?.shipments?.[0]?.productType || 'OUT_BOUND';
});

const totalSum = computed(() => {
  if (!invoice.value?.shipments) return "0";
  const sum = invoice.value.shipments.reduce((acc: number, s: any) => acc + (s.totalPrice || 0), 0);
  return formatNumber(Math.round(sum));
});

const requestingMonth = computed(() => {
  if (!invoice.value?.shipments?.length) return "";
  const dates = invoice.value.shipments.map((s: any) => new Date(s.dispatchDate));
  const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

  const monthYear = `${minDate.toLocaleDateString("en-US", { month: "short" })}_${minDate.getFullYear()}`;
  const getOrdinal = (d: number) => {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
  };

  return `${monthYear} (${minDate.getDate()}${getOrdinal(minDate.getDate())} To ${maxDate.getDate()}${getOrdinal(maxDate.getDate())})`;
});

const formatShortDate = (dateStr: string) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};


const computeRate = (shipment: any) => {
  const qty = shipment.quantity || shipment.order?.totalRequest || shipment.dispatchWeight || 0;
  if (!shipment.totalPrice || !qty) return "-";
  return formatNumber(+(shipment.totalPrice / qty).toFixed(2));
};

const printInvoice = () => {
  window.print();
};

const handleExport = async () => {
  const inv = invoice.value as any;
  if (!inv?.shipments) return;
  const pt = inv.shipments[0]?.productType;
  const shipperId = inv.shipper?._id || inv.shipments[0]?.order?.shipper?._id;
  if (shipperId && pt) {
    const templateRes = await fetch_invoice_template(shipperId, pt);
    const raw = (templateRes?.data as any);
    const content = raw?.content ? JSON.parse(raw.content) : null;
    if (content) {
      exportInvoiceWithTemplate(inv, content);
      return;
    }
  }
  exportInvoiceToExcel(inv);
};
</script>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }
  .generate-invoice {
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
  }
  .report-table {
    font-size: 10px !important;
  }
}

.report-table th, .report-table td {
  border: 1px solid #000;
}

.font-serif {
  font-family: 'Calibri', 'Trebuchet MS', sans-serif;
}
</style>
