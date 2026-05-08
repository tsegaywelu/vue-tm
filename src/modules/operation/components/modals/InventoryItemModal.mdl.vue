<template>
  <FormModalParent
    :title="isEdit ? 'Edit Inventory Item' : 'Add Inventory Item'"
    :subtitle="isEdit ? 'Update item details' : 'Create a new inventory item'"
    form-id="inventory-item-form"
    :submit-handler="handleSubmit"
    modal-style="auto"
    :values="initialValues"
  >
    <template #center="{ form }">
      <ItemForm :values="form.state.values" />
    </template>

    <template #bottom="{ form }">
      <div class="flex justify-end gap-3">
        <Button variant="outline" size="md" @click="close" type="button">
          Cancel
        </Button>
        <SubmitButton
          form-id="inventory-item-form"
          :loading="form.state.isSubmitting"
        >
          {{ isEdit ? 'Save Changes' : 'Create Item' }}
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import ItemForm from "../inventory/ItemForm.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { create_inventory_item, update_inventory_item } from "../../api/inventory.api";
import { useToastStore } from "@/store/toastStore";

const props = defineProps<{
  data?: {
    item?: any;
    onSuccess?: () => void;
  };
  close: (res?: any) => void;
}>();

const toast = useToastStore();
const isEdit = computed(() => !!props.data?.item);

const initialValues = computed(() => {
  if (isEdit.value) {
    const data = props.data?.item;
    return {
      name: data.name || "",
      codeNumber: data.codeNumber || "",
      partNumber: data.partNumber || "",
      itemGroup: data.itemGroup?._id || data.itemGroup || "",
      inventoryType: data.inventoryType || "CONSUMABLE",
      uom: data.uom || "",
      quantity: data.quantity || 0,
      reorderLevel: data.reorderLevel || 0,
      price: data.price || 0,
      isTyre: data.isTyre || false,
      serialPrices: data.serialPrices || [],
    };
  }
  return {
    name: "",
    codeNumber: "",
    partNumber: "",
    itemGroup: "",
    inventoryType: "CONSUMABLE",
    uom: "",
    quantity: 0,
    reorderLevel: 0,
    price: 0,
    isTyre: false,
    serialPrices: [],
  };
});

const handleSubmit = async (values: any) => {
  try {
    const finalValues: any = {
      name: values.name,
      codeNumber: values.codeNumber,
      partNumber: values.partNumber,
      inventoryType: values.inventoryType,
      uom: values.uom,
      quantity: Number(values.quantity) || 0,
      reorderLevel: Number(values.reorderLevel) || 0,
      price: Number(values.price) || 0,
      isTyre: values.isTyre,
    };

    if (values.itemGroup) finalValues.itemGroup = values.itemGroup;

    if (values.inventoryType === 'SERIALIZED') {
      finalValues.reorderLevel = 1;
      finalValues.serialPrices = values.serialPrices || [];
    } else {
      finalValues.totalPrice = (Number(values.price) || 0) * (Number(values.quantity) || 0);
    }

    let res;
    if (isEdit.value) {
      res = await update_inventory_item(props.data!.item._id, finalValues);
    } else {
      res = await create_inventory_item(finalValues);
    }

    if (res.success) {
      toast.success(isEdit.value ? "Item updated successfully" : "Item created successfully");
      props.data?.onSuccess?.();
      props.close(true);
    } else {
      toast.error(res.error || `Failed to ${isEdit.value ? 'update' : 'create'} item`);
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
