<template>
  <FormModalParent
    title="Vehicle Registration"
    subtitle="Register Transporter, Driver, and Vehicle"
    form-id="vehicleRegistrationForm"
    @submit="handleFinalSubmit"
    modal-style="auto"
    :values="stepFields"
    :key="currentIndex"
  >
    <template #center="{ form }">
      <div class="flex items-center justify-between mb-8 relative z-0">
        <div
          class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-100 -z-10"
        ></div>
        <div
          class="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 primary-gradient -z-10 transition-all duration-300"
          :style="{
            width: `${(currentIndex / (stepOrder.length - 1)) * 100}%`,
          }"
        ></div>
        <div
          v-for="(stepName, index) in stepOrder"
          :key="stepName"
          class="flex flex-col items-center gap-2 bg-surface px-2"
        >
          <div
            class="size-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300"
            :class="[
              index <= currentIndex
                ? 'primary-gradient text-white shadow-md shadow-primary/20 scale-110'
                : 'bg-gray-100 text-gray-400',
            ]"
          >
            <span v-if="index < currentIndex">✓</span>
            <span v-else>{{ index + 1 }}</span>
          </div>
          <span
            class="text-[11px] font-bold uppercase tracking-wider transition-colors duration-300"
            :class="index <= currentIndex ? 'text-gray-900' : 'text-gray-400'"
          >
            {{ stepName }}
          </span>
        </div>
      </div>

      <div v-if="currentStep === 'transporter'" class="flex flex-col gap-6">
        <Input
          name="transporter.tradeName"
          label="Transporter Name"
          :attributes="{ placeholder: 'Enter company or individual name' }"
          :validation="{ required }"
        />
        <Input
          name="transporter.phoneNumber"
          label="Phone Number"
          :attributes="{ placeholder: '+251 9... or 09...' }"
          :validation="{ required, phone }"
        />
        <Input
          name="transporter.address"
          label="Address"
          :attributes="{ placeholder: 'City, Subcity, Woreda, House No.' }"
          :validation="{ required }"
        />
      </div>

      <div v-if="currentStep === 'driver'" class="flex flex-col gap-6">
        <div class="grid grid-cols-2 gap-4">
          <Input
            name="driver.firstName"
            label="First Name"
            :attributes="{ placeholder: 'First name' }"
            :validation="{ required }"
          />
          <Input
            name="driver.middleName"
            label="Middle Name"
            :attributes="{ placeholder: 'Middle name' }"
            :validation="{ required }"
          />
        </div>
        <Input
          name="driver.lastName"
          label="Last Name"
          :attributes="{ placeholder: 'Last name' }"
          :validation="{ required }"
        />
        <Input
          name="driver.phoneNumber"
          label="Phone Number"
          :attributes="{ placeholder: 'Driver\'s phone number' }"
          :validation="{ required, phone }"
        />
        <Input
          name="driver.driverLicenceNumber"
          label="License Number"
          :attributes="{ placeholder: 'Enter driving license number' }"
          :validation="{ required }"
        />
      </div>

      <div v-if="currentStep === 'vehicle'" class="flex flex-col gap-6">
        <Input
          name="vehicle.plateNumber"
          label="Plate Number"
          :attributes="{ placeholder: 'e.g. AA 12345' }"
          :validation="{ required }"
        />
        <Input
          name="vehicle.trailerPlate"
          label="Trailer Plate"
          :attributes="{ placeholder: 'e.g. TR 67890 (Optional)' }"
        />
        <SelectInput
          name="vehicle.vehicleType"
          label="Vehicle Type"
          url="/vehicle-type"
          label_key="name"
          value_key="_id"
          :attributes="{ placeholder: 'Select vehicle category' }"
          :validation="{ required }"
        />
      </div>

      <!-- Insurance step temporarily disabled
      <div v-if="currentStep === 'insurance'" class="flex flex-col gap-6">
        <SelectInput
          name="insurance.insurer"
          label="Insurance Provider"
          url="/insurance-provider"
          label_key="name"
          value_key="_id"
          :attributes="{ placeholder: 'Select insurance company' }"
          :validation="{ required }"
        />
        <div class="grid grid-cols-2 gap-4">
          <DateInput
            name="insurance.prePaymentDate"
            label="Pre Payment Start Date"
            :attributes="{ placeholder: 'Select start date' }"
            :validation="{
              required,
              dateGreaterThanOrEqalToToday,
              validateStartDate,
            }"
            match="insurance.prePaymentMatureDate"
          />
          <DateInput
            name="insurance.prePaymentMatureDate"
            label="Pre Payment Mature Date"
            :attributes="{ placeholder: 'Select end date' }"
            :validation="{ required, validateMatureDate }"
            match="insurance.prePaymentDate"
          />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <Input name="insurance.JV" label="JV" :attributes="{ placeholder: 'Enter JV' }" :validation="{ required }" />
          <Input name="insurance.CPV" label="CPV" :attributes="{ placeholder: 'Enter CPV' }" :validation="{ required }" />
          <Input name="insurance.withHoldTax" label="Withhold Tax" type="number" :attributes="{ placeholder: 'Enter Withhold Tax', step: '0.01' }" :validation="{ required, number }" />
          <Input name="insurance.total" label="Total" type="number" :attributes="{ placeholder: 'Enter Total', step: '0.01' }" :validation="{ required, number }" />
        </div>
      </div>
      -->
    </template>

    <template #bottom="{ form }">
      <div class="flex justify-end gap-3">
        <Button
          v-if="currentIndex > 0"
          variant="secondary"
          size="md"
          @click="goBack(form)"
        >
          Back
        </Button>
        <SubmitButton :loading="isLoading">
          {{
            currentStep === "vehicle" ? "Complete Registration" : "Next Step"
          }}
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { closeModal } from "@customizer/modal-x";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
// import DateInput from "@/components/form/DateInput.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { phone, required } from "@/utils/validations";
import { useToastStore } from "@/store/toastStore";
import * as api from "../api/registration.api";
import { useMutation } from "@tanstack/vue-query";
import type { Driver, Trasporter, Vehicle } from "../operation.types";

