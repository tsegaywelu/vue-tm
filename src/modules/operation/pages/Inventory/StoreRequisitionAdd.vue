<template>
  <StoreRequisitionForm
    form-id="add-store-requisition-form"
    :initial-values="initialValues"
    :on-submit="handleCreate"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">
        Discard Changes
      </Button>
      <SubmitButton> Submit Requisition </SubmitButton>
    </template>
  </StoreRequisitionForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMutation } from "@tanstack/vue-query";
import StoreRequisitionForm from "../../components/inventory/StoreRequisitionForm.vue";
import { create_store_requisition } from "../../api/inventory.api";
import { useToastStore } from "@/store/toastStore";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";

const router = useRouter();
const toast = useToastStore();

const mutation = useMutation({
  mutationFn: (values: any) => create_store_requisition(values),
});

const initialValues = {
  date: new Date().toISOString().split('T')[0],
  requiredDate: "",
  department: "",
  classification: "",
  costCenter: "",
  siv: "",
  items: [{ item: "", quantity: 1, remark: "" }],
};

const handleCreate = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Store requisition submitted successfully");
      router.push("/inventory/store-requisition");
    } else {
      toast.error(res.error || "Failed to submit store requisition");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
