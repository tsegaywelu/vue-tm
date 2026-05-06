<template>
  <FormModalParent
    title="Add Vehicle Lease Agreement"
    subtitle="Register a new leased vehicle agreement"
    form-id="addLeaseForm"
    :submit-handler="handleSubmit"
    modal-style="auto"
    :values="{
      leaseDirection: 'INWARD',
      coversMaintenance: true,
      coversAdvance: true,
    }"
  >
    <template #center="{ form }">
      <div class="flex flex-col gap-4">
        <SelectInput
          label="Vehicle"
          name="vehicle"
          url="/vehicle"
          label_key="plateNumber"
          value_key="_id"
          searchable
          :validation="{ required }"
          :attributes="{ placeholder: 'Select Vehicle' }"
          @select="(opt: any) => (selectedVehicle = opt.item)"
        />
        <div class="grid grid-cols-2 gap-4">
          <DateInput
            name="startDate"
            label="Start Date"
            :validation="{ required }"
          />
          <DateInput
            name="endDate"
            label="End Date"
            :validation="{ required }"
          />
        </div>
        <Input
          type="number"
          name="amount"
          label="Amount"
          :validation="{ required }"
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

        <div class="grid grid-cols-2 gap-4">
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
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import ToggleInput from "@/components/form/ToggleInput.vue";
import { required } from "@/utils/validations";
import { useToastStore } from "@/store/toastStore";
import { closeModal } from "@customizer/modal-x";
import ApiService from "@/api/ApiService";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import DateInput from "@/components/form/DateInput.vue";

const props = defineProps<{}>();

const toast = useToastStore();
const api = new ApiService();
const selectedVehicle = ref<any>(null);

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

  try {
    const res = await api
      .addAuthenticationHeader()
      .post("/vehicle-lease-agreement", payload);
    if (res.success || res.status === 200 || res.status === 201) {
      toast.success("Vehicle lease agreement added successfully!");
      closeModal(true);
    } else {
      toast.error(res.error || "Failed to add vehicle lease agreement");
    }
  } catch (error: any) {
    toast.error(error.response?.data?.description || "An error occurred");
  }
};
</script>