// [MODAL-X] AUTO-GENERATED INSTANCE
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.


export type ReturnType = {
  transporter: Trasporter;
  driver: Driver;
  vehicle: Vehicle;
  // insurance: Insurance; // temporarily disabled
} | null;

const toast = useToastStore();
const isLoading = ref(false);

// const validateStartDate = (value: any, msg: any, form: any) => { ... }; // insurance step disabled
// const validateMatureDate = (value: any, msg: any, form: any) => { ... }; // insurance step disabled

const trasporterMutation = useMutation({
  mutationKey: ["trasporter"],
  mutationFn: (payload: any) => api.add_transporter(payload),
});

const driverrMutation = useMutation({
  mutationKey: ["driver"],
  mutationFn: (payload: any) => api.add_driver(payload),
});

const vehicleMutation = useMutation({
  mutationKey: ["vehicle"],
  mutationFn: (payload: any) => api.add_vehicle(payload),
});

// const insuranceMutation = useMutation({
//   mutationKey: ["insurance"],
//   mutationFn: (payload: any) => api.add_insurance(payload),
// });

const stepOrder = ["transporter", "driver", "vehicle"] as const;
const currentStep = ref<(typeof stepOrder)[number]>("transporter");
const currentIndex = computed(() => stepOrder.indexOf(currentStep.value));

// Define which fields belong to which step for validation
const emptyFields = {
  transporter: {
    tradeName: "",
    phoneNumber: "",
    address: "",
  },
  driver: {
    firstName: "",
    middleName: "",
    lastName: "",
    phoneNumber: "",
    driverLicenceNumber: "",
  },
  vehicle: {
    plateNumber: "",
    trailerPlate: "",
    vehicleType: "",
  },
  // insurance: { ... }, // temporarily disabled
};

const stepFields = ref(emptyFields);

// Fill with faker data in dev mode
if (import.meta.env.DEV) {
  import("@/utils/devDummyData").then(({ generateVehicleRegistrationFields }) =>
    generateVehicleRegistrationFields().then((fields) => {
      stepFields.value = fields;
    }),
  );
}

function goBack(form: any) {
  stepFields.value = JSON.parse(JSON.stringify(form.state.values));
  currentStep.value = stepOrder[currentIndex.value - 1];
}

async function handleFinalSubmit(values: any) {
  stepFields.value = JSON.parse(JSON.stringify(values));

  if (currentStep.value !== "vehicle") {
    currentStep.value = stepOrder[currentIndex.value + 1];
    return;
  }

  isLoading.value = true;
  try {
    const transRes = await trasporterMutation.mutateAsync({
      ...stepFields.value.transporter,
      name: stepFields.value.transporter.tradeName,
      type: "STSC",
    });
    if (!transRes.success) return toast.error(transRes.error);

    const driverPayload = {
      ...stepFields.value.driver,
      transporter: transRes.data?._id,
      isActive: true,
      driverStatus: "vehicle_not_assigned",
      isEmployed: false,
    };
    const driverRes = await driverrMutation.mutateAsync(driverPayload);
    if (!driverRes.success) return toast.error(driverRes.error);

    const vehiclePayload = {
      ...stepFields.value.vehicle,
      transporter: transRes.data?._id,
      driver: driverRes.data?._id,
      ownership: "Rental",
      status: "available",
      isOperational: true,
    };
    const vehicleRes = await vehicleMutation.mutateAsync(vehiclePayload);
    if (!vehicleRes.success) return toast.error(vehicleRes.error);

    toast.success("All data registered successfully!");
    closeModal({
      transporter: transRes.data,
      driver: driverRes.data,
      vehicle: vehicleRes.data,
    });
  } finally {
    isLoading.value = false;
  }
}
</script>
