<template>
  <Form :id="formId" :values="normalizedValues" :on-submit="handleSubmit">
    <template #default="{ form }">
      <!-- Logo -->
      <Colapsable
        title="Logo"
        description="Upload a logo image for this carrier."
      >
        <div class="flex justify-start">
          <FileInput
            name="logo"
            label="Carrier Logo"
            image-only
            accept="image/*"
          />
        </div>
      </Colapsable>

      <!-- Basic Information -->
      <Colapsable
        title="Basic Information"
        description="Fill in the carrier's registration and contact details."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Input
            name="name"
            label="Name"
            :attributes="{ placeholder: 'Enter carrier name' }"
            :validation="{ required }"
          />

          <Input
            name="tradeName"
            label="Trade Name"
            :attributes="{ placeholder: 'Enter trade name' }"
            :validation="{ required }"
          />

          <Input
            name="phone"
            label="Phone"
            :attributes="{ placeholder: '+251...', type: 'tel' }"
            :validation="{ required }"
          />

          <Input
            name="email"
            label="Email"
            :attributes="{ placeholder: 'Enter email address', type: 'email' }"
            :validation="{ required }"
          />

          <Input
            name="tin"
            label="TIN"
            :attributes="{ placeholder: 'Enter TIN number' }"
            :validation="{ required }"
          />

          <div class="md:col-span-2 lg:col-span-3">
            <Input
              name="address"
              label="Address"
              :attributes="{ placeholder: 'Enter full address' }"
              :validation="{ required }"
            />
          </div>
        </div>
      </Colapsable>

      <!-- Actions -->
      <div class="pt-6 flex justify-end gap-4">
        <slot :form="form" name="submit-btn" />
      </div>
    </template>
  </Form>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Form from "@/components/form/Form.vue";
import Input from "@/components/form/Input.vue";
import FileInput from "@/components/form/FileInput.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import { required } from "@/utils/validations";

const props = defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  onSubmit: (values: any) => Promise<void> | void;
}>();

const normalizedValues = computed(() => ({
  name: props.initialValues.name ?? "",
  tradeName: props.initialValues.tradeName ?? "",
  phone: props.initialValues.phone ?? "",
  email: props.initialValues.email ?? "",
  tin: props.initialValues.tin ?? "",
  address: props.initialValues.address ?? "",
  logo: props.initialValues.logo ?? undefined,
}));

async function handleSubmit(values: any) {
  await props.onSubmit(values);
}
</script>
