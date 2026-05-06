<template>
  <BonusMultiplierForm
    form-id="add-bonus-multiplier-form"
    :initial-values="{
      metric: '',
      multiplier: null,
      minValue: 0,
      maxValue: null,
      description: '',
    }"
    :on-submit="handleAdd"
  >
    <template #submit-btn="{ form }">
      <Button size="md" variant="outline" @click="router.back()">
        Cancel
      </Button>
      <SubmitButton> Submit </SubmitButton>
    </template>
  </BonusMultiplierForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import BonusMultiplierForm from "../../components/settings/BonusMultiplier/BonusMultiplierForm.vue";
import { create_multiplier } from "../../api/bonus.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useMutation } from "@tanstack/vue-query";

const router = useRouter();
const toast = useToastStore();

const mutation = useMutation({
  mutationFn: (values: any) => create_multiplier(values),
});

const handleAdd = async (values: any) => {
  try {
    const payload = {
      ...values,
      multiplier: Number(values.multiplier),
      minValue: Number(values.minValue),
      maxValue: values.maxValue ? Number(values.maxValue) : null,
    };
    
    const res = await mutation.mutateAsync(payload);
    if (res.success) {
      toast.success("Bonus multiplier added successfully");
      router.push("/setting/bonus-multipliers");
    } else {
      toast.error(res.error || "Failed to add bonus multiplier");
    }
  } catch (err: any) {
    toast.error(err.message || "An unexpected error occurred");
  }
};
</script>
