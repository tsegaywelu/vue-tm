<template>
  <Form :id="formId" :values="initialValues" :onSubmit="handleSubmit">
    <template #default="{ form }">
      <!-- 1. Basic Vehicle Information -->
      <Colapsable
        title="Basic Vehicle Information"
        description="Core identity and specifications of the vehicle."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Input
            name="plateNumber"
            label="Plate Number"
            :validation="{ required }"
            :attributes="{ placeholder: 'e.g. A-12345' }"
          />

          <Input
            name="sideNumber"
            label="Side Number"
            :attributes="{ placeholder: 'Enter side number', type: 'number' }"
          />

          <Input
            name="weightCapacity"
            label="Weight Capacity"
            :validation="{ required }"
            :attributes="{ placeholder: '0.00', type: 'number' }"
          />

          <DateInput
            name="purchaseDate"
            label="Purchase Date"
            :attributes="{ placeholder: 'Select date' }"
            :validation="{
              dateLessThanOrEqalToToday,
            }"
          />

          <Input
            name="engineNumber"
            label="Engine Number"
            :validation="{ required }"
            :attributes="{ placeholder: 'Enter engine number' }"
          />

          <Input
            name="chassisNumber"
            label="Chassis Number"
            :validation="{ required }"
            :attributes="{ placeholder: 'Enter chassis number' }"
          />

          <SelectInput
            name="vehicleType"
            label="Vehicle Type"
            url="/vehicle-type"
            label_key="name"
            value_key="_id"
            :validation="{ required }"
            :attributes="{ placeholder: 'Select type' }"
          />

          <SelectInput
            name="vehicleGroup"
            label="Vehicle Group"
            url="/group"
            label_key="name"
            value_key="_id"
            :attributes="{ placeholder: 'Select group' }"
          />

          <SelectInput
            name="type"
            label="Category Type"
            url="/type"
            label_key="name"
            value_key="_id"
            :attributes="{ placeholder: 'Select category' }"
          />

          <SelectInput
            name="vehicleModel"
            label="Vehicle Model"
            url="/vehicle-model"
            label_key="name"
            value_key="_id"
            :attributes="{ placeholder: 'Select model' }"
          />

          <SelectInput
            name="maker"
            label="Maker"
            url="/maker"
            label_key="name"
            value_key="_id"
            :attributes="{ placeholder: 'Select maker' }"
          />

          <SelectInput
            name="region"
            label="Region"
            url="/region"
            label_key="name"
            value_key="_id"
            :attributes="{ placeholder: 'Select region' }"
          />

          <DateInput
            name="lastServiceDate"
            label="Last Service Date"
            :validation="{ required, dateLessThanOrEqalToToday }"
            :attributes="{ placeholder: 'Select date' }"
          />
        </div>
      </Colapsable>

      <!-- 2. Trailer Information -->
      <Colapsable
        title="Trailer Information"
        description="Details of the attached trailer, if applicable."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Input
            name="trailerPlate"
            label="Trailer Plate Number"
            :attributes="{ placeholder: 'Enter trailer plate' }"
          />

          <Input
            name="trailerChassisNumber"
            label="Trailer Chassis Number"
            :attributes="{ placeholder: 'Enter trailer chassis' }"
          />

          <DateInput
            name="trailerPurchaseDate"
            label="Trailer Purchase Date"
            :attributes="{ placeholder: 'Select date' }"
            :validation="{ dateLessThanOrEqalToToday }"
          />
        </div>
      </Colapsable>

      <!-- 3. Ownership & Assignment -->
      <Colapsable
        title="Ownership & Assignment"
        description="Management details and operational assignment."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SelectInput
            name="driver"
            label="Assigned Driver"
            url="/driver"
            :params="{ driverStatus: 'vehicle_not_assigned' }"
            :label_key="
              (item: any) =>
                `${item.firstName} ${item.middleName || ''} ${item.lastName || ''}`
            "
            value_key="_id"
            :validation="{ required }"
            :attributes="{ placeholder: 'Select driver' }"
          />

          <SelectInput
            name="ownership"
            label="Ownership Type"
            :options="ownershipOptions"
            :validation="{ required }"
            :attributes="{ placeholder: 'Select ownership' }"
          />

          <component
            :is="form.Subscribe"
            :selector="(state: any) => [state.values.ownership]"
            v-slot="[ownership]"
          >
            <SelectInput
              v-if="ownership && ownership !== 'Owned'"
              name="transporter"
              label="Transporter"
              url="/transporter"
              label_key="name"
              value_key="_id"
              searchable
              :validation="{ required }"
              :attributes="{ placeholder: 'Select transporter' }"
            />
          </component>

          <component
            :is="form.Subscribe"
            :selector="(state: any) => [state.values.ownership]"
            v-slot="[ownership]"
          >
            <SelectInput
              v-if="ownership === 'Owned'"
              name="vehicleUseType"
              label="Vehicle Use Type"
              :options="[
                { label: 'In-house', value: 'INHOUSE' },
                { label: 'Lease out', value: 'LEASE_OUT' },
              ]"
              :attributes="{ placeholder: 'Select use type' }"
            />
          </component>

          <ToggleInput name="isOperational" label="Is Vehicle Operational" />

          <component
            :is="form.Subscribe"
            :selector="(state: any) => [state.values.isOperational]"
            v-slot="[isOperational]"
          >
            <SelectInput
              name="status"
              label="Vehicle Status"
              :options="
                isOperational ? operationalOptions : nonOperationalOptions
              "
              :validation="{ required }"
              :attributes="{ placeholder: 'Select status' }"
            />
          </component>
        </div>

        <!-- Lease Details Section -->
        <component
          :is="form.Subscribe"
          :selector="(state: any) => [state.values.ownership]"
          v-slot="[ownership]"
        >
          <div
            v-if="ownership === 'Leased'"
            class="mt-8 p-6 bg-grey-25 rounded-3xl border border-grey-100"
          >
            <h4
              class="text-sm font-bold text-grey-900 mb-6 uppercase tracking-wider"
            >
              Lease Agreement Details
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                name="leaseAmount"
                label="Lease Amount"
                :validation="{ required }"
                :attributes="{ placeholder: '0.00', type: 'number' }"
              />
              <DateInput
                name="leaseStartDate"
                label="Lease Start Date"
                :attributes="{ placeholder: 'Select date' }"
                :validation="{
                  required,
                  dateLessThanOrEqalToToday,
                  validateLeaseStartDate,
                }"
                match="leaseEndDate"
              />
              <DateInput
                name="leaseEndDate"
                label="Lease End Date"
                :attributes="{ placeholder: 'Select date' }"
                :validation="{
                  required,
                  validateLeaseEndDate,
                }"
                match="leaseStartDate"
              />
              <ToggleInput
                name="leaseCoversMaintenance"
                label="Covers Maintenance"
              />
              <ToggleInput
                name="leaseCoversAdvance"
                label="Covers Advance / Fuel"
              />
            </div>
          </div>
        </component>
      </Colapsable>

      <!-- 4. Performance & Compliance -->
      <Colapsable
        title="Performance & Compliance"
        description="Tracking metrics and legal documentation dates."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Input
            name="mileage"
            label="Total Mileage"
            :validation="{ required }"
            :attributes="{ placeholder: '0', type: 'number' }"
          />

          <Input
            name="mileageSinceService"
            label="Mileage Since Service"
            :validation="{ required }"
            :attributes="{ placeholder: '0', type: 'number' }"
          />

          <Input
            name="fuelRateLoaded"
            label="Fuel Rate (Loaded)"
            :attributes="{ placeholder: '0.00', type: 'number' }"
          />

          <Input
            name="fuelRateUnloaded"
            label="Fuel Rate (Unloaded)"
            :attributes="{ placeholder: '0.00', type: 'number' }"
          />

          <Input
            name="averageFuelUsage"
            label="Average Fuel Usage"
            :attributes="{ placeholder: '0.00', type: 'number' }"
          />

          <DateInput
            name="roadTaxExpireDate"
            label="Road Tax Expire Date"
            :attributes="{ placeholder: 'Select date' }"
            :validation="{
              dateGreaterThanOrEqalToToday,
            }"
          />

          <DateInput
            name="boloIssueDate"
            label="Bolo Issue Date"
            :attributes="{ placeholder: 'Select date' }"
          />

          <DateInput
            name="boloExpirationDate"
            label="Bolo Expire Date"
            :attributes="{ placeholder: 'Select date' }"
          />
        </div>
      </Colapsable>

      <!-- 4. Insurance Information -->
      <Colapsable
        title="Insurance Information"
        description="Provide vehicle insurance details."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DateInput
            name="insurance_insuredDate"
            label="Insured Date"
            :attributes="{ placeholder: 'Select date' }"
          />
          <Input
            name="insurance_insuredAmount"
            label="Insured Amount"
            :attributes="{ placeholder: '0.00', type: 'number' }"
          />
          <Input
            name="insurance_prePaymentAmount"
            label="Pre-Payment Amount"
            :attributes="{ placeholder: '0.00', type: 'number' }"
          />
          <Input
            name="insurance_lifespan"
            label="Lifespan (Days)"
            :attributes="{ placeholder: '0', type: 'number' }"
          />
          <SelectInput
            name="insurance_insurer"
            label="Insurer"
            url="/insurance-provider"
            label_key="name"
            value_key="_id"
            searchable
            :attributes="{ placeholder: 'Select insurer' }"
          />
        </div>
      </Colapsable>

      <!-- 5. Vehicle Documents -->
      <Colapsable
        title="Vehicle Documents"
        description="Upload relevant vehicle documents (Registration, Insurance, etc.)."
      >
        <div
          class="p-6 bg-grey-25 rounded-3xl border border-grey-100 border-dashed"
        >
          <div class="flex flex-col items-center justify-center gap-4 py-8">
            <div
              class="size-16 rounded-full bg-white flex items-center justify-center shadow-sm border border-grey-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-grey-400"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" x2="12" y1="3" y2="15" />
              </svg>
            </div>
            <div class="text-center">
              <p class="text-sm font-bold text-grey-900">
                Click to upload or drag and drop
              </p>
              <p class="text-xs text-grey-500 mt-1">
                PDF, PNG, JPG (Max 10MB per file)
              </p>
            </div>
            <input
              type="file"
              ref="fileInputRef"
              class="hidden"
              multiple
              @change="handleFileChange"
            />
            <Button
              variant="outline"
              size="sm"
              @click="fileInputRef?.click()"
              class_name="bg-white"
            >
              Select New Files
            </Button>
          </div>

          <!-- Existing Documents -->
          <div
            v-if="initialValues.vehicleDocuments?.length"
            class="mb-6 space-y-3"
          >
            <p class="text-xs font-bold text-grey-500 uppercase tracking-wider">
              Existing Documents
            </p>
            <div
              v-for="(doc, index) in initialValues.vehicleDocuments"
              :key="'existing-' + index"
              class="flex items-center justify-between p-4 bg-white rounded-2xl border border-grey-100 shadow-sm"
            >
              <div class="flex items-center gap-3">
                <div
                  class="size-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
                    />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-bold text-grey-900">
                    {{ doc.split("/").pop() }}
                  </p>
                  <p class="text-xs text-grey-500">Uploaded Document</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                @click="openModal('FileViewerModal', { fileURL: getStaticUrl(doc) })"
              >
                View
              </Button>
            </div>
          </div>

          <!-- Selected Files List (New) -->
          <div v-if="selectedFiles.length > 0" class="mt-6 space-y-3">
            <p class="text-xs font-bold text-grey-500 uppercase tracking-wider">
              New Documents to Upload
            </p>
            <div
              v-for="(file, index) in selectedFiles"
              :key="index"
              class="flex items-center justify-between p-4 bg-white rounded-2xl border border-grey-100 shadow-sm"
            >
              <div class="flex items-center gap-3">
                <div
                  class="size-10 rounded-xl bg-grey-50 flex items-center justify-center text-grey-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
                    />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-bold text-grey-900">{{ file.name }}</p>
                  <p class="text-xs text-grey-500">
                    {{ (file.size / 1024 / 1024).toFixed(2) }} MB
                  </p>
                </div>
              </div>
              <button
                @click="removeFile(index)"
                class="size-8 rounded-lg hover:bg-red-50 text-grey-400 hover:text-red-600 transition-colors flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  <line x1="10" x2="10" y1="11" y2="17" />
                  <line x1="14" x2="14" y1="11" y2="17" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Colapsable>

      <Colapsable
        title="Remarks"
        description="Any additional information or special notes."
      >
        <TextareaInput
          name="remark"
          label="Remarks"
          :attributes="{ placeholder: 'Enter remarks...' }"
        />
      </Colapsable>

      <div class="pt-10 flex justify-end gap-4">
        <slot name="actions" :form="form"></slot>
      </div>
    </template>
  </Form>
