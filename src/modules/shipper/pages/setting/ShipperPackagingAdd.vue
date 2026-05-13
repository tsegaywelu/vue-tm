<template>
  <ShipperPackagingForm
    form-id="add-packaging-form"
    :initial-values="{ name: '' }"
    :on-submit="handleCreate"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">Discard</Button>
      <SubmitButton> Create Packaging </SubmitButton>
    </template>
  </ShipperPackagingForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import ShipperPackagingForm from "../../components/setting/Packaging/ShipperPackagingForm.vue";
import { create_packaging } from "../../api/shipper.api";
import { useToastStore } from "@/store/toastStore";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";

const router = useRouter();
const toast = useToastStore();
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: (values: any) => create_packaging(values),
});

const handleCreate = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Packaging created successfully");
      queryClient.invalidateQueries({ queryKey: ["shipper-packaging-list"] });
      router.push("/shipper/setting/packaging");
    } else {
      toast.error(res.error || "Failed to create packaging");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
