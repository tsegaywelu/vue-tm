<template>
  <GoodTransferForm
    form-id="add-good-transfer-form"
    :initial-values="initialValues"
    :on-submit="handleCreate"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">
        Discard Changes
      </Button>
      <SubmitButton> Submit Transfer </SubmitButton>
    </template>
  </GoodTransferForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMutation } from "@tanstack/vue-query";
import GoodTransferForm from "../../components/inventory/GoodTransferForm.vue";
import { create_good_transfer } from "../../api/inventory.api";
import { useToastStore } from "@/store/toastStore";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";

const router = useRouter();
const toast = useToastStore();

const mutation = useMutation({
  mutationFn: (values: any) => create_good_transfer(values),
});

const initialValues = {
  srv: "",
  type: "ISSUE",
  issuedToBody: "",
  issuedToVehicle: "",
  issuedToContact: "",
  supplierName: "",
  classification: "",
  creditSalesInvoiceNumber: "",
  cashSalesInvoiceNumber: "",
  items: [],
  date: new Date().toISOString().split('T')[0],
};

const handleCreate = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Transfer voucher submitted successfully");
      router.push("/inventory/good-transfer");
    } else {
      toast.error(res.error || "Failed to submit transfer voucher");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
