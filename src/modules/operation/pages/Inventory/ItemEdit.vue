<template>
  <div v-if="isLoading" class="flex justify-center py-10">
    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
  </div>
  <ItemForm
    v-else-if="initialValues"
    form-id="edit-item-form"
    :initial-values="initialValues"
    :on-submit="handleUpdate"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">
        Cancel
      </Button>
      <SubmitButton> Save Changes </SubmitButton>
    </template>
  </ItemForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery, useMutation } from "@tanstack/vue-query";
import ItemForm from "../../components/inventory/ItemForm.vue";
import { fetch_inventory_item_details, update_inventory_item } from "../../api/inventory.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const id = route.params.id as string;

const { data: response, isLoading } = useQuery({
  queryKey: ["inventory-item", id],
  queryFn: () => fetch_inventory_item_details(id),
  enabled: !!id,
});

const initialValues = computed(() => {
  if (!response.value?.data) return null;
  const data = response.value.data.result || response.value.data;
  return {
    name: data.name || "",
    codeNumber: data.codeNumber || "",
    partNumber: data.partNumber || "",
    itemGroup: data.itemGroup?._id || data.itemGroup || "",
    inventoryType: data.inventoryType || "",
    uom: data.uom || "",
    isTyre: data.isTyre || false,
    quantity: data.quantity || 0,
    reorderLevel: data.reorderLevel || 0,
    price: data.price || 0,
    serialPrices: data.serialPrices || [{ serialNumber: "", price: "" }],
  };
});

const mutation = useMutation({
  mutationFn: (values: any) => update_inventory_item(id, values),
});

const handleUpdate = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Inventory item updated successfully");
      router.push("/inventory/items");
    } else {
      toast.error(res.error || "Failed to update inventory item");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
