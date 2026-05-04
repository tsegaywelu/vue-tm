<template>
  <div v-if="isLoading" class="flex justify-center py-10">
    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
  </div>
  <CommodityForm
    v-else-if="initialValues"
    form-id="edit-commodity-form"
    :initial-values="initialValues"
    :on-submit="handleUpdate"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">Cancel</Button>
      <SubmitButton> Save Changes </SubmitButton>
    </template>
  </CommodityForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery, useMutation } from "@tanstack/vue-query";
import CommodityForm from "../../components/settings/Commodity/CommodityForm.vue";
import { fetch_commodity_details, update_commodity } from "../../api/settings.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const id = route.params.id as string;

const { data: response, isLoading } = useQuery({
  queryKey: ["commodity", id],
  queryFn: () => fetch_commodity_details(id),
  enabled: !!id,
});

const initialValues = computed(() => {
  if (!response.value?.data) return null;
  const data = response.value.data.result || response.value.data;
  return {
    name: data.name || "",
    shipper: data.shipper?._id || data.shipper || "",
  };
});

const mutation = useMutation({
  mutationFn: (values: any) => update_commodity(id, values),
});

const handleUpdate = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Commodity updated successfully");
      router.push("/setting/commodity");
    } else {
      toast.error(res.error || "Failed to update commodity");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
