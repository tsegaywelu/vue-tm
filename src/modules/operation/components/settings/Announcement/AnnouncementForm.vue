<template>
  <Colapsable
    title="Announcement Details"
    description="Fill in the information for the announcement."
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Input
        name="title"
        label="Title"
        :attributes="{
          placeholder: 'Title'
        }"
        :validation="{ required }"
      />

      <SelectInput
        name="targetAudience"
        label="Target Audience"
        :options="[
          { value: 'ALL', label: 'All Users' },
          { value: 'DRIVER', label: 'Drivers' },
          { value: 'MECHANIC', label: 'Mechanics' },
        ]"
        :validation="{ required }"
      />

      <div class="md:col-span-2">
        <TextareaInput
          name="message"
          label="Message"
          :attributes="{
            rows: '4',
            placeholder: 'Write your message here...'
          }"
          :validation="{ required }"
        />
      </div>
    </div>
  </Colapsable>
</template>

<script setup lang="ts">
import Form from "@/components/form/Form.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import { required } from "@/utils/validations";
import TextareaInput from "@/components/form/TextareaInput.vue";

defineProps<{}>();
</script>
