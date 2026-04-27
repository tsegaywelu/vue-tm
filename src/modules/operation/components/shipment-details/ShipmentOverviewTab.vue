<template>
  <div class="flex flex-col gap-4">
    <div
      class="rounded-2xl px-3 md:px-5 py-4 bg-white flex flex-col gap-6 shadow-sm border border-gray-100"
    >
      <!-- Top Grid for Trip, Equipment, Contact Info -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-17">
        <!-- Trip Info -->
        <InfoWrapper title="Trip Information">
          <div class="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-2.5">
            <div class="flex items-center gap-2">
              <i
                v-html="icons.shippingRoute"
                class="shrink-0 *:h-[108px] *:w-[22px]"
              />
              <div class="h-[108px] flex flex-col justify-between">
                <div className="flex flex-col">
                  <span class="text-base lg:text-lg font-semibold">
                    {{ shipment?.route?.origin || "Unknown" }}, ET
                  </span>
                  <span className="text-xs lg:text-sm text-grey-500">
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
          <div class="grid grid-cols-3 px-2">
            <ShipmentDataLabel
              label="Waypoint"
              :value="shipment?.waypoint.name"
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

        <!-- Equipment Info -->
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

        <!-- Contact Information -->
        <InfoWrapper title="Contact Information">
          <div class="flex flex-col gap-4">
            <ShipmentDataLabel
              label="Shipper Name"
              :value="shipment?.shipper?.name"
            />
            <ShipmentDataLabel label="Driver Name" :value="driverFullName" />
            <ShipmentDataLabel
              label="Driver Phone"
              :value="shipment?.driver?.phoneNumber"
            />
            <ShipmentDataLabel
              label="Carrier"
              :value="shipment?.carrier?.name"
            />
          </div>
        </InfoWrapper>
      </div>

      <!-- Booking and Rating / Additional Information -->
      <InfoWrapper title="Booking & Financial Information">
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
              label="Vehicle Ownership"
              :value="shipment?.vehicle?.ownership"
            />
            <ShipmentDataLabel
              label="Plate Number"
              :value="shipment?.vehicle?.plateNumber"
            />
            <ShipmentDataLabel
              label="Trailer Plate"
              :value="shipment?.vehicle?.trailerPlate || '-'"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Shipment } from "../../operation.types";
import InfoWrapper from "./InfoWrapper.vue";
import ShipmentDataLabel from "./ShipmentDataLabel.vue";
import { icons } from "@/utils/icons";
import {
  numberFormatter,
  currencyFormatter,
  dateFormatter,
} from "@/utils/utils";

const props = defineProps<{
  shipment?: Shipment;
}>();

const driverFullName = computed(() => {
  if (!props.shipment?.driver) return "-";
  const { firstName, middleName, lastName } = props.shipment.driver;
  return [firstName, middleName, lastName].filter(Boolean).join(" ") || "-";
});

const formatStatus = (status?: string) => {
  if (!status) return "-";
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const formatPricing = (type?: string) => {
  if (type === "per_quintal") return "Per Quintal";
  if (type === "per_kilometer") return "Per Kilometer";
  return formatStatus(type);
};
</script>
