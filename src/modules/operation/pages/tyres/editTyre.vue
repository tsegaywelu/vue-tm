<template>
  <div v-if="isLoading" class="flex justify-center items-center h-64">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
  <TyreForm
    v-else-if="tyre"
    form-id="edit-tyre-form"
    :initial-values="initialValues"
    :initial-labels="initialLabels"
    :on-submit="handleUpdateTyre"
  >
    <template #submit-btn="{ form }">
      <Button size="md" variant="outline" @click="router.back()">
        Cancel
      </Button>
      <SubmitButton> Save Changes </SubmitButton>
    </template>
  </TyreForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import TyreForm from "../../components/tyre-details/TyreForm.vue";
import { fetch_tyre_by_id, update_tyre } from "../../api/tyre.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useMutation, useQuery } from "@tanstack/vue-query";
import { type Tyre } from "../../operation.types";

const router = useRouter();
const route = useRoute();
const toast = useToastStore();
const id = route.params.id as string;

const { data: tyreData, isLoading } = useQuery <Tyre>({
  queryKey: ["tyre", id],
  queryFn: () => fetch_tyre_by_id(id) as any,
});

const tyre = computed(() => tyreData.value?.data );

const initialValues = computed(() => {
  if (!tyre.value) return {};
  
  return {
    ...tyre.value,
    vehicle: tyre.value.vehicle?._id,
    installationDate: tyre.value.installationDate
      ? new Date(tyre.value.installationDate).toISOString().split("T")[0]
      : "",
  };
});

const initialLabels = computed(() => {
  if (!tyre.value?.vehicle) return {};
  return {
    [tyre.value.vehicle._id]: tyre.value.vehicle.plateNumber,
  };
});

const mutation = useMutation({
  mutationFn: (values: any) => update_tyre(id, values),
});

const handleUpdateTyre = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Tyre updated successfully");
      router.push("/operation/vehicle-tyres");
    } else {
      toast.error(res.error || "Failed to update tyre");
    }
  } catch (err: any) {
    toast.error(err.message || "An unexpected error occurred");
  }
};
</script>
