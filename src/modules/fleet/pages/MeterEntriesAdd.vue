<template>
  <MeterEntryForm
    form-id="add-meter-entry-form"
    :initial-values="initialValues"
    :on-submit="handleCreate"
  >
    <template #submit-btn="{ form }">
      <Button size="md" variant="outline" @click="form.reset()">
        Discard Changes
      </Button>
      <SubmitButton>Save Meter Entry</SubmitButton>
    </template>
  </MeterEntryForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import MeterEntryForm from "../components/MeterEntryForm.vue";
import { create_meter_entry } from "../api/fleet.api";
import { useToastStore } from "@/store/toastStore";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";

const router = useRouter();
const toast = useToastStore();
const queryClient = useQueryClient();

const initialValues = {
  vehicle: "",
  meterType: "ODOMETER",
  entryDate: "",
  entrySource: "MANUAL",
  isOverride: false,
};

const mutation = useMutation({
  mutationFn: (data: FormData) => create_meter_entry(data),
});

const handleCreate = async (formData: FormData) => {
  const res = await mutation.mutateAsync(formData);
  if (res.success) {
    toast.success("Meter entry created successfully");
    queryClient.invalidateQueries({ queryKey: ["meter-entry-list"] });
    router.push("/fleet/meter-entries");
  } else {
    toast.error(res.error || "Failed to create meter entry");
  }
};
</script>
