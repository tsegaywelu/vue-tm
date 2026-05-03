<template>
  <div v-if="isLoading" class="flex justify-center py-10">
    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-brightBlue"></div>
  </div>
  <ServiceTaskForm
    v-else-if="initialValues"
    form-id="edit-service-task-form"
    :initial-values="initialValues"
    :on-submit="handleUpdateServiceTask"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">
        Cancel
      </Button>
      <SubmitButton> Save Changes </SubmitButton>
    </template>
  </ServiceTaskForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import ServiceTaskForm from "../../components/maintenance/ServiceTaskForm.vue";
import { fetch_service_task_by_id, update_service_task } from "../../api/service-task.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useMutation, useQuery } from "@tanstack/vue-query";
import type { AsyncResponse } from "@/api/types";
import type { ServiceTask } from "../../operation.types";

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const serviceTaskId = route.params.id as string;

const { data: serviceTaskResponse, isLoading } = useQuery<AsyncResponse<ServiceTask>>({
  queryKey: ["service-task", serviceTaskId],
  queryFn: () => fetch_service_task_by_id(serviceTaskId),
  enabled: !!serviceTaskId,
});

const initialValues = computed(() => {
  if (!serviceTaskResponse.value?.data) return null;
  const serviceTask = serviceTaskResponse.value.data;
  return {
    ...serviceTask,
    requiredParts: serviceTask.requiredParts && serviceTask.requiredParts.length > 0 
      ? serviceTask.requiredParts 
      : [""],
  };
});

const mutation = useMutation({
  mutationFn: (values: any) => update_service_task(serviceTaskId, values),
});

const handleUpdateServiceTask = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Service task updated successfully");
      router.push("/maintenance/service-task");
    } else {
      toast.error(res.error || "Failed to update service task");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
