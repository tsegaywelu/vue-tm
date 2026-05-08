<template>
  <div v-if="isLoading" class="flex justify-center py-10">
    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-brightBlue"></div>
  </div>
  <ServiceReminderForm
    v-else-if="initialValues"
    form-id="edit-service-reminder-form"
    :initial-values="initialValues"
    :initial-labels="initialLabels"
    :on-submit="handleUpdateServiceReminder"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">
        Cancel
      </Button>
      <SubmitButton> Save Changes </SubmitButton>
    </template>
  </ServiceReminderForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import ServiceReminderForm from "../../components/maintenance/ServiceReminderForm.vue";
import { fetch_service_reminder_by_id, update_service_reminder } from "../../api/service-reminder.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { ServiceReminder } from "../../operation.types";
import type { AsyncResponse } from "@/api/types";

const router = useRouter();
const route = useRoute();
const toast = useToastStore();
const queryClient = useQueryClient();
const id = route.params.id as string;

const { data: serviceReminderResponse, isLoading } = useQuery<AsyncResponse<ServiceReminder>>({
  queryKey: ["service-reminder", id],
  queryFn: () => fetch_service_reminder_by_id(id),
  enabled: !!id,
});

const initialValues = computed(() => {
  const sr = serviceReminderResponse.value?.data;
  if (!sr) return null;
  
  const vehicleObj = Array.isArray(sr.vehicle) ? sr.vehicle[0] : sr.vehicle;
  const taskObj = Array.isArray(sr.serviceTask) ? sr.serviceTask[0] : sr.serviceTask;
  
  return {
    ...sr,
    vehicle: vehicleObj?._id || vehicleObj,
    serviceTask: taskObj?._id || taskObj,
    type: sr.interval ? "time" : "kilometer",
    lastServiceDate: sr.lastServiceDate
      ? new Date(sr.lastServiceDate).toISOString().split("T")[0]
      : "",
  };
});

const initialLabels = computed(() => {
  const sr = serviceReminderResponse.value?.data;
  if (!sr) return {};

  const labels: Record<string, string> = {};
  
  const vehicleObj = Array.isArray(sr.vehicle) ? sr.vehicle[0] : sr.vehicle;
  const taskObj = Array.isArray(sr.serviceTask) ? sr.serviceTask[0] : sr.serviceTask;

  if (vehicleObj) labels.vehicle = vehicleObj.plateNumber || "";
  if (taskObj) labels.serviceTask = taskObj.name || "";

  return labels;
});

const mutation = useMutation({
  mutationFn: (values: any) => update_service_reminder(id, values),
});

const handleUpdateServiceReminder = async (values: any) => {
  try {
    const payload = { ...values };
    delete payload._id;
    delete payload.createdAt;
    delete payload.updatedAt;
    delete payload.__v;
    delete payload.status;

    const res = await mutation.mutateAsync(payload);
    if (res.success) {
      toast.success("Service Reminder updated successfully");
      queryClient.invalidateQueries({ queryKey: ["service-reminders-list"] });
      queryClient.invalidateQueries({ queryKey: ["service-reminder", id] });
      router.push("/maintenance/service-reminder");
    } else {
      toast.error(res.error || "Failed to update service reminder");
    }
  } catch (err: any) {
    toast.error(err.message || "An unexpected error occurred");
  }
};
</script>
