<template>
  <div v-if="isLoading" class="flex justify-center py-10">
    <i class="mdi mdi-loading mdi-spin text-4xl text-primary"></i>
  </div>
  <VehicleExpenseForm
    v-else-if="initialValues"
    form-id="edit-vehicle-expense-form"
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
  </VehicleExpenseForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import VehicleExpenseForm from "../components/VehicleExpenseForm.vue";
import { fetch_vehicle_expense_by_id, update_vehicle_expense } from "../api/fleet.api";
import { useToastStore } from "@/store/toastStore";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const queryClient = useQueryClient();
const id = route.params.id as string;

const { data: response, isLoading } = useQuery({
  queryKey: ["vehicle-expense", id],
  queryFn: () => fetch_vehicle_expense_by_id(id),
  enabled: !!id,
});

const entry = computed(() => response.value?.data as any);

const initialValues = computed(() => {
  if (!entry.value) return null;
  const e = entry.value;
  return {
    vehicle: typeof e.vehicle === "object" ? e.vehicle._id : e.vehicle,
    vehicleExpenseType: typeof e.vehicleExpenseType === "object" ? e.vehicleExpenseType._id : e.vehicleExpenseType,
    amount: e.amount ?? "",
    date: e.date || "",
    notes: e.notes || "",
    vendor: e.vendor || "",
    reference: e.reference || "",
  };
});

const labels = computed(() => {
  if (!entry.value) return {};
  const e = entry.value;
  return {
    vehicle: typeof e.vehicle === "object" ? e.vehicle.plateNumber : "",
    vehicleExpenseType: typeof e.vehicleExpenseType === "object" ? e.vehicleExpenseType.name : "",
  };
});

const mutation = useMutation({
  mutationFn: (data: FormData) => update_vehicle_expense(id, data),
});

const handleUpdate = async (formData: FormData) => {
  const res = await mutation.mutateAsync(formData);
  if (res.success) {
    toast.success("Vehicle expense updated successfully");
    queryClient.invalidateQueries({ queryKey: ["vehicle-expense-list"] });
    queryClient.invalidateQueries({ queryKey: ["vehicle-expense", id] });
    router.push("/fleet/vehicle-expenses");
  } else {
    toast.error(res.error || "Failed to update vehicle expense");
  }
};
</script>
