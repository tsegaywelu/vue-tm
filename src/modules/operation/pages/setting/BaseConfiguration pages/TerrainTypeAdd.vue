<template>
  <TerrainTypeForm
    form-id="add-terrain-type-form"
    :initial-values="{ name: '' }"
    :on-submit="handleCreate"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()"
        >Discard</Button
      >
      <SubmitButton> Create Terrain Type </SubmitButton>
    </template>
  </TerrainTypeForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMutation } from "@tanstack/vue-query";
import TerrainTypeForm from "../../../components/settings/BaseConfiguration/TerrainTypeForm.vue";
import { getApi } from "@/utils/getApi";
import { useToastStore } from "@/store/toastStore";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { useQueryClient } from "@tanstack/vue-query";

const router = useRouter();
const toast = useToastStore();
const api = getApi("/terrain-type");
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: (values: any) => api.addAuthenticationHeader().post("", values),
});

const handleCreate = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Terrain type created successfully");
      //invalidate query
      queryClient.invalidateQueries({ queryKey: ["terrain-type-list"] });
      router.push("/setting/base-configuration?tab=terrainType");
    } else {
      toast.error(res.error || "Failed to create terrain type");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
