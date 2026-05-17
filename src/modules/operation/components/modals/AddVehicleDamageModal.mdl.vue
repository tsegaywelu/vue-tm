<template>
  <FormModalParent
    :title="props.data?.damageId ? 'Edit Vehicle Damage' : 'Add Vehicle Damage'"
    subtitle="Record details of vehicle damages, parts, and costs."
    form-id="vehicleDamageForm"
    :values="formValues"
    :submit-handler="handleSubmit"
    :submit-form-data="true"
  >
    <template #center="{ form }">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DateInput
          name="damageDate"
          label="Damage Date"
          :validation="{ required, lessThanToday }"
          :attributes="{ placeholder: 'Select damage date' }"
        />
        <VehicleInput
          name="vehicle"
          :validation="{ required }"
          :options="initial?.vehicle?._id ? [{ _id: initial.vehicle._id, plateNumber: initial.vehicle.plateNumber }] : []"
        />
        <SelectInput
          name="shipment"
          label="Shipment"
          url="/shipment"
          label_key="shipmentCode"
          value_key="_id"
          :attributes="{ placeholder: 'Select shipment' }"
        />
        <SelectInput
          name="severity"
          label="Severity"
          :options="[
            { label: 'Minor', value: 'MINOR' },
            { label: 'Moderate', value: 'MODERATE' },
            { label: 'Major', value: 'MAJOR' },
            { label: 'Total Loss', value: 'TOTAL_LOSS' },
          ]"
          :validation="{ required }"
          :attributes="{ placeholder: 'Select severity' }"
        />
        <Input
          name="location"
          label="Location"
          :validation="{ required }"
          :attributes="{ placeholder: 'Enter damage location' }"
        />
      </div>

      <div class="mt-8 mb-4 border-t border-gray-100 pt-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">
          Vehicle Parts & Prices
        </h3>
        <VehiclePartsInput name="vehiclePartsAndPrices" />
      </div>

      <div class="mt-8 border-t border-gray-100 pt-6">
        <h3 class="text-lg font-bold text-gray-900 mb-6">Costs & Deductions</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Input
            name="laborCost"
            label="Labor Cost"
            type="number"
            :attributes="{ placeholder: 'Enter labor cost' }"
          />
          <Input
            name="estimatedRepairCost"
            label="Estimated Repair Cost"
            type="number"
            :attributes="{ placeholder: 'Enter estimated repair cost' }"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Input
            name="excess"
            label="Excess"
            type="number"
            :attributes="{ placeholder: 'Enter excess' }"
          />
          <Input
            name="partsContribution"
            label="Parts Contribution"
            type="number"
            :attributes="{ placeholder: 'Enter parts contribution' }"
          />
        </div>

        <component
          :is="form.Subscribe"
          :selector="
            (state: any) => [
              state.values.vehiclePartsAndPrices,
              state.values.laborCost,
              state.values.excess,
              state.values.partsContribution,
            ]
          "
        >
          <template #default="[parts, laborCost, excess, partsContribution]">
            <div class="bg-gray-50 p-6 rounded-2xl space-y-3">
              <div
                class="grid grid-cols-2 md:grid-cols-4 gap-4 pb-3 border-b border-gray-200"
              >
                <div class="flex flex-col gap-0.5">
                  <span
                    class="text-gray-400 text-xs uppercase font-semibold tracking-wide"
                    >Parts Total</span
                  >
                  <span class="text-base font-bold text-gray-900">{{
                    currencyFormatter(getPartsTotal(parts))
                  }}</span>
                </div>
                <div class="flex flex-col gap-0.5">
                  <span
                    class="text-gray-400 text-xs uppercase font-semibold tracking-wide"
                    >Labor Cost</span
                  >
                  <span class="text-base font-bold text-gray-900">{{
                    currencyFormatter(Number(laborCost || 0))
                  }}</span>
                </div>
                <div class="flex flex-col gap-0.5">
                  <span
                    class="text-gray-400 text-xs uppercase font-semibold tracking-wide"
                    >Tax (3%)</span
                  >
                  <span class="text-base font-bold text-gray-900">{{
                    currencyFormatter(calcTax(parts, laborCost))
                  }}</span>
                </div>
                <div class="flex flex-col gap-0.5">
                  <span
                    class="text-gray-400 text-xs uppercase font-semibold tracking-wide"
                    >VAT (15%)</span
                  >
                  <span class="text-base font-bold text-gray-900">{{
                    currencyFormatter(calcVat(parts, laborCost))
                  }}</span>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div
                  class="flex flex-col gap-0.5 p-3 bg-white rounded-xl border border-gray-100"
                >
                  <span
                    class="text-gray-400 text-xs uppercase font-semibold tracking-wide"
                    >Actual Repair Cost</span
                  >
                  <span class="text-lg font-black text-gray-900">
                    {{
                      currencyFormatter(
                        calcActualRepairCost(
                          parts,
                          laborCost,
                          excess,
                          partsContribution,
                        ),
                      )
                    }}
                  </span>
                </div>
                <div
                  class="flex flex-col gap-0.5 p-3 bg-white rounded-xl border border-primary/20 shadow-sm"
                >
                  <span
                    class="text-primary text-xs uppercase font-bold tracking-wider"
                    >Amount To Be Received From Insurance</span
                  >
                  <span class="text-xl font-black text-primary">
                    {{
                      currencyFormatter(
                        calcInsuranceAmount(
                          parts,
                          laborCost,
                          excess,
                          partsContribution,
                        ),
                      )
                    }}
                  </span>
                </div>
              </div>
            </div>
          </template>
        </component>
      </div>

      <div class="mt-6 border-t border-gray-100 pt-6">
        <TextareaInput
          name="description"
          label="Description"
          :attributes="{
            placeholder: 'Provide detailed description of the damage...',
          }"
        />
      </div>

      <div class="mt-6 border-t border-gray-100 pt-6">
        <FileInput name="documents" label="Damage Documents" multiple />
      </div>
    </template>

    <template #bottom>
      <div class="flex justify-end gap-3">
        <SubmitButton form="vehicleDamageForm">
          {{ props.data?.damageId ? "Update Vehicle Damage" : "Submit Vehicle Damage" }}
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { closeModal } from "@customizer/modal-x";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import DateInput from "@/components/form/DateInput.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import FileInput from "@/components/form/FileInput.vue";
import VehicleInput from "@/components/common/inputs/VehicleInput.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { lessThanToday, required } from "@/utils/validations";
import { currencyFormatter } from "@/utils/utils";
import { add_vehicle_damage, update_vehicle_damage } from "../../api/operation.api";
import { useToastStore } from "@/store/toastStore";
import VehiclePartsInput from "../inputs/VehiclePartsInput.vue";
import { ref } from "vue";

