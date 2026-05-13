<template>
  <FormModalParent
    modal-style="auto"
    :title="isEdit ? 'Edit Packaging' : 'Add Packaging'"
    :subtitle="isEdit ? 'Update packaging type details' : 'Create a new packaging type'"
    :form-id="formId"
    :values="initialValues"
    :submit-handler="handleFormSubmit"
    @close="cancel"
  >
    <template #center>
      <PackagingForm />
    </template>
    <template #bottom>
      <div class="flex justify-end gap-3 w-full">
        <Button type="button" variant="outline" size="md" @click="cancel">
          Cancel
        </Button>
        <SubmitButton
          :loading="mutation.isPending.value"
          variant="primary"
          size="md"
          :form="formId"
        >
          {{ isEdit ? 'Update Packaging' : 'Create Packaging' }}
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { closeModal } from "@customizer/modal-x";
import { useToastStore } from "@/store/toastStore";
import { useMutation } from "@tanstack/vue-query";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import PackagingForm from "@/modules/operation/components/settings/Packaging/PackagingForm.vue";
import { create_packaging, update_packaging } from "../../api/shipper.api";
import { useAuthStore } from "@/store/authStore";

export type ReturnType = boolean;
export type Props = {
  packaging?: any;
};

const props = defineProps<{ data: Props; close: (res: ReturnType) => void }>();
const toast = useToastStore();
const authStore = useAuthStore();
const formId = "packagingForm";

const isEdit = computed(() => !!props.data.packaging);

const initialValues = computed(() => {
  if (props.data.packaging) {
    return {
      name: props.data.packaging.name,
      shipper: props.data.packaging.shipper?._id || props.data.packaging.shipper,
    };
  }
  return {
    name: "",
    shipper: authStore.shipperId,
  };
});

const mutation = useMutation({
  mutationFn: (values: any) => {
    if (isEdit.value) {
      return update_packaging(props.data.packaging._id, values);
    } else {
      return create_packaging(values);
    }
  },
  onSuccess: (res) => {
    if (res.success) {
      toast.success(`Packaging ${isEdit.value ? 'updated' : 'created'} successfully!`);
      props.close(true);
    } else {
      toast.error(res.error || `Failed to ${isEdit.value ? 'update' : 'create'} packaging`);
    }
  },
  onError: (error: any) => {
    toast.error(error?.message || "An error occurred");
  },
});

function cancel() {
  closeModal();
}

async function handleFormSubmit(values: any) {
  mutation.mutate(values);
}
</script>
