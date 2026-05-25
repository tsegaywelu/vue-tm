<template>
  <div v-if="isLoading" class="flex justify-center py-10">
    <i class="mdi mdi-loading mdi-spin text-4xl text-primary"></i>
  </div>
  <RecurringRuleForm
    v-else-if="initialValues"
    form-id="edit-recurring-rule-form"
    :initial-values="initialValues"
    :labels="labels"
    :on-submit="handleUpdate"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">
        Cancel
      </Button>
      <SubmitButton>Save Changes</SubmitButton>
    </template>
  </RecurringRuleForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import RecurringRuleForm from "../components/RecurringRuleForm.vue";
import { fetch_recurring_rule_by_id, update_recurring_rule } from "../api/fleet.api";
import { useToastStore } from "@/store/toastStore";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const queryClient = useQueryClient();
const id = route.params.id as string;

const { data: response, isLoading } = useQuery({
  queryKey: ["recurring-rule", id],
  queryFn: () => fetch_recurring_rule_by_id(id),
  enabled: !!id,
});

const rule = computed(() => response.value?.data as any);

const initialValues = computed(() => {
  if (!rule.value) return null;
  const r = rule.value;
  return {
    vehicle: typeof r.vehicle === "object" ? r.vehicle._id : r.vehicle,
    vehicleExpenseType: typeof r.vehicleExpenseType === "object" ? r.vehicleExpenseType._id : r.vehicleExpenseType,
    amount: r.amount ?? "",
    frequency: r.frequency || "MONTHLY",
    interval: r.interval ?? 1,
    startDate: r.startDate || "",
    endDate: r.endDate || "",
    autopost: r.autopost || false,
    notes: r.notes || "",
    vendor: r.vendor || "",
    reference: r.reference || "",
  };
});

const labels = computed(() => {
  if (!rule.value) return {};
  const r = rule.value;
  return {
    vehicle: typeof r.vehicle === "object" ? r.vehicle.plateNumber : "",
    vehicleExpenseType: typeof r.vehicleExpenseType === "object" ? r.vehicleExpenseType.name : "",
  };
});

const mutation = useMutation({
  mutationFn: (data: Record<string, any>) => update_recurring_rule(id, data),
});

const handleUpdate = async (payload: Record<string, any>) => {
  const res = await mutation.mutateAsync(payload);
  if (res.success) {
    toast.success("Recurring rule updated successfully");
    queryClient.invalidateQueries({ queryKey: ["recurring-rule-list"] });
    queryClient.invalidateQueries({ queryKey: ["recurring-rule", id] });
    router.push("/fleet/recurring-rules");
  } else {
    toast.error(res.error || "Failed to update recurring rule");
  }
};
</script>
