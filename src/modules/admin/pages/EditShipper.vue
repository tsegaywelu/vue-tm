<template>
  <div
    v-if="isLoading"
    class="flex justify-center items-center h-64"
  >
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>

  <ShipperForm
    v-else-if="shipper"
    form-id="edit-shipper-form"
    :initial-values="initialValues"
    :on-submit="handleUpdate"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">
        Cancel
      </Button>
      <SubmitButton>Save Changes</SubmitButton>
    </template>
  </ShipperForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useQuery, useMutation } from "@tanstack/vue-query";
import ShipperForm from "../components/ShipperForm.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { useToastStore } from "@/store/toastStore";
import { getShipperById, updateShipper } from "../api/shipper.api";

const router = useRouter();
const route = useRoute();
const toast = useToastStore();
const id = route.params.id as string;

const { data: shipperData, isLoading } = useQuery({
  queryKey: ["admin-shipper", id],
  queryFn: () => getShipperById(id) as any,
});

const shipper = computed(() => (shipperData.value as any)?.data);

const initialValues = computed(() => {
  if (!shipper.value) return {};
  return {
    name: shipper.value.name ?? "",
    tradeName: shipper.value.tradeName ?? "",
    shipperCode: shipper.value.shipperCode ?? "",
    phone: shipper.value.phone ?? "",
    email: shipper.value.email ?? "",
    tin: shipper.value.tin ?? "",
    address: shipper.value.address ?? "",
    logo: shipper.value.logo ?? undefined,
    phoneNumbers: shipper.value.phoneNumbers ?? [],
  };
});

const mutation = useMutation({ mutationFn: (data: FormData) => updateShipper(id, data) });

async function handleUpdate(values: any) {
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
      toast.success("Shipper updated successfully!");
      router.push("/admin/shippers");
    } else {
      toast.error(res.error || "Failed to update shipper");
    }
  } catch (err: any) {
    toast.error(err.message || "An unexpected error occurred");
  }
}
</script>
