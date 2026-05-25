<template>
  <VehicleForm
    formId="add-vehicle-form"
    :initial-values="initialValues"
    :onSubmit="handleSubmit"
  >
    <template #actions="{ form }">
      <Button variant="secondary" size="md" @click="$router.back()">
        Cancel
      </Button>
      <SubmitButton> Register Vehicle </SubmitButton>
    </template>
  </VehicleForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import VehicleForm from "../components/VehicleForm.vue";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { add_vehicle } from "../api/operation.api";
import { useToastStore } from "@/store/toastStore";

const router = useRouter();
const toast = useToastStore();
const queryClient = useQueryClient();

const initialValues = {
  isOperational: true,
  status: "available",
  ownership: "Owned",
  operationalRole: "SHIPMENT",
};

const mutation = useMutation({
  mutationFn: add_vehicle,
  onSuccess: (res: any) => {
    if (res.success) {
      toast.success("Vehicle registered successfully");
      queryClient.invalidateQueries({ queryKey: ["vehicle-list"] });
      router.push("/vehicles");
    } else {
      toast.error(res.error || "Failed to register vehicle");
    }
  },
});

const handleSubmit = async (values: any) => {
  await mutation.mutateAsync(values);
};
</script>
