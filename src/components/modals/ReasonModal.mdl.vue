<template>
  <FormModalParent
    modal-style="auto"
    :title="data.title || 'Cancel Order'"
    form-id="reasonForm"
    :onSubmit="onSubmit"
  >
    <template #center>
      <div class="mb-4 text-sm text-gray-600">
        {{ data.message || "Please provide a reason for this action." }}
      </div>
      <TextareaInput
        name="cancelReason"
        label="Reason"
        :attributes="{
          rows: 4,
          placeholder: 'Enter reason here...',
        }"
        :validation="{ required }"
      />
    </template>

    <template #bottom>
      <div class="flex justify-end gap-3 mt-4">
        <Button type="button" variant="outline" size="md" @click="cancel">
          Cancel
        </Button>
        <SubmitButton variant="secondary" size="md" form="reasonForm">
          {{ data.confirmText || "Confirm" }}
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Button from "@/components/common/Button.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { required } from "@/utils/validations";

// [MODAL-X] AUTO-GENERATED INSTANCE
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
const props = defineProps<{ data: Props; close: (res: ReturnType) => void }>();


export type ReturnType = string | boolean;
export type Props = {
  title?: string;
  message?: string;
  confirmText?: string;
};

const onSubmit = async (values: any) => {
  props.close(values.cancelReason);
};

function cancel() {
  props.close(false);
}
</script>
