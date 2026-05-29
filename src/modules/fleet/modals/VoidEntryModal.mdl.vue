<template>
  <FormModalParent
    title="Void Entry"
    :subtitle="`This action cannot be undone. Please provide a reason.`"
    form-id="void-entry-form"
    :submit-handler="handleSubmit"
    modal-style="auto"
    :values="{ voidReason: '' }"
  >
    <template #center>
      <TextareaInput
        name="voidReason"
        label="Void Reason"
        :validation="{ required }"
        :attributes="{
          placeholder: 'Explain why this entry is being voided...',
          rows: 3,
        }"
      />
    </template>

    <template #bottom>
      <div class="flex justify-end gap-3">
        <Button variant="secondary" size="md" @click="closeModal()">
          Cancel
        </Button>
        <SubmitButton variant="danger"> Confirm Void </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { closeModal } from "@customizer/modal-x";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { required } from "@/utils/validations";
import { useToastStore } from "@/store/toastStore";

const props = defineProps<{
  data: {
    entryId: string;
    voidFn: (id: string, reason: string) => Promise<any>;
  };
  close: (res: any) => void;
}>();

const toast = useToastStore();

async function handleSubmit(values: any) {
  const res = await props.data.voidFn(props.data.entryId, values.voidReason);
  if (res.success) {
    toast.success("Entry voided successfully");
    closeModal(true);
  } else {
    toast.error(res.error || "Failed to void entry");
  }
}
</script>