</template>

<script setup lang="ts">
import Form from "@/components/form/Form.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import DateInput from "@/components/form/DateInput.vue";
import ToggleInput from "@/components/form/ToggleInput.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import {
  dateLessThanOrEqalToToday,
  dateGreaterThanOrEqalToToday,
  required,
} from "@/utils/validations";
import { ref } from "vue";
import Button from "@/components/common/Button.vue";
import { openModal } from "@customizer/modal-x";
import { getStaticUrl } from "@/utils/utils";

const props = defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  onSubmit: (values: any) => Promise<void> | void;
}>();

const fileInputRef = ref<HTMLInputElement | null>(null);
const selectedFiles = ref<File[]>([]);

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    selectedFiles.value = [...selectedFiles.value, ...Array.from(target.files)];
  }
};

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1);
};

const ownershipOptions = [
  { label: "Owned", value: "Owned" },
  { label: "Rental", value: "Rental" },
  { label: "Leased", value: "Leased" },
];

const operationalOptions = [
  { value: "available", label: "Available" },
  { value: "assigned", label: "Assigned" },
];

const nonOperationalOptions = [
  { value: "inactive", label: "Inactive" },
  { value: "maintenance", label: "Maintenance" },
  { value: "accident", label: "Accident" },
  { value: "retired", label: "Retired" },
  { value: "sold", label: "Sold" },
];