export type Props = {
  onSuccess?: () => void;
  damageId?: string;
  initialData?: any;
};

const props = defineProps<{ data?: Props; close: (res: any) => void }>();

const toast = useToastStore();
const queryClient = useQueryClient();

const isEditMode = !!props.data?.damageId;
const initial = props.data?.initialData;

const mutation = useMutation({
  mutationFn: (payload: FormData) =>
    isEditMode
      ? update_vehicle_damage(props.data!.damageId!, payload)
      : add_vehicle_damage(payload),
});

const formValues = {
  damageDate: initial?.damageDate
    ? new Date(initial.damageDate).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0],
  vehicle: initial?.vehicle?._id ?? initial?.vehicle ?? "",
  shipment: initial?.shipment?._id ?? initial?.shipment ?? "",
  severity: initial?.severity ?? "",
  location: initial?.location ?? "",
  vehiclePartsAndPrices: initial?.vehiclePartsAndPrices?.length
    ? initial.vehiclePartsAndPrices.map((p: any) => ({
        vehiclePart: p.vehiclePart ?? "",
        price: Number(p.price ?? 0),
        isRepair: !!p.isRepair,
      }))
    : [{ vehiclePart: "", price: 0, isRepair: false }],
  laborCost: Number(initial?.laborCost ?? 0),
  tax: Number(initial?.tax ?? 0),
  vat: Number(initial?.vat ?? 0),
  estimatedRepairCost: Number(initial?.estimatedRepairCost ?? 0),
  actualRepairCost: Number(initial?.actualRepairCost ?? 0),
  excess: Number(initial?.excess ?? 0),
  partsContribution: Number(initial?.partsContribution ?? 0),
  amountToReceiveFromInsurance: Number(initial?.amountToReceiveFromInsurance ?? 0),
  description: initial?.description ?? "",
  documents: [],
};

