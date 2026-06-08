<template>
  <ShipperForm
    form-id="add-shipper-form"
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
      <SubmitButton>Create Shipper</SubmitButton>
    </template>
  </ShipperForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMutation } from "@tanstack/vue-query";
import ShipperForm from "../components/ShipperForm.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { useToastStore } from "@/store/toastStore";
import { createShipper } from "../api/shipper.api";

const router = useRouter();
const toast = useToastStore();

const initialValues = {
  name: "",
  tradeName: "",
  shipperCode: "",
  phone: "+251",
  email: "",
  tin: "",
  address: "",
  logo: undefined,
  phoneNumbers: [],
};

const mutation = useMutation({ mutationFn: (data: FormData) => createShipper(data) });

async function handleCreate(values: any) {
  const formData = new FormData();

  formData.append("name", values.name);
  formData.append("tradeName", values.tradeName);
  formData.append("shipperCode", values.shipperCode);
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

  values.representatives.forEach((num: string, i: number) => {
    const formatted = num.startsWith("+251") ? num : `+251${num}`;
    formData.append(`phoneNumbers[${i}]`, formatted);
  });

  try {
    const res: any = await mutation.mutateAsync(formData);
    if (res.success || res.status === 200 || res.status === 201) {
      toast.success("Shipper created successfully!");
      router.push("/admin/shippers");
    } else {
      toast.error(res.error || "Failed to create shipper");
    }
  } catch (err: any) {
    toast.error(err.message || "An unexpected error occurred");
  }
}
</script>
