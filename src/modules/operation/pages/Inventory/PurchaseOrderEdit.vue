<template>
  <div v-if="isLoading" class="flex justify-center py-10">
    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
  </div>
  <PurchaseOrderForm
    v-else-if="initialValues"
    form-id="edit-purchase-order-form"
    :initial-values="initialValues"
    :on-submit="handleUpdate"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">
        Cancel
      </Button>
      <SubmitButton> Save Changes </SubmitButton>
    </template>
  </PurchaseOrderForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery, useMutation } from "@tanstack/vue-query";
import PurchaseOrderForm from "../../components/inventory/PurchaseOrderForm.vue";
import { fetch_purchase_order_details, update_purchase_order } from "../../api/inventory.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const id = route.params.id as string;

const { data: response, isLoading } = useQuery({
  queryKey: ["purchase-order", id],
  queryFn: () => fetch_purchase_order_details(id),
  enabled: !!id,
});

const initialValues = computed(() => {
  if (!response.value?.data) return null;
  const data = response.value.data.result || response.value.data;
  return {
    pr: data.pr?._id || data.pr || "",
    to: data.to?._id || data.to || "",
    date: data.date ? new Date(data.date).toISOString().split('T')[0] : "",
    items: data.items?.map((i: any) => ({
      item: i.item?._id || i.item || "",
      quantity: i.quantity || 0,
      price: i.price || 0,
      totalPrice: i.totalPrice || 0,
      remark: i.remark || "",
    })) || [],
    includeVAT: data.includeVAT ?? true,
    vatRate: data.vatRate || 15,
  };
});

const mutation = useMutation({
  mutationFn: (values: any) => update_purchase_order(id, values),
});

const handleUpdate = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Purchase order updated successfully");
      router.push("/inventory/purchase-order");
    } else {
      toast.error(res.error || "Failed to update purchase order");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
