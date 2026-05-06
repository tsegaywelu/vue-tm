<template>
  <AnnouncementForm
    form-id="add-announcement-form"
    :initial-values="{
      title: '',
      message: '',
      targetAudience: 'ALL',
    }"
    :on-submit="handleAdd"
  >
    <template #submit-btn="{ form }">
      <Button size="md" variant="outline" @click="router.back()">
        Discard
      </Button>
      <SubmitButton> Send Announcement </SubmitButton>
    </template>
  </AnnouncementForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import AnnouncementForm from "../../components/settings/Announcement/AnnouncementForm.vue";
import { create_announcement } from "../../api/announcement.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useMutation } from "@tanstack/vue-query";

const router = useRouter();
const toast = useToastStore();

const mutation = useMutation({
  mutationFn: (values: any) => create_announcement(values),
});

const handleAdd = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Announcement created successfully");
      router.push("/setting/announcements");
    } else {
      toast.error(res.error || "Failed to create announcement");
    }
  } catch (err: any) {
    toast.error(err.message || "An unexpected error occurred");
  }
};
</script>
