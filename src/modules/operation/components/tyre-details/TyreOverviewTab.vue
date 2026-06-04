<template>
  <div class="flex flex-col gap-4">
    <div
      class="rounded-2xl px-0 md:px-3 md:py-4 bg-surface flex flex-col gap-6 md:shadow-sm md:border border-gray-100"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <InfoWrapper title="General Information">
          <div class="flex flex-col gap-4">
            <TyreDataLabel label="Serial Number" :value="tyre?.serialNumber" />
            <TyreDataLabel label="Brand" :value="tyre?.brand" />
            <TyreDataLabel label="Type" :value="tyre?.type" />
            <TyreDataLabel
              label="Price"
              :value="tyre?.price ? currencyFormatter(tyre.price) : '-'"
            />
          </div>
        </InfoWrapper>

        <InfoWrapper title="Vehicle & Position">
          <div class="flex flex-col gap-4">
            <TyreDataLabel
              label="Vehicle Plate"
              :value="tyre?.vehicle?.plateNumber"
            />
            <TyreDataLabel
              label="Is Trailer"
              :value="tyre?.trailer ? 'Yes' : 'No'"
            />
            <TyreDataLabel
              label="Position"
              :value="formatStatus(tyre?.tyrePosition)"
            />
          </div>
        </InfoWrapper>

        <InfoWrapper title="Technical Details">
          <div class="flex flex-col gap-4">
            <TyreDataLabel label="Standard (KM)" :value="tyre?.tyreStandard" />
            <TyreDataLabel label="Tread Depth" :value="tyre?.treadDepth" />
            <TyreDataLabel label="TPI" :value="tyre?.TPI" />
            <TyreDataLabel label="Pressure" :value="tyre?.pressure" />
          </div>
        </InfoWrapper>

        <InfoWrapper title="Installation Information">
          <div class="flex flex-col gap-4">
            <TyreDataLabel
              label="Installation Date"
              :value="
                tyre?.installationDate
                  ? dateFormatter(tyre.installationDate)
                  : '-'
              "
            />
            <TyreDataLabel
              label="Installation Mileage"
              :value="tyre?.installationMileage"
            />
          </div>
        </InfoWrapper>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InfoWrapper from "./InfoWrapper.vue";
import TyreDataLabel from "./TyreDataLabel.vue";
import { currencyFormatter, dateFormatter } from "@/utils/utils";

defineProps<{
  tyre?: any;
}>();

const formatStatus = (status?: string) => {
  if (!status) return "-";
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};
</script>
