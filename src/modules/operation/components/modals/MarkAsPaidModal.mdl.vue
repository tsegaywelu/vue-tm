<template>
  <FormModalParent
    title="Mark as Paid"
    subtitle="Submit payment reference for this infraction"
    form-id="markPaidForm"
    :values="formValues"
    :submit-handler="handleSubmit"
    modal-style="auto"
  >
    <template #center>
      <div class="flex flex-col gap-4">
        <Input
          name="paymentReference"
          label="Payment Reference"
          :attributes="{ placeholder: 'Enter payment reference' }"
        />
      </div>
    </template>
    <template #bottom>
      <div class="flex justify-end gap-3">
        <Button type="button" variant="outline" size="md" @click="close(false)">
          Cancel
        </Button>
        <SubmitButton form="markPaidForm" :loading="mutation.isPending.value">
          Mark as Paid
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Input from "@/components/form/Input.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { required } from "@/utils/validations";
import { useToastStore } from "@/store/toastStore";
import { update_infraction_status } from "../../api/infraction.api";

export type ReturnType = boolean;
export type Props = {
  infractionId: string;
};

const props = defineProps<{ data: Props; close: (res: any) => void }>();
const toast = useToastStore();

const formValues = {
  paymentReference: "",
};

const mutation = useMutation({
  mutationFn: (payload: { paymentReference: string }) =>
    update_infraction_status(props.data.infractionId, "mark-paid", payload),
});

async function handleSubmit(values: { paymentReference: string }) {
  try {
    const res: any = await mutation.mutateAsync({
      paymentReference: values.paymentReference.trim(),
    });
    if (res.success || res.status === 200 || res.status === 201) {
      toast.success("Infraction marked as paid successfully");
      props.close(true);
    } else {
      toast.error(res.error || "Failed to mark as paid");
    }
  } catch (err: any) {
    toast.error(err.response?.data?.description || "Failed to mark as paid");
  }
}
</script>
