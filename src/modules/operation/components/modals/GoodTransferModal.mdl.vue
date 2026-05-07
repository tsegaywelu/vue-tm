<script setup lang="ts">
import { computed } from "vue";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import GoodTransferForm from "../inventory/GoodTransferForm.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { useToastStore } from "@/store/toastStore";
import {
  create_good_transfer,
  update_good_transfer,
} from "../../api/inventory.api";

const props = defineProps<{
  data?: any;
  close: (res?: any) => void;
}>();

const toast = useToastStore();
const isEdit = computed(() => !!props.data?.transfer);

const initialValues = computed(() => {
  if (isEdit.value) {
    const data = props.data?.transfer;
    return {
      srv: data.srv?._id || data.srv || "",
      type: data.type || "ISSUE",
      issuedToBody: data.issuedToBody || "",
      issuedToVehicle: data.issuedToVehicle?._id || data.issuedToVehicle || "",
      issuedToContact: data.issuedToContact?._id || data.issuedToContact || "",
      supplier: data.supplier?._id || data.supplier || "",
      classification: data.classification || "",
      creditSalesInvoiceNumber: data.creditSalesInvoiceNumber || "",
      cashSalesInvoiceNumber: data.cashSalesInvoiceNumber || "",
      items: (data.items || []).map((i: any) => ({
        item: i.item?._id || i.item || "",
        itemName: i.item?.name || "",
        inventoryType: i.item?.inventoryType || "CONSUMABLE",
        quantity: i.quantity || 0,
        price: i.price || 0,
        serials: i.serials || [],
        remark: i.remark || "",
      })),
    };
  }
  return {
    srv: "",
    type: "ISSUE",
    issuedToBody: "",
    items: [],
    supplier: "",
  };
});

const handleSubmit = async (values: any) => {
  try {
    const payload = {
      ...values,
      items: (values.items || []).map((i: any) => ({
        item: i.item,
        quantity: i.inventoryType === 'SERIALIZED' ? (i.serials?.length || 0) : Number(i.quantity),
        price: Number(i.price) || 0,
        totalPrice: (i.inventoryType === 'SERIALIZED' ? (i.serials?.length || 0) : Number(i.quantity)) * (Number(i.price) || 0),
        serials: i.serials || [],
        remark: i.remark || "",
      })),
    };

    let res;
    if (isEdit.value) {
      res = await update_good_transfer(props.data.transfer._id, payload);
    } else {
      res = await create_good_transfer(payload);
    }

    if (res.success) {
      toast.success(isEdit.value ? "Transfer updated successfully" : "Transfer created successfully");
      props.data?.onSuccess?.();
      props.close(true);
    } else {
      toast.error(res.error || `Failed to ${isEdit.value ? 'update' : 'create'} transfer`);
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>

<template>
  <FormModalParent
    :title="isEdit ? 'Edit Transfer Voucher' : 'Create Transfer Voucher'"
    :values="initialValues"
    :submit-handler="handleSubmit"
    form-id="good-transfer-form"
    container-class="max-w-4xl"
  >
    <template #center>
      <GoodTransferForm />
    </template>

    <template #bottom="{ form }">
      <div class="flex justify-end gap-3">
        <Button variant="outline" size="md" @click="props.close()" type="button">
          Cancel
        </Button>
        <SubmitButton
          form-id="good-transfer-form"
          :loading="form.state.isSubmitting"
        >
          {{ isEdit ? 'Save Changes' : 'Submit Transfer' }}
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>
