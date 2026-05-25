<template>
  <ExpenseTypeForm
    form-id="add-expense-type-form"
    :initial-values="initialValues"
    :on-submit="handleCreate"
  >
    <template #submit-btn="{ form }">
      <Button size="md" variant="outline" @click="form.reset()">
        Discard Changes
      </Button>
      <SubmitButton> Create Expense Type </SubmitButton>
    </template>
  </ExpenseTypeForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMutation } from "@tanstack/vue-query";
import ExpenseTypeForm from "../../components/finance/ExpenseTypeForm.vue";
import { create_expense_type } from "../../api/finance.api";
import { useToastStore } from "@/store/toastStore";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { useQueryClient } from "@tanstack/vue-query";

const router = useRouter();
const toast = useToastStore();
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: (values: any) => create_expense_type(values),
});

const initialValues = {
  name: "",
  typicalPrice: "",
  description: "",
  scope: "BOTH",
};

const handleCreate = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Expense type created successfully");
      //invalidate query
      queryClient.invalidateQueries({ queryKey: ["expense-type-list"] });
      router.push("/finance/expense-types");
    } else {
      toast.error(res.error || "Failed to create expense type");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
