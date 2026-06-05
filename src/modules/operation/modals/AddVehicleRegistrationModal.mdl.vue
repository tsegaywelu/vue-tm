<template>
  <FormModalParent
    title="Vehicle Registration"
    subtitle="Register Transporter, Driver, and Vehicle"
    form-id="vehicleRegistrationForm"
    @submit="handleStepSubmit"
    modal-style="auto"
    :values="stepFields"
    :key="currentStep"
  >
    <template #center="{ form }">
      <div class="flex items-center justify-between mb-8 relative z-0">
        <div
          class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-100 -z-10"
        ></div>
        <div
          class="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 primary-gradient -z-10 transition-all duration-300"
          :style="{ width: `${(registeredCount / stepOrder.length) * 100}%` }"
        ></div>
        <div
          v-for="(stepName, index) in stepOrder"
          :key="stepName"
          class="flex flex-col items-center gap-2 bg-surface px-2 cursor-pointer"
          @click="navigateToStep(stepName, form)"
        >
          <div
            class="size-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300"
            :class="[
              registeredData[stepName]
                ? 'bg-green-500 text-white shadow-md shadow-green-200/50'
                : currentStep === stepName
                ? 'primary-gradient text-white shadow-md shadow-primary/20 scale-110'
                : 'bg-gray-100 text-gray-400',
            ]"
          >
            <span v-if="registeredData[stepName]">✓</span>
            <span v-else>{{ index + 1 }}</span>
          </div>
          <span
            class="text-[11px] font-bold uppercase tracking-wider transition-colors duration-300"
            :class="
              currentStep === stepName || registeredData[stepName]
                ? 'text-gray-900'
                : 'text-gray-400'
            "
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
        <SelectInput
          name="driver.transporter"
          label="Transporter"
          url="/transporter"
          label_key="tradeName"
          value_key="_id"
          search_key="tradeName"
          :searchable="true"
          :attributes="{ placeholder: 'Search transporter...' }"
          :validation="{ required }"
        />
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
        <SelectInput
          name="vehicle.transporter"
          label="Transporter"
          url="/transporter"
          label_key="tradeName"
          value_key="_id"
          search_key="tradeName"
          :searchable="true"
          :attributes="{ placeholder: 'Search transporter...' }"
          :validation="{ required }"
        />
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
        ...
      </div>
      -->
    </template>

    <template #bottom="{ form }">
      <div class="flex justify-between gap-3">
        <Button variant="secondary" size="md" @click="handleDone">
          Done
        </Button>
        <SubmitButton :loading="isLoading">
          Register {{ stepLabel }}
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
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.


export type ReturnType = {
  transporter?: Trasporter;
  driver?: Driver;
  vehicle?: Vehicle;
  // insurance?: Insurance; // temporarily disabled
} | null;

const toast = useToastStore();
const isLoading = ref(false);

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

const stepOrder = ["transporter", "driver", "vehicle"] as const;
type StepName = (typeof stepOrder)[number];

const currentStep = ref<StepName>("transporter");

const registeredData = ref<{
  transporter?: Trasporter;
  driver?: Driver;
  vehicle?: Vehicle;
}>({});

const registeredCount = computed(
  () => Object.values(registeredData.value).filter(Boolean).length,
);

const stepLabel = computed(
  () => currentStep.value.charAt(0).toUpperCase() + currentStep.value.slice(1),
);

const emptyFields = {
  transporter: {
    tradeName: "",
    phoneNumber: "",
    address: "",
  },
  driver: {
    transporter: "",
    firstName: "",
    middleName: "",
    lastName: "",
    phoneNumber: "",
    driverLicenceNumber: "",
  },
  vehicle: {
    transporter: "",
    plateNumber: "",
    trailerPlate: "",
    vehicleType: "",
  },
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

function navigateToStep(stepName: StepName, form: any) {
  if (form) {
    stepFields.value = JSON.parse(JSON.stringify(form.state.values));
  }
  currentStep.value = stepName;
}

function handleDone() {
  const hasData =
    registeredData.value.transporter ||
    registeredData.value.driver ||
    registeredData.value.vehicle;
  closeModal(hasData ? { ...registeredData.value } : null);
}

async function handleStepSubmit(values: any) {
  stepFields.value = JSON.parse(JSON.stringify(values));
  isLoading.value = true;

  try {
    if (currentStep.value === "transporter") {
      const res = await trasporterMutation.mutateAsync({
        ...stepFields.value.transporter,
        name: stepFields.value.transporter.tradeName,
        type: "STSC",
      });
      if (!res.success) return toast.error(res.error);
      registeredData.value.transporter = res.data;
      toast.success("Transporter registered successfully!");
      currentStep.value = "driver";
    } else if (currentStep.value === "driver") {
      const res = await driverrMutation.mutateAsync({
        ...stepFields.value.driver,
        isActive: true,
        driverStatus: "vehicle_not_assigned",
        isEmployed: false,
      });
      if (!res.success) return toast.error(res.error);
      registeredData.value.driver = res.data;
      toast.success("Driver registered successfully!");
      currentStep.value = "vehicle";
    } else if (currentStep.value === "vehicle") {
      const res = await vehicleMutation.mutateAsync({
        ...stepFields.value.vehicle,
        ownership: "Rental",
        status: "available",
        isOperational: true,
      });
      if (!res.success) return toast.error(res.error);
      registeredData.value.vehicle = res.data;
      toast.success("Vehicle registered successfully!");
      closeModal({ ...registeredData.value, vehicle: res.data });
    }
  } finally {
    isLoading.value = false;
  }
}
</script>
