<template>
  <div class="w-full">
    <div v-if="isLoading" class="flex justify-center py-10">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
    </div>
    <Form
      v-else-if="initialValues"
      id="edit-role-form"
      :values="initialValues"
      @submit="handleUpdate"
    >
      <div class="flex flex-col gap-6">
        <ShipperRoleForm />
        <div class="flex flex-col sm:flex-row justify-end gap-3 *:w-full sm:*:w-auto *:min-h-[52px] sm:*:min-h-0 *:text-base sm:*:text-sm *:rounded-2xl sm:*:rounded-xl">
          <Button size="md" variant="outline" @click="router.back()">
            Cancel
          </Button>
          <SubmitButton :loading="mutation.isPending.value"> Save Changes </SubmitButton>
        </div>
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import ShipperRoleForm from "../../components/UserManagement/ShipperRoleForm.vue";
import Form from "@/components/form/Form.vue";
import { fetch_shipper_role_details, update_role } from "../../api/shipper.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";

const queryClient = useQueryClient();
const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const id = route.params.id as string;

const { data: response, isLoading } = useQuery({
  queryKey: ["shipper-role", id],
  queryFn: () => fetch_shipper_role_details(id),
  enabled: !!id,
});

const initialValues = computed(() => {
  if (!response.value?.data) return null;
  const data = (response.value.data as any).result || response.value.data;
  return {
    name: data.name || "",
    type: data.type || "USER",
    description: data.description || "",
    permissions: data.permissions || [],
  };
});

const mutation = useMutation({
  mutationFn: (values: any) => update_role(id, values),
});

const handleUpdate = async (values: any) => {
  const res = await mutation.mutateAsync(values);
  if (res.success) {
    toast.success("Role updated successfully");
    queryClient.invalidateQueries({ queryKey: ["shipper-roles-list"] });
    router.push("/shipper/users?tab=roles");
  } else {
    toast.error(res.error || "Failed to update role");
  }
};
</script>
