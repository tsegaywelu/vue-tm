<template>
  <div v-if="isLoading" class="flex justify-center items-center h-64">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
  <MechanicForm
    v-else-if="mechanic"
    form-id="edit-mechanic-form"
    :initial-values="initialValues"
    :on-submit="handleUpdateMechanic"
  >
    <template #submit-btn="{ form }">
      <Button size="md" variant="outline" @click="router.back()">
        Cancel
      </Button>
      <SubmitButton> Save Changes </SubmitButton>
    </template>
  </MechanicForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import MechanicForm from "../../components/maintenance/MechanicForm.vue";
import { fetch_mechanic_by_id, update_mechanic } from "../../api/mechanic.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useMutation, useQuery } from "@tanstack/vue-query";
import type { Mechanic } from "../../operation.types";

const router = useRouter();
const route = useRoute();
const toast = useToastStore();
const id = route.params.id as string;

const { data: mechanicData, isLoading } = useQuery<Mechanic>({
  queryKey: ["mechanic", id],
  queryFn: () => fetch_mechanic_by_id(id) as any,
});

const mechanic = computed(() => mechanicData.value?.data);

const initialValues = computed(() => {
  if (!mechanic.value) return {};
  
  return {
    ...mechanic.value,
    workshop: mechanic.value.workshop?._id || mechanic.value.workshop,
    dateOfBirth: mechanic.value.dateOfBirth
      ? new Date(mechanic.value.dateOfBirth).toISOString().split("T")[0]
      : "",
  };
});

const mutation = useMutation({
  mutationFn: (values: any) => update_mechanic(id, values),
});

const handleUpdateMechanic = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Mechanic updated successfully");
      router.push("/maintenance/mechanic");
    } else {
      toast.error(res.error || "Failed to update mechanic");
    }
  } catch (err: any) {
    toast.error(err.message || "An unexpected error occurred");
  }
};
</script>
