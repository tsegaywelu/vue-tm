<template>
  <VendorForm
    form-id="add-vendor-form"
    :initial-values="initialValues"
    :on-submit="handleCreate"
  >
    <template #submit-btn="{ form }">
      <Button size="md" variant="outline" @click="router.back()">
        Discard Changes
      </Button>
      <SubmitButton> Create Vendor </SubmitButton>
    </template>
  </VendorForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMutation } from "@tanstack/vue-query";
import VendorForm from "../../components/inventory/VendorForm.vue";
import { create_vendor } from "../../api/inventory.api";
import { useToastStore } from "@/store/toastStore";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";

const router = useRouter();
const toast = useToastStore();

const mutation = useMutation({
  mutationFn: (values: any) => create_vendor(values),
});

const initialValues = {
  name: "",
  telephone: "",
  address: "",
  description: "",
};

const handleCreate = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Vendor created successfully");
      router.push("/inventory/vendor");
    } else {
      toast.error(res.error || "Failed to create vendor");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
