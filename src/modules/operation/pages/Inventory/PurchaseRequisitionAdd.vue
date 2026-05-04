<template>
  <PurchaseRequisitionForm
    form-id="add-purchase-requisition-form"
    :initial-values="initialValues"
    :on-submit="handleCreate"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">
        Discard Changes
      </Button>
      <SubmitButton> Submit Requisition </SubmitButton>
    </template>
  </PurchaseRequisitionForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMutation } from "@tanstack/vue-query";
import PurchaseRequisitionForm from "../../components/inventory/PurchaseRequisitionForm.vue";
import { create_purchase_requisition } from "../../api/inventory.api";
import { useToastStore } from "@/store/toastStore";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";

const router = useRouter();
const toast = useToastStore();

const mutation = useMutation({
  mutationFn: (values: any) => create_purchase_requisition(values),
});

const initialValues = {
  srv: "",
  date: new Date().toISOString().split('T')[0],
  approvedSTRDate: "",
  items: [],
};

const handleCreate = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Purchase requisition submitted successfully");
      router.push("/inventory/purchase-requisition");
    } else {
      toast.error(res.error || "Failed to submit purchase requisition");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
