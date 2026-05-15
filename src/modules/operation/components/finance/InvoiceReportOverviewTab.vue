<template>
  <div class="flex flex-col gap-4">
    <!-- ======================== PRINT LAYOUT (hidden on screen) ======================== -->
    <div class="hidden print:block" style="font-family: Calibri, sans-serif; font-size: 11px; padding: 10px;">

      <!-- IN_BOUND / SITE_TRANSFER print layout -->
      <template v-if="isInbound">
        <table style="width:100%; border-collapse:collapse; margin-bottom: 4px;">
          <tr>
            <th style="border:2px solid #374151; padding:3px 6px; text-align:center; background:#FFC107; color:#000; font-weight:bold;" colspan="3">Transporter Name</th>
            <th style="border:2px solid #374151; padding:3px 6px; text-align:left; font-weight:normal;" colspan="13">{{ invoice?.carrier?.name || '-' }}</th>
          </tr>
          <tr>
            <th style="border:2px solid #374151; padding:3px 6px; text-align:center; background:#FFC107; color:#000; font-weight:bold;" colspan="3">REQUESTING MONTH</th>
            <th style="border:2px solid #374151; padding:3px 6px; text-align:left; font-weight:normal;" colspan="13">{{ requestingMonth }}</th>
          </tr>
          <tr>
            <th style="border:2px solid #374151; padding:3px 6px; text-align:center; background:#FFC107; color:#000; font-weight:bold;" colspan="3">INVOICE NO</th>
            <th style="border:2px solid #374151; padding:3px 6px; text-align:left; font-weight:normal;" colspan="13">{{ invoice?.reference || '-' }}</th>
          </tr>
          <tr>
            <th style="border:2px solid #374151; padding:3px 6px; text-align:center; background:#FFC107; color:#000; font-weight:bold;" colspan="3">PO Number</th>
            <th style="border:2px solid #374151; padding:3px 6px; text-align:left; font-weight:normal;" colspan="13">TBA</th>
          </tr>
          <tr style="background:#1565C0; color:#fff;">
            <th style="border:2px solid #374151; padding:3px 4px; font-size:10px;">No</th>
            <th style="border:2px solid #374151; padding:3px 4px; font-size:10px;">Business Unit</th>
            <th style="border:2px solid #374151; padding:3px 4px; font-size:10px;">Date</th>
            <th style="border:2px solid #374151; padding:3px 4px; font-size:10px;">Allocation Num</th>
            <th style="border:2px solid #374151; padding:3px 4px; font-size:10px;">Material Type</th>
            <th style="border:2px solid #374151; padding:3px 4px; font-size:10px;">Truck Type</th>
            <th style="border:2px solid #374151; padding:3px 4px; font-size:10px;">Supplier Name</th>
            <th style="border:2px solid #374151; padding:3px 4px; font-size:10px;">Origin</th>
            <th style="border:2px solid #374151; padding:3px 4px; font-size:10px;">Destination</th>
            <th style="border:2px solid #374151; padding:3px 4px; font-size:10px;">Route</th>
            <th style="border:2px solid #374151; padding:3px 4px; font-size:10px;">Truck Plate Number</th>
            <th style="border:2px solid #374151; padding:3px 4px; font-size:10px;">Driver Name</th>
            <th style="border:2px solid #374151; padding:3px 4px; font-size:10px;">GRN</th>
            <th style="border:2px solid #374151; padding:3px 4px; font-size:10px;">QTY</th>
            <th style="border:2px solid #374151; padding:3px 4px; font-size:10px;">Tarrif</th>
            <th style="border:2px solid #374151; padding:3px 4px; font-size:10px;">Remark</th>
          </tr>
          <tr v-for="(s, i) in invoice?.shipments || []" :key="s._id">
            <td style="border:2px solid #374151; padding:2px 4px; font-weight:bold;">{{ i + 1 }}</td>
            <td style="border:2px solid #374151; padding:2px 4px; font-weight:bold;">{{ s.route?.destination }}</td>
            <td style="border:2px solid #374151; padding:2px 4px; font-weight:bold;">{{ formatDate(s.dispatchDate) }}</td>
            <td style="border:2px solid #374151; padding:2px 4px; font-weight:bold;">{{ s.order?.allocationNumber }}</td>
            <td style="border:2px solid #374151; padding:2px 4px; font-weight:bold;">{{ s.agent ? s.agent.name : (s.productType === 'SITE_TRANSFER' ? 'Site Transfer' : s.productType) }}</td>
            <td style="border:2px solid #374151; padding:2px 4px; font-weight:bold;">{{ formatVehicleType(s.vehicleTypeName) }}</td>
            <td style="border:2px solid #374151; padding:2px 4px; font-weight:bold;">{{ s.productType === 'SITE_TRANSFER' ? 'Site Transfer' : (s.agent?.name || '') }}</td>
            <td style="border:2px solid #374151; padding:2px 4px; font-weight:bold;">{{ s.route?.origin }}</td>
            <td style="border:2px solid #374151; padding:2px 4px; font-weight:bold;">{{ s.route?.destination }}</td>
            <td style="border:2px solid #374151; padding:2px 4px; font-weight:bold;">{{ s.route?.origin }}_{{ s.route?.destination }}</td>
            <td style="border:2px solid #374151; padding:2px 4px; font-weight:bold;">{{ s.vehicle?.plateNumber }} / {{ s.vehicle?.trailerPlate }}</td>
            <td style="border:2px solid #374151; padding:2px 4px; font-weight:bold;">{{ formatDriverName(s.driverName || `${s.driver?.firstName || ''} ${s.driver?.lastName || ''}`) }}</td>
            <td style="border:2px solid #374151; padding:2px 4px; font-weight:bold;">{{ s.agentReceiveVoucher }}</td>
            <td style="border:2px solid #374151; padding:2px 4px; font-weight:bold;">{{ s.order?.totalRequest }}</td>
            <td style="border:2px solid #374151; padding:2px 4px; font-weight:bold;">{{ formatPrice(s.totalPrice) }}</td>
            <td style="border:2px solid #374151; padding:2px 4px; font-weight:bold;">{{ s.remark }}</td>
          </tr>
          <tr>
            <td colspan="14" style="padding:3px 6px; font-weight:bold;"></td>
            <td style="padding:3px 6px; font-weight:bold;">TOTAL</td>
            <td style="padding:3px 6px; font-weight:bold;"><u>{{ totalSum }}</u></td>
          </tr>
        </table>
      </template>

      <!-- OUT_BOUND print layout -->
      <template v-else>
        <table style="width:100%; border-collapse:collapse; margin-bottom: 4px;">
          <tr>
            <th style="border:2px solid #374151; padding:3px 6px; text-align:center; background:#FFC107; color:#000; font-weight:bold;" colspan="3">Transporter Name</th>
            <th style="border:2px solid #374151; padding:3px 6px; text-align:left; font-weight:normal;" colspan="16">{{ invoice?.carrier?.name || '-' }}</th>
          </tr>
          <tr>
            <th style="border:2px solid #374151; padding:3px 6px; text-align:center; background:#FFC107; color:#000; font-weight:bold;" colspan="3">REQUESTING MONTH</th>
            <th style="border:2px solid #374151; padding:3px 6px; text-align:left; font-weight:normal;" colspan="16">{{ requestingMonth }}</th>
          </tr>
          <tr>
            <th style="border:2px solid #374151; padding:3px 6px; text-align:center; background:#FFC107; color:#000; font-weight:bold;" colspan="3">INVOICE NO</th>
            <th style="border:2px solid #374151; padding:3px 6px; text-align:left; font-weight:normal;" colspan="16">{{ invoice?.reference || '-' }}</th>
          </tr>
          <tr>
            <th style="border:2px solid #374151; padding:3px 6px; text-align:center; background:#FFC107; color:#000; font-weight:bold;" colspan="3">PO Number</th>
            <th style="border:2px solid #374151; padding:3px 6px; text-align:left; font-weight:normal;" colspan="16">TBA</th>
          </tr>
          <tr style="background:#1E530A; color:#fff;">
            <th style="border:2px solid #374151; padding:3px 4px; font-size:10px;">No</th>
            <th style="border:2px solid #374151; padding:3px 4px; font-size:10px;">Service Date</th>
            <th style="border:2px solid #374151; padding:3px 4px; font-size:10px;">PLATE NUMBER</th>
            <th style="border:2px solid #374151; padding:3px 4px; font-size:10px;">Truck Ownership</th>
            <th style="border:2px solid #374151; padding:3px 4px; font-size:10px;">GPS Status</th>
            <th style="border:2px solid #374151; padding:3px 4px; font-size:10px;">Origin</th>
            <th style="border:2px solid #374151; padding:3px 4px; font-size:10px;">Destination</th>
            <th style="border:2px solid #374151; padding:3px 4px; font-size:10px;">Distributer Name</th>
            <th style="border:2px solid #374151; padding:3px 4px; font-size:10px;">FPIV ({{ shipperName }})</th>
            <th style="border:2px solid #374151; padding:3px 4px; font-size:10px;">Loaded Quantity</th>
            <th style="border:2px solid #374151; padding:3px 4px; font-size:10px;">Number of Trip</th>
            <th style="border:2px solid #374151; padding:3px 4px; font-size:10px;">Receiving Voucher (Agent)</th>
            <th style="border:2px solid #374151; padding:3px 4px; font-size:10px;">CKRF</th>
            <th style="border:2px solid #374151; padding:3px 4px; font-size:10px;">Container ISSUE Voucher (Agent)</th>
            <th style="border:2px solid #374151; padding:3px 4px; font-size:10px;">Container Receiving Voucher ({{ shipperName }})</th>
            <th style="border:2px solid #374151; padding:3px 4px; font-size:10px;">Returned Quantity</th>
            <th style="border:2px solid #374151; padding:3px 4px; font-size:10px;">Tariff</th>
            <th style="border:2px solid #374151; padding:3px 4px; font-size:10px;">Payment Request</th>
            <th style="border:2px solid #374151; padding:3px 4px; font-size:10px;">Remark</th>
          </tr>
          <tr v-for="(s, i) in invoice?.shipments || []" :key="s._id">
            <td style="border:2px solid #374151; padding:2px 4px; font-weight:bold;">{{ i + 1 }}</td>
            <td style="border:2px solid #374151; padding:2px 4px; font-weight:bold;">{{ formatDate(s.dispatchDate) }}</td>
            <td style="border:2px solid #374151; padding:2px 4px; font-weight:bold;">{{ s.vehicle?.plateNumber }} / {{ s.vehicle?.trailerPlate }}</td>
            <td style="border:2px solid #374151; padding:2px 4px; font-weight:bold;">{{ s.vehicle?.ownership === 'Owned' ? 'Own' : 'Subcontracted' }}</td>
            <td style="border:2px solid #374151; padding:2px 4px; font-weight:bold;">{{ s.vehicle?.ownership === 'Owned' ? 'Yes' : 'No' }}</td>
            <td style="border:2px solid #374151; padding:2px 4px; font-weight:bold;">{{ s.route?.origin }}</td>
            <td style="border:2px solid #374151; padding:2px 4px; font-weight:bold;">{{ s.route?.origin }}_{{ s.route?.destination }}</td>
            <td style="border:2px solid #374151; padding:2px 4px; font-weight:bold;">{{ s.order?.agent?.name || '' }}</td>
            <td style="border:2px solid #374151; padding:2px 4px; font-weight:bold;" v-html="(s.shipperIssueVoucher || '').replace(/\//g, '/&shy;')"></td>
            <td style="border:2px solid #374151; padding:2px 4px; font-weight:bold;">{{ s.order?.totalRequest }}</td>
            <td style="border:2px solid #374151; padding:2px 4px; font-weight:bold;">1</td>
            <td style="border:2px solid #374151; padding:2px 4px; font-weight:bold;" v-html="(s.agentReceiveVoucher || '').replace(/\//g, '/&shy;')"></td>
            <td style="border:2px solid #374151; padding:2px 4px; font-weight:bold;">{{ s.CKRFCode }}</td>
            <td style="border:2px solid #374151; padding:2px 4px; font-weight:bold;">{{ s.tripType === 'round_trip' ? s.agentIssueVoucher : '' }}</td>
            <td style="border:2px solid #374151; padding:2px 4px; font-weight:bold;">{{ s.tripType === 'round_trip' ? s.shipperReceiveVoucher : '' }}</td>
            <td style="border:2px solid #374151; padding:2px 4px; font-weight:bold;"></td>
            <td style="border:2px solid #374151; padding:2px 4px; font-weight:bold;">{{ formatPrice(s.totalPrice) }}</td>
            <td style="border:2px solid #374151; padding:2px 4px; font-weight:bold;">{{ s.totalPrice }}</td>
            <td style="border:2px solid #374151; padding:2px 4px; font-weight:bold;">{{ s.remark }}</td>
          </tr>
          <tr>
            <td colspan="15" style="padding:3px 6px; font-weight:bold;"></td>
            <td style="padding:3px 6px; font-weight:bold;">TOTAL</td>
            <td colspan="3" style="padding:3px 6px; font-weight:bold;"><u>{{ totalSum }}</u></td>
          </tr>
        </table>
      </template>

      <!-- Signature section -->
      <div style="display:flex; justify-content:space-between; margin-top:24px; font-size:12px;">
        <div>
          <strong>Transporter:</strong><br />
          <strong>Prepared By:</strong><br />
          Name: {{ invoice?.paymentRequestedBy?.username || '' }}<br />
          Signature: ____________________________
        </div>
        <div style="text-align:center;">
          <strong>{{ shipperName }} (Supply Chain)</strong><br />
          <div style="display:flex; gap:32px; margin-top:8px;">
            <div>
              <strong>Checked By:</strong><br />
              Name: ____________________________<br />
              Signature: ____________________________
            </div>
            <div>
              <div style="display:flex; gap:24px; margin-top:4px;">
                <div>
                  <strong>Validated By:</strong><br />
                  Name: ____________________________<br />
                  Signature: ____________________________
                </div>
                <div>
                  <strong>Approved By:</strong><br />
                  Name: ____________________________<br />
                  Signature: ____________________________
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ======================== SCREEN LAYOUT (hidden on print) ======================== -->
    <div class="rounded-2xl px-3 md:px-5 py-6 bg-white flex flex-col gap-8 shadow-sm border border-gray-100 print:hidden">
      <!-- Summary cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <InfoWrapper title="Invoice Information">
          <div class="flex flex-col gap-4">
            <DataLabel label="Reference" :value="invoice?.reference || invoice?.shipments?.[0]?.paymentDetail?.reference" />
            <DataLabel label="Status" :value="invoice?.status || invoice?.shipments?.[0]?.paymentDetail?.paymentStatus || 'PENDING'" />
            <DataLabel label="Total Amount" :value="currencyFormatter(invoice?.totalAmount || totalSumRaw)" />
          </div>
        </InfoWrapper>
        <InfoWrapper title="Request Details">
          <div class="flex flex-col gap-4">
            <DataLabel label="Requested By" :value="invoice?.paymentRequestedBy?.username || invoice?.shipments?.[0]?.paymentDetail?.paymentRequestedBy?.username || '-'" />
            <DataLabel label="Requested Date" :value="dateFormatter(invoice?.paymentRequestedDate || invoice?.shipments?.[0]?.paymentDetail?.paymentRequestedDate)" />
            <DataLabel label="Approved By" :value="invoice?.paymentApprovedBy?.username || '-'" />
          </div>
        </InfoWrapper>
      </div>

      <!-- Associated Shipments table -->
      <div class="flex flex-col gap-4">
        <h3 class="text-lg font-bold text-gray-900 px-1">Associated Shipments</h3>

        <div class="overflow-x-auto rounded-xl border border-gray-200">
          <!-- IN_BOUND / SITE_TRANSFER table -->
          <table v-if="isInbound" class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">No</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Business Unit</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Allocation Num</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Material Type</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Truck Type</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Supplier Name</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Origin</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Destination</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Route</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Truck Plate Number</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Driver Name</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">GRN</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">QTY</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tarrif</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Remark</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="!invoice?.shipments?.length">
                <td colspan="16" class="px-4 py-10 text-center text-sm text-gray-500 italic">No shipments associated with this invoice.</td>
              </tr>
              <tr
                v-for="(shipment, index) in invoice?.shipments"
                :key="shipment._id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ index + 1 }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ shipment.route?.destination || '-' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ formatDate(shipment.dispatchDate) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ shipment.order?.allocationNumber || '-' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {{ shipment.agent ? shipment.agent.name : (shipment.productType === 'SITE_TRANSFER' ? 'Site Transfer' : shipment.productType) }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ formatVehicleType(shipment.vehicleTypeName) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {{ shipment.productType === 'SITE_TRANSFER' ? 'Site Transfer' : (shipment.agent?.name || '-') }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ shipment.route?.origin || '-' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ shipment.route?.destination || '-' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ shipment.route?.origin }}_{{ shipment.route?.destination }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{{ shipment.vehicle?.plateNumber || '-' }} / {{ shipment.vehicle?.trailerPlate || '-' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ formatDriverName(shipment.driverName || `${shipment.driver?.firstName || ''} ${shipment.driver?.lastName || ''}`) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ shipment.agentReceiveVoucher || '-' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ shipment.order?.totalRequest || '-' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900">{{ currencyFormatter(shipment.totalPrice || 0) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ shipment.remark || '-' }}</td>
              </tr>
              <tr v-if="invoice?.shipments?.length" class="bg-gray-50 font-bold">
                <td colspan="14" class="px-4 py-3 text-sm text-right text-gray-700">TOTAL</td>
                <td colspan="2" class="px-4 py-3 text-sm font-bold text-gray-900">{{ currencyFormatter(totalSumRaw) }}</td>
              </tr>
            </tbody>
          </table>

          <!-- OUT_BOUND table -->
          <table v-else class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">No</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Service Date</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">PLATE NUMBER</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Truck Ownership</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">GPS Status</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Origin</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Destination</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Distributer Name</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">FPIV ({{ shipperName }})</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Loaded Quantity</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Number of Trip</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Receiving Voucher (Agent)</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">CKRF</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Container ISSUE Voucher (Agent)</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Container Receiving Voucher ({{ shipperName }})</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Returned Quantity</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tariff</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Payment Request</th>
                <th class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Remark</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="!invoice?.shipments?.length">
                <td colspan="19" class="px-4 py-10 text-center text-sm text-gray-500 italic">No shipments associated with this invoice.</td>
              </tr>
              <tr
                v-for="(shipment, index) in invoice?.shipments"
                :key="shipment._id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ index + 1 }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ formatDate(shipment.dispatchDate) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{{ shipment.vehicle?.plateNumber || '-' }} / {{ shipment.vehicle?.trailerPlate || '-' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ shipment.vehicle?.ownership === 'Owned' ? 'Own' : 'Subcontracted' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ shipment.vehicle?.ownership === 'Owned' ? 'Yes' : 'No' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ shipment.route?.origin || '-' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ shipment.route?.origin }}_{{ shipment.route?.destination }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ shipment.order?.agent?.name || '-' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ shipment.shipperIssueVoucher || '-' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ shipment.order?.totalRequest || '-' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">1</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ shipment.agentReceiveVoucher || '-' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ shipment.CKRFCode || '-' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ shipment.tripType === 'round_trip' ? shipment.agentIssueVoucher : '-' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ shipment.tripType === 'round_trip' ? shipment.shipperReceiveVoucher : '-' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">-</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900">{{ currencyFormatter(shipment.totalPrice || 0) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ shipment.totalPrice || '-' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ shipment.remark || '-' }}</td>
              </tr>
              <tr v-if="invoice?.shipments?.length" class="bg-gray-50 font-bold">
                <td colspan="16" class="px-4 py-3 text-sm text-right text-gray-700">TOTAL</td>
                <td colspan="3" class="px-4 py-3 text-sm font-bold text-gray-900">{{ currencyFormatter(totalSumRaw) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import InfoWrapper from "../shipment-details/InfoWrapper.vue";
import DataLabel from "../shipment-details/ShipmentDataLabel.vue";
import { dateFormatter, currencyFormatter } from "@/utils/utils";

const props = defineProps<{ invoice?: any }>();

const shipments = computed(() => props.invoice?.shipments || []);
const firstProductType = computed(() => shipments.value[0]?.productType || "");
const isInbound = computed(() => firstProductType.value === "IN_BOUND" || firstProductType.value === "SITE_TRANSFER");
const shipperName = computed(() => shipments.value[0]?.order?.shipper?.name || "Shipper");
const totalSumRaw = computed(() => shipments.value.reduce((sum: number, s: any) => sum + (s.totalPrice || 0), 0));
const totalSum = computed(() => formatPrice(totalSumRaw.value));
const requestingMonth = computed(() => {
  const d = props.invoice?.paymentRequestedDate || shipments.value[0]?.paymentDetail?.paymentRequestedDate;
  if (!d) return "-";
  return new Date(d).toLocaleDateString("en-US", { month: "long", year: "numeric" });
});

function formatPrice(val: number) {
  if (val == null) return "-";
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
}

function formatDate(date: string) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatVehicleType(name: string) {
  if (!name) return "-";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].toUpperCase();
  return parts.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

function formatDriverName(name: string) {
  if (!name?.trim()) return "-";
  return name.trim().split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}
</script>
