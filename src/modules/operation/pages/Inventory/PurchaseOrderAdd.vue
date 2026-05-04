<template>
  <PurchaseOrderForm
    form-id="add-purchase-order-form"
    :initial-values="initialValues"
    :on-submit="handleCreate"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">
        Discard Changes
      </Button>
      <SubmitButton> Create Purchase Order </SubmitButton>
    </template>
  </PurchaseOrderForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMutation } from "@tanstack/vue-query";
import PurchaseOrderForm from "../../components/inventory/PurchaseOrderForm.vue";
import { create_purchase_order } from "../../api/inventory.api";
import { useToastStore } from "@/store/toastStore";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";

const router = useRouter();
const toast = useToastStore();

const mutation = useMutation({
  mutationFn: (values: any) => create_purchase_order(values),
});

const initialValues = {
  pr: "",
  to: "",
  date: new Date().toISOString().split('T')[0],
  items: [],
  includeVAT: true,
  vatRate: 15,
};

const handleCreate = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Purchase order created successfully");
      router.push("/inventory/purchase-order");
    } else {
      toast.error(res.error || "Failed to create purchase order");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
