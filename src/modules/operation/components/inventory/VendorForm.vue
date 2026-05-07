<template>
  <div class="flex flex-col gap-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Input
        name="name"
        label="Name"
        :attributes="{
          placeholder: 'Enter vendor name',
        }"
        :validation="{
          required,
        }"
      />
      <Input
        name="telephone"
        label="Telephone"
        :attributes="{
          placeholder: 'Enter telephone number',
        }"
        :validation="{
          required,
          phone,
        }"
      />
      <Input
        name="address"
        label="Address"
        :attributes="{
          placeholder: 'Enter address',
        }"
        :validation="{
          required,
        }"
      />
    </div>
    <div>
      <TextareaInput
        name="description"
        label="Description"
        :attributes="{
          placeholder: 'Enter description',
          rows: 3,
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Input from "@/components/form/Input.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import { phone, required } from "@/utils/validations";
</script>
