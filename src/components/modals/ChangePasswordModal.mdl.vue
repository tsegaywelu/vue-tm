<template>
  <FormModalParent
    modal-style="auto"
    title="Change Password"
    subtitle="Update your account password"
    form-id="change-password-modal-form"
    :values="initialValues"
    :submit-handler="handleSubmit"
  >
    <template #center>
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
    </template>

    <template #bottom>
      <div class="flex justify-end gap-3 w-full">
        <Button type="button" variant="outline" size="md" @click="cancel"
          >Cancel</Button
        >
        <SubmitButton :loading="mutation.isPending.value"
          >Change Password</SubmitButton
        >
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import { closeModal } from "@customizer/modal-x";
import { change_password } from "@/modules/auth/api/auth.api";
import { useToastStore } from "@/store/toastStore";
import { required, password, isEqualTo } from "@/utils/validations";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import PasswordInput from "@/components/form/PasswordInput.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";

export type ReturnType = boolean;
export type Props = object;

const props = defineProps<{ data: Props; close: (res: ReturnType) => void }>();

const toast = useToastStore();

const initialValues = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const mutation = useMutation({
  mutationFn: (values: any) =>
    change_password({
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    }),
  onSuccess: () => {
    toast.success("Password changed successfully");
    closeModal(true);
  },
  onError: (error: any) => {
    toast.error(error.response?.data?.message || "Failed to change password");
  },
});

const handleSubmit = (values: any) => {
  mutation.mutate(values);
};

function cancel() {
  closeModal(false);
}
</script>
