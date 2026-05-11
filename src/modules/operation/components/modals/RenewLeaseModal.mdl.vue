<template>
  <FormModalParent
    title="Renew Vehicle Lease Agreement"
    subtitle="Create a new agreement based on existing one"
    form-id="renewLeaseForm"
    :submit-handler="handleSubmit"
    modal-style="auto"
    :values="initialValues"
  >
    <template #center>
      <div class="flex flex-col gap-4">
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
        <SubmitButton :loading="renewMutation.isPending">Renew</SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Input from "@/components/form/Input.vue";
import ToggleInput from "@/components/form/ToggleInput.vue";
import DateInput from "@/components/form/DateInput.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { required } from "@/utils/validations";
import { useToastStore } from "@/store/toastStore";
import { closeModal } from "@customizer/modal-x";
import ApiService from "@/api/ApiService";

const props = defineProps<{
  data: { lease: any; onSuccess?: () => void };
}>();

const toast = useToastStore();
const api = new ApiService();
const queryClient = useQueryClient();

const initialValues = computed(() => {
  const lease = props.data.lease;
  if (!lease)
    return {
      startDate: "",
      endDate: "",
      amount: "",
      coversMaintenance: true,
      coversAdvance: true,
    };
  return {
    startDate: lease.startDate
      ? new Date(lease.startDate).toISOString().substr(0, 10)
      : "",
    endDate: lease.endDate
      ? new Date(lease.endDate).toISOString().substr(0, 10)
      : "",
    amount: lease.amount || "",
    coversMaintenance: lease.leaseAgreement?.coversMaintenance ?? true,
    coversAdvance: lease.leaseAgreement?.coversAdvance ?? true,
  };
});

const renewMutation = useMutation({
  mutationFn: (payload: any) =>
    api.addAuthenticationHeader().post("/vehicle-lease-agreement", payload),
  onSuccess: (res) => {
    if (res.success || res.status === 200 || res.status === 201) {
      toast.success("Agreement renewed successfully");
      queryClient.invalidateQueries({ queryKey: ["leased-vehicle-list"] });
      props.data.onSuccess?.();
      closeModal(true);
    } else {
      toast.error(res.error || "Failed to renew agreement");
    }
  },
  onError: (error: any) => {
    toast.error(error.response?.data?.description || "An error occurred");
  },
});

const handleSubmit = async (values: any) => {
  const lease = props.data.lease;
  if (!lease) return;

  const payload = {
    startDate: values.startDate,
    endDate: values.endDate,
    amount: Number(values.amount),
    vehicle: lease.vehicle?._id || lease.vehicle,
    transporter: lease.transporter?._id || lease.transporter,
    leaseDirection: lease.leaseDirection || "INWARD",
    leaseAgreement: {
      coversMaintenance: values.coversMaintenance ?? true,
      coversAdvance: values.coversAdvance ?? true,
    },
  };

  await renewMutation.mutateAsync(payload);
};
</script>
