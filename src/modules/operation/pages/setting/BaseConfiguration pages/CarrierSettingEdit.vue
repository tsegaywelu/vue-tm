<template>
  <div v-if="isLoading" class="flex justify-center py-10">
    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
  </div>
  <CarrierSettingForm
    v-else-if="initialValues"
    form-id="edit-carrier-setting-form"
    :initial-values="initialValues"
    :on-submit="handleUpdate"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">Cancel</Button>
      <SubmitButton> Save Changes </SubmitButton>
    </template>
  </CarrierSettingForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery, useMutation } from "@tanstack/vue-query";
import CarrierSettingForm from "../../../components/settings/BaseConfiguration/CarrierSettingForm.vue";
import { getApi } from "@/utils/getApi";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const id = route.params.id as string;
const api = getApi("/carrierSetting");

const { data: response, isLoading } = useQuery({
  queryKey: ["carrier-setting", id],
  queryFn: () => api.addAuthenticationHeader().get(`/${id}`),
  enabled: !!id,
});

const initialValues = computed(() => {
  if (!response.value?.data) return null;
  const data = response.value.data.result || response.value.data;
  return {
    movementAlertStartHour: data.movementAlertStartHour || 0,
    movementAlertEndHour: data.movementAlertEndHour || 0,
    speedAlertThreshold: data.speedAlertThreshold || 0,
  };
});

const mutation = useMutation({
  mutationFn: (values: any) => api.addAuthenticationHeader().patch(`/${id}`, values),
});

const handleUpdate = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Carrier setting updated successfully");
      router.push("/setting/base-configuration?tab=settings");
    } else {
      toast.error(res.error || "Failed to update setting");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
