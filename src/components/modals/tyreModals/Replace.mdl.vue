<template>
  <FormModalParent
    :values="formValues"
    @submit="handleFormSubmit"
    modal-style="auto"
    title="Replace Tyre"
    form-id="replaceForm"
  >
    <template #center>
      <!-- Old Tyre Details -->
      <div class="grid grid-cols-2 gap-4">
        <Input name="mileage" label="Current Mileage" type="number" :validation="{ required }" />
        <DateInput name="date" label="Date" :validation="{ required }" :attributes="{ placeholder: 'Select date' }" />
      </div>

      <!-- New Tyre Details -->
      <div class="text-sm font-semibold text-gray-700 mt-4 mb-2 border-b pb-1">New Tyre Details</div>
      
      <div class="grid grid-cols-2 gap-4">
        <Input name="serialNumber" label="Serial Number" :validation="{ required }" />
        <Input name="brand" label="Brand" :validation="{ required }" />
        <Input name="treadDepth" label="Tread Depth" type="number" />
        <Input name="TPI" label="TPI" type="number" />
        <Input name="pressure" label="Pressure" type="number" />
        <Input name="price" label="Price" type="number" :validation="{ required }" />
        <Input name="type" label="Type" />
        <DateInput name="installationDate" label="Installation Date" :validation="{ required }" :attributes="{ placeholder: 'Select date' }" />
        <Input name="installationMileage" label="Installation Mileage" type="number" :validation="{ required }" />
      </div>

      <!-- Description Input -->
      <TextareaInput
        name="description"
        label="Description"
        :rows="3"
        class="mt-4"
        :attributes="{ placeholder: 'Enter a description...' }"
      />
    </template>

    <template #bottom>
      <div class="flex justify-end gap-3">
        <Button type="button" variant="secondary" size="lg-sm" @click="close(false)">Cancel</Button>
        <SubmitButton variant="primary" size="lg-sm" :is-loading="isLoading">Save</SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { closeModal } from "@customizer/modal-x";
import FormModalParent from "../FormModalParent.vue";
import Button from "@/components/common/Button.vue";
import Input from "@/components/form/Input.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import DateInput from "@/components/form/DateInput.vue";
import { required } from "@/utils/validations";
import { useToastStore } from "@/store/toastStore";
import { update_tyre_status } from "@/modules/operation/api/tyre.api";

export type ReturnType = boolean;
export type Props = { tyre: any; };

const props = defineProps<{ data: Props; close: (res: ReturnType) => void }>();

const toast = useToastStore();
const isLoading = ref(false);

const tyre = computed(() => props.data.tyre ?? {});

const formValues = computed(() => ({
  mileage: "",
  date: "",
  description: "",
  serialNumber: "",
  brand: "",
  treadDepth: "",
  TPI: "",
  pressure: "",
  price: "",
  type: "",
  installationDate: "",
  installationMileage: "",
}));

async function handleFormSubmit(values: any) {
  const id = tyre.value._id;
  isLoading.value = true;

  try {
    let optionalFields: any = {};
    if (values.TPI) optionalFields.TPI = Number(values.TPI);
    if (values.pressure) optionalFields.pressure = Number(values.pressure);
    if (values.treadDepth) optionalFields.treadDepth = Number(values.treadDepth);
    if (values.type) optionalFields.type = values.type;

    const newTyreData = {
      serialNumber: values.serialNumber,
      brand: values.brand,
      price: Number(values.price),
      installationDate: values.installationDate,
      installationMileage: Number(values.installationMileage),
      vehicle: tyre.value.vehicle?._id,
      tyrePosition: tyre.value.tyrePosition,
      ...optionalFields
    };

    const data = {
      mileage: Number(values.mileage),
      date: values.date,
      description: values.description,
      newTyre: newTyreData,
    };

    const res: any = await update_tyre_status(id, "replace", data);

    if (res.status === 200 || res.status === 201) {
      toast.addToast("Tyre status updated successfully!", "success");
      props.close(true);
    } else {
      toast.addToast(`Error: ${res.data?.description || "Unknown error occurred."}`, "error");
    }
  } catch (error: any) {
    const msg = error.response?.data?.description || error.message || "Unexpected error";
    toast.addToast(`Error: ${msg}`, "error");
  } finally {
    isLoading.value = false;
  }
}
</script>
