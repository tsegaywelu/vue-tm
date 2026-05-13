<template>
  <ShipperAnnouncementForm
    form-id="add-announcement-form"
    :initial-values="{ title: '', message: '', targetAudience: 'ALL' }"
    :on-submit="handleCreate"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">Discard</Button>
      <SubmitButton> Create Announcement </SubmitButton>
    </template>
  </ShipperAnnouncementForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import ShipperAnnouncementForm from "../../components/setting/Announcement/ShipperAnnouncementForm.vue";
import { create_announcement } from "../../api/shipper.api";
import { useToastStore } from "@/store/toastStore";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";

const router = useRouter();
const toast = useToastStore();
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: (values: any) => create_announcement(values),
});

const handleCreate = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Announcement created successfully");
      queryClient.invalidateQueries({ queryKey: ["shipper-announcement-list"] });
      router.push("/shipper/setting/announcements");
    } else {
      toast.error(res.error || "Failed to create announcement");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
