<template>
  <FormModalParent
    title="Add Transporter Advance"
    subtitle="Select a shipment to create a transporter advance"
    form-id="addPrePaymentStandaloneForm"
    :values="initialValues"
    :submit-handler="handleSubmit"
    modal-style="auto"
  >
    <template #center="{ form }">
      <div class="flex flex-col gap-6">
        <!-- Shipment search -->
        <component
          :is="form.Subscribe"
          :selector="(state: any) => [state.values.shipment]"
        >
          <template #default="[shipmentId]">
            <SelectInput
              name="shipment"
              label="Select Shipment"
              url="/shipment"
              label_key="shipmentCode"
              value_key="_id"
              searchable
              :validation="{ required }"
              @select="(opt: any) => onShipmentSelected(opt?.item, form)"
            />

            <!-- Read-only context (shown once a shipment is picked) -->
            <div
              v-if="shipmentId"
              class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg mt-2"
            >
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
          </template>
        </component>

        <!-- Editable fields -->
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
    </template>

    <template #bottom>
      <div class="flex justify-end gap-3">
        <Button variant="outline" size="md" @click="closeModal(false)">
          Cancel
        </Button>
        <SubmitButton
          :loading="mutation.isPending.value"
          form="addPrePaymentStandaloneForm"
        >
          Submit
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { closeModal } from "@customizer/modal-x";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Input from "@/components/form/Input.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { required, price } from "@/utils/validations";
import { useToastStore } from "@/store/toastStore";
import { create_prepayment } from "../../api/operation.api";

export type Props = Record<string, never>;
export type ReturnType = boolean;

const props = defineProps<{ data?: Props; close: (res: ReturnType) => void }>();

const toast = useToastStore();
const queryClient = useQueryClient();

// Holds the full shipment object after selection so we can build the payload
const selectedShipment = ref<any>(null);

const initialValues = {
  shipment: "",
  driverName: "",
  routeName: "",
  vehiclePlate: "",
  transporterName: "",
  bankName: "",
  accountNumber: "",
  totalTransporterPrice: "",
  amount: "",
  remark: "",
};

function onShipmentSelected(shipment: any, form: any) {
  if (!shipment) return;
  selectedShipment.value = shipment;

  const preferredBank =
    shipment.transporter?.bankAccount?.find((a: any) => a?.preferred) ?? null;

  const driverName = [
    shipment.driver?.firstName,
    shipment.driver?.middleName,
    shipment.driver?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  form.setFieldValue("driverName", driverName);
  form.setFieldValue("routeName", shipment.route?.routeName || "");
  form.setFieldValue("vehiclePlate", shipment.vehicle?.plateNumber || "");
  form.setFieldValue("transporterName", shipment.transporter?.name || "");
  form.setFieldValue("bankName", preferredBank?.bank?.name || "No preferred bank");
  form.setFieldValue("accountNumber", preferredBank?.accountNumber || "No account number");
  form.setFieldValue("totalTransporterPrice", shipment.transporterPrice ?? "");
}

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
  if (!selectedShipment.value) {
    toast.error("Please select a shipment first");
    return;
  }

  const s = selectedShipment.value;
  const preferredBank =
    s.transporter?.bankAccount?.find((a: any) => a?.preferred) ?? null;

  const payload = {
    shipment: s._id,
    vehicle: s.vehicle?._id,
    totalTransporterPrice: s.transporterPrice,
    amount: Number(values.amount),
    depositedBankName: preferredBank?.bank?._id,
    depositedBankAccount: preferredBank?.accountNumber,
    remark: values.remark || "",
  };

  await mutation.mutateAsync(payload);
}
</script>
