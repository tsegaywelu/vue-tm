<template>
  <FormModalParent
    title="Add Shipment Damage"
    subtitle="Record details of damaged items in this shipment."
    form-id="damageReportForm"
    :values="formValues"
    :submit-handler="handleSubmit"
  >
    <template #center="{ form }">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DateInput
          name="damageDate"
          label="Damage Date"
          :validation="{ required, lessThanToday }"
          :attributes="{
            placeholder: 'Enter Damage date',
          }"
        />
        <Input
          name="location"
          label="Location"
          :attributes="{ placeholder: 'Enter Location' }"
          :validation="{ required }"
        />
        <SelectInput
          name="paymentToBeReceivedFrom"
          label="Payment Received From"
          :options="[
            { label: 'Driver', value: 'DRIVER' },
            { label: 'Insurance', value: 'INSURANCE' },
            { label: 'Transporter', value: 'TRANSPORTER' },
            { label: 'Third Party', value: 'THIRD_PARTY' },
          ]"
          :validation="{ required }"
        />
      </div>

      <DamageInput name="items" :shipper-id="props.data.shipperId" />
      <!-- Totals Section -->
      <component
        :is="form.Subscribe"
        :selector="
          (state: any) => [state.values.items, state.values.vatInclusive]
        "
      >
        <template #default="[items, vatInclusive]">
          <div class="mt-8 flex flex-col items-end gap-2">
            <div class="text-sm font-medium text-gray-500">
              Subtotal:
              {{ currencyFormatter(getSubtotal(items)) }}
            </div>
            <ToggleInput name="vatInclusive" label="VAT Inclusive (15%)" />
            <div v-if="vatInclusive" class="text-sm font-medium text-gray-500">
              VAT (15%):
              {{ currencyFormatter(getSubtotal(items) * 0.15) }}
            </div>
            <div class="text-2xl font-black text-primary mt-2">
              Total:
              {{
                currencyFormatter(
                  vatInclusive ? getSubtotal(items) * 1.15 : getSubtotal(items),
                )
              }}
            </div>
          </div>
        </template>
      </component>

      <div class="mt-6">
        <TextareaInput name="remark" label="General Remark" />
      </div>
    </template>

    <template #bottom>
      <div class="flex justify-end gap-3">
        <SubmitButton form="damageReportForm">
          Submit Damage Report
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { closeModal } from "@customizer/modal-x";
import { useMutation } from "@tanstack/vue-query";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import DateInput from "@/components/form/DateInput.vue";
import ToggleInput from "@/components/form/ToggleInput.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { lessThanToday, required } from "@/utils/validations";
import { currencyFormatter } from "@/utils/utils";
import { add_shipment_damage } from "../../api/operation.api";
import { useToastStore } from "@/store/toastStore";
import { icons } from "@/utils/icons";
import DamageInput from "../inputs/DamageInput.vue";

export type Props = {
  shipmentId: string;
  carrierId: string;
  shipperId: string;
};

export type ReturnType = boolean;

const props = defineProps<{ data: Props; close: (res: any) => void }>();

const toast = useToastStore();

const mutation = useMutation({
  mutationFn: (payload: any) => add_shipment_damage(payload),
});

const formValues = {
  shipment: props.data.shipmentId,
  damageDate: new Date().toISOString().split("T")[0],
  location: "",
  paymentToBeReceivedFrom: "DRIVER",
  items: [],
  vatInclusive: false,
  remark: "",
};

function getSubtotal(items: any[]) {
  return (
    items?.reduce(
      (sum: number, i: any) =>
        sum + (Number(i?.unitPrice) || 0) * (Number(i?.quantity) || 0),
      0,
    ) || 0
  );
}

async function handleSubmit(values: any) {
  const subtotal = getSubtotal(values.items);
  const total = values.vatInclusive ? subtotal * 1.15 : subtotal;

  const payload = {
    shipment: values.shipment,
    damageDate: values.damageDate,
    location: values.location,
    paymentToBeReceivedFrom: values.paymentToBeReceivedFrom,
    remark: values.remark,
    total,
    items: (values.items || []).filter(Boolean).map((i: any) => ({
      item: i.item,
      uom: i.uom,
      unitPrice: Number(i.unitPrice || 0),
      quantity: Number(i.quantity || 0),
      totalPrice: Number(i.unitPrice || 0) * Number(i.quantity || 0),
    })),
  };

  const res = await mutation.mutateAsync(payload);
  if (res.success) {
    toast.success("Damage report submitted successfully");
    props.close(true);
  } else {
    toast.error(res.error || "Failed to submit damage report");
  }
}
</script>
