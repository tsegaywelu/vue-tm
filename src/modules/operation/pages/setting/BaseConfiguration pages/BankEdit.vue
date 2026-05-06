<template>
  <div v-if="isLoading" class="flex justify-center py-10">
    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
  </div>
  <BankForm
    v-else-if="initialValues"
    form-id="edit-bank-form"
    title="Edit Bank"
    description="Update the name of the existing bank."
    :initial-values="initialValues"
    :on-submit="handleUpdate"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">Cancel</Button>
      <SubmitButton> Save Changes </SubmitButton>
    </template>
  </BankForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery, useMutation } from "@tanstack/vue-query";
import BankForm from "../../../components/settings/BaseConfiguration/BankForm.vue";
import { getApi } from "@/utils/getApi";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useQueryClient } from "@tanstack/vue-query";

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const queryClient = useQueryClient();
const id = route.params.id as string;
const api = getApi("/bank");

const { data: response, isLoading } = useQuery({
  queryKey: ["bank", id],
  queryFn: () => api.addAuthenticationHeader().get(`/${id}`),
  enabled: !!id,
});

const initialValues = computed(() => {
  if (!response.value?.data) return null;
  const data = (response.value.data as any).result || response.value.data;
  return {
    name: data.name || "",
  };
});

const mutation = useMutation({
  mutationFn: (values: any) => api.addAuthenticationHeader().patch(`/${id}`, values),
});

const handleUpdate = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Bank updated successfully");
       queryClient.invalidateQueries({ queryKey: ["bank-list"] });
      router.push("/setting/base-configuration?tab=bank");
    } else {
      toast.error(res.error || "Failed to update bank");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
