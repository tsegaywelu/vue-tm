<template>
  <FormModalParent
    :title="isEdit ? 'Edit Store Requisition' : 'Create Store Requisition'"
    :subtitle="isEdit ? 'Update requisition details' : 'Register a new store requisition voucher'"
    form-id="store-requisition-form"
    :submit-handler="handleSubmit"
    modal-style="auto"
    :values="initialValues"
  >
    <template #center>
      <StoreRequisitionForm />
    </template>

    <template #bottom="{ form }">
      <div class="flex justify-end gap-3">
        <Button variant="outline" size="md" @click="close" type="button">
          Cancel
        </Button>
        <SubmitButton
          form-id="store-requisition-form"
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
import StoreRequisitionForm from "../inventory/StoreRequisitionForm.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { create_store_requisition, update_store_requisition } from "../../api/inventory.api";
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
      date: data.date ? data.date.split('T')[0] : "",
      requiredDate: data.requiredDate ? data.requiredDate.split('T')[0] : "",
      department: data.department || "",
      classification: data.classification || "",
      costCenter: data.costCenter || "",
      siv: data.siv || "",
      items: (data.items || []).map((i: any) => ({
        item: i.item?._id || i.item || "",
        itemName: i.item?.name || "",
        quantity: i.quantity || 1,
        remark: i.remark || "",
      })),
    };
  }
  return {
    date: new Date().toISOString().split('T')[0],
    requiredDate: "",
    department: "",
    classification: "",
    costCenter: "",
    siv: "",
    items: [],
  };
});

const handleSubmit = async (values: any) => {
  try {
    // Format items to ensure numeric quantity
    const payload = {
      date: values.date,
      requiredDate: values.requiredDate,
      department: values.department,
      classification: values.classification,
      costCenter: values.costCenter,
      siv: values.siv,
      items: (values.items || []).map((i: any) => ({
        item: i.item,
        quantity: Number(i.quantity) || 1,
        remark: i.remark || "",
      })),
    };

    let res;
    if (isEdit.value) {
      res = await update_store_requisition(props.data!.requisition._id, payload);
    } else {
      res = await create_store_requisition(payload);
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
