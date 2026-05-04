<template>
  <PackagingForm
    form-id="add-packaging-form"
    :initial-values="{ name: '', shipper: '' }"
    :on-submit="handleCreate"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">Discard</Button>
      <SubmitButton> Create Packaging </SubmitButton>
    </template>
  </PackagingForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMutation } from "@tanstack/vue-query";
import PackagingForm from "../../components/settings/Packaging/PackagingForm.vue";
import { create_packaging } from "../../api/settings.api";
import { useToastStore } from "@/store/toastStore";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";

const router = useRouter();
const toast = useToastStore();

const mutation = useMutation({
  mutationFn: (values: any) => create_packaging(values),
});

const handleCreate = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Packaging created successfully");
      router.push("/setting/packaging");
    } else {
      toast.error(res.error || "Failed to create packaging");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
