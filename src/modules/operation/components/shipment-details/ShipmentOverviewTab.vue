<template>
  <div class="flex flex-col gap-4">
    <div
      class="rounded-2xl px-3 md:px-5 py-4 bg-white flex flex-col gap-6 shadow-sm border border-gray-100"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        <InfoWrapper title="Trip Information">
          <div
            class="flex flex-col justify-between lg:grid lg:grid-cols-2 gap-6 lg:gap-2.5"
          >
            <div class="flex items-center gap-2">
              <i
                v-html="icons.shippingRoute"
                class="shrink-0 *:h-[108px] *:w-[22px]"
              />
              <div class="h-[108px] flex flex-col justify-between">
                <div class="flex flex-col">
                  <span class="text-base lg:text-lg font-semibold">
                    {{ shipment?.route?.origin || "Unknown" }}, ET
                  </span>
                  <span class="text-xs lg:text-sm text-grey-500">
                    {{
                      shipment?.dispatchDate
                        ? dateFormatter(shipment?.dispatchDate)
                        : ""
                    }}
                  </span>
                </div>
                <span class="font-semibold text-base lg:text-lg">
                  {{ shipment?.route?.destination || "Unknown" }}, ET
                </span>
              </div>
            </div>
            <div
              class="flex flex-row lg:flex-col gap-4 justify-between lg:justify-center items-center lg:items-end"
            >
              <span class="font-semibold text-xl">
                {{ numberFormatter(shipment?.waypointDistance || 0) }} km
              </span>
            </div>
          </div>
          <div class="grid border-t py-4 mt-4 border-gray-200 grid-cols-3 px-2">
            <ShipmentDataLabel
              label="Waypoint"
              :value="shipment?.waypoint?.name"
            />
            <ShipmentDataLabel
              label="Distance"
              :value="numberFormatter(shipment?.waypointDistance || 0) + ' km'"
            />
            <ShipmentDataLabel
              label="Vehicle Type"
              :value="shipment?.vehicleType?.name"
            />
          </div>
        </InfoWrapper>
        <InfoWrapper title="Additional Information">
          <div class="flex flex-col gap-4">
            <ShipmentDataLabel
              label="Product Type"
              :value="formatStatus(shipment?.productType)"
            />
            <ShipmentDataLabel
              label="Commodity"
              :value="shipment?.commodity?.map((c) => c.name).join(', ') || '-'"
            />
            <ShipmentDataLabel
              label="Packaging"
              :value="shipment?.packaging?.name"
            />
            <ShipmentDataLabel
              label="Pricing Type"
              :value="formatPricing(shipment?.pricingType?.type)"
            />
          </div>
        </InfoWrapper>
        <InfoWrapper title="Vouchers">
          <div class="flex flex-col gap-4">
            <div class="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100">
              <ShipmentDataLabel
                label="Vehicle Shipper Issue"
                :value="shipment?.shipperIssueVoucher"
              />
              <ShipmentDataLabel
                label="Agent Receive"
                :value="shipment?.agent?.name || '-'"
              />
            </div>
          </div>
        </InfoWrapper>

        <InfoWrapper class="col-span-3" title="Shipment Status Timeline">
          <div class="flex flex-wrap items-center gap-y-8 gap-x-0 px-2 py-4">
            <template
              v-for="(item, index) in statusTimeline"
              :key="item.status"
            >
              <!-- Timeline Item -->
              <div
                class="relative flex flex-col gap-2 p-4 rounded-2xl border-2 transition-all min-w-[180px] z-10"
                :class="
                  index === statusTimeline.length - 1
                    ? 'border-blue-500 bg-blue-50/30 shadow-md ring-4 ring-blue-50'
                    : 'border-gray-100 bg-white shadow-sm'
                "
              >
                <div class="flex items-center gap-2">
                  <div
                    class="size-2.5 rounded-full"
                    :class="
                      index === statusTimeline.length - 1
                        ? 'bg-blue-600 animate-pulse'
                        : 'bg-green-500'
                    "
                  ></div>
                  <span
                    class="text-[10px] text-gray-500 font-bold uppercase tracking-wider"
                  >
                    {{ formatStatus(item.status) }}
                  </span>
                </div>
                <span v-if="item.time" class="text-xs font-bold text-gray-900">
                  {{ dateTimeFormatter(item.time) }}
                </span>
              </div>

              <!-- Connecting Line -->
              <div
                v-if="index < statusTimeline.length - 1"
                class="h-0.5 w-10 min-w-[20px] bg-gray-200"
              ></div>
            </template>
          </div>
        </InfoWrapper>

        <InfoWrapper class="col-span-2" title="Invoice Information">
          <div
            class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 px-2.5 py-2"
          >
            <div class="flex flex-col gap-4">
              <ShipmentDataLabel
                label="Pricing Type"
                :value="formatPricing(shipment?.pricingType?.type)"
              />
              <ShipmentDataLabel
                label="Rate Amount"
                :value="currencyFormatter(shipment?.pricingType?.amount || 0)"
              />
              <ShipmentDataLabel
                label="Total Price"
                :value="currencyFormatter(shipment?.totalPrice || 0)"
              />
            </div>

            <div class="flex flex-col gap-4">
              <ShipmentDataLabel
                label="Payment Status"
                :value="shipment?.paymentDetail?.paymentStatus || '-'"
              />
              <ShipmentDataLabel
                label="Transporter Price"
                :value="
                  shipment?.transporterPrice
                    ? currencyFormatter(Number(shipment?.transporterPrice))
                    : '-'
                "
              />
            </div>
            <div class="flex flex-col gap-4">
              <ShipmentDataLabel
                label="Product Type"
                :value="formatStatus(shipment?.productType)"
              />
              <ShipmentDataLabel
                label="Trip Type"
                :value="formatStatus(shipment?.tripType)"
              />
              <ShipmentDataLabel
                label="Order Code"
                :value="shipment?.orderCode"
              />
            </div>
          </div>
        </InfoWrapper>
        <InfoWrapper title="Vehicle Information">
          <div class="flex flex-col gap-4 px-4">
            <div class="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100">
              <ShipmentDataLabel
                label="Plate Number"
                :value="shipment?.vehicle?.plateNumber"
              />
              <ShipmentDataLabel
                label="Trailer Plate"
                :value="shipment?.vehicle?.trailerPlate || '-'"
              />
              <ShipmentDataLabel
                label="Vehicle Ownership"
                :value="shipment?.vehicle?.ownership"
              />
            </div>
            <div class="grid grid-cols-1 gap-4">
              <ShipmentDataLabel
                label="Odometer at Dispatch"
                :value="numberFormatter(shipment?.odometerAtDispatch || 0)"
              />
              <ShipmentDataLabel
                label="Fuel Reading at Dispatch"
                :value="shipment?.fuelReadingAtDispatch + ' L'"
              />
              <ShipmentDataLabel
                label="Dispatch Weight"
                :value="numberFormatter(shipment?.dispatchWeight || 0) + ' Q'"
              />
            </div>
          </div>
        </InfoWrapper>

        <!-- Driver & Transporter Info Section -->
        <InfoWrapper class="col-span-3" title="Driver & Transporter Information">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 px-2 py-2">
            <!-- Driver Sub-section -->
            <div class="flex flex-col gap-4">
              <div class="flex items-center gap-4 pb-3 border-b border-gray-50">
                <div
                  class="size-12 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center font-bold text-lg border border-primary-100 shadow-sm"
                >
                  {{
                    shipment?.driver?.firstName?.charAt(0) || ""
                  }}{{
                    shipment?.driver?.lastName?.charAt(0) || ""
                  }}
                </div>
                <div class="flex flex-col">
                  <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Assigned Driver</span>
                  <span class="text-base font-bold text-gray-900">{{ driverFullName }}</span>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <ShipmentDataLabel
                  label="Phone Number"
                  :value="shipment?.driver?.phoneNumber"
                />
                <ShipmentDataLabel
                  label="License Number"
                  :value="shipment?.driver?.licenseNumber"
                />
              </div>
            </div>

            <!-- Transporter Sub-section -->
            <div class="flex flex-col gap-4 border-l-0 md:border-l md:pl-8 border-gray-100">
              <div class="flex items-center gap-4 pb-3 border-b border-gray-50">
                <div
                  class="size-12 rounded-full bg-orange-50 text-orange-700 flex items-center justify-center border border-orange-100 shadow-sm"
                >
                  <i class="mdi mdi-office-building text-2xl"></i>
                </div>
                <div class="flex flex-col">
                  <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Transporter / Carrier</span>
                  <span class="text-base font-bold text-gray-900">{{ shipment?.transporter?.name || shipment?.transporter?.tradeName || "-" }}</span>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <ShipmentDataLabel
                  label="Contact Phone"
                  :value="shipment?.transporter?.phoneNumber"
                />
                <ShipmentDataLabel
                  label="Trade Name"
                  :value="shipment?.transporter?.tradeName"
                />
              </div>
            </div>
          </div>
        </InfoWrapper>
      </div>
    </div>

    <InfoWrapper title="Driver Performance by Status Source" v-if="report">
      <DriverPerformanceReport :report="report" />
    </InfoWrapper>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "@/store/authStore";
