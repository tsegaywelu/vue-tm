<template>
  <div v-if="isLoading" class="flex justify-center py-10">
    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-brightBlue"></div>
  </div>
  <WorkOrderForm
    v-else-if="initialValues"
    form-id="edit-work-order-form"
    :initial-values="initialValues"
    :on-submit="handleUpdateWorkOrder"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">
        Cancel
      </Button>
      <SubmitButton> Save Changes </SubmitButton>
    </template>
  </WorkOrderForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import WorkOrderForm from "../../components/maintenance/WorkOrderForm.vue";
import { fetch_work_order_by_id, update_work_order } from "../../api/work-order.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useMutation, useQuery } from "@tanstack/vue-query";
import type { AsyncResponse } from "@/api/types";
import type { WorkOrder } from "../../operation.types";

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const workOrderId = route.params.id as string;

const { data: workOrderResponse, isLoading } = useQuery<AsyncResponse<WorkOrder>>({
  queryKey: ["work-order", workOrderId],
  queryFn: () => fetch_work_order_by_id(workOrderId),
  enabled: !!workOrderId,
});

const initialValues = computed(() => {
  if (!workOrderResponse.value?.data) return null;
  const wo = workOrderResponse.value.data;
  
  return {
    ...wo,
    vehicle: (wo.vehicle as any)?._id || wo.vehicle,
    workshop: (wo.workshop as any)?._id || wo.workshop,
    serviceTypes: wo.serviceTypes?.map((st: any) => st._id || st) || [""],
    mechanics: wo.mechanics?.map((m: any) => m._id || m) || [""],
    tasks: wo.tasks?.map((t: any) => ({
      ...t,
      serviceTask: (t.serviceTask as any)?._id || t.serviceTask,
      taskStartTime: t.taskStartTime ? t.taskStartTime.slice(0, 16) : "",
      taskEndTime: t.taskEndTime ? t.taskEndTime.slice(0, 16) : "",
    })) || [],
    startDate: wo.startDate ? wo.startDate.split("T")[0] : "",
    estimatedCompletionDate: wo.estimatedCompletionDate ? wo.estimatedCompletionDate.split("T")[0] : "",
    partsCost: wo.costBreakdown?.partsCost || wo.partsCost,
  };
});

const mutation = useMutation({
  mutationFn: (values: any) => update_work_order(workOrderId, values),
});

const handleUpdateWorkOrder = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Work Order updated successfully");
      router.push("/maintenance/work-order");
    } else {
      toast.error(res.error || "Failed to update work order");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
