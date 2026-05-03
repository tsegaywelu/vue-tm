<template>
  <div v-if="isLoading" class="flex justify-center py-10">
    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-brightBlue"></div>
  </div>
  <ExpenseTypeForm
    v-else-if="initialValues"
    form-id="edit-expense-type-form"
    :initial-values="initialValues"
    :on-submit="handleUpdate"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">
        Cancel
      </Button>
      <SubmitButton> Save Changes </SubmitButton>
    </template>
  </ExpenseTypeForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery, useMutation } from "@tanstack/vue-query";
import ExpenseTypeForm from "../../components/finance/ExpenseTypeForm.vue";
import { fetch_expense_type_details, update_expense_type } from "../../api/finance.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const id = route.params.id as string;

const { data: response, isLoading } = useQuery({
  queryKey: ["expense-type", id],
  queryFn: () => fetch_expense_type_details(id),
  enabled: !!id,
});

const initialValues = computed(() => {
  if (!response.value?.data) return null;
  
  // Mapping based on the provided backend response structure
  const data = response.value.data.result || response.value.data;
  
  return {
    name: data.name || "",
    typicalPrice: data.typicalPrice || "",
    description: data.description || "",
  };
});

const mutation = useMutation({
  mutationFn: (values: any) => update_expense_type(id, values),
});

const handleUpdate = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Expense type updated successfully");
      router.push("/finance/expense-types");
    } else {
      toast.error(res.error || "Failed to update expense type");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