const validateLeaseStartDate = (value: any, _msg: any, form: any) => {
  const endDateStr = form?.state?.values?.leaseEndDate;
  if (value && endDateStr) {
    const start = new Date(value);
    const end = new Date(endDateStr);
    if (start > end) return [false, "Start Date must be before End Date"];
  }
  return [true, ""];
};

const validateLeaseEndDate = (value: any, _msg: any, form: any) => {
  const startDateStr = form?.state?.values?.leaseStartDate;
  if (value && startDateStr) {
    const start = new Date(startDateStr);
    const end = new Date(value);
    if (end < start) return [false, "End Date must be after Start Date"];
  }
  return [true, ""];
};

const handleSubmit = (values: any) => {
  // Build the nested objects as expected by the API
  const insuranceInformation = {
    insuredDate: values.insurance_insuredDate,
    insuredAmount: Number(values.insurance_insuredAmount) || 0,
    prePaymentAmount: Number(values.insurance_prePaymentAmount) || 0,
    lifespan: Number(values.insurance_lifespan) || 0,
    insurer: values.insurance_insurer,
  };

  const lease =
    values.ownership === "Leased"
      ? {
          startDate: values.leaseStartDate,
          endDate: values.leaseEndDate,
          amount: Number(values.leaseAmount) || 0,
          leaseAgreement: {
            coversMaintenance: !!values.leaseCoversMaintenance,
            coversAdvance: !!values.leaseCoversAdvance,
          },
          transporter: values.transporter,
          leaseDirection: "INWARD",
        }
      : undefined;

  // Build FormData for multi-part submission (includes files)
  const formData = new FormData();

  // Primary fields
  const primaryFields = [
    "plateNumber",
    "sideNumber",
    "lastServiceDate",
    "chassisNumber",
    "ownership",
    "vehicleType",
    "vehicleModel",
    "maker",
    "region",
    "vehicleGroup",
    "mileage",
    "mileageSinceService",
    "driver",
    "status",
    "isOperational",
    "remark",
    "fuelRateLoaded",
    "fuelRateUnloaded",
    "averageFuelUsage",
    "engineNumber",
    "trailerPlate",
    "trailerChassisNumber",
    "trailerPurchaseDate",
    "roadTaxExpireDate",
    "boloIssueDate",
    "boloExpirationDate",
    "purchaseDate",
  ];

  primaryFields.forEach((key) => {
    if (values[key] !== undefined && values[key] !== null) {
      // Don't append objects (like driver, vehicleType etc. if they are still objects)
      // but in edit mode they might be IDs already due to mapping
      formData.append(key, values[key]);
    }
  });

  // Ownership specific
  if (values.ownership === "Owned" && values.vehicleUseType) {
    formData.append("vehicleUseType", values.vehicleUseType);
  }

  // Insurance
  if (values.insurance_insuredDate || values.insurance_insurer) {
    formData.append("insuranceInformation", JSON.stringify(insuranceInformation));
  }

  if (lease) {
    formData.append("lease[startDate]", lease.startDate || "");
    formData.append("lease[endDate]", lease.endDate || "");
    formData.append("lease[amount]", String(lease.amount));
    formData.append("lease[transporter]", lease.transporter || "");
    formData.append("lease[leaseDirection]", lease.leaseDirection);
    formData.append(
      "lease[leaseAgreement][coversAdvance]",
      String(lease.leaseAgreement.coversAdvance),
    );
    formData.append(
      "lease[leaseAgreement][coversMaintenance]",
      String(lease.leaseAgreement.coversMaintenance),
    );
  }

  // Files
  selectedFiles.value.forEach((file) => {
    formData.append("vehicleDocuments", file);
  });

  props.onSubmit(formData);
};
</script>
