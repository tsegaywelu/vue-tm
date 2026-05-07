<template>
  <FormModalParent
    :title="isEdit ? 'Edit Vendor' : 'Add Vendor'"
    :subtitle="isEdit ? 'Update vendor details' : 'Register a new inventory vendor'"
    form-id="inventory-vendor-form"
    :submit-handler="handleSubmit"
    modal-style="auto"
    :values="initialValues"
  >
    <template #center>
      <VendorForm />
    </template>

    <template #bottom="{ form }">
      <div class="flex justify-end gap-3">
        <Button variant="outline" size="md" @click="close" type="button">
          Cancel
        </Button>
        <SubmitButton
          form-id="inventory-vendor-form"
          :loading="form.state.isSubmitting"
        >
          {{ isEdit ? 'Save Changes' : 'Create Vendor' }}
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import VendorForm from "../inventory/VendorForm.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { create_vendor, update_vendor } from "../../api/inventory.api";
import { useToastStore } from "@/store/toastStore";

const props = defineProps<{
  data?: {
    vendor?: any;
    onSuccess?: () => void;
  };
  close: (res?: any) => void;
}>();

const toast = useToastStore();
const isEdit = computed(() => !!props.data?.vendor);

const initialValues = computed(() => {
  if (isEdit.value) {
    const data = props.data?.vendor;
    return {
      name: data.name || "",
      telephone: data.telephone || "",
      address: data.address || "",
      description: data.description || "",
    };
  }
  return {
    name: "",
    telephone: "",
    address: "",
    description: "",
  };
});

const handleSubmit = async (values: any) => {
  try {
    let res;
    if (isEdit.value) {
      res = await update_vendor(props.data!.vendor._id, values);
    } else {
      res = await create_vendor(values);
    }

    if (res.success) {
      toast.success(isEdit.value ? "Vendor updated successfully" : "Vendor created successfully");
      props.data?.onSuccess?.();
      props.close(true);
    } else {
      toast.error(res.error || `Failed to ${isEdit.value ? 'update' : 'create'} vendor`);
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
