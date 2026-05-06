<template>
  <FormModalParent
    title="Add Vehicle Damage"
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
        <SelectInput
          name="vehicle"
          label="Vehicle"
          url="/vehicle"
          label_key="plateNumber"
          value_key="_id"
          :validation="{ required }"
          :attributes="{ placeholder: 'Select vehicle' }"
        />
        <SelectInput
          name="shipment"
          label="Shipment (Optional)"
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
            <div class="bg-gray-50 p-6 rounded-2xl space-y-4 mb-8">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div class="flex flex-col gap-1">
                  <span class="text-gray-500 font-medium">Parts Total</span>
                  <span class="text-lg font-bold text-gray-900">{{
                    currencyFormatter(getPartsTotal(parts))
                  }}</span>
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-gray-500 font-medium">Labor Cost</span>
                  <span class="text-lg font-bold text-gray-900">{{
                    currencyFormatter(Number(laborCost || 0))
                  }}</span>
                </div>
                <div
                  class="flex flex-col gap-1 p-3 bg-white rounded-xl border border-gray-100 shadow-sm"
                >
                  <span
                    class="text-primary font-bold uppercase tracking-wider text-[10px]"
                    >Estimated Total</span
                  >
                  <span class="text-xl font-black text-primary">{{
                    currencyFormatter(
                      getPartsTotal(parts) + Number(laborCost || 0),
                    )
                  }}</span>
                </div>
              </div>
            </div>
          </template>
        </component>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            name="tax"
            label="Tax (3%)"
            type="number"
            :attributes="{ placeholder: 'Enter tax amount' }"
          />
          <Input
            name="vat"
            label="VAT (15%)"
            type="number"
            :attributes="{ placeholder: 'Enter VAT amount' }"
          />

          <Input
            name="actualRepairCost"
            label="Actual Repair Cost"
            type="number"
            :attributes="{ placeholder: 'Enter actual repair cost' }"
          />
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
          <Input
            name="amountToReceiveFromInsurance"
            label="Amount To Receive (Insurance)"
            type="number"
            :attributes="{ placeholder: 'Enter amount to receive' }"
          />
        </div>
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
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700"
            >Damage Documents</label
          >
          <div
            @drop.prevent="handleDrop"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @click="triggerFileInput"
            class="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer group"
            :class="{ 'border-primary bg-primary/5': isDragging }"
          >
            <input
              type="file"
              class="hidden"
              ref="fileInput"
              multiple
              @change="handleFileChange"
            />

            <div
              v-if="files.length === 0"
              class="flex flex-col items-center gap-2"
            >
              <div
                class="size-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"
              >
                <i
                  class="mdi mdi-cloud-upload-outline text-xl text-gray-400 group-hover:text-primary"
                ></i>
              </div>
              <p class="text-xs text-gray-500">
                <span class="font-bold text-primary">Click to upload</span> or
                drag and drop
              </p>
            </div>

            <div v-else class="w-full space-y-2" @click.stop>
              <div
                v-for="(file, index) in files"
                :key="index"
                class="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100 shadow-sm"
              >
                <div class="flex items-center gap-3 overflow-hidden">
                  <div
                    class="size-8 rounded bg-gray-50 flex items-center justify-center shrink-0"
                  >
                    <i class="mdi mdi-file-document-outline text-gray-400"></i>
                  </div>
                  <span class="text-sm font-medium text-gray-700 truncate">{{
                    file.name
                  }}</span>
                </div>
                <button
                  @click.prevent="removeFile(index)"
                  class="size-8 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <i class="mdi mdi-close"></i>
                </button>
              </div>

              <button
                @click="triggerFileInput"
                type="button"
                class="mt-2 text-xs font-bold text-primary hover:underline"
              >
                + Add more files
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #bottom>
      <div class="flex justify-end gap-3">
        <SubmitButton form="vehicleDamageForm">
          Submit Vehicle Damage
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
import SubmitButton from "@/components/form/SubmitButton.vue";
import { lessThanToday, required } from "@/utils/validations";
import { currencyFormatter } from "@/utils/utils";
import { add_vehicle_damage } from "../../api/operation.api";
import { useToastStore } from "@/store/toastStore";
import VehiclePartsInput from "../inputs/VehiclePartsInput.vue";
import { ref } from "vue";

export type Props = {
  onSuccess?: () => void;
};

const props = defineProps<{ data?: Props; close: (res: any) => void }>();

const files = ref<File[]>([]);
const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files?.length) {
    files.value.push(...Array.from(target.files));
  }
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  if (event.dataTransfer?.files?.length) {
    files.value.push(...Array.from(event.dataTransfer.files));
  }
};

const removeFile = (index: number) => {
  files.value.splice(index, 1);
};

const toast = useToastStore();
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: (payload: FormData) => add_vehicle_damage(payload),
});

const formValues = {
  damageDate: new Date().toISOString().split("T")[0],
  vehicle: "",
  shipment: "",
  severity: "",
  location: "",
  vehiclePartsAndPrices: [],
  laborCost: 0,
  tax: 0,
  vat: 0,
  estimatedRepairCost: 0,
  actualRepairCost: 0,
  excess: 0,
  partsContribution: 0,
  amountToReceiveFromInsurance: 0,
  description: "",
  documents: [],
};

const getPartsTotal = (parts: any[]) => {
  return parts?.reduce((sum, p) => sum + Number(p.price || 0), 0) || 0;
};

async function handleSubmit(values: any) {
  // Construct FormData because of file uploads and nested arrays
  const formData = new FormData();

  formData.append("damageDate", values.damageDate);
  formData.append("vehicle", values.vehicle);
  if (values.shipment) formData.append("shipment", values.shipment);
  formData.append("severity", values.severity);
  formData.append("location", values.location);
  formData.append("description", values.description || "");

  // Numeric fields
  const numericFields = [
    "laborCost",
    "estimatedRepairCost",
    "actualRepairCost",
    "tax",
    "vat",
    "excess",
    "partsContribution",
    "amountToReceiveFromInsurance",
  ];
  for (const field of numericFields) {
    if (values[field] !== undefined && values[field] !== null) {
      formData.append(field, String(values[field]));
    }
  }

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
  if (files.value.length > 0) {
    files.value.forEach((file: File) => {
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
