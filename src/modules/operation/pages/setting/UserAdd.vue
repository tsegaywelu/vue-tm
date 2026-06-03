<template>
  <DashboardPage title="Register User" subtitle="Create a new user account">
    <Form
      id="add-user-form"
      :values="initialValues"
      @submit="handleCreate"
    >
      <div class="flex flex-col gap-6">
        <CarrierUserForm />
        <div class="flex justify-end gap-3">
          <Button size="md" variant="outline" @click="router.back()">
            Discard
          </Button>
          <SubmitButton :loading="mutation.isPending.value"> Register User </SubmitButton>
        </div>
      </div>
    </Form>
  </DashboardPage>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import CarrierUserForm from "../../components/settings/CarrierUserForm.vue";
import Form from "@/components/form/Form.vue";
import DashboardPage from "@/components/common/DashboardPage.vue";
import { create_carrier_user } from "../../api/settings.api";
import { useToastStore } from "@/store/toastStore";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { useAuthStore } from "@/store/authStore";

const queryClient = useQueryClient();
const router = useRouter();
const toast = useToastStore();
const authStore = useAuthStore();

const mutation = useMutation({
  mutationFn: (values: any) => create_carrier_user({ ...values, carrier: authStore.carrierId }),
});

const initialValues = {
  username: "",
  password: "",
  confirmPassword: "",
  role: "",
  regions: [],
};

const handleCreate = async (values: any) => {
  const payload = {
    username: values.username,
    password: values.password,
    role: values.role,
    regions: values.regions,
  };
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
