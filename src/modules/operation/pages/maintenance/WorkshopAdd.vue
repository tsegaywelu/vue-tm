<template>
  <WorkshopForm
    form-id="add-workshop-form"
    :initial-values="initialValues"
    :on-submit="handleCreateWorkshop"
  >
    <template #submit-btn="{ form }">
      <Button size="md" variant="outline" @click="form.reset()">
        Discard Changes
      </Button>
      <SubmitButton> Create Workshop </SubmitButton>
    </template>
  </WorkshopForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import WorkshopForm from "../../components/maintenance/WorkshopForm.vue";
import { create_workshop } from "../../api/workshop.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useMutation } from "@tanstack/vue-query";

const router = useRouter();
const toast = useToastStore();

const mutation = useMutation({
  mutationFn: (values: any) => create_workshop(values),
});

const initialValues = {
  name: "",
  tradeName: "",
  contactPerson: "",
  contactPhone: "+251",
  specialization: "",
  tin: "",
  latitude: null,
  longitude: null,
  location: {
    street: "",
    city: "",
    region: "",
  },
};

const handleCreateWorkshop = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Workshop created successfully");
      router.push("/maintenance/workshop");
    } else {
      toast.error(res.error || "Failed to create workshop");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
