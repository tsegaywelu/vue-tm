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
        <SelectInput
          v-if="!props.data?.shipmentId"
          name="shipment"
          label="Select Shipment"
          url="/shipment"
          label_key="shipmentCode"
          value_key="_id"
          :validation="{ required }"
        />
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

      <DamageInput name="items" :shipper-id="selectedShipperId || props.data?.shipperId" />
      
      <!-- Totals Section -->
      <component
        :is="form.Subscribe"
        :selector="
          (state: any) => [state.values.items, state.values.vatInclusive, state.values.shipment]
        "
      >
        <template #default="[items, vatInclusive, selectedShipment]">
          <!-- Hidden tracking of selected shipment to fetch shipper dynamically if needed -->
          <span class="hidden">{{ updateSelectedShipment(selectedShipment) }}</span>

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
import { ref } from "vue";
import { closeModal } from "@customizer/modal-x";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
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
import { getApi } from "@/utils/getApi";
import DamageInput from "../inputs/DamageInput.vue";

export type Props = {
  shipmentId?: string;
  carrierId?: string;
  shipperId?: string;
  onSuccess?: () => void;
};

export type ReturnType = boolean;

const props = defineProps<{ data?: Props; close: (res: any) => void }>();

const toast = useToastStore();
const queryClient = useQueryClient();

const selectedShipperId = ref<string | undefined>(props.data?.shipperId);

const mutation = useMutation({
  mutationFn: (payload: any) => add_shipment_damage(payload),
});

const formValues = {
  shipment: props.data?.shipmentId || "",
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

// Function to fetch shipper ID if a shipment is selected and we don't already have it
const updateSelectedShipment = (shipmentId: string) => {
  if (shipmentId && !props.data?.shipperId && shipmentId !== formValues.shipment) {
    // If we have a shipment selected but no shipper, we might need to fetch the shipment details
    // to get the shipper ID so DamageInput can fetch the right commodities.
    // In a real scenario, we might want a hook here. For simplicity, we trigger a fetch if it changes.
    getApi("/shipment").addAuthenticationHeader().get(`/${shipmentId}`).then(res => {
      if (res.data?.shipper?._id) {
        selectedShipperId.value = res.data.shipper._id;
      }
    }).catch(console.error);
    formValues.shipment = shipmentId;
  }
  return "";
};

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
    if (props.data?.onSuccess) {
      props.data.onSuccess();
    }
    props.close(true);
  } else {
    toast.error(res.error || "Failed to submit damage report");
  }
}
</script>
