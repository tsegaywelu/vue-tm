<template>
  <div class="w-full">
    <Form
      id="add-role-form"
      :values="initialValues"
      @submit="handleCreate"
    >
      <div class="flex flex-col gap-6">
        <ShipperRoleForm />
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
import ShipperRoleForm from "../../components/UserManagement/ShipperRoleForm.vue";
import Form from "@/components/form/Form.vue";
import { create_shipper_role } from "../../api/shipper.api";
import { useToastStore } from "@/store/toastStore";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";

const queryClient = useQueryClient();
const router = useRouter();
const toast = useToastStore();

const mutation = useMutation({
  mutationFn: (values: any) => create_shipper_role(values),
});

const initialValues = {
  name: "",
  type: "USER",
  description: "",
  permissions: [],
};

const handleCreate = async (values: any) => {
  const res = await mutation.mutateAsync(values);
  if (res.success) {
    toast.success("Role created successfully");
    queryClient.invalidateQueries({ queryKey: ["shipper-roles-list"] });
    router.push("/shipper/users?tab=roles");
  } else {
    toast.error(res.error || "Failed to create role");
  }
};
</script>
