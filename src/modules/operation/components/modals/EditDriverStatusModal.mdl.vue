<template>
  <FormModalParent
    title="Edit Driver Status"
    :subtitle="`Update status for ${data.driver.firstName} ${data.driver.lastName}`"
    form-id="editDriverStatusForm"
    :submit-handler="handleSubmit"
    modal-style="auto"
    :values="initialValues"
  >
    <template #center="{ form }">
      <div class="flex flex-col gap-6">
        <ToggleInput
          name="isActive"
          label="Is Driver Active"
          :on_change="(val: boolean) => (isActive = val)"
        />

        <SelectInput
          name="driverStatus"
          label="Driver Status"
          :options="statusOptions"
          :validation="{ required }"
          :attributes="{ placeholder: 'Select status' }"
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
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { required } from "@/utils/validations";
import { useToastStore } from "@/store/toastStore";
import { update_driver_status } from "../../api/operation.api";
import { useMutation } from "@tanstack/vue-query";

const props = defineProps<{
  data: { driver: any };
  close: (res: any) => void;
}>();

const toast = useToastStore();
const isActive = ref(props.data.driver.isActive);

const initialValues = {
  isActive: props.data.driver.isActive,
  driverStatus: props.data.driver.driverStatus,
};

const activeOptions = [
  { value: "ready_to_dispatch", label: "Ready to Dispatch" },
  { value: "dispatched", label: "Dispatched" },
  { value: "vehicle_not_assigned", label: "Vehicle Not Assigned" },
];

const inactiveOptions = [
  { value: "unavailable", label: "Unavailable" },
  { value: "suspended", label: "Suspended" },
  { value: "terminated", label: "Terminated" },
  { value: "fired", label: "Fired" },
];

const statusOptions = computed(() => {
  return isActive.value ? activeOptions : inactiveOptions;
});

const mutation = useMutation({
  mutationFn: (payload: any) =>
    update_driver_status(props.data.driver._id, payload),
});

async function handleSubmit(values: any) {
  const res = await mutation.mutateAsync({
    isActive: values.isActive,
    driverStatus: values.driverStatus,
  });
  if (res.success || res.status === 200 || res.status === 201) {
    toast.success("Driver status updated successfully");
    closeModal(true);
  } else {
    toast.error(res.error || "Failed to update driver status");
  }
}
</script>
