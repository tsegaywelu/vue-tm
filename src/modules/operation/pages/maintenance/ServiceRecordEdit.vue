<template>
  <div v-if="isLoading" class="flex justify-center py-10">
    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-brightBlue"></div>
  </div>
  <ServiceRecordForm
    v-else-if="initialValues"
    form-id="edit-service-record-form"
    :initial-values="initialValues"
    :on-submit="handleUpdateServiceRecord"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">
        Cancel
      </Button>
      <SubmitButton> Save Changes </SubmitButton>
    </template>
  </ServiceRecordForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import ServiceRecordForm from "../../components/maintenance/ServiceRecordForm.vue";
import { fetch_service_record_by_id, update_service_record } from "../../api/service-record.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useMutation, useQuery } from "@tanstack/vue-query";
import type { AsyncResponse } from "@/api/types";
import type { ServiceRecord } from "../../operation.types";

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const serviceRecordId = route.params.id as string;

const { data: serviceRecordResponse, isLoading } = useQuery<AsyncResponse<ServiceRecord>>({
  queryKey: ["service-record", serviceRecordId],
  queryFn: () => fetch_service_record_by_id(serviceRecordId),
  enabled: !!serviceRecordId,
});

const initialValues = computed(() => {
  const serviceRecord = serviceRecordResponse.value?.data;
  if (!serviceRecord) return null;
  
  return {
    ...serviceRecord,
    vehicle: (serviceRecord.vehicle as any)?._id || serviceRecord.vehicle,
    workshop: (serviceRecord.workshop as any)?._id || serviceRecord.workshop,
    mechanics: serviceRecord.mechanics?.map((m: any) => m._id || m) || [""],
    maintenanceDate: serviceRecord.maintenanceDate ? serviceRecord.maintenanceDate.split("T")[0] : "",
  };
});

const mutation = useMutation({
  mutationFn: (values: any) => update_service_record(serviceRecordId, values),
});

const handleUpdateServiceRecord = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Service record updated successfully");
      router.push("/maintenance/service-record");
    } else {
      toast.error(res.error || "Failed to update service record");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
