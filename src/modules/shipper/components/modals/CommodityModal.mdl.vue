<template>
  <FormModalParent
    modal-style="auto"
    :title="isEdit ? 'Edit Commodity' : 'Add Commodity'"
    :subtitle="isEdit ? 'Update commodity details' : 'Create a new commodity'"
    :form-id="formId"
    :values="initialValues"
    :submit-handler="handleFormSubmit"
    @close="cancel"
  >
    <template #center>
      <CommodityForm />
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
          {{ isEdit ? 'Update Commodity' : 'Create Commodity' }}
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
import CommodityForm from "@/modules/operation/components/settings/Commodity/CommodityForm.vue";
import { create_commodity, update_commodity } from "../../api/shipper.api";
import { useAuthStore } from "@/store/authStore";

export type ReturnType = boolean;
export type Props = {
  commodity?: any;
};

const props = defineProps<{ data: Props; close: (res: ReturnType) => void }>();
const toast = useToastStore();
const authStore = useAuthStore();
const formId = "commodityForm";

const isEdit = computed(() => !!props.data.commodity);

const initialValues = computed(() => {
  if (props.data.commodity) {
    return {
      name: props.data.commodity.name,
      shipper: props.data.commodity.shipper?._id || props.data.commodity.shipper,
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
      return update_commodity(props.data.commodity._id, values);
    } else {
      return create_commodity(values);
    }
  },
  onSuccess: (res) => {
    if (res.success) {
      toast.success(`Commodity ${isEdit.value ? 'updated' : 'created'} successfully!`);
      props.close(true);
    } else {
      toast.error(res.error || `Failed to ${isEdit.value ? 'update' : 'create'} commodity`);
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
