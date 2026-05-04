<template>
  <DriverForm
    formId="add-driver-form"
    :initial-values="initialValues"
    :onSubmit="handleSubmit"
  >
    <template #actions="{ form }">
      <Button variant="secondary" size="md" @click="$router.back()">
        Cancel
      </Button>
      <SubmitButton :loading="mutation.isPending.value">
        Register Driver
      </SubmitButton>
    </template>
  </DriverForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import DriverForm from "../components/DriverForm.vue";
import { useMutation } from "@tanstack/vue-query";
import { add_driver } from "../api/operation.api";
import { useToastStore } from "@/store/toastStore";

const router = useRouter();
const toast = useToastStore();

const initialValues = {
  isEmployed: true,
  driverStatus: "ready_to_dispatch",
  gender: "MALE",
  contactPerson: {
    name: "",
    phone: "",
    address: "",
  },
};

const mutation = useMutation({
  mutationFn: add_driver,
  onSuccess: (res: any) => {
    if (res.success || res.status === 200 || res.status === 201) {
      toast.success("Driver registered successfully");
      router.push("/drivers");
    } else {
      toast.error(res.error || "Failed to register driver");
    }
  },
  onError: (error: any) => {
    toast.error(
      error.response?.data?.description ||
        "An error occurred while registering the driver.",
    );
  },
});

const handleSubmit = async (values: any) => {
  await mutation.mutateAsync(values);
};
</script>
