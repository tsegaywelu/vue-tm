<template>
  <DashboardPage title="Edit User" subtitle="Update user account details">
    <div v-if="isLoading" class="flex justify-center py-10">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
    </div>
    <Form
      v-else-if="initialValues"
      id="edit-user-form"
      :values="initialValues"
      @submit="handleUpdate"
    >
      <div class="flex flex-col gap-6">
        <CarrierUserForm is-edit :labels="labels" />
        <div class="flex justify-end gap-3">
          <Button size="md" variant="outline" @click="router.back()">
            Cancel
          </Button>
          <SubmitButton :loading="mutation.isPending.value"> Save Changes </SubmitButton>
        </div>
      </div>
    </Form>
  </DashboardPage>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import CarrierUserForm from "../../components/settings/CarrierUserForm.vue";
import Form from "@/components/form/Form.vue";
import DashboardPage from "@/components/common/DashboardPage.vue";
import { fetch_user_details, update_user } from "../../api/settings.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";

const queryClient = useQueryClient();
const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const id = route.params.id as string;

const { data: response, isLoading } = useQuery({
  queryKey: ["user", id],
  queryFn: () => fetch_user_details(id),
  enabled: !!id,
});

const initialValues = computed(() => {
  if (!response.value?.data) return null;
  const data = (response.value.data as any).result || response.value.data;
  return {
    username: data.username || "",
    role: data.role?._id || data.role || "",
    region: Array.isArray(data.region)
      ? data.region.map((r: any) => r._id || r)
      : data.region?._id
        ? [data.region._id]
        : data.region
          ? [data.region]
          : [],
  };
});

const labels = computed(() => {
  const data = (response.value?.data as any)?.result || response.value?.data;
  return {
    role: data?.role?.name || "",
    region: data?.region?.name || "",
  };
});

const mutation = useMutation({
  mutationFn: (values: any) => update_user(id, values),
});

const handleUpdate = async (values: any) => {
  const { confirmPassword, ...payload } = values;
  try {
    const res = await mutation.mutateAsync(payload);
    if (res.success) {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users-list"] });
      router.push("/setting/user-and-role");
    } else {
      toast.error(res.error || "Failed to update user");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
