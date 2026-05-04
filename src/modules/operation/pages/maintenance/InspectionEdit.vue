<template>
  <div v-if="isLoading" class="flex justify-center py-10">
    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-brightBlue"></div>
  </div>
  <InspectionForm
    v-else-if="initialValues"
    form-id="edit-inspection-form"
    :initial-values="initialValues"
    :on-submit="handleUpdateInspection"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">
        Cancel
      </Button>
      <SubmitButton> Save Changes </SubmitButton>
    </template>
  </InspectionForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import InspectionForm from "../../components/maintenance/InspectionForm.vue";
import { fetch_inspection_by_id, update_inspection } from "../../api/inspection.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useMutation, useQuery } from "@tanstack/vue-query";
import type { inspection } from "@/utils/type";
import type { AsyncResponse } from "@/api/types";

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const inspectionId = route.params.id as string;



const { data: inspectionResponse, isLoading } = useQuery<AsyncResponse<inspection>>({
  queryKey: ["inspection", inspectionId],
  queryFn: () => fetch_inspection_by_id(inspectionId),
  enabled: !!inspectionId,
});


const initialValues = computed(() => {
  if (!inspectionResponse.value?.data) return null;
  const inspection = inspectionResponse.value.data;

  return {
    ...inspection,
    vehicle: inspection.vehicle?._id || (inspection.vehicle as any),
    inspector: inspection.inspector?._id || (inspection.inspector as any),
    inspectionDate: inspection.inspectionDate?.split("T")[0],
    nextInspectionDate: inspection.nextInspectionDate?.split("T")[0],
  };
});

const mutation = useMutation({
  mutationFn: (values: any) => update_inspection(inspectionId, values),
});

const handleUpdateInspection = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Inspection updated successfully");
      router.push("/maintenance/inspection");
    } else {
      toast.error(res.error || "Failed to update inspection");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
