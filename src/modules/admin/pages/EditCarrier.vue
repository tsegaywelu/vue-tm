<template>
  <div
    v-if="isLoading"
    class="flex justify-center items-center h-64"
  >
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>

  <CarrierForm
    v-else-if="carrier"
    form-id="edit-carrier-form"
    :initial-values="initialValues"
    :on-submit="handleUpdate"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">
        Cancel
      </Button>
      <SubmitButton>Save Changes</SubmitButton>
    </template>
  </CarrierForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useQuery, useMutation } from "@tanstack/vue-query";
import CarrierForm from "../components/CarrierForm.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { useToastStore } from "@/store/toastStore";
import { getCarrierById, updateCarrier } from "../api/carrier.api";

const router = useRouter();
const route = useRoute();
const toast = useToastStore();
const id = route.params.id as string;

const { data: carrierData, isLoading } = useQuery({
  queryKey: ["admin-carrier", id],
  queryFn: () => getCarrierById(id) as any,
});

const carrier = computed(() => (carrierData.value as any)?.data);

const initialValues = computed(() => {
  if (!carrier.value) return {};
  return {
    name: carrier.value.name ?? "",
    tradeName: carrier.value.tradeName ?? "",
    phone: carrier.value.phone ?? "",
    email: carrier.value.email ?? "",
    tin: carrier.value.tin ?? "",
    address: carrier.value.address ?? "",
    logo: carrier.value.logo ?? undefined,
  };
});

const mutation = useMutation({ mutationFn: (data: FormData) => updateCarrier(id, data) });

async function handleUpdate(values: any) {
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
      toast.success("Carrier updated successfully!");
      router.push("/admin/carriers");
    } else {
      toast.error(res.error || "Failed to update carrier");
    }
  } catch (err: any) {
    toast.error(err.message || "An unexpected error occurred");
  }
}
</script>
