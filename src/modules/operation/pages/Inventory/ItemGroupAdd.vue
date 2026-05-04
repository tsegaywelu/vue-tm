<template>
  <ItemGroupForm
    form-id="add-item-group-form"
    :initial-values="initialValues"
    :on-submit="handleCreate"
  >
    <template #submit-btn="{ form }">
      <Button size="md" variant="outline" @click="router.back()">
        Discard Changes
      </Button>
      <SubmitButton> Create Item Group </SubmitButton>
    </template>
  </ItemGroupForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMutation } from "@tanstack/vue-query";
import ItemGroupForm from "../../components/inventory/ItemGroupForm.vue";
import { create_item_group } from "../../api/inventory.api";
import { useToastStore } from "@/store/toastStore";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";

const router = useRouter();
const toast = useToastStore();

const mutation = useMutation({
  mutationFn: (values: any) => create_item_group(values),
});

const initialValues = {
  name: "",
  category: "",
  description: "",
};

const handleCreate = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Item group created successfully");
      router.push("/inventory/item-groups");
    } else {
      toast.error(res.error || "Failed to create item group");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
