<template>
  <div v-if="isLoading" class="flex justify-center py-10">
    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
  </div>
  <StoreRequisitionForm
    v-else-if="initialValues"
    form-id="edit-store-requisition-form"
    :initial-values="initialValues"
    :on-submit="handleUpdate"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">
        Cancel
      </Button>
      <SubmitButton> Save Changes </SubmitButton>
    </template>
  </StoreRequisitionForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery, useMutation } from "@tanstack/vue-query";
import StoreRequisitionForm from "../../components/inventory/StoreRequisitionForm.vue";
import { fetch_store_requisition_details, update_store_requisition } from "../../api/inventory.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const id = route.params.id as string;

const { data: response, isLoading } = useQuery({
  queryKey: ["store-requisition", id],
  queryFn: () => fetch_store_requisition_details(id),
  enabled: !!id,
});

const initialValues = computed(() => {
  if (!response.value?.data) return null;
  const data = response.value.data.result || response.value.data;
  return {
    date: data.date ? new Date(data.date).toISOString().split('T')[0] : "",
    requiredDate: data.requiredDate ? new Date(data.requiredDate).toISOString().split('T')[0] : "",
    department: data.department || "",
    classification: data.classification || "",
    costCenter: data.costCenter || "",
    siv: data.siv || "",
    items: data.items?.map((i: any) => ({
      item: i.inventoryItem?._id || i.item?._id || i.item || "",
      quantity: i.quantity || 0,
      remark: i.remark || "",
    })) || [{ item: "", quantity: 1, remark: "" }],
  };
});

const mutation = useMutation({
  mutationFn: (values: any) => update_store_requisition(id, values),
});

const handleUpdate = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Store requisition updated successfully");
      router.push("/inventory/store-requisition");
    } else {
      toast.error(res.error || "Failed to update store requisition");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
