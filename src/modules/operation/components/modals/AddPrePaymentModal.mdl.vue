<template>
  <FormModalParent
    title="Add Transporter Advance"
    :subtitle="`Shipment: ${shipment.shipmentCode}`"
    form-id="addPrePaymentForm"
    :values="initialValues"
    :submit-handler="handleSubmit"
    modal-style="auto"
  >
    <template #center>
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-12 gap-3">
        <div class="relative size-10">
          <div class="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
        <span class="text-sm text-gray-500 animate-pulse">Loading shipment details...</span>
      </div>
      <div v-else class="flex flex-col gap-6">
        <!-- Read-only shipment context -->
        <div class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
          <Input
            name="shipmentCode"
            label="Shipment"
            :attributes="{ disabled: true }"
          />
          <Input
            name="driverName"
            label="Driver"
            :attributes="{ disabled: true }"
          />
          <Input
            name="routeName"
            label="Route"
            :attributes="{ disabled: true }"
          />
          <Input
            name="vehiclePlate"
            label="Vehicle"
            :attributes="{ disabled: true }"
          />
          <Input
            name="transporterName"
            label="Transporter"
            :attributes="{ disabled: true }"
          />
          <Input
            name="bankName"
            label="Bank Name"
            :attributes="{ disabled: true }"
          />
          <Input
            name="accountNumber"
            label="Account Number"
            :attributes="{ disabled: true }"
          />
          <Input
            name="totalTransporterPrice"
            label="Transporter Price"
            type="number"
            :attributes="{ disabled: true }"
          />
        </div>

        <!-- Editable fields -->
        <div class="grid grid-cols-1 gap-4">
          <Input
            name="amount"
            label="Amount"
            type="number"
            :attributes="{ placeholder: '0.00', step: '0.01' }"
            :validation="{ required, price }"
          />
          <TextareaInput
            name="remark"
            label="Remark"
            :attributes="{ placeholder: 'Add a note...', rows: 3 }"
          />
        </div>
      </div>
    </template>

    <template #bottom>
      <div class="flex justify-end gap-3">
        <Button variant="outline" size="md" @click="closeModal(false)">
          Cancel
        </Button>
        <SubmitButton
          :loading="mutation.isPending.value"
          form="addPrePaymentForm"
        >
          Submit
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { closeModal } from "@customizer/modal-x";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Input from "@/components/form/Input.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { required, price } from "@/utils/validations";
import { useToastStore } from "@/store/toastStore";
import { fetch_prepayment, create_prepayment } from "../../api/operation.api";
import { fetch_shipment_by_id } from "../../api/operation.api";
import type { Shipment } from "../../operation.types";

export type Props = { shipment: Shipment };
export type ReturnType = boolean;

const props = defineProps<{ data: Props; close: (res: ReturnType) => void }>();

const toast = useToastStore();
const queryClient = useQueryClient();
const shipment = props.data.shipment;

// Fetch the full shipment to get populated transporter.bankAccount array
const { data: shipmentDetailsResponse, isLoading } = useQuery({
  queryKey: ["shipment-details", shipment._id],
  queryFn: () => fetch_shipment_by_id(shipment._id),
  enabled: computed(() => !!shipment._id),
});

const fullShipment = computed(() => {
  return shipmentDetailsResponse.value?.data || shipment;
});

const preferredBank = computed(() => {
  const accounts = (fullShipment.value.transporter as any)?.bankAccount ?? [];
  return accounts.find((a: any) => a?.preferred) ?? accounts[0] ?? null;
});

const initialValues = computed(() => ({
  shipmentCode: fullShipment.value.shipmentCode || "",
  driverName: [
    fullShipment.value.driver?.firstName,
    (fullShipment.value.driver as any)?.middleName,
    fullShipment.value.driver?.lastName,
  ]
    .filter(Boolean)
    .join(" "),
  routeName: (fullShipment.value.route as any)?.routeName || "",
  vehiclePlate: fullShipment.value.vehicle?.plateNumber || "",
  transporterName: (fullShipment.value.transporter as any)?.name || "",
  bankName: preferredBank.value?.bank?.name || "No preferred bank",
  accountNumber: preferredBank.value?.accountNumber || "No account number",
  totalTransporterPrice: (fullShipment.value as any).transporterPrice ?? "",
  amount: "",
  remark: "",
}));

const mutation = useMutation({
  mutationFn: (data: any) => create_prepayment(data),
  onSuccess: (res) => {
    if (res.success) {
      toast.success("Transporter advance added successfully!");
      queryClient.invalidateQueries({ queryKey: ["pre-payments"] });
      props.close(true);
    } else {
      toast.error(res.error || "Failed to add transporter advance");
    }
  },
});

async function handleSubmit(values: Record<string, any>) {
  const payload = {
    shipment: fullShipment.value._id || shipment._id,
    vehicle: fullShipment.value.vehicle?._id || shipment.vehicle?._id,
    totalTransporterPrice: Number(fullShipment.value.transporterPrice) || Number((shipment as any).transporterPrice),
    amount: Number(values.amount),
    depositedBankName: preferredBank.value?.bank?._id,
    depositedBankAccount: preferredBank.value?.accountNumber,
    remark: values.remark || "",
  };
  await mutation.mutateAsync(payload);
}
</script>
