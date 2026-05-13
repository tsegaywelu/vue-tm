<template>
  <FormModalParent
    modal-style="auto"
    :title="isEdit ? 'Edit Role' : 'Add Role'"
    :subtitle="
      isEdit
        ? 'Update role permissions and details'
        : 'Create a new role with specific permissions'
    "
    :form-id="formId"
    :values="initialValues"
    :submit-handler="handleFormSubmit"
    @close="cancel"
  >
    <template #center>
      <RoleForm />
    </template>
    <template #bottom>
      <div class="flex justify-end gap-3 w-full">
        <Button type="button" variant="outline" size="md" @click="cancel">
          Cancel
        </Button>
        <SubmitButton
          :loading="mutation.isPending.value"
          variant="primary"
          size="md"
          :form="formId"
        >
          {{ isEdit ? "Update Role" : "Create Role" }}
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { closeModal } from "@customizer/modal-x";
import { useToastStore } from "@/store/toastStore";
import { useMutation } from "@tanstack/vue-query";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import RoleForm from "@/modules/operation/components/settings/RoleForm.vue";
import { create_role, update_role } from "../../api/shipper.api";

export type ReturnType = boolean;
export type Props = {
  role?: any;
};

const props = defineProps<{ data: Props; close: (res: ReturnType) => void }>();
const toast = useToastStore();
const formId = "roleForm";

const isEdit = computed(() => !!props.data.role);

const initialValues = computed(() => {
  if (props.data.role) {
    return {
      name: props.data.role.name,
      type: props.data.role.type,
      description: props.data.role.description,
      permissions: props.data.role.permissions || [],
    };
  }
  return {
    name: "",
    type: "USER",
    description: "",
    permissions: [],
  };
});

const mutation = useMutation({
  mutationFn: (values: any) => {
    if (isEdit.value) {
      return update_role(props.data.role._id, values);
    } else {
      return create_role(values);
    }
  },
  onSuccess: (res) => {
    if (res.success) {
      toast.success(
        `Role ${isEdit.value ? "updated" : "created"} successfully!`,
      );
      props.close(true);
    } else {
      toast.error(
        res.error || `Failed to ${isEdit.value ? "update" : "create"} role`,
      );
    }
  },
  onError: (error: any) => {
    toast.error(error?.message || "An error occurred");
  },
});

function cancel() {
  closeModal();
}

async function handleFormSubmit(values: any) {
  mutation.mutate(values);
}
</script>
