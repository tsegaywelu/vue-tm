<template>
  <RecurringRuleForm
    form-id="add-recurring-rule-form"
    :initial-values="initialValues"
    :on-submit="handleCreate"
  >
    <template #submit-btn="{ form }">
      <Button size="md" variant="outline" @click="form.reset()">
        Discard Changes
      </Button>
      <SubmitButton>Save Rule</SubmitButton>
    </template>
  </RecurringRuleForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import RecurringRuleForm from "../components/RecurringRuleForm.vue";
import { create_recurring_rule } from "../api/fleet.api";
import { useToastStore } from "@/store/toastStore";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";

const router = useRouter();
const toast = useToastStore();
const queryClient = useQueryClient();

const initialValues = {
  vehicle: "",
  vehicleExpenseType: "",
  amount: "",
  frequency: "MONTHLY",
  interval: 1,
  startDate: "",
  autopost: false,
};

const mutation = useMutation({
  mutationFn: (data: Record<string, any>) => create_recurring_rule(data),
});

const handleCreate = async (payload: Record<string, any>) => {
  const res = await mutation.mutateAsync(payload);
  if (res.success) {
    toast.success("Recurring rule created successfully");
    queryClient.invalidateQueries({ queryKey: ["recurring-rule-list"] });
    router.push("/fleet/recurring-rules");
  } else {
    toast.error(res.error || "Failed to create recurring rule");
  }
};
</script>
