<template>
  <div class="flex flex-col gap-6">
    <Input
      name="name"
      label="Name"
      :attributes="{
        placeholder: 'Enter inventory category name',
      }"
      :validation="{
        required,
      }"
    />
    <TextareaInput
      name="description"
      label="Description"
      :attributes="{
        placeholder: 'Enter description',
        rows: 3,
      }"
    />
  </div>
</template>

<script setup lang="ts">
import Input from "@/components/form/Input.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import { required } from "@/utils/validations";
</script>
