<template>
  <CarrierSettingForm
    form-id="add-carrier-setting-form"
    :initial-values="{ movementAlertStartHour: 0, movementAlertEndHour: 0, speedAlertThreshold: 0 }"
    :on-submit="handleCreate"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">Discard</Button>
      <SubmitButton> Create Setting </SubmitButton>
    </template>
  </CarrierSettingForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMutation } from "@tanstack/vue-query";
import CarrierSettingForm from "../../../components/settings/BaseConfiguration/CarrierSettingForm.vue";
import { getApi } from "@/utils/getApi";
import { useToastStore } from "@/store/toastStore";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { useQueryClient } from "@tanstack/vue-query";

const router = useRouter();
const toast = useToastStore();
const api = getApi("/carrier-settings");
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: (values: any) => api.addAuthenticationHeader().post("", values),
});

const handleCreate = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      //invalidate query here 
       queryClient.invalidateQueries({ queryKey: ["carrier-setting-list"] });
      toast.success("Carrier setting created successfully");
      router.push("/setting/base-configuration?tab=settings");
    } else {
      toast.error(res.error || "Failed to create setting");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
