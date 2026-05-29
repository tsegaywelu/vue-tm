<template>
  <DashboardPage title="Change Password" subtitle="Update your account password">
    <Form id="change-password-form" :values="initialValues" @submit="handleSubmit">
      <div class="max-w-md flex flex-col gap-6">
        <PasswordInput
          name="oldPassword"
          label="Current Password"
          :attributes="{ placeholder: 'Enter your current password' }"
          :validation="{ required }"
        />

        <PasswordInput
          name="newPassword"
          label="New Password"
          :attributes="{ placeholder: 'Enter your new password' }"
          :validation="{ required, password }"
        />

        <PasswordInput
          name="confirmPassword"
          label="Confirm New Password"
          :attributes="{ placeholder: 'Confirm your new password' }"
          :validation="{
            required,
            fun: (value: string, _msg: any, form: any) =>
              isEqualTo(value, form.state.values.newPassword),
          }"
        />

        <div class="flex justify-end gap-3">
          <Button size="md" variant="outline" @click="router.back()">Cancel</Button>
          <SubmitButton :loading="mutation.isPending.value">Change Password</SubmitButton>
        </div>
      </div>
    </Form>
  </DashboardPage>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMutation } from "@tanstack/vue-query";
import { change_password } from "@/modules/auth/api/auth.api";
import { useToastStore } from "@/store/toastStore";
import { required, password, isEqualTo } from "@/utils/validations";
import DashboardPage from "@/components/common/DashboardPage.vue";
import Form from "@/components/form/Form.vue";
import PasswordInput from "@/components/form/PasswordInput.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";

const router = useRouter();
const toast = useToastStore();

const initialValues = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const mutation = useMutation({
  mutationFn: (values: any) =>
    change_password({ oldPassword: values.oldPassword, newPassword: values.newPassword }),
  onSuccess: () => {
    toast.success("Password changed successfully");
  },
  onError: (error: any) => {
    toast.error(error.response?.data?.message || "Failed to change password");
  },
});

const handleSubmit = (values: any) => {
  mutation.mutate(values);
};
</script>
