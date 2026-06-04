<template>
  <Teleport defer to="#page-actions">
    <div class="flex gap-2">
      <Button
        v-if="infraction?.status === 'pending'"
        variant="outline"
        size="md"
        @click="handleApprove"
        :loading="statusMutation.isPending.value"
      >
        Approve
      </Button>
      <Button
        v-if="infraction?.status === 'pending'"
        variant="outline"
        size="md"
        @click="handleReject"
        :loading="statusMutation.isPending.value"
      >
        Reject
      </Button>
      <Button
        v-if="infraction?.status === 'approved'"
        variant="outline"
        size="md"
        @click="handleMarkAsPaid"
        :loading="statusMutation.isPending.value"
      >
        Mark as Paid
      </Button>
    </div>
  </Teleport>

  <div class="flex flex-col gap-8">
    <div v-if="isLoading" class="flex justify-center p-8">
      <i class="w-10 h-10 animate-spin text-primary mdi mdi-loading"></i>
    </div>

    <template v-else-if="infraction">
      <!-- Overview Section -->
      <InfoWrapper title="Infraction Overview">
        <template #title-extra>
          <span
            class="px-2.5 py-1 text-xs font-semibold rounded-full capitalize border"
            :class="
              statusStyles[infraction?.status as string] ||
              'bg-grey-100 text-grey-700'
            "
          >
            {{ infraction?.status || "Pending" }}
          </span>
        </template>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 py-2">
          <ShipmentDataLabel
            label="Date"
            :value="dateFormatter(infraction.createdAt)"
          />
          <ShipmentDataLabel
            label="Driver Name"
            :value="
              infraction.driverData?.name ||
              infraction.driverData?.firstName ||
              '-'
            "
          />
          <ShipmentDataLabel
            label="Shipment Code"
            :value="infraction.shipment?.shipmentCode || '-'"
          />
          <ShipmentDataLabel
            label="Total Fine"
            :value="
              currencyFormatter(
                infraction.totalFine || infraction.totalAmount || 0,
              )
            "
            is-bold
          />
        </div>
      </InfoWrapper>

      <!-- Details Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InfoWrapper title="Context Information">
          <div class="grid grid-cols-2 gap-6">
            <ShipmentDataLabel label="Location" :value="infraction.location" />
            <ShipmentDataLabel
              label="Notes"
              :value="infraction.notes || 'No remarks provided'"
            />
          </div>
        </InfoWrapper>
      </div>

      <!-- Infraction Items Details -->
      <div v-if="infraction.items?.length" class="mt-4">
        <h3 class="text-lg font-bold text-gray-900 mb-4">
          Offense & Penalty Breakdown
        </h3>
        <div
          class="overflow-hidden border border-grey-100 rounded-2xl bg-surface"
        >
          <table class="min-w-full divide-y divide-grey-100 text-sm">
            <thead class="bg-grey-50 text-grey-700 font-semibold text-left">
              <tr>
                <th class="px-6 py-3">Reason / Description</th>
                <th class="px-6 py-3">Notes</th>
                <th class="px-6 py-3 text-right">Penalty / Fine</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-grey-100 text-grey-600">
              <tr v-for="(item, index) in infraction.items" :key="index">
                <td class="px-6 py-4 font-medium text-grey-900">
                  {{ item.title || item.reason || "Offense Penalty" }}
                </td>
                <td class="px-6 py-4">{{ item.description || "-" }}</td>
                <td class="px-6 py-4 text-right font-bold text-grey-900">
                  {{ currencyFormatter(item.fine || item.penaltyAmount || 0) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useQuery, useMutation } from "@tanstack/vue-query";
import {
  fetch_infraction_by_id,
  update_infraction_status,
} from "../api/infraction.api";
import InfoWrapper from "../components/shipment-details/InfoWrapper.vue";
import ShipmentDataLabel from "../components/shipment-details/ShipmentDataLabel.vue";
import Button from "@/components/common/Button.vue";
import { currencyFormatter, dateFormatter } from "@/utils/utils";
import { useToastStore } from "@/store/toastStore";
import { openModal } from "@customizer/modal-x";

const route = useRoute();
const toast = useToastStore();
const infractionId = computed(() => route.params.id as string);

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-600 border border-amber-100",
  approved: "bg-green-50 text-green-600 border border-green-100",
  paid: "bg-blue-50 text-blue-600 border border-blue-100",
  rejected: "bg-red-50 text-red-600 border border-red-100",
};

const {
  data: response,
  isLoading,
  refetch,
} = useQuery({
  queryKey: ["infraction-details", infractionId.value],
  queryFn: () => fetch_infraction_by_id(infractionId.value),
  enabled: !!infractionId.value,
});

const infraction = computed(() => response.value?.data);

const statusMutation = useMutation({
  mutationFn: ({ action, data }: { action: string; data?: any }) =>
    update_infraction_status(infractionId.value, action, data),
  onSuccess: () => {
    toast.success("Infraction status updated successfully");
    refetch();
  },
  onError: (error: any) => {
    toast.error(error.response?.data?.description || "Failed to update status");
  },
});

const handleApprove = async () => {
  const res = await openModal("ConfirmationModal", {
    title: "Approve Infraction",
    message: "Are you sure you want to approve this infraction offense report?",
    confirmLabel: "Approve",
    onConfirm: () => statusMutation.mutate({ action: "approve" }),
  });
};

const handleReject = () => {
  openModal("ConfirmationModal", {
    title: "Reject Infraction",
    message: "Are you sure you want to reject this infraction report?",
    confirmLabel: "Reject",
    onConfirm: () => statusMutation.mutate({ action: "reject" }),
  });
};

const handleMarkAsPaid = () => {
  openModal("ConfirmationModal", {
    title: "Mark as Paid",
    message: "Are you sure you want to mark this infraction penalty as paid?",
    confirmLabel: "Paid",
    onConfirm: () => statusMutation.mutate({ action: "paid" }),
  });
};
</script>
