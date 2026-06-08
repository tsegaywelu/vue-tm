<template>
  <Teleport defer to="#page-actions">
    <template v-if="entry">
      <Button v-if="!entry.isVoided" variant="secondary" size="md" @click="router.push(`/fleet/vehicle-expenses/edit/${id}`)">
        Edit
      </Button>
      <Button v-if="!entry.isVoided" variant="destructive" size="md" @click="handleVoid">
        Void
      </Button>
      <Button v-if="entry.isVoided" variant="secondary" size="md" @click="handleCancelVoid">
        Cancel Void
      </Button>
    </template>
  </Teleport>

  <div v-if="isLoading" class="flex justify-center items-center py-20">
    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
  </div>

  <div v-else-if="entry" class="flex flex-col gap-8">
    <InfoWrapper title="General Information">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 py-2">
        <ShipmentDataLabel label="Vehicle" :value="entry.vehicle?.plateNumber" />
        <ShipmentDataLabel label="Expense Type" :value="entry.vehicleExpenseType?.name" />
        <ShipmentDataLabel label="Amount" :value="entry.amount != null ? currencyFormatter(entry.amount) : null" />
        <ShipmentDataLabel label="Date" :value="dateFormatter(entry.date)" />
        <ShipmentDataLabel label="Vendor" :value="entry.vendor" />
        <ShipmentDataLabel label="Reference No." :value="entry.reference" />
        <div class="flex flex-col gap-0.5">
          <span class="text-sm lg:text-base text-[#666D80]">Status</span>
          <span
            class="inline-block px-2 py-0.5 rounded-full text-xs font-bold uppercase w-fit"
            :class="entry.isVoided ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'"
          >{{ entry.isVoided ? 'Voided' : 'Active' }}</span>
        </div>
        <ShipmentDataLabel label="Created By" :value="entry.createdBy?.username" />
        <ShipmentDataLabel label="Created At" :value="dateFormatter(entry.createdAt)" />
      </div>
    </InfoWrapper>

    <InfoWrapper v-if="entry.notes" title="Notes">
      <p class="py-2 text-sm text-gray-700">{{ entry.notes }}</p>
    </InfoWrapper>

    <InfoWrapper v-if="entry.isVoided" title="Void Information">
      <div class="grid grid-cols-2 md:grid-cols-3 gap-6 py-2">
        <ShipmentDataLabel label="Void Reason" :value="entry.voidReason" class="col-span-2 md:col-span-1" />
        <ShipmentDataLabel label="Voided By" :value="entry.voidedBy?.username" />
        <ShipmentDataLabel label="Voided At" :value="dateFormatter(entry.voidedAt)" />
      </div>
    </InfoWrapper>

    <InfoWrapper v-if="entry.photos?.length" title="Photos">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 py-2">
        <a
          v-for="(photo, i) in entry.photos"
          :key="i"
          :href="`${API_URL}/${photo}`"
          target="_blank"
          class="aspect-square rounded-2xl overflow-hidden border border-grey-100 hover:opacity-90 transition-opacity"
        >
          <img :src="`${API_URL}/${photo}`" alt="Photo" class="w-full h-full object-cover" />
        </a>
      </div>
    </InfoWrapper>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { openModal } from "@customizer/modal-x";
import Button from "@/components/common/Button.vue";
import InfoWrapper from "@/modules/operation/components/shipment-details/InfoWrapper.vue";
import ShipmentDataLabel from "@/modules/operation/components/shipment-details/ShipmentDataLabel.vue";
import { fetch_vehicle_expense_by_id, void_vehicle_expense, cancel_void_vehicle_expense } from "../api/fleet.api";
import { useToastStore } from "@/store/toastStore";
import { currencyFormatter, dateFormatter } from "@/utils/utils";

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const queryClient = useQueryClient();
const id = route.params.id as string;
const API_URL = import.meta.env.VITE_API_URL;

const { data: response, isLoading, refetch } = useQuery({
  queryKey: ["vehicle-expense", id],
  queryFn: () => fetch_vehicle_expense_by_id(id),
  enabled: !!id,
});

const entry = computed(() => response.value?.data as any);

const voidMutation = useMutation({
  mutationFn: ({ entryId, reason }: { entryId: string; reason: string }) =>
    void_vehicle_expense(entryId, reason),
});

const cancelVoidMutation = useMutation({
  mutationFn: (entryId: string) => cancel_void_vehicle_expense(entryId),
});

const handleVoid = async () => {
  const confirmed = await openModal("VoidEntryModal", {
    entryId: id,
    voidFn: (entryId: string, reason: string) =>
      voidMutation.mutateAsync({ entryId, reason }),
  });
  if (confirmed) {
    queryClient.invalidateQueries({ queryKey: ["vehicle-expense-list"] });
    refetch();
  }
};

const handleCancelVoid = async () => {
  const confirmed = await openModal("ConfirmationModal", {
    title: "Cancel Void",
    message: "Are you sure you want to restore this expense entry?",
    confirmText: "Restore",
    cancelText: "Cancel",
  });
  if (confirmed) {
    const res = await cancelVoidMutation.mutateAsync(id);
    if (res.success) {
      toast.success("Expense entry restored");
      queryClient.invalidateQueries({ queryKey: ["vehicle-expense-list"] });
      refetch();
    } else {
      toast.error(res.error || "Failed to restore expense entry");
    }
  }
};
</script>