import { ShipmentStatus, type Shipment } from "../../operation.types";
import InfoWrapper from "./InfoWrapper.vue";
import ShipmentDataLabel from "./ShipmentDataLabel.vue";
import { icons } from "@/utils/icons";

const authStore = useAuthStore();
const isShipper = computed(() => authStore.is_shipper);
import {
  numberFormatter,
  currencyFormatter,
  dateFormatter,
  dateTimeFormatter,
  formatStatus,
  formatPricing,
} from "@/utils/utils";
import { useQuery } from "@tanstack/vue-query";
import { fetch_status_source_report } from "../../api/shipment.api";
import DriverPerformanceReport from "./DriverPerformanceReport.vue";

const props = defineProps<{
  shipment?: Shipment;
}>();

const driverFullName = computed(() => {
  if (!props.shipment?.driver) return "-";
  const { firstName, middleName, lastName } = props.shipment.driver;
  return [firstName, middleName, lastName].filter(Boolean).join(" ") || "-";
});

const statusTimeline = computed(() => {
  if (!props.shipment?.statusTime) return [];

  // Show only statuses that have an associated timestamp
  return Object.values(ShipmentStatus)
    .filter((status) => {
      const newName = (status + "Time").replace(/_(.)/g, (_, c) =>
        c.toUpperCase(),
      );
      return props.shipment?.statusTime[
        newName as keyof typeof props.shipment.statusTime
      ];
    })
    .map((status) => ({
      status,
      time: props.shipment?.statusTime[
        (status + "Time").replace(/_(.)/g, (_, c) =>
          c.toUpperCase(),
        ) as keyof typeof props.shipment.statusTime
      ],
    }));
});

const { data: reportResponse } = useQuery({
  queryKey: ["shipment-status-source-report", computed(() => props.shipment?._id)],
  queryFn: () => fetch_status_source_report(props.shipment!._id),
  enabled: computed(() => !!props.shipment?._id),
});

const report = computed(() => reportResponse.value?.data);
</script>
