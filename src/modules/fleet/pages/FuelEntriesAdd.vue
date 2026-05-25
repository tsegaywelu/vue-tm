<template>
  <FuelEntryForm
    form-id="add-fuel-entry-form"
    :initial-values="initialValues"
    :on-submit="handleCreate"
  >
    <template #submit-btn="{ form }">
      <Button size="md" variant="outline" @click="form.reset()">
        Discard Changes
      </Button>
      <SubmitButton>Save Fuel Entry</SubmitButton>
    </template>
  </FuelEntryForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import FuelEntryForm from "../components/FuelEntryForm.vue";
import { create_fuel_entry } from "../api/fleet.api";
import { useToastStore } from "@/store/toastStore";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";

const router = useRouter();
const toast = useToastStore();
const queryClient = useQueryClient();

const initialValues = {
  vehicle: "",
  date: "",
  usageType: "BUSINESS",
};

const mutation = useMutation({
  mutationFn: (data: FormData) => create_fuel_entry(data),
});

const handleCreate = async (formData: FormData) => {
  const res = await mutation.mutateAsync(formData);
  if (res.success) {
    toast.success("Fuel entry created successfully");
    queryClient.invalidateQueries({ queryKey: ["fuel-entry-list"] });
    router.push("/fleet/fuel-entries");
  } else {
    toast.error(res.error || "Failed to create fuel entry");
  }
};
</script>
