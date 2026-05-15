<template>
  <BankForm
    form-id="add-insurance-form"
    title="Add Insurance Provider"
    description="Enter the name of the new insurance provider."
    :initial-values="{ name: '' }"
    :on-submit="handleCreate"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">Discard</Button>
      <SubmitButton> Create Provider </SubmitButton>
    </template>
  </BankForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMutation } from "@tanstack/vue-query";
import BankForm from "../../../components/settings/BaseConfiguration/BankForm.vue";
import { getApi } from "@/utils/getApi";
import { useToastStore } from "@/store/toastStore";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { useQueryClient } from "@tanstack/vue-query";

const router = useRouter();
const toast = useToastStore();
const api = getApi("/insurance-provider");
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: (values: any) => api.addAuthenticationHeader().post("", values),
});

const handleCreate = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Insurance provider created successfully");
      //invalidae query
      queryClient.invalidateQueries({ queryKey: ["insurance-provider-list"] });
      router.push("/setting/base-configuration?tab=insurance");
    } else {
      toast.error(res.error || "Failed to create provider");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
