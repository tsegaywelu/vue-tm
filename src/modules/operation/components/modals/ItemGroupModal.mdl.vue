<template>
  <FormModalParent
    :title="isEdit ? 'Edit Item Group' : 'Add Item Group'"
    :subtitle="isEdit ? 'Update item group details' : 'Create a new item group'"
    form-id="item-group-form"
    :submit-handler="handleSubmit"
    modal-style="auto"
    :values="initialValues"
  >
    <template #center>
      <ItemGroupForm />
    </template>

    <template #bottom="{ form }">
      <div class="flex justify-end gap-3">
        <Button variant="outline" size="md" @click="close" type="button">
          Cancel
        </Button>
        <SubmitButton
          form-id="item-group-form"
          :loading="form.state.isSubmitting"
        >
          {{ isEdit ? 'Save Changes' : 'Create Group' }}
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import ItemGroupForm from "../inventory/ItemGroupForm.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { create_item_group, update_item_group } from "../../api/inventory.api";
import { useToastStore } from "@/store/toastStore";

const props = defineProps<{
  data?: {
    group?: any;
    onSuccess?: () => void;
  };
  close: (res?: any) => void;
}>();

const toast = useToastStore();
const isEdit = computed(() => !!props.data?.group);

const initialValues = computed(() => {
  if (isEdit.value) {
    const data = props.data?.group;
    return {
      name: data.name || "",
      category: data.category?._id || data.category || "",
      description: data.description || "",
    };
  }
  return {
    name: "",
    category: "",
    description: "",
  };
});

const handleSubmit = async (values: any) => {
  try {
    let res;
    if (isEdit.value) {
      res = await update_item_group(props.data!.group._id, values);
    } else {
      res = await create_item_group(values);
    }

    if (res.success) {
      toast.success(isEdit.value ? "Item group updated successfully" : "Item group created successfully");
      props.data?.onSuccess?.();
      props.close(true);
    } else {
      toast.error(res.error || `Failed to ${isEdit.value ? 'update' : 'create'} item group`);
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
