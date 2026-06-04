<template>
  <div class="w-full">
    <Form
      id="add-role-form"
      :values="initialValues"
      @submit="handleCreate"
    >
      <div class="flex flex-col gap-6">
        <RoleForm />
        <div class="flex flex-col sm:flex-row justify-end gap-3 *:w-full sm:*:w-auto *:min-h-[52px] sm:*:min-h-0 *:text-base sm:*:text-sm *:rounded-2xl sm:*:rounded-xl">
          <Button size="md" variant="outline" @click="router.back()">
            Discard
          </Button>
          <SubmitButton :loading="mutation.isPending.value"> Create Role </SubmitButton>
        </div>
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import RoleForm from "../../components/settings/CarrierRoleForm.vue";
import Form from "@/components/form/Form.vue";
import { create_role } from "../../api/settings.api";
import { useToastStore } from "@/store/toastStore";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";

const queryClient = useQueryClient();
const router = useRouter();
const toast = useToastStore();

const mutation = useMutation({
  mutationFn: (values: any) => create_role(values),
});

const initialValues = {
  name: "",
  type: "USER",
  description: "",
  permissions: [],
};

const handleCreate = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Role created successfully");
      queryClient.invalidateQueries({ queryKey: ["roles-list"] });
      router.push("/setting/user-and-role");
    } else {
      toast.error(res.error || "Failed to create role");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
