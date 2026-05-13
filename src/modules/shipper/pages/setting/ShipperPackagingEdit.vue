<template>
  <ShipperPackagingForm
    v-if="packaging"
    form-id="edit-packaging-form"
    :initial-values="packaging"
    :on-submit="handleUpdate"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">Discard</Button>
      <SubmitButton> Update Packaging </SubmitButton>
    </template>
  </ShipperPackagingForm>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import ShipperPackagingForm from "../../components/setting/Packaging/ShipperPackagingForm.vue";
import { fetch_packaging_details, update_packaging } from "../../api/shipper.api";
import { useToastStore } from "@/store/toastStore";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";

const router = useRouter();
const route = useRoute();
const toast = useToastStore();
const queryClient = useQueryClient();
const id = route.params.id as string;

const { data: packaging } = useQuery({
  queryKey: ["packaging", id],
  queryFn: () => fetch_packaging_details(id).then(res => res.data),
});

const mutation = useMutation({
  mutationFn: (values: any) => update_packaging(id, values),
});

const handleUpdate = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Packaging updated successfully");
      queryClient.invalidateQueries({ queryKey: ["shipper-packaging-list"] });
      router.push("/shipper/setting/packaging");
    } else {
      toast.error(res.error || "Failed to update packaging");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
