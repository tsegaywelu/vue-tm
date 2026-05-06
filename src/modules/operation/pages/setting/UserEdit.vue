<template>
  <div v-if="isLoading" class="flex justify-center py-10">
    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
  </div>
  <UserForm
    v-else-if="initialValues"
    form-id="edit-user-form"
    :initial-values="initialValues"
    :on-submit="handleUpdate"
    is-edit
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">
        Cancel
      </Button>
      <SubmitButton> Save Changes </SubmitButton>
    </template>
  </UserForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery, useMutation } from "@tanstack/vue-query";
import UserForm from "../../components/settings/UserForm.vue";
import { fetch_user_details, update_user } from "../../api/settings.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useQueryClient } from "@tanstack/vue-query";

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
    region: data.region?._id || data.region || "",
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
