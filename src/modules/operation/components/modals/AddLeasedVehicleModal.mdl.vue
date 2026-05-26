<template>
  <FormModalParent
    title="Add Vehicle Lease Agreement"
    subtitle="Register a new leased vehicle agreement"
    form-id="addLeaseForm"
    :submit-handler="handleSubmit"
    modal-style="auto"
    :values="{}"
  >
    <template #center="{ form }">
      <div class="flex flex-col gap-4">
        <component
          :is="form.Subscribe"
          :selector="(state: any) => [state.values.leaseDirection]"
        >
          <template #default="[leaseDirection]">
            <VehicleInput
              name="vehicle"
              @select="(opt: any) => (selectedVehicle = opt.item)"
              :validation="{ required }"
              :key="leaseDirection"
            />
          </template>
        </component>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DateInput
            name="startDate"
            label="Start Date"
            :validation="{ required }"
            :attributes="{
              placeholder: 'Select Start Date',
            }"
          />
          <DateInput
            name="endDate"
            label="End Date"
            :validation="{ required }"
            :attributes="{
              placeholder: 'Select End Date',
            }"
          />
        </div>
        <Input
          type="number"
          name="amount"
          label="Amount"
          :validation="{ required, price }"
          :attributes="{
            placeholder: 'Enter Amount',
          }"
        />
        <SelectInput
          label="Lease Direction"
          name="leaseDirection"
          :options="[
            { label: 'Inward', value: 'INWARD' },
            { label: 'Outward', value: 'OUTWARD' },
          ]"
          :validation="{ required }"
          :attributes="{ placeholder: 'Select Direction' }"
        />

        <component
          :is="form.Subscribe"
          :selector="(state: any) => [state.values.leaseDirection]"
        >
          <template #default="[leaseDirection]">
            <SelectInput
              v-if="leaseDirection === 'OUTWARD'"
              label="Transporter"
              name="transporter"
              url="/transporter"
              label_key="name"
              value_key="_id"
              searchable
              :validation="{ required }"
              :attributes="{ placeholder: 'Select Transporter' }"
            />
          </template>
        </component>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ToggleInput name="coversMaintenance" label="Covers Maintenance" />
          <ToggleInput name="coversAdvance" label="Covers Advance" />
        </div>
      </div>
    </template>
    <template #bottom="{ form }">
      <div class="flex justify-end gap-3">
        <Button
          size="md"
          variant="outline"
          @click="
            form.resetForm();
            closeModal(false);
          "
          >Cancel</Button
        >
        <SubmitButton>Submit</SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import ToggleInput from "@/components/form/ToggleInput.vue";
import VehicleInput from "@/components/common/inputs/VehicleInput.vue";
import { price, required } from "@/utils/validations";
import { useToastStore } from "@/store/toastStore";
import { closeModal } from "@customizer/modal-x";
import ApiService from "@/api/ApiService";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import DateInput from "@/components/form/DateInput.vue";

// [MODAL-X] AUTO-GENERATED INSTANCE
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.

const toast = useToastStore();
const api = new ApiService();
const queryClient = useQueryClient();
const selectedVehicle = ref<any>(null);

const addMutation = useMutation({
  mutationFn: (payload: any) =>
    api.addAuthenticationHeader().post("/vehicle-lease-agreement", payload),
  onSuccess: (res) => {
    if (res.success || res.status === 200 || res.status === 201) {
      toast.success("Vehicle lease agreement added successfully!");
      queryClient.invalidateQueries({ queryKey: ["leased-vehicle-list"] });
      closeModal(true);
    } else {
      toast.error(res.error || "Failed to add vehicle lease agreement");
    }
  },
  onError: (error: any) => {
    toast.error(error.response?.data?.description || "An error occurred");
  },
});

const handleSubmit = async (values: any) => {
  if (values.leaseDirection === "OUTWARD" && !values.transporter) {
    toast.error("Transporter is required when lease direction is outward");
    return;
  }

  const payload = {
    startDate: values.startDate,
    endDate: values.endDate,
    amount: Number(values.amount),
    vehicle: values.vehicle,
    transporter:
      values.leaseDirection === "OUTWARD"
        ? values.transporter
        : selectedVehicle.value?.transporter?._id,
    leaseDirection: values.leaseDirection,
    leaseAgreement: {
      coversMaintenance: values.coversMaintenance ?? true,
      coversAdvance: values.coversAdvance ?? true,
    },
  };

  await addMutation.mutateAsync(payload);
};
</script>
