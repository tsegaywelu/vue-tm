<template>
  <ServiceRecordForm
    form-id="add-service-record-form"
    :initial-values="initialValues"
    :on-submit="handleCreateServiceRecord"
  >
    <template #submit-btn="{ form }">
      <Button size="md" variant="outline" @click="form.reset()">
        Discard Changes
      </Button>
      <SubmitButton> Create Service Record </SubmitButton>
    </template>
  </ServiceRecordForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import ServiceRecordForm from "../../components/maintenance/ServiceRecordForm.vue";
import { create_service_record } from "../../api/service-record.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useMutation } from "@tanstack/vue-query";

const router = useRouter();
const toast = useToastStore();

const mutation = useMutation({
  mutationFn: (values: any) => create_service_record(values),
});

const initialValues = {
  vehicle: "",
  maintenanceDate: new Date().toISOString().split("T")[0],
  workshop: "",
  mileageAtService: null,
  totalCost: null,
  mechanics: [""],
  description: "",
};

const handleCreateServiceRecord = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Service record created successfully");
      router.push("/maintenance/service-record");
    } else {
      toast.error(res.error || "Failed to create service record");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
