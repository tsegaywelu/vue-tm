<template>
  <ShipperCommodityForm
    v-if="commodity"
    form-id="edit-commodity-form"
    :initial-values="commodity"
    :on-submit="handleUpdate"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">Discard</Button>
      <SubmitButton> Update Commodity </SubmitButton>
    </template>
  </ShipperCommodityForm>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import ShipperCommodityForm from "../../components/setting/Commodity/ShipperCommodityForm.vue";
import { fetch_commodity_details, update_commodity } from "../../api/shipper.api";
import { useToastStore } from "@/store/toastStore";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";

const router = useRouter();
const route = useRoute();
const toast = useToastStore();
const queryClient = useQueryClient();
const id = route.params.id as string;

const { data: commodity } = useQuery({
  queryKey: ["commodity", id],
  queryFn: () => fetch_commodity_details(id).then(res => res.data),
});

const mutation = useMutation({
  mutationFn: (values: any) => update_commodity(id, values),
});

const handleUpdate = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Commodity updated successfully");
      queryClient.invalidateQueries({ queryKey: ["shipper-commodity-list"] });
      router.push("/shipper/setting/commodities");
    } else {
      toast.error(res.error || "Failed to update commodity");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
