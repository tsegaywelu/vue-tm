<template>
  <ServiceReminderForm
    form-id="add-service-reminder-form"
    :initial-values="initialValues"
    :on-submit="handleCreateServiceReminder"
  >
    <template #submit-btn="{ form }">
      <Button size="md" variant="outline" @click="form.reset()">
        Discard Changes
      </Button>
      <SubmitButton> Create Service Reminder </SubmitButton>
    </template>
  </ServiceReminderForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import ServiceReminderForm from "../../components/maintenance/ServiceReminderForm.vue";
import { create_service_reminder } from "../../api/service-reminder.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useMutation } from "@tanstack/vue-query";
import { useQueryClient } from "@tanstack/vue-query";

const router = useRouter();
const toast = useToastStore();
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: (values: any) => create_service_reminder(values),
});

const initialValues = {
  vehicle: "",
  serviceTask: "",
  type: "kilometer",
  interval: 1,
  reminderDays: 14,
  mileageInterval: null,
  lastServiceMileage: null,
  lastServiceDate: new Date().toISOString().split("T")[0],
  reminderMileage: 2000,
};

const handleCreateServiceReminder = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Service Reminder created successfully");
      // invalidate query here
    
      queryClient.invalidateQueries({ queryKey: ["service-reminders"] });
      router.push("/maintenance/service-reminder");
    } else {
      toast.error(res.error || "Failed to create service reminder");
    }
  } catch (err: any) {
    toast.error(err.message || "An unexpected error occurred");
  }
};
</script>
