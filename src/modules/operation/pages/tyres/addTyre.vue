<template>
  <TyreForm
    form-id="add-tyre-form"
    :initial-values="initialValues"
    :on-submit="handleCreateTyre"
  >
    <template #submit-btn="{ form }">
      <Button size="md" variant="outline" @click="form.reset()">
        Discard Changes
      </Button>
      <SubmitButton> Create Tyre </SubmitButton>
    </template>
  </TyreForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import TyreForm from "../../components/tyre-details/TyreForm.vue";
import { create_tyre } from "../../api/tyre.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useMutation } from "@tanstack/vue-query";

const mutation = useMutation({
  mutationFn: (values: any) => create_tyre(values),
});

const router = useRouter();
const toast = useToastStore();

const initialValues = {
  serialNumber: "",
  vehicle: "",
  tyrePosition: "",
  brand: "",
  tyreStandard: null,
  treadDepth: null,
  TPI: null,
  pressure: null,
  price: null,
  type: "",
  installationDate: new Date().toISOString().split("T")[0],
  installationMileage: null,
  trailer: false,
};

const handleCreateTyre = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Tyre created successfully");
      router.push("/vehicle-tyres");
    } else {
      toast.error(res.error || "Failed to create tyre");
    }
  } catch (err: any) {
    toast.error(err.message || "An unexpected error occurred");
  }
};
</script>
