<template>
  <RoadTypeForm
    form-id="add-road-type-form"
    :initial-values="{ name: '', code: '' }"
    :on-submit="handleCreate"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">Discard</Button>
      <SubmitButton> Create Road Type </SubmitButton>
    </template>
  </RoadTypeForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMutation } from "@tanstack/vue-query";
import RoadTypeForm from "../../../components/settings/BaseConfiguration/RoadTypeForm.vue";
import { getApi } from "@/utils/getApi";
import { useToastStore } from "@/store/toastStore";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";

const router = useRouter();
const toast = useToastStore();
const api = getApi("/roadType");

const mutation = useMutation({
  mutationFn: (values: any) => api.addAuthenticationHeader().post("", values),
});

const handleCreate = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Road type created successfully");
      router.push("/setting/base-configuration?tab=roadType");
    } else {
      toast.error(res.error || "Failed to create road type");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
