<template>
  <div v-if="isLoading" class="flex justify-center p-12">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
  <BonusMultiplierForm
    v-else-if="initialValues"
    form-id="edit-bonus-multiplier-form"
    :initial-values="initialValues"
    :on-submit="handleEdit"
  >
    <template #submit-btn="{ form }">
      <Button size="md" variant="outline" @click="router.back()">
        Cancel
      </Button>
      <SubmitButton> Update </SubmitButton>
    </template>
  </BonusMultiplierForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import BonusMultiplierForm from "../../components/settings/BonusMultiplier/BonusMultiplierForm.vue";
import { fetch_multiplier_details, update_multiplier } from "../../api/bonus.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useMutation, useQuery } from "@tanstack/vue-query";

const router = useRouter();
const route = useRoute();
const toast = useToastStore();
const id = route.params.id as string;

const { data: response, isLoading } = useQuery({
  queryKey: ["bonus-multiplier", id],
  queryFn: () => fetch_multiplier_details(id),
  enabled: !!id,
});

const initialValues = computed(() => {
  if (!response.value?.data) return null;
  const data = response.value.data;
  return {
    metric: data.metric || "",
    multiplier: data.multiplier || null,
    minValue: data.minValue ?? 0,
    maxValue: data.maxValue ?? null,
    description: data.description || "",
  };
});

const mutation = useMutation({
  mutationFn: (values: any) => update_multiplier(id, values),
});

const handleEdit = async (values: any) => {
  try {
    const payload = {
      ...values,
      multiplier: Number(values.multiplier),
      minValue: Number(values.minValue),
      maxValue: values.maxValue ? Number(values.maxValue) : null,
    };

    const res = await mutation.mutateAsync(payload);
    if (res.success) {
      toast.success("Bonus multiplier updated successfully");
      router.push("/setting/bonus-multipliers");
    } else {
      toast.error(res.error || "Failed to update bonus multiplier");
    }
  } catch (err: any) {
    toast.error(err.message || "An unexpected error occurred");
  }
};
</script>
