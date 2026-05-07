<script setup lang="ts">
import { computed } from "vue";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import PurchaseOrderForm from "../inventory/PurchaseOrderForm.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { useToastStore } from "@/store/toastStore";
import {
  create_purchase_order,
  update_purchase_order,
} from "../../api/inventory.api";

const props = defineProps<{
  data?: any;
  close: (res?: any) => void;
}>();

const toast = useToastStore();
const isEdit = computed(() => !!props.data?.order);

const initialValues = computed(() => {
  if (isEdit.value) {
    const data = props.data?.order;
    return {
      pr: data.pr?._id || data.pr || "",
      prRef: data.pr?.referenceNumber || "",
      to: data.to?._id || data.to || "",
      date: data.date ? data.date.split("T")[0] : "",
      includeVAT: data.includeVAT ?? true,
      vatRate: data.vatRate || 15,
      items: (data.items || []).map((i: any) => ({
        item: i.item?._id || i.item || "",
        itemName: i.item?.name || "",
        quantity: i.quantity || 1,
        price: i.price || 0,
        remark: i.remark || "",
      })),
    };
  }
  return {
    pr: "",
    prRef: "",
    to: "",
    date: new Date().toISOString().split("T")[0],
    includeVAT: true,
    vatRate: 15,
    items: [],
  };
});

const calculateSubtotal = (items: any[]) => {
  return (items || []).reduce((sum: number, item: any) => {
    return sum + (Number(item.quantity) * Number(item.price) || 0);
  }, 0);
};

const calculateVAT = (items: any[], vatRate: number) => {
  return calculateSubtotal(items) * (Number(vatRate || 0) / 100);
};

const handleSubmit = async (values: any) => {
  try {
    const subtotal = calculateSubtotal(values.items);
    const vatAmount = values.includeVAT
      ? calculateVAT(values.items, values.vatRate)
      : 0;

    const submitValues = { ...values };
    delete submitValues.prRef;

    const payload = {
      ...submitValues,
      items: (values.items || []).map((i: any) => ({
        item: i.item,
        quantity: Number(i.quantity) || 1,
        remainingQuantity: Number(i.quantity) || 1,
        price: Number(i.price) || 0,
        totalPrice: Number(i.quantity) * Number(i.price),
        remark: i.remark || "",
      })),
      total: subtotal,
      vat: vatAmount,
      grandTotal: subtotal + vatAmount,
    };

    let res;
    if (isEdit.value) {
      res = await update_purchase_order(props.data.order._id, payload);
    } else {
      res = await create_purchase_order(payload);
    }

    if (res.success) {
      toast.success(
        isEdit.value
          ? "Purchase order updated successfully"
          : "Purchase order created successfully",
      );
      props.data?.onSuccess?.();
      props.close(true);
    } else {
      toast.error(
        res.error ||
          `Failed to ${isEdit.value ? "update" : "create"} purchase order`,
      );
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>

<template>
  <FormModalParent
    :title="isEdit ? 'Edit Purchase Order' : 'Create Purchase Order'"
    :values="initialValues"
    :submit-handler="handleSubmit"
    form-id="purchase-order-form"
    container-class="max-w-3xl"
  >
    <template #center>
      <PurchaseOrderForm />
    </template>

    <template #bottom="{ form }">
      <div class="flex justify-end gap-3">
        <Button variant="outline" size="md" @click="props.close()" type="button">
          Cancel
        </Button>
        <SubmitButton
          form-id="purchase-order-form"
          :loading="form.state.isSubmitting"
        >
          {{ isEdit ? "Save Changes" : "Create Purchase Order" }}
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>
