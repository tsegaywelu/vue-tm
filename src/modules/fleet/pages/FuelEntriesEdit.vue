<template>
  <div v-if="isLoading" class="flex justify-center py-10">
    <i class="mdi mdi-loading mdi-spin text-4xl text-primary"></i>
  </div>
  <FuelEntryForm
    v-else-if="initialValues"
    form-id="edit-fuel-entry-form"
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
  </FuelEntryForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import FuelEntryForm from "../components/FuelEntryForm.vue";
import { fetch_fuel_entry_by_id, update_fuel_entry } from "../api/fleet.api";
import { useToastStore } from "@/store/toastStore";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const queryClient = useQueryClient();
const id = route.params.id as string;

const { data: response, isLoading } = useQuery({
  queryKey: ["fuel-entry", id],
  queryFn: () => fetch_fuel_entry_by_id(id),
  enabled: !!id,
});

const entry = computed(() => response.value?.data as any);

const initialValues = computed(() => {
  if (!entry.value) return null;
  const e = entry.value;
  return {
    vehicle: typeof e.vehicle === "object" ? e.vehicle._id : e.vehicle,
    date: e.date || "",
    odometer: e.odometer ?? "",
    quantity: e.quantity ?? "",
    unitPrice: e.unitPrice ?? "",
    amount: e.amount ?? "",
    vendor: e.vendor || "",
    reference: e.reference || "",
    usageType: e.usageType || "",
    comment: e.comment || "",
  };
});

const labels = computed(() => {
  if (!entry.value) return {};
  const e = entry.value;
  return {
    vehicle: typeof e.vehicle === "object" ? e.vehicle.plateNumber : "",
  };
});

const mutation = useMutation({
  mutationFn: (data: FormData) => update_fuel_entry(id, data),
});

const handleUpdate = async (formData: FormData) => {
  const res = await mutation.mutateAsync(formData);
  if (res.success) {
    toast.success("Fuel entry updated successfully");
    queryClient.invalidateQueries({ queryKey: ["fuel-entry-list"] });
    queryClient.invalidateQueries({ queryKey: ["fuel-entry", id] });
    router.push("/fleet/fuel-entries");
  } else {
    toast.error(res.error || "Failed to update fuel entry");
  }
};
</script>
