<template>
  <CarrierForm
    form-id="add-carrier-form"
    :initial-values="initialValues"
    :on-submit="handleCreate"
  >
    <template #submit-btn="{ form }">
      <Button size="md" variant="outline" @click="router.back()">
        Cancel
      </Button>
      <Button size="md" variant="outline" @click="form.reset()">
        Discard Changes
      </Button>
      <SubmitButton>Create Carrier</SubmitButton>
    </template>
  </CarrierForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMutation } from "@tanstack/vue-query";
import CarrierForm from "../components/CarrierForm.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { useToastStore } from "@/store/toastStore";
import { createCarrier } from "../api/carrier.api";

const router = useRouter();
const toast = useToastStore();

const initialValues = {
  name: "",
  tradeName: "",
  phone: "+251",
  email: "",
  tin: "",
  address: "",
  logo: undefined,
};

const mutation = useMutation({ mutationFn: (data: FormData) => createCarrier(data) });

async function handleCreate(values: any) {
  const formData = new FormData();

  formData.append("name", values.name);
  formData.append("tradeName", values.tradeName);
  formData.append("address", values.address);

  if (values.phone) {
    const phone = values.phone.startsWith("+251")
      ? values.phone
      : `+251${values.phone}`;
    formData.append("phone", phone);
  }
  if (values.email) formData.append("email", values.email);
  if (values.tin) formData.append("tin", values.tin);
  if (values.logo instanceof File) formData.append("logo", values.logo);

  try {
    const res: any = await mutation.mutateAsync(formData);
    if (res.success || res.status === 200 || res.status === 201) {
      toast.success("Carrier created successfully!");
      router.push("/admin/carriers");
    } else {
      toast.error(res.error || "Failed to create carrier");
    }
  } catch (err: any) {
    toast.error(err.message || "An unexpected error occurred");
  }
}
</script>
