<template>
  <div v-if="isLoading" class="flex justify-center p-12">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
  <BonusRouteForm
    v-else-if="initialValues"
    form-id="edit-bonus-route-form"
    :initial-values="initialValues"
    :initial-labels="initialLabels"
    :on-submit="handleEdit"
  >
    <template #submit-btn="{ form }">
      <Button size="md" variant="outline" @click="router.back()">
        Discard
      </Button>
      <SubmitButton> Update </SubmitButton>
    </template>
  </BonusRouteForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import BonusRouteForm from "../../components/settings/BonusRoute/BonusRouteForm.vue";
import { fetch_bonus_route_details, update_bonus_route } from "../../api/bonus.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useMutation, useQuery } from "@tanstack/vue-query";

const router = useRouter();
const route = useRoute();
const toast = useToastStore();
const id = route.params.id as string;

const { data: response, isLoading } = useQuery({
  queryKey: ["bonus-route", id],
  queryFn: () => fetch_bonus_route_details(id),
  enabled: !!id,
});

const initialValues = computed(() => {
  if (!response.value?.data) return null;
  const data = response.value.data;
  return {
    route: data.route?._id || data.route || "",
    amount: data.amount || null,
    description: data.description || "",
  };
});

const initialLabels = computed(() => {
  if (!response.value?.data?.route) return {};
  const routeData = response.value.data.route;
  const routeName = routeData.routeName || 
    `${routeData.origin?.name || ''} - ${routeData.destination?.name || ''}`;
  return {
    [routeData._id]: routeName
  };
});

const mutation = useMutation({
  mutationFn: (values: any) => update_bonus_route(id, values),
});

const handleEdit = async (values: any) => {
  try {
    const payload = {
      ...values,
      amount: Number(values.amount),
    };

    const res = await mutation.mutateAsync(payload);
    if (res.success) {
      toast.success("Bonus route updated successfully");
      router.push("/setting/bonus-routes");
    } else {
      toast.error(res.error || "Failed to update bonus route");
    }
  } catch (err: any) {
    toast.error(err.message || "An unexpected error occurred");
  }
};
</script>
