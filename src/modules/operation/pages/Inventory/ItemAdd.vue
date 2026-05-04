<template>
  <ItemForm
    form-id="add-item-form"
    :initial-values="initialValues"
    :on-submit="handleCreate"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">
        Discard Changes
      </Button>
      <SubmitButton> Create Inventory Item </SubmitButton>
    </template>
  </ItemForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMutation } from "@tanstack/vue-query";
import ItemForm from "../../components/inventory/ItemForm.vue";
import { create_inventory_item } from "../../api/inventory.api";
import { useToastStore } from "@/store/toastStore";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";

const router = useRouter();
const toast = useToastStore();

const mutation = useMutation({
  mutationFn: (values: any) => create_inventory_item(values),
});

const initialValues = {
  name: "",
  codeNumber: "",
  partNumber: "",
  itemGroup: "",
  inventoryType: "",
  uom: "",
  isTyre: false,
  serialPrices: [{ serialNumber: "", price: "" }],
};

const handleCreate = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Inventory item created successfully");
      router.push("/inventory/items");
    } else {
      toast.error(res.error || "Failed to create inventory item");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
