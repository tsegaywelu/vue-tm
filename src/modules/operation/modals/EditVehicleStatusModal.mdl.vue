<template>
  <FormModalParent
    title="Edit Vehicle Status"
    :subtitle="`Update status for ${data.vehicle.plateNumber}`"
    form-id="editVehicleStatusForm"
    :submit-handler="handleSubmit"
    modal-style="auto"
    :values="initialValues"
  >
    <template #center="{ form }">
      <div class="flex flex-col gap-6">
        <ToggleInput
          name="isOperational"
          label="Is Vehicle Operational"
          :on_change="(val) => (isOperational = val)"
        />

        <SelectInput
          name="status"
          label="Vehicle Status"
          :options="statusOptions"
          :validation="{ required }"
          :attributes="{ placeholder: 'Select status' }"
        />

        <DateInput
          v-if="
            form.state.values.status === 'accident' ||
            form.state.values.status === 'maintenance'
          "
          name="estimatedMaintenanceEndDate"
          label="Maintenance End Date"
          :attributes="{ placeholder: 'Select end date' }"
        />
      </div>
    </template>

    <template #bottom>
      <div class="flex justify-end gap-3">
        <Button variant="secondary" size="md" @click="closeModal()">
          Cancel
        </Button>
        <SubmitButton> Update Status </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { closeModal } from "@customizer/modal-x";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import ToggleInput from "@/components/form/ToggleInput.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import DateInput from "@/components/form/DateInput.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { required } from "@/utils/validations";
import { useToastStore } from "@/store/toastStore";
import { update_vehicle_status } from "../api/operation.api";
import { useMutation } from "@tanstack/vue-query";

const props = defineProps<{
  data: { vehicle: any };
  close: (res: any) => void;
}>();
const toast = useToastStore();
const isOperational = ref(props.data.vehicle.isOperational);

const initialValues = {
  isOperational: props.data.vehicle.isOperational,
  status: props.data.vehicle.status,
  estimatedMaintenanceEndDate:
    props.data.vehicle.estimatedMaintenanceEndDate || "",
};

const operationalOptions = [
  { value: "available", label: "Available" },
  { value: "assigned", label: "Assigned" },
];

const nonOperationalOptions = [
  { value: "inactive", label: "Inactive" },
  { value: "maintenance", label: "Maintenance" },
  { value: "accident", label: "Accident" },
  { value: "retired", label: "Retired" },
  { value: "sold", label: "Sold" },
];

const statusOptions = computed(() => {
  return isOperational.value ? operationalOptions : nonOperationalOptions;
});

const mutation = useMutation({
  mutationFn: (payload: any) =>
    update_vehicle_status(props.data.vehicle._id, payload),
});

async function handleSubmit(values: any) {
  const res = await mutation.mutateAsync({
    ...values,
    estimatedMaintenanceEndDate: null,
  });
  if (res.success) {
    toast.success("Vehicle status updated successfully");
    closeModal(true);
  } else {
    toast.error(res.error || "Failed to update status");
  }
}
</script>
