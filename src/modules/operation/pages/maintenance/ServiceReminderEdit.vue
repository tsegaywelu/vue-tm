<template>
  <div v-if="isLoading" class="flex justify-center py-10">
    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-brightBlue"></div>
  </div>
  <ServiceReminderForm
    v-else-if="initialValues"
    form-id="edit-service-reminder-form"
    :initial-values="initialValues"
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
import { useMutation, useQuery } from "@tanstack/vue-query";
import type { ServiceReminder } from "../../operation.types";
import type { AsyncResponse } from "@/api/types";

const router = useRouter();
const route = useRoute();
const toast = useToastStore();
const id = route.params.id as string;

const { data: serviceReminderResponse, isLoading } = useQuery<AsyncResponse<ServiceReminder>>({
  queryKey: ["service-reminder", id],
  queryFn: () => fetch_service_reminder_by_id(id),
  enabled: !!id,
});

const initialValues = computed(() => {
  const sr = serviceReminderResponse.value?.data;
  if (!sr) return null;
  
  return {
    ...sr,
    vehicle: sr.vehicle?._id || sr.vehicle,
    serviceTask: sr.serviceTask?._id || sr.serviceTask,
    type: sr.interval ? "time" : "kilometer",
    lastServiceDate: sr.lastServiceDate
      ? new Date(sr.lastServiceDate).toISOString().split("T")[0]
      : "",
  };
});

const mutation = useMutation({
  mutationFn: (values: any) => update_service_reminder(id, values),
});

const handleUpdateServiceReminder = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Service Reminder updated successfully");
      router.push("/maintenance/service-reminder");
    } else {
      toast.error(res.error || "Failed to update service reminder");
    }
  } catch (err: any) {
    toast.error(err.message || "An unexpected error occurred");
  }
};
</script>
