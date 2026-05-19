<template>
  <FormModalParent
    modal-style="auto"
    title="Collect Invoice"
    :form="form"
    form-id="collectInvoiceForm"
    @close="cancel"
  >
    <template #center>
      <div class="grid grid-cols-1 gap-4">
        <DateInput
          name="paymentCollectedDate"
          label="Collection Date"
          :validation="{ required, dateLessThanOrEqalToToday }"
        />
        <Input
          name="crv"
          label="CRV"
          :validation="{ required, number }"
          :attributes="{
            placeholder: 'Enter CRV',
          }"
        />
        <Input
          name="csi"
          label="CSI"
          :validation="{ required, number }"
          :attributes="{
            placeholder: 'Enter CSI',
          }"
        />
        <TextareaInput
          name="remarkCarrier"
          label="Remark"
          :attributes="{ rows: 3 }"
        />
      </div>
    </template>

    <template #bottom>
      <div class="flex justify-end gap-3">
        <Button type="button" variant="outline" size="md" @click="cancel">
          Cancel
        </Button>
        <SubmitButton
          :loading="isSubmitting"
          variant="primary"
          size="md"
          form="collectInvoiceForm"
        >
          Collect
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { ref, computed, provide } from "vue";
import { closeModal } from "@customizer/modal-x";
import { useToastStore } from "@/store/toastStore";
import { useForm } from "@tanstack/vue-form";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Button from "@/components/common/Button.vue";
import Input from "@/components/form/Input.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import DateInput from "@/components/form/DateInput.vue";
import {
  dateLessThanOrEqalToToday,
  number,
  required,
} from "@/utils/validations";
import { collect_invoice } from "@/modules/operation/api/operation.api";
import { useAuthStore } from "@/store/authStore";

export type ReturnType = boolean;
export type Props = {
  invoice: any;
};

const props = defineProps<{ data: Props; close: (res: ReturnType) => void }>();
const toast = useToastStore();
const authStore = useAuthStore();
const isSubmitting = ref(false);

const form = useForm({
  defaultValues: {
    paymentCollectedDate: new Date().toISOString().split("T")[0],
    crv: "",
    csi: "",
    remarkCarrier: "",
  },
  onSubmit: async ({ value }) => {
    await handleFormSubmit(value);
  },
}) as any;

provide("formContext", {
  id: "collectInvoiceForm",
  form,
  is_dirty: computed(() => form.state.isDirty),
});

function cancel() {
  closeModal();
}

async function handleFormSubmit(values: any) {
  const id = props.data.invoice._id || props.data.invoice.id;
  isSubmitting.value = true;

  try {
    const userId =
      authStore.current_user?._id || authStore.current_user?.user?._id;
    const formData = {
      ...values,
      paymentCollectedBy: userId,
    };

    const res = await collect_invoice(id, formData);
    if (res.status === 200 || res.status === 201) {
      toast.success("Invoice collected successfully!");
      closeModal(true);
    } else {
      toast.error("Failed to collect invoice");
    }
  } catch (error: any) {
    const msg = error.response?.data?.message || "Unexpected error";
    toast.error(`Error: ${msg}`);
  } finally {
    isSubmitting.value = false;
  }
}
</script>
