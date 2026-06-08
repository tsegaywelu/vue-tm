<template>
  <FormModalParent
    title="Add Carrier Admin"
    subtitle="Register a new carrier admin user"
    form-id="create-carrier-admin-form"
    :submit-handler="handleSubmit"
    modal-style="auto"
    :values="initialValues"
  >
    <template #center="{ form }">
      <div class="flex flex-col gap-5">
        <Input
          name="username"
          label="Username"
          :attributes="{ placeholder: 'Enter username' }"
          :validation="{ required }"
        />

        <div class="grid grid-cols-2 gap-4">
          <Input
            name="password"
            label="Password"
            :attributes="{ type: 'password', placeholder: 'Enter password' }"
            :validation="{ required }"
          />
          <Input
            name="confirmPassword"
            label="Confirm Password"
            :attributes="{ type: 'password', placeholder: 'Re-enter password' }"
            :validation="{ required }"
          />
        </div>

        <button
          type="button"
          class="self-start text-sm font-semibold text-primary border border-primary/30 rounded-xl px-4 py-2 hover:bg-primary/5 transition"
          @click="generatePassword(form)"
        >
          Generate Password
        </button>

        <SelectInput
          name="carrier"
          label="Carrier"
          url="/carrier"
          label_key="name"
          value_key="_id"
          searchable
          :attributes="{ placeholder: 'Select a carrier' }"
          :validation="{ required }"
        />
      </div>
    </template>

    <template #bottom>
      <div class="flex justify-end gap-3">
        <Button variant="secondary" size="md" @click="closeModal(null)">
          Cancel
        </Button>
        <SubmitButton>Create Admin</SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { closeModal } from "@customizer/modal-x";
import { useMutation } from "@tanstack/vue-query";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { required } from "@/utils/validations";
import { useToastStore } from "@/store/toastStore";
import { createCarrierAdmin } from "@/modules/admin/api/carrier.api";

defineProps<{
  data?: Record<string, any>;
  close: (res: any) => void;
}>();

const toast = useToastStore();

const initialValues = {
  username: "",
  password: "",
  confirmPassword: "",
  carrier: "",
};

const mutation = useMutation({
  mutationFn: ({ carrierId, data }: { carrierId: string; data: Record<string, any> }) =>
    createCarrierAdmin(carrierId, data),
});

function generatePassword(form: any) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  const length = Math.floor(Math.random() * 5) + 8;
  const pwd = Array.from({ length }, () =>
    charset.charAt(Math.floor(Math.random() * charset.length)),
  ).join("");
  form.setFieldValue("password", pwd);
  form.setFieldValue("confirmPassword", pwd);
}

async function handleSubmit(values: any) {
  if (values.password !== values.confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  const res: any = await mutation.mutateAsync({
    carrierId: values.carrier,
    data: { username: values.username, password: values.password },
  });

  if (res.success || res.status === 200 || res.status === 201) {
    toast.success("Carrier admin created successfully!");
    closeModal(true);
  } else {
    toast.error(res.error || "Failed to create carrier admin");
  }
}
</script>
