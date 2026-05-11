<template>
  <FormModalParent
    title="Edit Vehicle Lease Agreement"
    subtitle="Update lease agreement details"
    form-id="editLeaseForm"
    :submit-handler="handleSubmit"
    modal-style="auto"
    :values="initialValues"
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
              :params="{
                ownership: leaseDirection === 'OUTWARD' ? 'Owned' : 'Leased',
              }"
              :key="leaseDirection"
              :initial_labels="initialVehicleLabel"
            />
          </template>
        </component>

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
        <SubmitButton :loading="updateMutation.isPending">Update</SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import ToggleInput from "@/components/form/ToggleInput.vue";
import VehicleInput from "@/components/common/inputs/VehicleInput.vue";
import { required } from "@/utils/validations";
import { useToastStore } from "@/store/toastStore";
import { closeModal } from "@customizer/modal-x";
import ApiService from "@/api/ApiService";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import DateInput from "@/components/form/DateInput.vue";

const props = defineProps<{
  data: { lease: any };
}>();

const toast = useToastStore();
const api = new ApiService();
const queryClient = useQueryClient();
const selectedVehicle = ref<any>(props.data.lease?.vehicle || null);

const initialValues = computed(() => {
  const lease = props.data.lease;
  return {
    vehicle: lease.vehicle?._id || lease.vehicle,
    startDate: lease.startDate ? new Date(lease.startDate).toISOString().substr(0, 10) : "",
    endDate: lease.endDate ? new Date(lease.endDate).toISOString().substr(0, 10) : "",
    amount: lease.amount || "",
    leaseDirection: lease.leaseDirection || "INWARD",
    transporter: lease.transporter?._id || lease.transporter,
    coversMaintenance: lease.leaseAgreement?.coversMaintenance ?? true,
    coversAdvance: lease.leaseAgreement?.coversAdvance ?? true,
  };
});

const initialVehicleLabel = computed(() => {
  const lease = props.data.lease;
  if (lease.vehicle?._id) {
    return { [lease.vehicle._id]: lease.vehicle.plateNumber };
  }
  return {};
});

const updateMutation = useMutation({
  mutationFn: (payload: any) =>
    api
      .addAuthenticationHeader()
      .patch(`/vehicle-lease-agreement/${props.data.lease._id}`, payload),
  onSuccess: (res) => {
    if (res.success || res.status === 200 || res.status === 201) {
      toast.success("Vehicle lease agreement updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["leased-vehicle-list"] });
      closeModal(true);
    } else {
      toast.error(res.error || "Failed to update vehicle lease agreement");
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
        : selectedVehicle.value?.transporter?._id || values.transporter,
    leaseDirection: values.leaseDirection,
    leaseAgreement: {
      coversMaintenance: values.coversMaintenance ?? true,
      coversAdvance: values.coversAdvance ?? true,
    },
  };

  await updateMutation.mutateAsync(payload);
};
</script>
