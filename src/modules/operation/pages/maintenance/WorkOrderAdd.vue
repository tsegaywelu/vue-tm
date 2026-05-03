<template>
  <WorkOrderForm
    form-id="add-work-order-form"
    :initial-values="initialValues"
    :on-submit="handleCreateWorkOrder"
  >
    <template #submit-btn="{ form }">
      <Button size="md" variant="outline" @click="form.reset()">
        Discard Changes
      </Button>
      <SubmitButton> Create Work Order </SubmitButton>
    </template>
  </WorkOrderForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import WorkOrderForm from "../../components/maintenance/WorkOrderForm.vue";
import { create_work_order } from "../../api/work-order.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useMutation } from "@tanstack/vue-query";

const router = useRouter();
const toast = useToastStore();

const mutation = useMutation({
  mutationFn: (values: any) => create_work_order(values),
});

const initialValues = {
  vehicle: "",
  fuelLevel: "HALF",
  odometer: null,
  startDate: new Date().toISOString().split("T")[0],
  estimatedCompletionDate: new Date().toISOString().split("T")[0],
  workArea: "WORKSHOP",
  workshop: "",
  workType: "MAINTENANCE",
  partsCost: null,
  serviceTypes: [""],
  mechanics: [""],
  tasks: [],
  description: "",
};

const handleCreateWorkOrder = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Work Order created successfully");
      router.push("/maintenance/work-order");
    } else {
      toast.error(res.error || "Failed to create work order");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
