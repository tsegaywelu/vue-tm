<template>
  <UserForm
    form-id="add-user-form"
    :initial-values="initialValues"
    :on-submit="handleCreate"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">
        Discard
      </Button>
      <SubmitButton> Register User </SubmitButton>
    </template>
  </UserForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMutation } from "@tanstack/vue-query";
import UserForm from "../../components/settings/UserForm.vue";
import { create_user } from "../../api/settings.api";
import { useToastStore } from "@/store/toastStore";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { useQueryClient } from "@tanstack/vue-query";

const queryClient = useQueryClient();
const router = useRouter();
const toast = useToastStore();

const mutation = useMutation({
  mutationFn: (values: any) => create_user(values),
});

const initialValues = {
  username: "",
  password: "",
  confirmPassword: "",
  role: "",
  region: "",
};

const handleCreate = async (values: any) => {
  const { confirmPassword, ...payload } = values;
  if (values.password !== confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }
  try {
    const res = await mutation.mutateAsync(payload);
    if (res.success) {
      toast.success("User registered successfully");
      queryClient.invalidateQueries({ queryKey: ["users-list"] });
      router.push("/setting/user-and-role");
    } else {
      toast.error(res.error || "Failed to register user");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
