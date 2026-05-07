<template>
  <FormModalParent
    :title="isEdit ? 'Edit Inventory Category' : 'Add Inventory Category'"
    :subtitle="isEdit ? 'Update inventory category details' : 'Create a new inventory category'"
    form-id="inventory-category-form"
    :submit-handler="handleSubmit"
    modal-style="auto"
    :values="initialValues"
  >
    <template #center>
      <InventoryCategoryForm />
    </template>

    <template #bottom="{ form }">
      <div class="flex justify-end gap-3">
        <Button variant="outline" size="md" @click="close" type="button">
          Cancel
        </Button>
        <SubmitButton
          form-id="inventory-category-form"
          :loading="form.state.isSubmitting"
        >
          {{ isEdit ? 'Save Changes' : 'Create Category' }}
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import InventoryCategoryForm from "../inventory/InventoryCategoryForm.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { create_inventory_category, update_inventory_category } from "../../api/inventory.api";
import { useToastStore } from "@/store/toastStore";

const props = defineProps<{
  data?: {
    category?: any;
    onSuccess?: () => void;
  };
  close: (res?: any) => void;
}>();

const toast = useToastStore();
const isEdit = computed(() => !!props.data?.category);

const initialValues = computed(() => {
  if (isEdit.value) {
    return {
      name: props.data?.category.name || "",
      description: props.data?.category.description || "",
    };
  }
  return {
    name: "",
    description: "",
  };
});

const handleSubmit = async (values: any) => {
  try {
    let res;
    if (isEdit.value) {
      res = await update_inventory_category(props.data!.category._id, values);
    } else {
      res = await create_inventory_category(values);
    }

    if (res.success) {
      toast.success(isEdit.value ? "Category updated successfully" : "Category created successfully");
      props.data?.onSuccess?.();
      props.close(true);
    } else {
      toast.error(res.error || `Failed to ${isEdit.value ? 'update' : 'create'} category`);
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
