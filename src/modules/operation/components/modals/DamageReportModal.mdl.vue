<template>
  <FormModalParent
    :title="
      props.data?.damageId ? 'Edit Shipment Damage' : 'Add Shipment Damage'
    "
    subtitle="Record details of damaged items in this shipment."
    form-id="damageReportForm"
    :values="formValues"
    :submit-handler="handleSubmit"
  >
    <template #center="{ form }">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectInput
          v-if="!props.data?.shipmentId && !props.data?.damageId"
          name="shipment"
          label="Select Shipment"
          url="/shipment"
          label_key="shipmentCode"
          value_key="_id"
          :validation="{ required }"
          @select="(opt) => (selectedShipperId = opt?.item?.shipper?._id)"
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

      <DamageInput
        :key="selectedShipperId"
        name="items"
        :shipper-id="selectedShipperId || props.data?.shipperId || ''"
      />

      <!-- <div class="mt-8 border-t border-gray-100 pt-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">
          Vehicle Parts & Prices (Optional)
        </h3>
        <VehiclePartsInput name="vehiclePartsAndPrices" />
      </div> -->

      <!-- Totals Section -->
      <component
        :is="form.Subscribe"
        :selector="
          (state: any) => [
            state.values.items,
            state.values.vehiclePartsAndPrices,
            state.values.vatInclusive,
          ]
        "
      >
        <template
          #default="[items, vehicleParts, vatInclusive]"
        >
          <div
            class="mt-8 flex flex-col items-end gap-2 bg-gray-50 p-6 rounded-2xl"
          >
            <div class="flex flex-col items-end gap-1 mb-2">
              <div
                class="text-xs text-gray-500 uppercase font-bold tracking-wider"
              >
                Items Subtotal
              </div>
              <div class="text-lg font-bold text-gray-900">
                {{ currencyFormatter(getSubtotal(items)) }}
              </div>
            </div>

            <div class="flex flex-col items-end gap-1 mb-2">
              <div
                class="text-xs text-gray-500 uppercase font-bold tracking-wider"
              >
                Vehicle Parts Total
              </div>
              <div class="text-lg font-bold text-gray-900">
                {{ currencyFormatter(getVehiclePartsTotal(vehicleParts)) }}
              </div>
            </div>

            <ToggleInput name="vatInclusive" label="VAT Inclusive (15%)" />

            <div
              v-if="vatInclusive"
              class="text-sm font-medium text-gray-500 mt-2"
            >
              VAT (15%):
              {{
                currencyFormatter(
                  (getSubtotal(items) + getVehiclePartsTotal(vehicleParts)) *
                    0.15,
                )
              }}
            </div>

            <div
              class="mt-4 pt-4 border-t border-gray-200 w-full flex flex-col items-end"
            >
              <div
                class="text-[10px] text-primary uppercase font-black tracking-[0.2em] mb-1"
              >
                Total Amount
              </div>
              <div class="text-3xl font-black text-primary">
                {{
                  currencyFormatter(
                    vatInclusive
                      ? (getSubtotal(items) +
                          getVehiclePartsTotal(vehicleParts)) *
                          1.15
                      : getSubtotal(items) + getVehiclePartsTotal(vehicleParts),
                  )
                }}
              </div>
            </div>
          </div>
        </template>
      </component>

      <div class="mt-6">
        <TextareaInput
          name="remark"
          label="General Remark"
          :attributes="{ placeholder: 'Enter any additional remarks...' }"
        />
      </div>
    </template>

    <template #bottom>
      <div class="flex justify-end gap-3">
        <SubmitButton form="damageReportForm">
          {{
            props.data?.damageId
              ? "Update Damage Report"
              : "Submit Damage Report"
          }}
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
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
import {
  add_shipment_damage,
  update_shipment_damage,
} from "../../api/operation.api";
import { useToastStore } from "@/store/toastStore";
import { getApi } from "@/utils/getApi";
import DamageInput from "../inputs/DamageInput.vue";
import VehiclePartsInput from "../inputs/VehiclePartsInput.vue";

export type Props = {
  shipmentId?: string;
  carrierId?: string;
  shipperId?: string;
  onSuccess?: () => void;
  damageId?: string;
  initialData?: any;
};

export type ReturnType = boolean;

const props = defineProps<{ data?: Props; close: (res: any) => void }>();

const toast = useToastStore();
const queryClient = useQueryClient();

const isEditMode = !!props.data?.damageId;
const initial = props.data?.initialData;

// shipper is at root level of the damage record
const selectedShipperId = ref<string | undefined>(
  props.data?.shipperId || initial?.shipper?._id,
);

const mutation = useMutation({
  mutationFn: (payload: any) =>
    isEditMode
      ? update_shipment_damage(props.data!.damageId!, payload)
      : add_shipment_damage(payload),
});

const shipmentId = props.data?.shipmentId || initial?.shipment?._id || "";

onMounted(async () => {
  if (isEditMode && shipmentId && !selectedShipperId.value) {
    try {
      const res = await getApi("/shipment")
        .addAuthenticationHeader()
        .get(`/${shipmentId}`);
      const data = res.data as any;
      if (data?.shipper?._id) {
        selectedShipperId.value = data.shipper._id;
      }
    } catch (e) {}
  }
});

const formValues = {
  shipment: shipmentId,
  damageDate: initial?.damageDate
    ? new Date(initial.damageDate).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0],
  location: initial?.location || "",
  paymentToBeReceivedFrom: initial?.paymentToBeReceivedFrom || "DRIVER",
  // normalize item from populated object { _id, name } to plain _id; keep name as _itemLabel for display
  items: (initial?.items || []).map((i: any) => ({
    ...i,
    item: i.item?._id ?? i.item,
    _itemLabel: i.item?.name ?? "",
  })),
  vehiclePartsAndPrices: initial?.vehiclePartsAndPrices || [],
  vatInclusive: initial?.vatInclusive || false,
  remark: initial?.remark || "",
};

function getVehiclePartsTotal(parts: any[]) {
  return (
    parts?.reduce((sum: number, p: any) => sum + (Number(p.price) || 0), 0) || 0
  );
}

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
  const itemsSubtotal = getSubtotal(values.items);
  const partsSubtotal = getVehiclePartsTotal(values.vehiclePartsAndPrices);
  const subtotal = itemsSubtotal + partsSubtotal;
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
    // vehiclePartsAndPrices: (values.vehiclePartsAndPrices || [])
    //   .filter((p: any) => p.vehiclePart)
    //   .map((p: any) => ({
    //     vehiclePart: p.vehiclePart,
    //     price: Number(p.price || 0),
    //     isRepair: !!p.isRepair,
    //   })),
  };

  const res = await mutation.mutateAsync(payload);
  if (res.success) {
    toast.success(
      isEditMode
        ? "Damage report updated successfully"
        : "Damage report submitted successfully",
    );
    if (props.data?.onSuccess) {
      props.data.onSuccess();
    }
    props.close(true);
  } else {
    toast.error(res.error || "Failed to submit damage report");
  }
}
</script>
