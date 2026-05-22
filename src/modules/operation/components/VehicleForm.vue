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
            :options="props.labels?.vehicleType ? [{ label: props.labels.vehicleType, value: props.initialValues.vehicleType }] : []"
          />

          <SelectInput
            name="vehicleGroup"
            label="Vehicle Group"
            url="/group"
            label_key="name"
            value_key="_id"
            :attributes="{ placeholder: 'Select group' }"
            :options="props.labels?.vehicleGroup ? [{ label: props.labels.vehicleGroup, value: props.initialValues.vehicleGroup }] : []"
          />

          <SelectInput
            name="type"
            label="Category Type"
            url="/type"
            label_key="name"
            value_key="_id"
            :attributes="{ placeholder: 'Select category' }"
            :options="props.labels?.type ? [{ label: props.labels.type, value: props.initialValues.type }] : []"
          />

          <SelectInput
            name="vehicleModel"
            label="Vehicle Model"
            url="/vehicle-model"
            label_key="name"
            value_key="_id"
            :attributes="{ placeholder: 'Select model' }"
            :options="props.labels?.vehicleModel ? [{ label: props.labels.vehicleModel, value: props.initialValues.vehicleModel }] : []"
          />

          <SelectInput
            name="maker"
            label="Maker"
            url="/maker"
            label_key="name"
            value_key="_id"
            :attributes="{ placeholder: 'Select maker' }"
            :options="props.labels?.maker ? [{ label: props.labels.maker, value: props.initialValues.maker }] : []"
          />

          <SelectInput
            name="region"
            label="Region"
            url="/region"
            label_key="name"
            value_key="_id"
            :attributes="{ placeholder: 'Select region' }"
            :options="props.labels?.region ? [{ label: props.labels.region, value: props.initialValues.region }] : []"
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
            :options="props.labels?.driver ? [{ label: props.labels.driver, value: props.initialValues.driver }] : []"
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
              :options="props.labels?.transporter ? [{ label: props.labels.transporter, value: props.initialValues.transporter }] : []"
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
            :options="props.labels?.insurance_insurer ? [{ label: props.labels.insurance_insurer, value: props.initialValues.insurance_insurer }] : []"
          />
        </div>
      </Colapsable>

      <!-- 5. Vehicle Documents -->
      <Colapsable
        title="Vehicle Documents"
        description="Upload relevant vehicle documents (Registration, Insurance, etc.)."
      >
        <FileInput
          name="vehicleDocuments"
          label="Vehicle Documents"
          multiple
        />
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
import FileInput from "@/components/form/FileInput.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import {
  dateLessThanOrEqalToToday,
  dateGreaterThanOrEqalToToday,
  required,
} from "@/utils/validations";
const props = defineProps<{
  formId: string;
  mode?: "add" | "edit";
  initialValues: Record<string, any>;
  labels?: Record<string, string>;
  onSubmit: (values: any) => Promise<void> | void;
}>();

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
  if (props.mode === "edit") {
    return handleEditSubmit(values);
  }
  return handleAddSubmit(values);
};

const handleEditSubmit = (values: any) => {
  const editFields = [
    "plateNumber",
    "sideNumber",
    "weightCapacity",
    "ownership",
    "lastServiceDate",
    "roadTaxExpireDate",
    "boloIssueDate",
    "boloExpirationDate",
    "driver",
    "chassisNumber",
    "mileageSinceService",
    "mileage",
    "engineNumber",
    "fuelRateLoaded",
    "fuelRateUnloaded",
    "remark",
    "trailerPlate",
    "trailerPurchaseDate",
    "trailerChassisNumber",
    "vehicleType",
    "vehicleGroup",
    "maker",
    "region",
    "purchaseDate",
  ];

  const payload: Record<string, any> = {};
  editFields.forEach((key) => {
    if (values[key] !== undefined && values[key] !== null && values[key] !== "") {
      payload[key] = values[key];
    }
  });

  if (values.ownership === "Owned") {
    payload.vehicleUseType = values.vehicleUseType || "INHOUSE";
  }

  props.onSubmit(payload);
};

const handleAddSubmit = (values: any) => {
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

  const formData = new FormData();

  const primaryFields = [
    "plateNumber",
    "sideNumber",
    "weightCapacity",
    "lastServiceDate",
    "chassisNumber",
    "ownership",
    "vehicleType",
    "vehicleModel",
    "maker",
    "region",
    "vehicleGroup",
    "type",
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
    "transporter",
  ];

  primaryFields.forEach((key) => {
    if (values[key] !== undefined && values[key] !== null) {
      formData.append(key, values[key]);
    }
  });

  if (values.ownership === "Owned") {
    formData.append("vehicleUseType", values.vehicleUseType || "INHOUSE");
  }

  if (values.insurance_insuredDate || values.insurance_insurer) {
    formData.append("insuranceInformation", JSON.stringify(insuranceInformation));
  }

  if (lease) {
    formData.append("lease[startDate]", lease.startDate || "");
    formData.append("lease[endDate]", lease.endDate || "");
    formData.append("lease[amount]", String(lease.amount));
    formData.append("lease[transporter]", lease.transporter || "");
    formData.append("lease[leaseDirection]", lease.leaseDirection);
    formData.append("lease[leaseAgreement][coversAdvance]", String(lease.leaseAgreement.coversAdvance));
    formData.append("lease[leaseAgreement][coversMaintenance]", String(lease.leaseAgreement.coversMaintenance));
  }

  if (values.vehicleDocuments?.length > 0) {
    values.vehicleDocuments.forEach((file: any) => {
      if (file instanceof File) formData.append("vehicleDocuments", file);
    });
  }

  props.onSubmit(formData);
};
</script>
