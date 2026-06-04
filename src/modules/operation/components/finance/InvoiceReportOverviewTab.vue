<template>
  <div class="flex flex-col gap-4">
    <!-- ======================== PRINT LAYOUT (hidden on screen) ======================== -->
    <div
      class="hidden print:block"
      style="font-family: Calibri, sans-serif; font-size: 11px; padding: 10px"
    >
      <!-- IN_BOUND / SITE_TRANSFER print layout -->
      <template v-if="isInbound">
        <table
          style="width: 100%; border-collapse: collapse; margin-bottom: 4px"
        >
          <tr>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 6px;
                text-align: center;
                background: #ffc107;
                color: #000;
                font-weight: bold;
              "
              colspan="3"
            >
              Transporter Name
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 6px;
                text-align: left;
                font-weight: normal;
              "
              colspan="13"
            >
              {{ invoice?.carrier?.name || "-" }}
            </th>
          </tr>
          <tr>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 6px;
                text-align: center;
                background: #ffc107;
                color: #000;
                font-weight: bold;
              "
              colspan="3"
            >
              REQUESTING MONTH
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 6px;
                text-align: left;
                font-weight: normal;
              "
              colspan="13"
            >
              {{ requestingMonth }}
            </th>
          </tr>
          <tr>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 6px;
                text-align: center;
                background: #ffc107;
                color: #000;
                font-weight: bold;
              "
              colspan="3"
            >
              INVOICE NO
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 6px;
                text-align: left;
                font-weight: normal;
              "
              colspan="13"
            >
              {{ invoice?.reference || "-" }}
            </th>
          </tr>
          <tr>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 6px;
                text-align: center;
                background: #ffc107;
                color: #000;
                font-weight: bold;
              "
              colspan="3"
            >
              PO Number
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 6px;
                text-align: left;
                font-weight: normal;
              "
              colspan="13"
            >
              TBA
            </th>
          </tr>
          <tr style="background: #1565c0; color: #fff">
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 4px;
                font-size: 10px;
              "
            >
              No
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 4px;
                font-size: 10px;
              "
            >
              Business Unit
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 4px;
                font-size: 10px;
              "
            >
              Date
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 4px;
                font-size: 10px;
              "
            >
              Allocation Num
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 4px;
                font-size: 10px;
              "
            >
              Material Type
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 4px;
                font-size: 10px;
              "
            >
              Truck Type
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 4px;
                font-size: 10px;
              "
            >
              Supplier Name
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 4px;
                font-size: 10px;
              "
            >
              Origin
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 4px;
                font-size: 10px;
              "
            >
              Destination
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 4px;
                font-size: 10px;
              "
            >
              Route
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 4px;
                font-size: 10px;
              "
            >
              Truck Plate Number
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 4px;
                font-size: 10px;
              "
            >
              Driver Name
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 4px;
                font-size: 10px;
              "
            >
              GRN
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 4px;
                font-size: 10px;
              "
            >
              QTY
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 4px;
                font-size: 10px;
              "
            >
              Tarrif
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 4px;
                font-size: 10px;
              "
            >
              Remark
            </th>
          </tr>
          <tr
            v-for="(s, i) in invoice?.shipments || []"
            :key="s._id"
            class="cursor-pointer hover:bg-surface-muted"
            @click="$router.push(`/operation/shipments/${s._id}`)"
          >
            <td
              style="
                border: 2px solid #374151;
                padding: 2px 4px;
                font-weight: bold;
              "
            >
              {{ i + 1 }}
            </td>
            <td
              style="
                border: 2px solid #374151;
                padding: 2px 4px;
                font-weight: bold;
              "
            >
              {{ s.route?.destination }}
            </td>
            <td
              style="
                border: 2px solid #374151;
                padding: 2px 4px;
                font-weight: bold;
              "
            >
              {{ formatDate(s.dispatchDate) }}
            </td>
            <td
              style="
                border: 2px solid #374151;
                padding: 2px 4px;
                font-weight: bold;
              "
            >
              {{ s.order?.allocationNumber }}
            </td>
            <td
              style="
                border: 2px solid #374151;
                padding: 2px 4px;
                font-weight: bold;
              "
            >
              {{
                s.agent
                  ? s.agent.name
                  : s.productType === "SITE_TRANSFER"
                    ? "Site Transfer"
                    : s.productType
              }}
            </td>
            <td
              style="
                border: 2px solid #374151;
                padding: 2px 4px;
                font-weight: bold;
              "
            >
              {{ formatVehicleType(s.vehicleTypeName) }}
            </td>
            <td
              style="
                border: 2px solid #374151;
                padding: 2px 4px;
                font-weight: bold;
              "
            >
              {{
                s.productType === "SITE_TRANSFER"
                  ? "Site Transfer"
                  : s.agent?.name || ""
              }}
            </td>
            <td
              style="
                border: 2px solid #374151;
                padding: 2px 4px;
                font-weight: bold;
              "
            >
              {{ s.route?.origin }}
            </td>
            <td
              style="
                border: 2px solid #374151;
                padding: 2px 4px;
                font-weight: bold;
              "
            >
              {{ s.route?.destination }}
            </td>
            <td
              style="
                border: 2px solid #374151;
                padding: 2px 4px;
                font-weight: bold;
              "
            >
              {{ s.route?.origin }}_{{ s.route?.destination }}
            </td>
            <td
              style="
                border: 2px solid #374151;
                padding: 2px 4px;
                font-weight: bold;
              "
            >
              {{ s.vehicle?.plateNumber }} / {{ s.vehicle?.trailerPlate }}
            </td>
            <td
              style="
                border: 2px solid #374151;
                padding: 2px 4px;
                font-weight: bold;
              "
            >
              {{
                formatDriverName(
                  s.driverName ||
                    `${s.driver?.firstName || ""} ${s.driver?.lastName || ""}`,
                )
              }}
            </td>
            <td
              style="
                border: 2px solid #374151;
                padding: 2px 4px;
                font-weight: bold;
              "
            >
              {{ s.agentReceiveVoucher }}
            </td>
            <td
              style="
                border: 2px solid #374151;
                padding: 2px 4px;
                font-weight: bold;
              "
            >
              {{ s.order?.totalRequest }}
            </td>
            <td
              style="
                border: 2px solid #374151;
                padding: 2px 4px;
                font-weight: bold;
              "
            >
              {{ formatPrice(s.totalPrice) }}
            </td>
            <td
              style="
                border: 2px solid #374151;
                padding: 2px 4px;
                font-weight: bold;
              "
            >
              {{ s.remark }}
            </td>
          </tr>
          <tr>
            <td colspan="14" style="padding: 3px 6px; font-weight: bold"></td>
            <td style="padding: 3px 6px; font-weight: bold">TOTAL</td>
            <td style="padding: 3px 6px; font-weight: bold">
              <u>{{ totalSum }}</u>
            </td>
          </tr>
        </table>
      </template>

      <!-- OUT_BOUND print layout -->
      <template v-else>
        <table
          style="width: 100%; border-collapse: collapse; margin-bottom: 4px"
        >
          <tr>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 6px;
                text-align: center;
                background: #ffc107;
                color: #000;
                font-weight: bold;
              "
              colspan="3"
            >
              Transporter Name
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 6px;
                text-align: left;
                font-weight: normal;
              "
              colspan="16"
            >
              {{ invoice?.carrier?.name || "-" }}
            </th>
          </tr>
          <tr>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 6px;
                text-align: center;
                background: #ffc107;
                color: #000;
                font-weight: bold;
              "
              colspan="3"
            >
              REQUESTING MONTH
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 6px;
                text-align: left;
                font-weight: normal;
              "
              colspan="16"
            >
              {{ requestingMonth }}
            </th>
          </tr>
          <tr>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 6px;
                text-align: center;
                background: #ffc107;
                color: #000;
                font-weight: bold;
              "
              colspan="3"
            >
              INVOICE NO
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 6px;
                text-align: left;
                font-weight: normal;
              "
              colspan="16"
            >
              {{ invoice?.reference || "-" }}
            </th>
          </tr>
          <tr>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 6px;
                text-align: center;
                background: #ffc107;
                color: #000;
                font-weight: bold;
              "
              colspan="3"
            >
              PO Number
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 6px;
                text-align: left;
                font-weight: normal;
              "
              colspan="16"
            >
              TBA
            </th>
          </tr>
          <tr style="background: #1e530a; color: #fff">
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 4px;
                font-size: 10px;
              "
            >
              No
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 4px;
                font-size: 10px;
              "
            >
              Service Date
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 4px;
                font-size: 10px;
              "
            >
              PLATE NUMBER
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 4px;
                font-size: 10px;
              "
            >
              Truck Ownership
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 4px;
                font-size: 10px;
              "
            >
              GPS Status
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 4px;
                font-size: 10px;
              "
            >
              Origin
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 4px;
                font-size: 10px;
              "
            >
              Destination
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 4px;
                font-size: 10px;
              "
            >
              Distributer Name
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 4px;
                font-size: 10px;
              "
            >
              FPIV ({{ shipperName }})
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 4px;
                font-size: 10px;
              "
            >
              Loaded Quantity
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 4px;
                font-size: 10px;
              "
            >
              Number of Trip
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 4px;
                font-size: 10px;
              "
            >
              Receiving Voucher (Agent)
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 4px;
                font-size: 10px;
              "
            >
              CKRF
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 4px;
                font-size: 10px;
              "
            >
              Container ISSUE Voucher (Agent)
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 4px;
                font-size: 10px;
              "
            >
              Container Receiving Voucher ({{ shipperName }})
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 4px;
                font-size: 10px;
              "
            >
              Returned Quantity
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 4px;
                font-size: 10px;
              "
            >
              Tariff
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 4px;
                font-size: 10px;
              "
            >
              Payment Request
            </th>
            <th
              style="
                border: 2px solid #374151;
                padding: 3px 4px;
                font-size: 10px;
              "
            >
              Remark
            </th>
          </tr>
          <tr
            v-for="(s, i) in invoice?.shipments || []"
            :key="s._id"
            class="cursor-pointer hover:bg-surface-muted"
            @click="$router.push(`/operation/shipments/${s._id}`)"
          >
            <td
              style="
                border: 2px solid #374151;
                padding: 2px 4px;
                font-weight: bold;
              "
            >
              {{ i + 1 }}
            </td>
            <td
              style="
                border: 2px solid #374151;
                padding: 2px 4px;
                font-weight: bold;
              "
            >
              {{ formatDate(s.dispatchDate) }}
            </td>
            <td
              style="
                border: 2px solid #374151;
                padding: 2px 4px;
                font-weight: bold;
              "
            >
              {{ s.vehicle?.plateNumber }} / {{ s.vehicle?.trailerPlate }}
            </td>
            <td
              style="
                border: 2px solid #374151;
                padding: 2px 4px;
                font-weight: bold;
              "
            >
              {{ s.vehicle?.ownership === "Owned" ? "Own" : "Subcontracted" }}
            </td>
            <td
              style="
                border: 2px solid #374151;
                padding: 2px 4px;
                font-weight: bold;
              "
            >
              {{ s.vehicle?.ownership === "Owned" ? "Yes" : "No" }}
            </td>
            <td
              style="
                border: 2px solid #374151;
                padding: 2px 4px;
                font-weight: bold;
              "
            >
              {{ s.route?.origin }}
            </td>
            <td
              style="
                border: 2px solid #374151;
                padding: 2px 4px;
                font-weight: bold;
              "
            >
              {{ s.route?.origin }}_{{ s.route?.destination }}
            </td>
            <td
              style="
                border: 2px solid #374151;
                padding: 2px 4px;
                font-weight: bold;
              "
            >
              {{ s.order?.agent?.name || "" }}
            </td>
            <td
              style="
                border: 2px solid #374151;
                padding: 2px 4px;
                font-weight: bold;
              "
              v-html="(s.shipperIssueVoucher || '').replace(/\//g, '/&shy;')"
            ></td>
            <td
              style="
                border: 2px solid #374151;
                padding: 2px 4px;
                font-weight: bold;
              "
            >
              {{ s.order?.totalRequest }}
            </td>
            <td
              style="
                border: 2px solid #374151;
                padding: 2px 4px;
                font-weight: bold;
              "
            >
              1
            </td>
            <td
              style="
                border: 2px solid #374151;
                padding: 2px 4px;
                font-weight: bold;
              "
              v-html="(s.agentReceiveVoucher || '').replace(/\//g, '/&shy;')"
            ></td>
            <td
              style="
                border: 2px solid #374151;
                padding: 2px 4px;
                font-weight: bold;
              "
            >
              {{ s.CKRFCode }}
            </td>
            <td
              style="
                border: 2px solid #374151;
                padding: 2px 4px;
                font-weight: bold;
              "
            >
              {{ s.tripType === "round_trip" ? s.agentIssueVoucher : "" }}
            </td>
            <td
              style="
                border: 2px solid #374151;
                padding: 2px 4px;
                font-weight: bold;
              "
            >
              {{ s.tripType === "round_trip" ? s.shipperReceiveVoucher : "" }}
            </td>
            <td
              style="
                border: 2px solid #374151;
                padding: 2px 4px;
                font-weight: bold;
              "
            ></td>
            <td
              style="
                border: 2px solid #374151;
                padding: 2px 4px;
                font-weight: bold;
              "
            >
              {{ formatPrice(s.totalPrice) }}
            </td>
            <td
              style="
                border: 2px solid #374151;
                padding: 2px 4px;
                font-weight: bold;
              "
            >
              {{ s.totalPrice }}
            </td>
            <td
              style="
                border: 2px solid #374151;
                padding: 2px 4px;
                font-weight: bold;
              "
            >
              {{ s.remark }}
            </td>
          </tr>
          <tr>
            <td colspan="15" style="padding: 3px 6px; font-weight: bold"></td>
            <td style="padding: 3px 6px; font-weight: bold">TOTAL</td>
            <td colspan="3" style="padding: 3px 6px; font-weight: bold">
              <u>{{ totalSum }}</u>
            </td>
          </tr>
        </table>
      </template>

      <!-- Signature section -->
      <div
        style="
          display: flex;
          justify-content: space-between;
          margin-top: 24px;
          font-size: 12px;
        "
      >
        <div>
          <strong>Transporter:</strong><br />
          <strong>Prepared By:</strong><br />
          Name: {{ invoice?.paymentRequestedBy?.username || "" }}<br />
          Signature: ____________________________
        </div>
        <div style="text-align: center">
          <strong>{{ shipperName }} (Supply Chain)</strong><br />
          <div style="display: flex; gap: 32px; margin-top: 8px">
            <div>
              <strong>Checked By:</strong><br />
              Name: ____________________________<br />
              Signature: ____________________________
            </div>
            <div>
              <div style="display: flex; gap: 24px; margin-top: 4px">
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
    <div
      class="rounded-2xl px-3 md:px-5 py-6 bg-surface flex flex-col gap-8 shadow-sm border border-line print:hidden"
    >
      <!-- Summary cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <InfoWrapper title="Invoice Information">
          <div class="flex flex-col gap-4">
            <DataLabel
              label="Reference"
              :value="
                invoice?.reference ||
                invoice?.shipments?.[0]?.paymentDetail?.reference
              "
            />
            <DataLabel
              label="Status"
              :value="
                invoice?.status ||
                invoice?.shipments?.[0]?.paymentDetail?.paymentStatus ||
                'PENDING'
              "
            />
            <DataLabel
              label="Total Amount"
              :value="currencyFormatter(invoice?.totalAmount || totalSumRaw)"
            />
          </div>
        </InfoWrapper>
        <InfoWrapper title="Request Details">
          <div class="flex flex-col gap-4">
            <DataLabel
              label="Requested By"
              :value="
                invoice?.paymentRequestedBy?.username ||
                invoice?.shipments?.[0]?.paymentDetail?.paymentRequestedBy
                  ?.username ||
                '-'
              "
            />
            <DataLabel
              label="Requested Date"
              :value="
                dateFormatter(
                  invoice?.paymentRequestedDate ||
                    invoice?.shipments?.[0]?.paymentDetail
                      ?.paymentRequestedDate,
                )
              "
            />
            <DataLabel
              label="Approved By"
              :value="invoice?.paymentApprovedBy?.username || '-'"
            />
          </div>
        </InfoWrapper>
      </div>

      <!-- Associated Shipments table -->
      <div class="flex flex-col gap-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
          <h3 class="text-lg font-bold text-base-text">Associated Shipments</h3>
          <div class="relative w-full sm:w-64">
            <i
              class="mdi mdi-magnify absolute left-3 top-1/2 -translate-y-1/2 text-faint-text text-xl"
            ></i>
            <input
              v-model="searchQuery"
              type="text"
              class="w-full pl-10 pr-4 py-2 border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-shadow"
              placeholder="Search shipments..."
            />
          </div>
        </div>

        <!-- Mobile card list -->
        <div class="sm:hidden flex flex-col divide-y divide-line rounded-xl border border-line bg-surface overflow-hidden">
          <div v-if="!filteredShipments.length" class="px-4 py-10 text-center text-sm text-dim-text italic">
            {{ searchQuery ? "No shipments match your search." : "No shipments associated with this invoice." }}
          </div>
          <div
            v-for="(shipment, index) in filteredShipments"
            :key="shipment._id"
            class="px-4 py-3 grid grid-cols-6 gap-x-2 gap-y-1.5 cursor-pointer hover:bg-surface-muted transition-colors"
            @click="$router.push(`/operation/shipments/${shipment._id}`)"
          >
            <!-- Row: index + date -->
            <div class="col-span-1 flex items-center">
              <span class="text-xs font-bold text-faint-text">#{{ index + 1 }}</span>
            </div>
            <div class="col-span-5 flex items-center justify-end">
              <span class="text-xs text-dim-text">{{ formatDate(shipment.dispatchDate) }}</span>
            </div>
            <!-- Row: plate + amount -->
            <div class="col-span-3">
              <span class="text-sm font-bold text-base-text">{{ shipment.vehicle?.plateNumber || "-" }}</span>
              <span v-if="shipment.vehicle?.trailerPlate" class="text-xs text-faint-text ml-1">/ {{ shipment.vehicle.trailerPlate }}</span>
            </div>
            <div class="col-span-3 text-right">
              <span class="text-sm font-bold text-primary">{{ currencyFormatter(shipment.totalPrice || 0) }}</span>
            </div>
            <!-- Row: route -->
            <div class="col-span-6">
              <span class="text-xs font-medium text-dim-text">{{ shipment.route?.origin || "-" }} → {{ shipment.route?.destination || "-" }}</span>
            </div>
            <!-- Row: driver -->
            <div v-if="shipment.driver || shipment.driverName" class="col-span-6">
              <span class="text-xs text-dim-text">{{ formatDriverName(shipment.driverName || `${shipment.driver?.firstName || ''} ${shipment.driver?.lastName || ''}`) }}</span>
            </div>
            <!-- IN_BOUND specific rows -->
            <template v-if="isInbound">
              <div v-if="shipment.agent?.name || shipment.productType" class="col-span-3">
                <span class="text-xs text-faint-text uppercase tracking-wide">Supplier</span>
                <span class="text-xs text-dim-text ml-1">{{ shipment.productType === 'SITE_TRANSFER' ? 'Site Transfer' : (shipment.agent?.name || '-') }}</span>
              </div>
              <div v-if="shipment.vehicleTypeName" class="col-span-3 text-right">
                <span class="text-xs text-faint-text uppercase tracking-wide">Truck Type</span>
                <span class="text-xs text-dim-text ml-1">{{ formatVehicleType(shipment.vehicleTypeName) }}</span>
              </div>
              <div v-if="shipment.order?.allocationNumber" class="col-span-3">
                <span class="text-xs text-faint-text uppercase tracking-wide">Alloc</span>
                <span class="text-xs text-dim-text ml-1">{{ shipment.order.allocationNumber }}</span>
              </div>
              <div v-if="shipment.order?.totalRequest" class="col-span-3 text-right">
                <span class="text-xs text-faint-text uppercase tracking-wide">QTY</span>
                <span class="text-xs text-dim-text ml-1">{{ shipment.order.totalRequest }}</span>
              </div>
              <div v-if="shipment.agentReceiveVoucher" class="col-span-6">
                <span class="text-xs text-faint-text uppercase tracking-wide">GRN</span>
                <span class="text-xs text-dim-text ml-1">{{ shipment.agentReceiveVoucher }}</span>
              </div>
            </template>
            <!-- OUT_BOUND specific rows -->
            <template v-else>
              <div v-if="shipment.order?.agent?.name" class="col-span-3">
                <span class="text-xs text-faint-text uppercase tracking-wide">Distributor</span>
                <span class="text-xs text-dim-text ml-1">{{ shipment.order.agent.name }}</span>
              </div>
              <div class="col-span-3 text-right">
                <span class="text-xs text-faint-text uppercase tracking-wide">Ownership</span>
                <span class="text-xs text-dim-text ml-1">{{ shipment.vehicle?.ownership === 'Owned' ? 'Own' : 'Sub' }}</span>
              </div>
              <div v-if="shipment.order?.totalRequest" class="col-span-3">
                <span class="text-xs text-faint-text uppercase tracking-wide">Loaded QTY</span>
                <span class="text-xs text-dim-text ml-1">{{ shipment.order.totalRequest }}</span>
              </div>
              <div v-if="shipment.CKRFCode" class="col-span-3 text-right">
                <span class="text-xs text-faint-text uppercase tracking-wide">CKRF</span>
                <span class="text-xs text-dim-text ml-1">{{ shipment.CKRFCode }}</span>
              </div>
              <div v-if="shipment.shipperIssueVoucher" class="col-span-6">
                <span class="text-xs text-faint-text uppercase tracking-wide">FPIV</span>
                <span class="text-xs text-dim-text ml-1">{{ shipment.shipperIssueVoucher }}</span>
              </div>
              <div v-if="shipment.agentReceiveVoucher" class="col-span-6">
                <span class="text-xs text-faint-text uppercase tracking-wide">Receive Voucher</span>
                <span class="text-xs text-dim-text ml-1">{{ shipment.agentReceiveVoucher }}</span>
              </div>
              <template v-if="shipment.tripType === 'round_trip'">
                <div v-if="shipment.agentIssueVoucher" class="col-span-6">
                  <span class="text-xs text-faint-text uppercase tracking-wide">Container Issue</span>
                  <span class="text-xs text-dim-text ml-1">{{ shipment.agentIssueVoucher }}</span>
                </div>
                <div v-if="shipment.shipperReceiveVoucher" class="col-span-6">
                  <span class="text-xs text-faint-text uppercase tracking-wide">Container Receive</span>
                  <span class="text-xs text-dim-text ml-1">{{ shipment.shipperReceiveVoucher }}</span>
                </div>
              </template>
            </template>
            <!-- Remark (both types) -->
            <div v-if="shipment.remark" class="col-span-6">
              <span class="text-xs text-faint-text italic">{{ shipment.remark }}</span>
            </div>
          </div>
          <div v-if="filteredShipments.length" class="px-4 py-3 bg-surface-muted flex items-center justify-between">
            <span class="text-sm font-bold text-dim-text">TOTAL</span>
            <span class="text-sm font-bold text-base-text">{{ currencyFormatter(filteredShipments.reduce((sum: number, s: any) => sum + (s.totalPrice || 0), 0)) }}</span>
          </div>
        </div>

        <!-- Desktop table -->
        <div class="hidden sm:block overflow-x-auto rounded-xl border border-line">
          <!-- IN_BOUND / SITE_TRANSFER table -->
          <table v-if="isInbound" class="min-w-full divide-y divide-line">
            <thead class="bg-surface-muted">
              <tr>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider"
                >
                  No
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider"
                >
                  Business Unit
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider"
                >
                  Allocation Num
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider"
                >
                  Material Type
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider"
                >
                  Truck Type
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider"
                >
                  Supplier Name
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider"
                >
                  Origin
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider"
                >
                  Destination
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider"
                >
                  Route
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider"
                >
                  Truck Plate Number
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider"
                >
                  Driver Name
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider"
                >
                  GRN
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider"
                >
                  QTY
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider"
                >
                  Tarrif
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider"
                >
                  Remark
                </th>
              </tr>
            </thead>
            <tbody class="bg-surface divide-y divide-line">
              <tr v-if="!filteredShipments.length">
                <td
                  colspan="16"
                  class="px-4 py-10 text-center text-sm text-dim-text italic"
                >
                  {{
                    searchQuery
                      ? "No shipments match your search."
                      : "No shipments associated with this invoice."
                  }}
                </td>
              </tr>
              <tr
                v-for="(shipment, index) in filteredShipments"
                :key="shipment._id"
                class="hover:bg-surface-muted transition-colors cursor-pointer"
                @click="$router.push(`/operation/shipments/${shipment._id}`)"
              >
                <td class="px-4 py-3 whitespace-nowrap text-sm text-base-text">
                  {{ index + 1 }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-dim-text">
                  {{ shipment.route?.destination || "-" }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-dim-text">
                  {{ formatDate(shipment.dispatchDate) }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-dim-text">
                  {{ shipment.order?.allocationNumber || "-" }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-dim-text">
                  {{
                    shipment.agent
                      ? shipment.agent.name
                      : shipment.productType === "SITE_TRANSFER"
                        ? "Site Transfer"
                        : shipment.productType
                  }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-dim-text">
                  {{ formatVehicleType(shipment.vehicleTypeName) }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-dim-text">
                  {{
                    shipment.productType === "SITE_TRANSFER"
                      ? "Site Transfer"
                      : shipment.agent?.name || "-"
                  }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-dim-text">
                  {{ shipment.route?.origin || "-" }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-dim-text">
                  {{ shipment.route?.destination || "-" }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-dim-text">
                  {{ shipment.route?.origin }}_{{ shipment.route?.destination }}
                </td>
                <td
                  class="px-4 py-3 whitespace-nowrap text-sm font-medium text-base-text"
                >
                  {{ shipment.vehicle?.plateNumber || "-" }} /
                  {{ shipment.vehicle?.trailerPlate || "-" }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-dim-text">
                  {{
                    formatDriverName(
                      shipment.driverName ||
                        `${shipment.driver?.firstName || ""} ${shipment.driver?.lastName || ""}`,
                    )
                  }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-dim-text">
                  {{ shipment.agentReceiveVoucher || "-" }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-dim-text">
                  {{ shipment.order?.totalRequest || "-" }}
                </td>
                <td
                  class="px-4 py-3 whitespace-nowrap text-sm font-bold text-base-text"
                >
                  {{ currencyFormatter(shipment.totalPrice || 0) }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-dim-text">
                  {{ shipment.remark || "-" }}
                </td>
              </tr>
              <tr v-if="filteredShipments.length" class="bg-surface-muted font-bold">
                <td
                  colspan="14"
                  class="px-4 py-3 text-sm text-right text-dim-text"
                >
                  TOTAL
                </td>
                <td
                  colspan="2"
                  class="px-4 py-3 text-sm font-bold text-base-text"
                >
                  {{
                    currencyFormatter(
                      filteredShipments.reduce(
                        (sum: number, s: any) => sum + (s.totalPrice || 0),
                        0,
                      ),
                    )
                  }}
                </td>
              </tr>
            </tbody>
          </table>

          <!-- OUT_BOUND table -->
          <table v-else class="min-w-full divide-y divide-line">
            <thead class="bg-surface-muted">
              <tr>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider"
                >
                  No
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider"
                >
                  Service Date
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider"
                >
                  PLATE NUMBER
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider"
                >
                  Truck Ownership
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider"
                >
                  GPS Status
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider"
                >
                  Origin
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider"
                >
                  Destination
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider"
                >
                  Distributer Name
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider"
                >
                  FPIV ({{ shipperName }})
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider"
                >
                  Loaded Quantity
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider"
                >
                  Number of Trip
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider"
                >
                  Receiving Voucher (Agent)
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider"
                >
                  CKRF
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider"
                >
                  Container ISSUE Voucher (Agent)
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider"
                >
                  Container Receiving Voucher ({{ shipperName }})
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider"
                >
                  Returned Quantity
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider"
                >
                  Tariff
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider"
                >
                  Payment Request
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-bold text-dim-text uppercase tracking-wider"
                >
                  Remark
                </th>
              </tr>
            </thead>
            <tbody class="bg-surface divide-y divide-line">
              <tr v-if="!filteredShipments.length">
                <td
                  colspan="19"
                  class="px-4 py-10 text-center text-sm text-dim-text italic"
                >
                  {{
                    searchQuery
                      ? "No shipments match your search."
                      : "No shipments associated with this invoice."
                  }}
                </td>
              </tr>
              <tr
                v-for="(shipment, index) in filteredShipments"
                :key="shipment._id"
                class="hover:bg-surface-muted transition-colors cursor-pointer"
                @click="$router.push(`/operation/shipments/${shipment._id}`)"
              >
                <td class="px-4 py-3 whitespace-nowrap text-sm text-base-text">
                  {{ index + 1 }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-dim-text">
                  {{ formatDate(shipment.dispatchDate) }}
                </td>
                <td
                  class="px-4 py-3 whitespace-nowrap text-sm font-medium text-base-text"
                >
                  {{ shipment.vehicle?.plateNumber || "-" }} /
                  {{ shipment.vehicle?.trailerPlate || "-" }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-dim-text">
                  {{
                    shipment.vehicle?.ownership === "Owned"
                      ? "Own"
                      : "Subcontracted"
                  }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-dim-text">
                  {{ shipment.vehicle?.ownership === "Owned" ? "Yes" : "No" }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-dim-text">
                  {{ shipment.route?.origin || "-" }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-dim-text">
                  {{ shipment.route?.origin }}_{{ shipment.route?.destination }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-dim-text">
                  {{ shipment.order?.agent?.name || "-" }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-dim-text">
                  {{ shipment.shipperIssueVoucher || "-" }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-dim-text">
                  {{ shipment.order?.totalRequest || "-" }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-dim-text">
                  1
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-dim-text">
                  {{ shipment.agentReceiveVoucher || "-" }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-dim-text">
                  {{ shipment.CKRFCode || "-" }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-dim-text">
                  {{
                    shipment.tripType === "round_trip"
                      ? shipment.agentIssueVoucher
                      : "-"
                  }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-dim-text">
                  {{
                    shipment.tripType === "round_trip"
                      ? shipment.shipperReceiveVoucher
                      : "-"
                  }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-dim-text">
                  -
                </td>
                <td
                  class="px-4 py-3 whitespace-nowrap text-sm font-bold text-base-text"
                >
                  {{ currencyFormatter(shipment.totalPrice || 0) }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-base-text">
                  {{ shipment.totalPrice || "-" }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-dim-text">
                  {{ shipment.remark || "-" }}
                </td>
              </tr>
              <tr v-if="filteredShipments.length" class="bg-surface-muted font-bold">
                <td
                  colspan="16"
                  class="px-4 py-3 text-sm text-right text-dim-text"
                >
                  TOTAL
                </td>
                <td
                  colspan="3"
                  class="px-4 py-3 text-sm font-bold text-base-text"
                >
                  {{
                    currencyFormatter(
                      filteredShipments.reduce(
                        (sum: number, s: any) => sum + (s.totalPrice || 0),
                        0,
                      ),
                    )
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import InfoWrapper from "../shipment-details/InfoWrapper.vue";
import DataLabel from "../shipment-details/ShipmentDataLabel.vue";
import { dateFormatter, currencyFormatter } from "@/utils/utils";

const props = defineProps<{ invoice?: any }>();

const route = useRoute();
const router = useRouter();

const searchQuery = ref((route.query.q as string) || "");

watch(searchQuery, (val) => {
  router.replace({ query: { ...route.query, q: val || undefined } });
});

const shipments = computed(() => props.invoice?.shipments || []);

// Split a code value by common delimiters and check if any segment starts with q
function codeMatch(value: string, q: string) {
  return value.split(/[\/\\\-\s]+/).some((seg) => seg.startsWith(q));
}

const filteredShipments = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return shipments.value;
  return shipments.value.filter((s: any) => {
    const plate = (s.vehicle?.plateNumber || "").toLowerCase();
    const trailer = (s.vehicle?.trailerPlate || "").toLowerCase();
    const driver = (
      s.driverName || `${s.driver?.firstName || ""} ${s.driver?.lastName || ""}`
    ).toLowerCase();
    const origin = (s.route?.origin || "").toLowerCase();
    const destination = (s.route?.destination || "").toLowerCase();
    const allocation = (s.order?.allocationNumber || "").toLowerCase();
    const grn = (s.agentReceiveVoucher || "").toLowerCase();
    const fpiv = (s.shipperIssueVoucher || "").toLowerCase();
    const ckrf = (s.CKRFCode || "").toLowerCase();
    const remark = (s.remark || "").toLowerCase();
    // Match what the user sees in the table (e.g. "May 19") so "May" finds all May rows
    const date = formatDate(s.dispatchDate).toLowerCase();
    return (
      plate.includes(q) ||
      trailer.includes(q) ||
      driver.includes(q) ||
      origin.includes(q) ||
      destination.includes(q) ||
      codeMatch(allocation, q) ||
      codeMatch(grn, q) ||
      codeMatch(fpiv, q) ||
      codeMatch(ckrf, q) ||
      remark.includes(q) ||
      date.includes(q)
    );
  });
});
const firstProductType = computed(() => shipments.value[0]?.productType || "");
const isInbound = computed(
  () =>
    firstProductType.value === "IN_BOUND" ||
    firstProductType.value === "SITE_TRANSFER",
);
const shipperName = computed(
  () => shipments.value[0]?.order?.shipper?.name || "Shipper",
);
const totalSumRaw = computed(() =>
  shipments.value.reduce((sum: number, s: any) => sum + (s.totalPrice || 0), 0),
);
const totalSum = computed(() => formatPrice(totalSumRaw.value));
const requestingMonth = computed(() => {
  const d =
    props.invoice?.paymentRequestedDate ||
    shipments.value[0]?.paymentDetail?.paymentRequestedDate;
  if (!d) return "-";
  return new Date(d).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
});

function formatPrice(val: number) {
  if (val == null) return "-";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}

function formatDate(date: string) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatVehicleType(name: string) {
  if (!name) return "-";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].toUpperCase();
  return parts
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function formatDriverName(name: string) {
  if (!name?.trim()) return "-";
  return name
    .trim()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}
</script>
