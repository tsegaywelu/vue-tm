<template>
  <BonusRouteForm
    form-id="add-bonus-route-form"
    :initial-values="{
      route: '',
      amount: null,
      description: '',
    }"
    :on-submit="handleAdd"
  >
    <template #submit-btn="{ form }">
      <Button size="md" variant="outline" @click="router.back()">
        Discard
      </Button>
      <SubmitButton> Submit </SubmitButton>
    </template>
  </BonusRouteForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import BonusRouteForm from "../../components/settings/BonusRoute/BonusRouteForm.vue";
import { create_bonus_route } from "../../api/bonus.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useMutation, useQueryClient } from "@tanstack/vue-query";

const router = useRouter();
const toast = useToastStore();
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: (values: any) => create_bonus_route(values),
});

const handleAdd = async (values: any) => {
  try {
    const payload = {
      ...values,
      amount: Number(values.amount),
    };
    
    const res = await mutation.mutateAsync(payload);
    if (res.success) {
      toast.success("Bonus route added successfully");
      // invalidate query
      queryClient.invalidateQueries({ queryKey: ["bonus-route-list"] });
      
      router.push("/setting/bonus-routes");
    } else {
      toast.error(res.error || "Failed to add bonus route");
    }
  } catch (err: any) {
    toast.error(err.message || "An unexpected error occurred");
  }
};
</script>
