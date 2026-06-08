<template>
  <Form :id="formId" :values="normalizedValues" :on-submit="handleSubmit">
    <template #default="{ form }">
      <!-- Logo -->
      <Colapsable
        title="Logo"
        description="Upload a logo image for this shipper."
      >
        <div class="flex justify-start">
          <FileInput
            name="logo"
            label="Shipper Logo"
            image-only
            accept="image/*"
          />
        </div>
      </Colapsable>

      <!-- Basic Information -->
      <Colapsable
        title="Basic Information"
        description="Fill in the shipper's registration and contact details."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Input
            name="name"
            label="Name"
            :attributes="{ placeholder: 'Enter shipper name' }"
            :validation="{ required }"
          />

          <Input
            name="tradeName"
            label="Trade Name"
            :attributes="{ placeholder: 'Enter trade name' }"
            :validation="{ required }"
          />

          <Input
            name="shipperCode"
            label="Shipper Code"
            :attributes="{ placeholder: 'Enter shipper code' }"
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
          />

          <Input
            name="tin"
            label="TIN"
            :attributes="{ placeholder: 'Enter TIN number' }"
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

      <!-- Representatives -->
      <Colapsable
        title="Representatives"
        description="Add representative phone numbers for this shipper."
      >
        <div class="flex flex-col gap-3">
          <div
            v-for="(_, index) in representatives"
            :key="index"
            class="flex items-center gap-3"
          >
            <input
              v-model="representatives[index]"
              type="tel"
              :placeholder="`+251... (Representative ${index + 1})`"
              class="flex-1 h-10 rounded-xl border border-grey-200 bg-white px-3 text-sm text-grey-900 placeholder:text-grey-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
            <button
              type="button"
              @click="removeRepresentative(index)"
              class="shrink-0 h-10 px-4 rounded-xl text-sm font-semibold text-red-500 border border-red-200 hover:bg-red-50 transition"
            >
              Remove
            </button>
          </div>

          <button
            type="button"
            @click="addRepresentative"
            class="self-start h-10 px-4 rounded-xl text-sm font-semibold text-primary border border-primary/30 hover:bg-primary/5 transition"
          >
            + Add Representative
          </button>
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
import { ref, watch, computed } from "vue";
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

const representatives = ref<string[]>([...(props.initialValues.phoneNumbers ?? [])]);

watch(
  () => props.initialValues.phoneNumbers,
  (val) => {
    representatives.value = [...(val ?? [])];
  },
);

const normalizedValues = computed(() => ({
  name: props.initialValues.name ?? "",
  tradeName: props.initialValues.tradeName ?? "",
  shipperCode: props.initialValues.shipperCode ?? "",
  phone: props.initialValues.phone ?? "",
  email: props.initialValues.email ?? "",
  tin: props.initialValues.tin ?? "",
  address: props.initialValues.address ?? "",
  logo: props.initialValues.logo ?? undefined,
}));

function addRepresentative() {
  representatives.value.push("");
}

function removeRepresentative(index: number) {
  representatives.value.splice(index, 1);
}

async function handleSubmit(values: any) {
  await props.onSubmit({
    ...values,
    representatives: representatives.value.filter((p) => p.trim() !== ""),
  });
}
</script>
