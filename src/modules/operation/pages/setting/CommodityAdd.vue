<template>
  <CommodityForm
    form-id="add-commodity-form"
    :initial-values="{ name: '', shipper: '' }"
    :on-submit="handleCreate"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">Discard</Button>
      <SubmitButton> Create Commodity </SubmitButton>
    </template>
  </CommodityForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMutation } from "@tanstack/vue-query";
import CommodityForm from "../../components/settings/Commodity/CommodityForm.vue";
import { create_commodity } from "../../api/settings.api";
import { useToastStore } from "@/store/toastStore";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";

const router = useRouter();
const toast = useToastStore();

const mutation = useMutation({
  mutationFn: (values: any) => create_commodity(values),
});

const handleCreate = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Commodity created successfully");
      router.push("/setting/commodity");
    } else {
      toast.error(res.error || "Failed to create commodity");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
