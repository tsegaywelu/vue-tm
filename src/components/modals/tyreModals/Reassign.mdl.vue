<template>
  <FormModalParent
    :values="formValues"
    @submit="handleFormSubmit"
    modal-style="auto"
    title="Reassign Tyre"
    form-id="reassignForm"
  >
    <template #center>
      <!-- Date Input -->
      <DateInput
        name="date"
        label="Reassign Date"
        :validation="{ required, dateLessThanOrEqalToToday }"
        :attributes="{
          placeholder: 'Select date',
        }"
      />

      <!-- Trailer Toggle -->
      <ToggleInput
        name="trailer"
        label="Is Trailer?"
        :on_change="onTrailerChange"
      />

      <!-- Vehicle Input -->
      <VehicleInput
        name="newVehicle"
        label="Vehicle"
        label-key="label"
        value-key="value"
        :validation="{ required }"
      />

      <!-- Driver Input -->
      <SelectInput
        name="newDriver"
        label="Driver"
        :options="driverOptions"
        label-key="label"
        value-key="value"
        :validation="{ required }"
      />

      <!-- Installation Mileage Input -->
      <Input
        name="installationMileage"
        label="Installation Mileage (New Vehicle)"
        :attributes="{ placeholder: 'Enter mileage' }"
        :validation="{ required, pos_number }"
      />

      <!-- New Position Input -->
      <SelectInput
        name="newPosition"
        label="Tyre Position"
        :options="positionOptions"
        label-key="label"
        value-key="value"
        :validation="{ required }"
      />

      <!-- Description Input -->
      <TextareaInput
        name="description"
        label="Description"
        :rows="4"
        :attributes="{ placeholder: 'Enter a description...' }"
      />
    </template>

    <template #bottom>
      <div class="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          size="lg-sm"
          @click="close(false)"
        >
          Cancel
        </Button>
        <SubmitButton variant="primary" size="lg-sm" :is-loading="isLoading">
          Save
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import FormModalParent from "../FormModalParent.vue";
import Button from "@/components/common/Button.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import ToggleInput from "@/components/form/ToggleInput.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import DateInput from "@/components/form/DateInput.vue";
import {
  dateLessThanOrEqalToToday,
  pos_number,
  required,
} from "@/utils/validations";
import { useToastStore } from "@/store/toastStore";
import { update_tyre_status } from "@/modules/operation/api/tyre.api";
import {
  fetch_vehicles,
  fetch_drivers,
} from "@/modules/operation/api/operation.api";
import VehicleInput from "@/components/common/inputs/VehicleInput.vue";

export type ReturnType = boolean;
export type Props = {
  tyre: any;
};

const props = defineProps<{ data: Props; close: (res: ReturnType) => void }>();

const toast = useToastStore();
const isLoading = ref(false);
const isTrailer = ref(false);

const vehicles = ref<any[]>([]);
const drivers = ref<any[]>([]);

onMounted(async () => {
  try {
    const [vehiclesRes, driversRes] = await Promise.all([
      fetch_vehicles({ limit: 1000 }),
      fetch_drivers({ limit: 1000 }),
    ]);

    vehicles.value = Array.isArray(vehiclesRes?.data?.result)
      ? vehiclesRes?.data?.result
      : Array.isArray(vehiclesRes?.data?.items)
        ? vehiclesRes?.data?.items
        : Array.isArray(vehiclesRes?.data)
          ? vehiclesRes?.data
          : [];

    drivers.value = Array.isArray(driversRes?.data?.results)
      ? driversRes?.data?.results
      : Array.isArray(driversRes?.data?.items)
        ? driversRes?.data?.items
        : Array.isArray(driversRes?.data)
          ? driversRes?.data
          : [];
  } catch (error) {
    console.error("Failed to load options", error);
  }
});

const vehicleOptions = computed(() => {
  return vehicles.value.map((v) => ({ value: v._id, label: v.plateNumber }));
});

const driverOptions = computed(() => {
  return drivers.value.map((d) => ({
    value: d._id,
    label: `${d.firstName} ${d.middleName || ""}`.trim(),
  }));
});

const tyre = computed(() => props.data.tyre ?? {});

const formValues = computed(() => ({
  date: "",
  trailer: false,
  newVehicle: "",
  newDriver: "",
  installationMileage: "",
  newPosition: "",
  description: "",
}));

const onTrailerChange = (val: boolean) => {
  isTrailer.value = val;
};

const positionOptions = computed(() => {
  if (isTrailer.value) {
    return [
      { value: "FRONT_RIGHT_OUTER", label: "Front Right Outer" },
      { value: "FRONT_RIGHT_INNER", label: "Front Right Inner" },
      { value: "FRONT_LEFT_OUTER", label: "Front Left Outer" },
      { value: "FRONT_LEFT_INNER", label: "Front Left Inner" },
      { value: "MID_LEFT_INNER", label: "Mid Left Inner" },
      { value: "MID_LEFT_OUTER", label: "Mid Left Outer" },
      { value: "MID_RIGHT_INNER", label: "Mid Right Inner" },
      { value: "MID_RIGHT_OUTER", label: "Mid Right Outer" },
      { value: "REAR_LEFT_INNER", label: "Rear Left Inner" },
      { value: "REAR_LEFT_OUTER", label: "Rear Left Outer" },
      { value: "REAR_RIGHT_INNER", label: "Rear Right Inner" },
      { value: "REAR_RIGHT_OUTER", label: "Rear Right Outer" },
      { value: "PRIMARY_SQUART", label: "Primary Squart" },
      { value: "SECONDARY_SQUART", label: "Secondary Squart" },
    ];
  } else {
    return [
      { value: "FRONT_LEFT", label: "Front Left" },
      { value: "FRONT_RIGHT", label: "Front Right" },
      { value: "MID_LEFT_INNER", label: "Mid Left Inner" },
      { value: "MID_LEFT_OUTER", label: "Mid Left Outer" },
      { value: "MID_RIGHT_INNER", label: "Mid Right Inner" },
      { value: "MID_RIGHT_OUTER", label: "Mid Right Outer" },
      { value: "REAR_LEFT_INNER", label: "Rear Left Inner" },
      { value: "REAR_LEFT_OUTER", label: "Rear Left Outer" },
      { value: "REAR_RIGHT_INNER", label: "Rear Right Inner" },
      { value: "REAR_RIGHT_OUTER", label: "Rear Right Outer" },
      { value: "PRIMARY_SQUART", label: "Primary Squart" },
      { value: "SECONDARY_SQUART", label: "Secondary Squart" },
    ];
  }
});

async function handleFormSubmit(values: any) {
  const id = tyre.value._id;
  isLoading.value = true;

  try {
    const data = {
      date: values.date,
      trailer: values.trailer,
      newVehicle: values.newVehicle,
      newDriver: values.newDriver,
      installationMileage: Number(values.installationMileage),
      newPosition: values.newPosition,
      description: values.description,
    };

    const res: any = await update_tyre_status(id, "reassign", data);

    if (res.status === 200 || res.status === 201) {
      toast.addToast("Tyre status updated successfully!", "success");
      props.close(true);
    } else {
      toast.addToast(
        `Error: ${res.data?.description || "Unknown error occurred."}`,
        "error",
      );
    }
  } catch (error: any) {
    const msg =
      error.response?.data?.description || error.message || "Unexpected error";
    toast.addToast(`Error: ${msg}`, "error");
  } finally {
    isLoading.value = false;
  }
}
</script>
