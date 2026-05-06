<template>
  <FormModalParent
    title="Edit Vehicle Goals"
    :subtitle="`Update performance goals for ${data.plateNumber}`"
    form-id="vehicleGoalForm"
    :submit-handler="handleSubmit"
    modal-style="auto"
    :values="data.goals"
  >
    <template #center>
      <div class="flex flex-col gap-6">
        <div class="grid grid-cols-1 gap-4">
          <Input
            name="targetDistanceKm"
            label="Kilometer Goal (Km)"
            :attributes="{ placeholder: 'Enter Kilometer Goal' }"
            :validation="{ required, number }"
          />
          <Input
            name="targetShipmentCount"
            label="Shipment Goal (Trips)"
            :attributes="{ placeholder: 'Enter Shipment Goal' }"
            :validation="{ required, number }"
          />
          <Input
            name="targetFuelEfficiency"
            label="Fuel Efficiency Goal (Km/L)"
            :attributes="{ placeholder: 'Enter Fuel Efficiency Goal' }"
            :validation="{ required, number }"
          />
        </div>
      </div>
    </template>

    <template #bottom="{ form }">
      <div class="flex justify-end gap-3">
        <Button variant="outline" size="md" @click="closeModal" type="button">
          Cancel
        </Button>
        <SubmitButton
          form-id="vehicleGoalForm"
          :loading="form.state.isSubmitting"
        >
          Save Goals
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Input from "@/components/form/Input.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { number, required } from "@/utils/validations";
import { upsert_vehicle_monthly_goal } from "../../api/operation.api";
import { useToastStore } from "@/store/toastStore";
import { closeModal } from "@customizer/modal-x";

export type Props = {
  vehicleId: string;
  plateNumber: string;
  goals: {
    targetDistanceKm: number;
    targetShipmentCount: number;
    targetFuelEfficiency: number;
    month: number;
    year: number;
  };
  onSuccess: () => void;
};
const props = defineProps<{ data: Props; close: (res: any) => void }>();

console.log(props.data);
const toast = useToastStore();

const handleSubmit = async (values: any) => {
  try {
    const res = await upsert_vehicle_monthly_goal(props.data.vehicleId, {
      month: props.data.goals.month,
      year: props.data.goals.year,
      targetDistanceKm: Number(values.targetDistanceKm),
      targetShipmentCount: Number(values.targetShipmentCount),
      targetFuelEfficiency: Number(values.targetFuelEfficiency),
    });

    if (res.status === 200 || res.status === 201) {
      toast.success("Vehicle goals updated successfully");
      props.data.onSuccess();
      closeModal();
    } else {
      toast.error("Failed to update vehicle goals");
    }
  } catch (error: any) {
    toast.error(error.response?.data?.description || "An error occurred");
  }
};
</script>