const getPartsTotal = (parts: any[]) =>
  parts?.reduce((sum, p) => sum + Number(p.price || 0), 0) || 0;

const calcTax = (parts: any[], laborCost: any) =>
  (getPartsTotal(parts) + Number(laborCost || 0)) * 0.03;

const calcVat = (parts: any[], laborCost: any) =>
  (getPartsTotal(parts) + Number(laborCost || 0)) * 0.15;

const calcActualRepairCost = (
  parts: any[],
  laborCost: any,
  excess: any,
  partsContribution: any,
) => {
  const subtotal = getPartsTotal(parts) + Number(laborCost || 0);
  return (
    subtotal +
    calcVat(parts, laborCost) -
    Number(excess || 0) -
    Number(partsContribution || 0)
  );
};

const calcInsuranceAmount = (
  parts: any[],
  laborCost: any,
  excess: any,
  partsContribution: any,
) =>
  Math.max(
    0,
    calcActualRepairCost(parts, laborCost, excess, partsContribution),
  );

async function handleSubmit(values: any) {
  const parts = values.vehiclePartsAndPrices || [];
  const tax = calcTax(parts, values.laborCost);
  const vat = calcVat(parts, values.laborCost);
  const actualRepairCost = calcActualRepairCost(
    parts,
    values.laborCost,
    values.excess,
    values.partsContribution,
  );
  const amountToReceiveFromInsurance = calcInsuranceAmount(
    parts,
    values.laborCost,
    values.excess,
    values.partsContribution,
  );

  // Construct FormData because of file uploads and nested arrays
  const formData = new FormData();

  formData.append("damageDate", values.damageDate);
  formData.append("vehicle", values.vehicle);
  if (values.shipment) formData.append("shipment", values.shipment);
  formData.append("severity", values.severity);
  formData.append("location", values.location);
  formData.append("description", values.description || "");

  // Numeric fields — tax/vat/actualRepairCost/amountToReceiveFromInsurance are auto-computed
  formData.append("laborCost", String(values.laborCost || 0));
  formData.append(
    "estimatedRepairCost",
    String(values.estimatedRepairCost || 0),
  );
  formData.append("excess", String(values.excess || 0));
  formData.append("partsContribution", String(values.partsContribution || 0));
  formData.append("tax", String(tax.toFixed(2)));
  formData.append("vat", String(vat.toFixed(2)));
  formData.append("actualRepairCost", String(actualRepairCost.toFixed(2)));
  formData.append(
    "amountToReceiveFromInsurance",
    String(amountToReceiveFromInsurance.toFixed(2)),
  );

  // Array of parts
  if (values.vehiclePartsAndPrices && values.vehiclePartsAndPrices.length > 0) {
    values.vehiclePartsAndPrices.forEach((part: any, index: number) => {
      formData.append(
        `vehiclePartsAndPrices[${index}][vehiclePart]`,
        part.vehiclePart || "",
      );
      formData.append(
        `vehiclePartsAndPrices[${index}][price]`,
        String(part.price || 0),
      );
      formData.append(
        `vehiclePartsAndPrices[${index}][isRepair]`,
        part.isRepair ? "true" : "false",
      );
    });
  }

  // Files
  if (values.documents && values.documents.length > 0) {
    values.documents.forEach((file: File) => {
      formData.append("documents", file);
    });
  }

  const res = await mutation.mutateAsync(formData);
  if (res.success) {
    toast.success("Vehicle damage submitted successfully");
    if (props.data?.onSuccess) {
      props.data.onSuccess();
    }
    props.close(true);
  } else {
    toast.error(res.error || "Failed to submit vehicle damage");
  }
}
</script>
