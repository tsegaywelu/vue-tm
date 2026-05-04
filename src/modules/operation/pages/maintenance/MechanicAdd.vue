<template>
  <MechanicForm
    form-id="add-mechanic-form"
    :initial-values="initialValues"
    :on-submit="handleCreateMechanic"
  >
    <template #submit-btn="{ form }">
      <Button size="md" variant="outline" @click="form.reset()">
        Discard Changes
      </Button>
      <SubmitButton> Create Mechanic </SubmitButton>
    </template>
  </MechanicForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import MechanicForm from "../../components/maintenance/MechanicForm.vue";
import { create_mechanic } from "../../api/mechanic.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useMutation } from "@tanstack/vue-query";

const router = useRouter();
const toast = useToastStore();

const mutation = useMutation({
  mutationFn: (values: any) => create_mechanic(values),
});

const initialValues = {
  firstName: "",
  middleName: "",
  lastName: "",
  employeeNumber: "",
  phoneNumber: "+251",
  dateOfBirth: "",
  certification: "",
  experience: null,
  isInternal: true,
  workshop: "",
};

const handleCreateMechanic = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Mechanic created successfully");
      router.push("/maintenance/mechanic");
    } else {
      toast.error(res.error || "Failed to create mechanic");
    }
  } catch (err: any) {
    toast.error(err.message || "An unexpected error occurred");
  }
};
</script>
