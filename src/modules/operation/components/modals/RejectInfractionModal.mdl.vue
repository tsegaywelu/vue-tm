<template>
  <FormModalParent
    title="Reject Infraction"
    subtitle="Please enter the reason for rejecting this infraction"
    form-id="rejectForm"
    :values="formValues"
    :submit-handler="handleSubmit"
    modal-style="auto"
  >
    <template #center>
      <div class="flex flex-col gap-4">
        <TextareaInput
          name="rejectionReason"
          label="Rejection Reason"
          :validation="{ required }"
          :attributes="{ placeholder: 'Enter rejection reason' }"
        />
      </div>
    </template>
    <template #bottom>
      <div class="flex justify-end gap-3">
        <Button type="button" variant="outline" size="md" @click="close(false)">
          Cancel
        </Button>
        <SubmitButton form="rejectForm" :loading="mutation.isPending.value">
          Reject
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
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
  rejectionReason: "",
};

const mutation = useMutation({
  mutationFn: (payload: { rejectionReason: string }) =>
    update_infraction_status(props.data.infractionId, "reject", payload),
});

async function handleSubmit(values: { rejectionReason: string }) {
  if (!values.rejectionReason.trim()) {
    toast.error("Rejection reason is required");
    return;
  }

  try {
    const res: any = await mutation.mutateAsync({
      rejectionReason: values.rejectionReason.trim(),
    });
    if (res.success || res.status === 200 || res.status === 201) {
      toast.success("Infraction rejected successfully");
      props.close(true);
    } else {
      toast.error(res.error || "Failed to reject infraction");
    }
  } catch (err: any) {
    toast.error(err.response?.data?.description || "Failed to reject infraction");
  }
}
</script>
