<template>
  <FormModalParent
    title="Confirm Approval"
    form-id="approvalForm"
    :submit-handler="handleFinalSubmit"
    modal-style="auto"
    :values="formValues"
  >
    <template #center>
      <div class="flex flex-col gap-4">
        <p class="text-sm text-gray-500">
          You are about to approve
          <span class="font-bold text-gray-700">{{ row.advanceNumber }}</span
          >. Please confirm or adjust the final amount.
        </p>

        <Input
          name="amount"
          label="Approval Amount"
          type="number"
          placeholder="Enter amount"
          :validation="{ required }"
        />
      </div>
    </template>

    <template #bottom>
      <div class="flex justify-end gap-3">
        <Button size="md" variant="outline" @click="closeModal()"
          >Cancel</Button
        >
        <SubmitButton form="approvalForm">Confirm Approval</SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { closeModal } from "@customizer/modal-x";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Input from "@/components/form/Input.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { required } from "@/utils/validations";

// [MODAL-X] Managed Props
export type Props = {
  row: any;
};

const props = defineProps<{ data: Props }>();

const row = computed(() => props.data.row);

const formValues = {
  amount: props.data.row.total || 0,
};

async function handleFinalSubmit(values: Record<string, any>) {
  closeModal({ amount: Number(values.amount) });
}
</script>
