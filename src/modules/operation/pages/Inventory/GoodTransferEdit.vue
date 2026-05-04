<template>
  <div v-if="isLoading" class="flex justify-center py-10">
    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
  </div>
  <GoodTransferForm
    v-else-if="initialValues"
    form-id="edit-good-transfer-form"
    :initial-values="initialValues"
    :on-submit="handleUpdate"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">
        Cancel
      </Button>
      <SubmitButton> Save Changes </SubmitButton>
    </template>
  </GoodTransferForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery, useMutation } from "@tanstack/vue-query";
import GoodTransferForm from "../../components/inventory/GoodTransferForm.vue";
import { fetch_good_transfer_details, update_good_transfer } from "../../api/inventory.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const id = route.params.id as string;

const { data: response, isLoading } = useQuery({
  queryKey: ["good-transfer", id],
  queryFn: () => fetch_good_transfer_details(id),
  enabled: !!id,
});

const initialValues = computed(() => {
  if (!response.value?.data) return null;
  const data = response.value.data.result || response.value.data;
  return {
    srv: data.srv?._id || data.srv || "",
    type: data.type || "ISSUE",
    issuedToBody: data.issuedToBody || "",
    issuedToVehicle: data.issuedToVehicle?._id || data.issuedToVehicle || "",
    issuedToContact: data.issuedToContact?._id || data.issuedToContact || "",
    supplierName: data.supplierName?._id || data.supplierName || "",
    classification: data.classification || "",
    creditSalesInvoiceNumber: data.creditSalesInvoiceNumber || "",
    cashSalesInvoiceNumber: data.cashSalesInvoiceNumber || "",
    items: data.items?.map((i: any) => ({
      item: i.item?._id || i.item || "",
      price: i.price || 0,
      quantity: i.quantity || 0,
      serials: i.serials || [],
      totalPrice: i.totalPrice || 0,
      remark: i.remark || "",
    })) || [],
    date: data.date ? new Date(data.date).toISOString().split('T')[0] : "",
  };
});

const mutation = useMutation({
  mutationFn: (values: any) => update_good_transfer(id, values),
});

const handleUpdate = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Transfer voucher updated successfully");
      router.push("/inventory/good-transfer");
    } else {
      toast.error(res.error || "Failed to update transfer voucher");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
