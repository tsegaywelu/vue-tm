<template>
  <FormModalParent
    modal-style="auto"
    :title="isEdit ? 'Edit Announcement' : 'Add Announcement'"
    :subtitle="isEdit ? 'Update announcement details' : 'Create a new announcement'"
    :form-id="formId"
    :values="initialValues"
    :submit-handler="handleFormSubmit"
    @close="cancel"
  >
    <template #center>
      <AnnouncementForm />
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
          {{ isEdit ? 'Update Announcement' : 'Create Announcement' }}
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
import AnnouncementForm from "@/modules/operation/components/settings/Announcement/AnnouncementForm.vue";
import { create_announcement, update_announcement } from "../../api/shipper.api";
import { useAuthStore } from "@/store/authStore";

export type ReturnType = boolean;
export type Props = {
  announcement?: any;
};

const props = defineProps<{ data: Props; close: (res: ReturnType) => void }>();
const toast = useToastStore();
const authStore = useAuthStore();
const formId = "announcementForm";

const isEdit = computed(() => !!props.data.announcement);

const initialValues = computed(() => {
  if (props.data.announcement) {
    return {
      title: props.data.announcement.title,
      targetAudience: props.data.announcement.targetAudience,
      message: props.data.announcement.message,
    };
  }
  return {
    title: "",
    targetAudience: "ALL",
    message: "",
  };
});

const mutation = useMutation({
  mutationFn: (values: any) => {
    if (isEdit.value) {
      return update_announcement(props.data.announcement._id, values);
    } else {
      const payload = {
        ...values,
        shipper: authStore.shipperId,
      };
      return create_announcement(payload);
    }
  },
  onSuccess: (res) => {
    if (res.success) {
      toast.success(`Announcement ${isEdit.value ? 'updated' : 'created'} successfully!`);
      props.close(true);
    } else {
      toast.error(res.error || `Failed to ${isEdit.value ? 'update' : 'create'} announcement`);
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
