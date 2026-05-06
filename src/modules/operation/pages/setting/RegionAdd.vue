<template>
  <RegionForm
    form-id="add-region-form"
    :initial-values="{
      name: '',
      odometerRouteToleranceKilometer: 200,
      notificationEnabled: false,
      enforceOdometerRouteTolerance: false,
    }"
    :on-submit="handleCreate"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">Discard</Button>
      <SubmitButton> Create Region </SubmitButton>
    </template>
  </RegionForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMutation } from "@tanstack/vue-query";
import RegionForm from "../../components/settings/Region/RegionForm.vue";
import { create_region } from "../../api/region.api";
import { useToastStore } from "@/store/toastStore";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { useQueryClient } from "@tanstack/vue-query";

const router = useRouter();
const toast = useToastStore();

const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: (values: any) => create_region(values),
});

const handleCreate = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Region created successfully");
      //invalidate queries
      queryClient.invalidateQueries({ queryKey: ["region-list"] });
      router.push("/setting/region");
    } else {
      toast.error(res.error || "Failed to create region");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
