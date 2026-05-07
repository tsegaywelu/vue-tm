<template>
  <FormModalParent
    title="Reset User Password"
    subtitle="Reset the password for the selected user."
    form-id="resetPasswordForm"
    :submit-handler="handleSubmit"
    modal-style="auto"
    :values="initialValues"
  >
    <template #center="{ form }">
      <div class="flex flex-col gap-6">
        <Input
          name="newPassword"
          label="New Password"
          type="password"
          :attributes="{ placeholder: 'Enter new password' }"
          :validation="{ required }"
        />
        <Input
          name="confirmNewPassword"
          label="Confirm Password"
          type="password"
          :attributes="{ placeholder: 'Confirm new password' }"
          :match="['newPassword']"
          :validation="{ 
            required,
            passwordMatch: (val: any, _: any, f: any) => val === f.getFieldValue('newPassword') ? [true, ''] : [false, 'Passwords do not match']
          }"
        />

        <div class="flex justify-start">
          <Button
            type="button"
            variant="outline"
            size="sm"
            @click="generateRandomPassword(form)"
          >
            Generate Password
          </Button>
        </div>
      </div>
    </template>

    <template #bottom="{ form }">
      <div class="flex justify-end gap-3">
        <Button variant="outline" size="md" @click="close" type="button">
          Cancel
        </Button>
        <SubmitButton
          form-id="resetPasswordForm"
          :loading="form.state.isSubmitting"
        >
          Reset Password
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Input from "@/components/form/Input.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { required } from "@/utils/validations";
import { reset_user_password } from "../../api/settings.api";
import { useToastStore } from "@/store/toastStore";

const props = defineProps<{
  data: { user: any; onSuccess?: () => void };
  close: (res?: any) => void;
}>();

const toast = useToastStore();

const initialValues = {
  newPassword: "",
  confirmNewPassword: "",
};

const generateRandomPassword = (form: any) => {
  const length = Math.floor(Math.random() * 5) + 8;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  const password = Array.from({ length }, () =>
    charset.charAt(Math.floor(Math.random() * charset.length))
  ).join("");
  
  form.setFieldValue("newPassword", password);
  form.setFieldValue("confirmNewPassword", password);
  
  toast.success("Random password generated and filled");
};

const handleSubmit = async (values: any) => {
  const userId = props.data.user?._id;
  if (!userId) {
    toast.error("User ID is missing");
    return;
  }

  try {
    const res: any = await reset_user_password(userId, {
      newPassword: values.newPassword,
    });

    if (res.status === 200 || res.status === 201 || res.data?.success) {
      toast.success("Password reset successfully");
      if (props.data.onSuccess) props.data.onSuccess();
      props.close(true);
    } else {
      toast.error(res.data?.description || "Failed to reset password");
    }
  } catch (error: any) {
    toast.error(error.response?.data?.description || error.message || "An error occurred");
  }
};
</script>
