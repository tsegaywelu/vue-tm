<template>
  <FormModalParent
    modal-style="auto"
    title="Pay Invoice"
    subtitle="Submit payment collection details for this invoice"
    :form="form"
    form-id="payInvoiceForm"
    @close="cancel"
  >
    <template #center>
      <div class="grid grid-cols-1 gap-4">
        <Input
          name="checkNumber"
          label="Check Number / Reference"
          placeholder="Enter check or transaction number"
          :validation="{ required }"
        />
        <DateInput
          name="paymentCollectedDate"
          label="Payment Date"
          :validation="{ required }"
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
          form="payInvoiceForm"
        >
          Submit Payment
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
import SubmitButton from "@/components/form/SubmitButton.vue";
import DateInput from "@/components/form/DateInput.vue";
import { required } from "@/utils/validations";
import { collect_shipper_invoice } from "../../api/shipper.api";
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
    checkNumber: "",
  },
  onSubmit: async ({ value }) => {
    await handleFormSubmit(value);
  },
}) as any;

provide("formContext", {
  id: "payInvoiceForm",
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
      paymentCollectedBy: userId,
      paymentCollectedDate: values.paymentCollectedDate,
      checkNumber: values.checkNumber,
    };

    const res = await collect_shipper_invoice(id, formData);
    if (res.success) {
      toast.success("Invoice payment submitted successfully!");
      closeModal(true);
    } else {
      toast.error(res.error || "Failed to submit payment");
    }
  } catch (error: any) {
    toast.error(error?.error || "An error occurred");
  } finally {
    isSubmitting.value = false;
  }
}
</script>
