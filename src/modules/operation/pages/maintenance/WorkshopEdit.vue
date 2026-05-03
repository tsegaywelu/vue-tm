<template>
  <div v-if="isLoading" class="flex justify-center py-10">
    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-brightBlue"></div>
  </div>
  <WorkshopForm
    v-else-if="initialValues"
    form-id="edit-workshop-form"
    :initial-values="initialValues"
    :on-submit="handleUpdateWorkshop"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">
        Cancel
      </Button>
      <SubmitButton> Save Changes </SubmitButton>
    </template>
  </WorkshopForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import WorkshopForm from "../../components/maintenance/WorkshopForm.vue";
import { fetch_workshop_by_id, update_workshop } from "../../api/workshop.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useMutation, useQuery } from "@tanstack/vue-query";
import type { AsyncResponse } from "@/api/types";
import type { Workshop } from "../../operation.types";

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const workshopId = route.params.id as string;

const { data: workshopResponse, isLoading } = useQuery<AsyncResponse<Workshop>>({
  queryKey: ["workshop", workshopId],
  queryFn: () => fetch_workshop_by_id(workshopId),
  enabled: !!workshopId,
});

const initialValues = computed(() => {
  if (!workshopResponse.value?.data) return null;
  return workshopResponse.value.data;
});

const mutation = useMutation({
  mutationFn: (values: any) => update_workshop(workshopId, values),
});

const handleUpdateWorkshop = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Workshop updated successfully");
      router.push("/maintenance/workshop");
    } else {
      toast.error(res.error || "Failed to update workshop");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
