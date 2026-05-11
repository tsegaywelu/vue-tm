<template>
  <div v-if="isLoading" class="flex justify-center py-10">
    <div
      class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"
    ></div>
  </div>
  <RegionForm
    v-else-if="initialValues"
    form-id="edit-region-form"
    :initial-values="initialValues"
    :on-submit="handleUpdate"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">Cancel</Button>
      <SubmitButton> Save Changes </SubmitButton>
    </template>
  </RegionForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery, useMutation } from "@tanstack/vue-query";
import RegionForm from "../../components/settings/Region/RegionForm.vue";
import { fetch_region_details, update_region } from "../../api/region.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useQueryClient } from "@tanstack/vue-query";

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const id = route.params.id as string;
const queryClient = useQueryClient();

const { data: response, isLoading } = useQuery({
  queryKey: ["region", id],
  queryFn: () => fetch_region_details(id),
  enabled: !!id,
});

const initialValues = computed(() => {
  if (!response.value?.data) return null;
  const data = (response.value.data as any).result || response.value.data;
  return {
    name: data.name || "",
    odometerRouteToleranceKilometer: data.odometerRouteToleranceKilometer ?? 200,
    notificationEnabled: data.notificationEnabled || false,
    enforceOdometerRouteTolerance: data.enforceOdometerRouteTolerance || false,
  };
});

const mutation = useMutation({
  mutationFn: (values: any) => update_region(id, values),
});

const handleUpdate = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Region updated successfully");
      queryClient.invalidateQueries({ queryKey: ["region-list"] });
      router.push("/setting/region");
    } else {
      toast.error(res.error || "Failed to update region");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
