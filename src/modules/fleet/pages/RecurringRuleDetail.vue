<template>
  <Teleport defer to="#page-actions">
    <template v-if="rule">
      <Button variant="secondary" size="md" @click="router.push(`/fleet/recurring-rules/edit/${id}`)">
        Edit
      </Button>
      <Button
        v-if="rule.isActive"
        variant="destructive"
        size="md"
        :loading="pauseMutation.isPending.value"
        @click="handlePause"
      >
        Pause
      </Button>
      <Button
        v-else
        variant="primary"
        size="md"
        :loading="resumeMutation.isPending.value"
        @click="handleResume"
      >
        Resume
      </Button>
    </template>
  </Teleport>

  <div v-if="isLoading" class="flex justify-center items-center py-20">
    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
  </div>

  <div v-else-if="rule" class="flex flex-col gap-8">
    <InfoWrapper title="General Information">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 py-2">
        <ShipmentDataLabel label="Vehicle" :value="rule.vehicle?.plateNumber" />
        <ShipmentDataLabel label="Expense Type" :value="rule.vehicleExpenseType?.name" />
        <ShipmentDataLabel label="Amount" :value="rule.amount != null ? currencyFormatter(rule.amount) : null" />
        <div class="flex flex-col gap-0.5">
          <span class="text-sm lg:text-base text-[#666D80]">Status</span>
          <span
            class="inline-block px-2 py-0.5 rounded-full text-xs font-bold uppercase w-fit"
            :class="rule.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
          >{{ rule.isActive ? 'Active' : 'Paused' }}</span>
        </div>
      </div>
    </InfoWrapper>

    <InfoWrapper title="Schedule">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 py-2">
        <div class="flex flex-col gap-0.5">
          <span class="text-sm lg:text-base text-[#666D80]">Frequency</span>
          <span
            class="inline-block px-2 py-0.5 rounded-full text-xs font-bold uppercase w-fit"
            :class="{
              'bg-blue-100 text-blue-700': rule.frequency === 'DAILY',
              'bg-purple-100 text-purple-700': rule.frequency === 'WEEKLY',
              'bg-orange-100 text-orange-700': rule.frequency === 'MONTHLY',
            }"
          >{{ rule.frequency }}</span>
        </div>
        <ShipmentDataLabel label="Interval" :value="rule.interval != null ? String(rule.interval) : null" />
        <ShipmentDataLabel label="Start Date" :value="dateFormatter(rule.startDate)" />
        <ShipmentDataLabel label="End Date" :value="rule.endDate ? dateFormatter(rule.endDate) : 'No End Date'" />
        <ShipmentDataLabel label="Next Run At" :value="rule.nextRunAt ? dateFormatter(rule.nextRunAt) : null" />
        <div class="flex flex-col gap-0.5">
          <span class="text-sm lg:text-base text-[#666D80]">Auto-Post</span>
          <span
            class="inline-block px-2 py-0.5 rounded-full text-xs font-bold uppercase w-fit"
            :class="rule.autopost ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
          >{{ rule.autopost ? 'Yes' : 'No' }}</span>
        </div>
      </div>
    </InfoWrapper>

    <InfoWrapper title="Additional Details">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 py-2">
        <ShipmentDataLabel label="Vendor" :value="rule.vendor" />
        <ShipmentDataLabel label="Reference No." :value="rule.reference" />
        <ShipmentDataLabel label="Created By" :value="rule.createdBy?.username" />
        <ShipmentDataLabel label="Created At" :value="dateFormatter(rule.createdAt)" />
      </div>
    </InfoWrapper>

    <InfoWrapper v-if="rule.notes" title="Notes">
      <p class="py-2 text-sm text-gray-700">{{ rule.notes }}</p>
    </InfoWrapper>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import Button from "@/components/common/Button.vue";
import InfoWrapper from "@/modules/operation/components/shipment-details/InfoWrapper.vue";
import ShipmentDataLabel from "@/modules/operation/components/shipment-details/ShipmentDataLabel.vue";
import { fetch_recurring_rule_by_id, pause_recurring_rule, resume_recurring_rule } from "../api/fleet.api";
import { useToastStore } from "@/store/toastStore";
import { currencyFormatter, dateFormatter } from "@/utils/utils";

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const queryClient = useQueryClient();
const id = route.params.id as string;

const { data: response, isLoading, refetch } = useQuery({
  queryKey: ["recurring-rule", id],
  queryFn: () => fetch_recurring_rule_by_id(id),
  enabled: !!id,
});

const rule = computed(() => response.value?.data as any);

const pauseMutation = useMutation({
  mutationFn: (ruleId: string) => pause_recurring_rule(ruleId),
});

const resumeMutation = useMutation({
  mutationFn: (ruleId: string) => resume_recurring_rule(ruleId),
});

const refresh = () => {
  queryClient.invalidateQueries({ queryKey: ["recurring-rule-list"] });
  refetch();
};

const handlePause = async () => {
  const res = await pauseMutation.mutateAsync(id);
  if (res.success) {
    toast.success("Rule paused");
    refresh();
  } else {
    toast.error(res.error || "Failed to pause rule");
  }
};

const handleResume = async () => {
  const res = await resumeMutation.mutateAsync(id);
  if (res.success) {
    toast.success("Rule resumed");
    refresh();
  } else {
    toast.error(res.error || "Failed to resume rule");
  }
};
</script>
