<template>
  <FormModalParent
    :title="isEdit ? 'Edit Purchase Requisition' : 'Create Purchase Requisition'"
    :subtitle="isEdit ? 'Update requisition details' : 'Register a new purchase requisition request'"
    form-id="purchase-requisition-form"
    :submit-handler="handleSubmit"
    modal-style="auto"
    :values="initialValues"
  >
    <template #center>
      <PurchaseRequisitionForm />
    </template>

    <template #bottom="{ form }">
      <div class="flex justify-end gap-3">
        <Button variant="outline" size="md" @click="close" type="button">
          Cancel
        </Button>
        <SubmitButton
          form-id="purchase-requisition-form"
          :loading="form.state.isSubmitting"
        >
          {{ isEdit ? 'Save Changes' : 'Submit Requisition' }}
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import PurchaseRequisitionForm from "../inventory/PurchaseRequisitionForm.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { create_purchase_requisition, update_purchase_requisition } from "../../api/inventory.api";
import { useToastStore } from "@/store/toastStore";

const props = defineProps<{
  data?: {
    requisition?: any;
    onSuccess?: () => void;
  };
  close: (res?: any) => void;
}>();

const toast = useToastStore();
const isEdit = computed(() => !!props.data?.requisition);

const initialValues = computed(() => {
  if (isEdit.value) {
    const data = props.data?.requisition;
    return {
      srv: data.srv?._id || data.srv || "",
      srvRef: data.srv?.referenceNumber || "",
      date: data.date ? data.date.split('T')[0] : "",
      requestedDate: data.requestedDate ? data.requestedDate.split('T')[0] : "",
      approvedSTRDate: data.approvedSTRDate || "",
      supplierName: data.supplierName || "",
      remark: data.remark || "",
      items: (data.items || []).map((i: any) => ({
        item: i.item?._id || i.item || "",
        itemName: i.item?.name || "",
        quantity: i.quantity || 1,
        leadTime: i.leadTime || "",
        remark: i.remark || "",
      })),
    };
  }
  return {
    srv: "",
    date: new Date().toISOString().split('T')[0],
    requestedDate: new Date().toISOString().split('T')[0],
    approvedSTRDate: "",
    supplierName: "",
    remark: "",
    items: [],
  };
});

const handleSubmit = async (values: any) => {
  try {
    const payload = {
      ...values,
      items: (values.items || []).map((i: any) => ({
        item: i.item,
        quantity: Number(i.quantity) || 1,
        remainingQuantity: Number(i.quantity) || 1,
        leadTime: i.leadTime || "",
        remark: i.remark || "",
      })),
    };

    let res;
    if (isEdit.value) {
      res = await update_purchase_requisition(props.data!.requisition._id, payload);
    } else {
      res = await create_purchase_requisition(payload);
    }

    if (res.success) {
      toast.success(isEdit.value ? "Requisition updated successfully" : "Requisition submitted successfully");
      props.data?.onSuccess?.();
      props.close(true);
    } else {
      toast.error(res.error || `Failed to ${isEdit.value ? 'update' : 'submit'} requisition`);
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
