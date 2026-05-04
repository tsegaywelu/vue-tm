<template>
  <div v-if="isLoading" class="flex justify-center py-10">
    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
  </div>
  <PurchaseRequisitionForm
    v-else-if="initialValues"
    form-id="edit-purchase-requisition-form"
    :initial-values="initialValues"
    :on-submit="handleUpdate"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">
        Cancel
      </Button>
      <SubmitButton> Save Changes </SubmitButton>
    </template>
  </PurchaseRequisitionForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery, useMutation } from "@tanstack/vue-query";
import PurchaseRequisitionForm from "../../components/inventory/PurchaseRequisitionForm.vue";
import { fetch_purchase_requisition_details, update_purchase_requisition } from "../../api/inventory.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const id = route.params.id as string;

const { data: response, isLoading } = useQuery({
  queryKey: ["purchase-requisition", id],
  queryFn: () => fetch_purchase_requisition_details(id),
  enabled: !!id,
});

const initialValues = computed(() => {
  if (!response.value?.data) return null;
  const data = response.value.data.result || response.value.data;
  return {
    srv: data.srv?._id || data.srv || "",
    date: data.date ? new Date(data.date).toISOString().split('T')[0] : "",
    approvedSTRDate: data.approvedSTRDate || "",
    items: data.items?.map((i: any) => ({
      item: i.item?._id || i.item || "",
      quantity: i.quantity || 0,
      remainingQuantity: i.remainingQuantity || 0,
      leadTime: i.leadTime || "",
      remark: i.remark || "",
    })) || [],
  };
});

const mutation = useMutation({
  mutationFn: (values: any) => update_purchase_requisition(id, values),
});

const handleUpdate = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Purchase requisition updated successfully");
      router.push("/inventory/purchase-requisition");
    } else {
      toast.error(res.error || "Failed to update purchase requisition");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
