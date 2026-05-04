<template>
  <ServiceTaskForm
    form-id="add-service-task-form"
    :initial-values="initialValues"
    :on-submit="handleCreateServiceTask"
  >
    <template #submit-btn="{ form }">
      <Button size="md" variant="outline" @click="form.reset()">
        Discard Changes
      </Button>
      <SubmitButton> Create Service Task </SubmitButton>
    </template>
  </ServiceTaskForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import ServiceTaskForm from "../../components/maintenance/ServiceTaskForm.vue";
import { create_service_task } from "../../api/service-task.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useMutation } from "@tanstack/vue-query";

const router = useRouter();
const toast = useToastStore();

const mutation = useMutation({
  mutationFn: (values: any) => create_service_task(values),
});

const initialValues = {
  name: "",
  code: "",
  description: "",
  estimatedDuration: 0,
  requiredParts: [""],
  priority: "MEDIUM",
  estimatedCost: 0,
};

const handleCreateServiceTask = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Service task created successfully");
      router.push("/maintenance/service-task");
    } else {
      toast.error(res.error || "Failed to create service task");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
