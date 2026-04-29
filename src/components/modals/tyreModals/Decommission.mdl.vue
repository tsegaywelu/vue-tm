<template>
  <FormModalParent
    :values="formValues"
    @submit="handleFormSubmit"
    modal-style="auto"
    title="Decommission Tyre"
    form-id="decommissionForm"
  >
    <template #center>
      <!-- Mileage Input -->
      <Input
        name="mileage"
        label="Mileage"
       
        :attributes="{ placeholder: 'Enter mileage', type:'number', min: 0 }"
        :validation="{ required }"
      />

      <!-- Date Input -->
      <DateInput
        name="date"
        label="Date"
        :validation="{ required }"
        :attributes="{
          placeholder: 'Select date',
        }"
      />

      <!-- Description Input -->
      <TextareaInput
        name="description"
        label="Description"
        :rows="4"
        :attributes="{ placeholder: 'Enter a description...' }"
      />
    </template>

    <template #bottom>
      <div class="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          size="lg-sm"
          @click="close(false)"
        >
          Cancel
        </Button>
        <SubmitButton variant="primary" size="lg-sm" :is-loading="isLoading">
          Save
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { closeModal } from "@customizer/modal-x";
import FormModalParent from "../FormModalParent.vue";
import Button from "@/components/common/Button.vue";
import Input from "@/components/form/Input.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import DateInput from "@/components/form/DateInput.vue";
import { number, required } from "@/utils/validations";
import { useToastStore } from "@/store/toastStore";
import { update_tyre_status } from "@/modules/operation/api/tyre.api";

export type ReturnType = boolean;
export type Props = {
  tyre: any;
};

const props = defineProps<{ data: Props; close: (res: ReturnType) => void }>();

const toast = useToastStore();
const isLoading = ref(false);

const tyre = computed(() => props.data.tyre ?? {});

const formValues = computed(() => ({
  mileage: "",
  date: "",
  description: "",
}));

async function handleFormSubmit(values: any) {
  const id = tyre.value._id;
  isLoading.value = true;

  try {
    const data = {
      mileage: Number(values.mileage),
      date: values.date,
      description: values.description,
    };

    const res: any = await update_tyre_status(id, "decommission", data);

    if (res.status === 200 || res.status === 201) {
      toast.addToast("Tyre status updated successfully!", "success");
      props.close(true);
    } else {
      toast.addToast(
        `Error: ${res.data?.description || "Unknown error occurred."}`,
        "error"
      );
    }
  } catch (error: any) {
    const msg =
      error.response?.data?.description || error.message || "Unexpected error";
    toast.addToast(`Error: ${msg}`, "error");
  } finally {
    isLoading.value = false;
  }
}
</script>
