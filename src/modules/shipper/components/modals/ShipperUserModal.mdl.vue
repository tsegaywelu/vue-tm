<template>
  <FormModalParent
    modal-style="auto"
    :title="isEdit ? 'Edit User' : 'Add User'"
    :subtitle="isEdit ? 'Update user account details' : 'Create a new user account'"
    :form-id="formId"
    :values="initialValues"
    :submit-handler="handleFormSubmit"
    @close="cancel"
  >
    <template #center>
      <ShipperUserForm :isEdit="isEdit" :labels="labels" />
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
          {{ isEdit ? 'Update User' : 'Create User' }}
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
import ShipperUserForm from "../UserManagement/ShipperUserForm.vue";
import { create_shipper_user, update_user } from "../../api/shipper.api";
import { useAuthStore } from "@/store/authStore";

export type ReturnType = boolean;
export type Props = {
  user?: any;
};

const props = defineProps<{ data: Props; close: (res: ReturnType) => void }>();
const toast = useToastStore();
const authStore = useAuthStore();
const formId = "userForm";

const isEdit = computed(() => !!props.data.user);

const labels = computed(() => ({
  role: props.data.user?.role?.name || "",
  region: props.data.user?.region?.name || "",
}));

const initialValues = computed(() => {
  if (props.data.user) {
    return {
      username: props.data.user.username,
      role: props.data.user.role?._id || props.data.user.role,
      region: props.data.user.region?._id || props.data.user.region,
    };
  }
  return {
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
    region: "",
  };
});

const mutation = useMutation({
  mutationFn: (values: any) => {
    if (isEdit.value) {
      const { confirmPassword, ...payload } = values;
      return update_user(props.data.user._id, payload);
    } else {
      const { confirmPassword, ...payload } = values;
      return create_shipper_user({ ...payload, shipper: authStore.shipperId });
    }
  },
  onSuccess: (res) => {
    if (res.success) {
      toast.success(`User ${isEdit.value ? 'updated' : 'created'} successfully!`);
      props.close(true);
    } else {
      toast.error(res.error || `Failed to ${isEdit.value ? 'update' : 'create'} user`);
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
