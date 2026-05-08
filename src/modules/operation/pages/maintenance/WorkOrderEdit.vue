<template>
  <div v-if="isLoading" class="flex justify-center py-10">
    <div
      class="animate-spin rounded-full h-10 w-10 border-b-2 border-brightBlue"
    ></div>
  </div>
  <WorkOrderForm
    v-else-if="initialValues"
    form-id="edit-work-order-form"
    :initial-values="initialValues"
    :initial-labels="initialLabels"
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
import {
  fetch_work_order_by_id,
  update_work_order,
} from "../../api/work-order.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { AsyncResponse } from "@/api/types";
import type { WorkOrder } from "../../operation.types";

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const queryClient = useQueryClient();
const workOrderId = route.params.id as string;

const { data: workOrderResponse, isLoading } = useQuery<
  AsyncResponse<WorkOrder>
>({
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
    tasks:
      wo.tasks?.map((t: any) => ({
        ...t,
        serviceTask: (t.serviceTask as any)?._id || t.serviceTask,
        taskStartTime: t.taskStartTime ? t.taskStartTime.slice(0, 16) : "",
        taskEndTime: t.taskEndTime ? t.taskEndTime.slice(0, 16) : "",
      })) || [],
    startDate: wo.startDate ? wo.startDate.split("T")[0] : "",
    estimatedCompletionDate: wo.estimatedCompletionDate
      ? wo.estimatedCompletionDate.split("T")[0]
      : "",
    partsCost: wo.costBreakdown?.partsCost || wo.partsCost,
  };
});

const initialLabels = computed(() => {
  const wo = workOrderResponse.value?.data;
  if (!wo) return {};

  const labels: Record<string, any> = {};

  if (wo.vehicle) {
    labels.vehicle = (wo.vehicle as any).plateNumber || "";
  }

  if (wo.workshop) {
    labels.workshop = (wo.workshop as any).name || "";
  }

  const mechanicLabels: Record<string, string> = {};
  if (wo.mechanics?.length) {
    wo.mechanics.forEach((m: any) => {
      if (m._id) {
        mechanicLabels[m._id] =
          m.name || `${m.firstName || ""} ${m.lastName || ""}`.trim();
      }
    });
  }
  labels.mechanics = mechanicLabels;

  return labels;
});

const mutation = useMutation({
  mutationFn: (values: any) => update_work_order(workOrderId, values),
});

const handleUpdateWorkOrder = async (values: any) => {
  try {
    const payload = { ...values };
    delete payload._id;
    delete payload.createdAt;
    delete payload.updatedAt;
    delete payload.__v;
    delete payload.status;
    delete payload.serviceTasks; // Exclude populated field from backend

    const res = await mutation.mutateAsync(payload);
    if (res.success) {
      toast.success("Work Order updated successfully");
      queryClient.invalidateQueries({ queryKey: ["work-orders-list"] });
      queryClient.invalidateQueries({ queryKey: ["work-order", workOrderId] });
      router.push("/maintenance/work-order");
    } else {
      toast.error(res.error || "Failed to update work order");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
