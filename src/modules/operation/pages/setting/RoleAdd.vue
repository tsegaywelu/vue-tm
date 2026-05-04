<template>
  <RoleForm
    form-id="add-role-form"
    :initial-values="initialValues"
    :on-submit="handleCreate"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">
        Discard
      </Button>
      <SubmitButton> Create Role </SubmitButton>
    </template>
  </RoleForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMutation } from "@tanstack/vue-query";
import RoleForm from "../../components/settings/RoleForm.vue";
import { create_role } from "../../api/settings.api";
import { useToastStore } from "@/store/toastStore";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";

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
      router.push("/setting/user-and-role");
    } else {
      toast.error(res.error || "Failed to create role");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
