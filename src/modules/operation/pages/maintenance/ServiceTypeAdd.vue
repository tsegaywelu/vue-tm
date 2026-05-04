<template>
  <ServiceTypeForm
    form-id="add-service-type-form"
    :initial-values="initialValues"
    :on-submit="handleCreateServiceType"
  >
    <template #submit-btn="{ form }">
      <Button size="md" variant="outline" @click="form.reset()">
        Discard Changes
      </Button>
      <SubmitButton> Create Service Type </SubmitButton>
    </template>
  </ServiceTypeForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import ServiceTypeForm from "../../components/maintenance/ServiceTypeForm.vue";
import { create_service_type } from "../../api/service-type.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useMutation } from "@tanstack/vue-query";

const router = useRouter();
const toast = useToastStore();

const mutation = useMutation({
  mutationFn: (values: any) => create_service_type(values),
});

const initialValues = {
  name: "",
  description: "",
  serviceTasks: [""],
};

const handleCreateServiceType = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Service type created successfully");
      router.push("/maintenance/service-type");
    } else {
      toast.error(res.error || "Failed to create service type");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
