<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <SelectInput
      v-if="!hideShipper"
      name="shipper"
      label="Shipper"
      url="/shipper"
      label_key="name"
      value_key="_id"
      :validation="{ required }"
      :attributes="{ placeholder: 'Select shipper' }"
    />
    <Input
      name="name"
      label="Facility Name"
      :validation="{ required }"
      :attributes="{ placeholder: 'Enter facility name' }"
    />
    <SelectInput
      name="region"
      label="Region"
      :options="regionOptions"
      :validation="{ required }"
      :attributes="{ placeholder: 'Select region' }"
    />
    <Input
      name="city"
      label="City"
      :validation="{ required }"
      :attributes="{ placeholder: 'Enter city' }"
    />
  </div>
</template>

<script setup lang="ts">
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import { required } from "@/utils/validations";

defineProps<{
  hideShipper?: boolean;
}>();

const regionOptions = [
  { label: "Addis Ababa", value: "Addis Ababa" },
  { label: "Afar", value: "Afar" },
  { label: "Amhara", value: "Amhara" },
  { label: "Benishangul-Gumuz", value: "Benishangul-Gumuz" },
  { label: "Dire Dawa", value: "Dire Dawa" },
  { label: "Gambela", value: "Gambela" },
  { label: "Harari", value: "Harari" },
  { label: "Oromia", value: "Oromia" },
  { label: "Sidama", value: "Sidama" },
  { label: "Somali", value: "Somali" },
  {
    label: "SNNPR",
    value: "Southern Nations, Nationalities, and Peoples' Region (SNNPR)",
  },
  { label: "Tigray", value: "Tigray" },
];
</script>
