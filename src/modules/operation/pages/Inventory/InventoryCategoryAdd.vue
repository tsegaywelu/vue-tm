<template>
  <InventoryCategoryForm
    form-id="add-inventory-category-form"
    :initial-values="initialValues"
    :on-submit="handleCreate"
  >
    <template #submit-btn="{ form }">
      <Button size="md" variant="outline" @click="router.back()">
        Discard Changes
      </Button>
      <SubmitButton> Create Inventory Category </SubmitButton>
    </template>
  </InventoryCategoryForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMutation } from "@tanstack/vue-query";
import InventoryCategoryForm from "../../components/inventory/InventoryCategoryForm.vue";
import { create_inventory_category } from "../../api/inventory.api";
import { useToastStore } from "@/store/toastStore";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";

const router = useRouter();
const toast = useToastStore();

const mutation = useMutation({
  mutationFn: (values: any) => create_inventory_category(values),
});

const initialValues = {
  name: "",
  description: "",
};

const handleCreate = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Inventory category created successfully");
      router.push("/inventory/categories");
    } else {
      toast.error(res.error || "Failed to create inventory category");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
