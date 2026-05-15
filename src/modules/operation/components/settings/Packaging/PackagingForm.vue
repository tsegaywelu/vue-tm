<template>
  <div class="flex flex-col gap-6">
    <div class="grid grid-cols-1 gap-6">
      <Input
        name="name"
        label="Name"
        :validation="{ required }"
        :attributes="{
          placeholder:'Enter packaging name'
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Input from "@/components/form/Input.vue";
import { required } from "@/utils/validations";

defineProps<{}>();
</script>
