<template>
  <div v-if="isLoading" class="flex justify-center py-10">
    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-brightBlue"></div>
  </div>
  <ServiceTypeForm
    v-else-if="initialValues"
    form-id="edit-service-type-form"
    :initial-values="initialValues"
    :initial-labels="initialLabels"
    :on-submit="handleUpdateServiceType"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">
        Cancel
      </Button>
      <SubmitButton> Save Changes </SubmitButton>
    </template>
  </ServiceTypeForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import ServiceTypeForm from "../../components/maintenance/ServiceTypeForm.vue";
import { fetch_service_type_by_id, update_service_type } from "../../api/service-type.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { AsyncResponse } from "@/api/types";
import type { ServiceType } from "../../operation.types";

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const queryClient = useQueryClient();
const serviceTypeId = route.params.id as string;

const { data: serviceTypeResponse, isLoading } = useQuery<AsyncResponse<ServiceType>>({
  queryKey: ["service-type", serviceTypeId],
  queryFn: () => fetch_service_type_by_id(serviceTypeId),
  enabled: !!serviceTypeId,
});

const initialValues = computed(() => {
  if (!serviceTypeResponse.value?.data) return null;
  const serviceType = serviceTypeResponse.value.data;
  
  return {
    ...serviceType,
    serviceTasks: serviceType.serviceTasks?.map((task: any) => task._id || task) || [""],
  };
});

const initialLabels = computed(() => {
  if (!serviceTypeResponse.value?.data) return {};
  const serviceType = serviceTypeResponse.value.data;
  const labels: Record<string, string> = {};
  serviceType.serviceTasks?.forEach((task: any) => {
    if (task && typeof task === "object") {
      labels[task._id] = task.name;
    }
  });
  return labels;
});

const mutation = useMutation({
  mutationFn: (values: any) => update_service_type(serviceTypeId, values),
});

const handleUpdateServiceType = async (values: any) => {
  const payload = { ...values };
  delete payload._id;
  delete payload.createdAt;
  delete payload.updatedAt;
  delete payload.__v;
  delete payload.status;

  const res = await mutation.mutateAsync(payload);
  if (res.success) {
    toast.success("Service type updated successfully");
    queryClient.invalidateQueries({ queryKey: ["service-types-list"] });
    queryClient.invalidateQueries({ queryKey: ["service-type", serviceTypeId] });
    router.push("/maintenance/service-type");
  } else {
    toast.error(res.error || "Failed to update service type");
  }
};
</script>
