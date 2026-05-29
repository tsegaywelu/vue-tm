<template>
  <VehicleExpenseForm
    form-id="add-vehicle-expense-form"
    :initial-values="initialValues"
    :on-submit="handleCreate"
  >
    <template #submit-btn="{ form }">
      <Button size="md" variant="outline" @click="form.reset()">
        Discard Changes
      </Button>
      <SubmitButton>Save Expense</SubmitButton>
    </template>
  </VehicleExpenseForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import VehicleExpenseForm from "../components/VehicleExpenseForm.vue";
import { create_vehicle_expense } from "../api/fleet.api";
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
  date: "",
};

const mutation = useMutation({
  mutationFn: (data: FormData) => create_vehicle_expense(data),
});

const handleCreate = async (formData: FormData) => {
  const res = await mutation.mutateAsync(formData);
  if (res.success) {
    toast.success("Vehicle expense created successfully");
    queryClient.invalidateQueries({ queryKey: ["vehicle-expense-list"] });
    router.push("/fleet/vehicle-expenses");
  } else {
    toast.error(res.error || "Failed to create vehicle expense");
  }
};
</script>
