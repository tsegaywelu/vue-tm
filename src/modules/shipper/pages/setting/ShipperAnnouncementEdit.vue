<template>
  <ShipperAnnouncementForm
    v-if="announcement"
    form-id="edit-announcement-form"
    :initial-values="announcement"
    :on-submit="handleUpdate"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">Discard</Button>
      <SubmitButton> Update Announcement </SubmitButton>
    </template>
  </ShipperAnnouncementForm>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import ShipperAnnouncementForm from "../../components/setting/Announcement/ShipperAnnouncementForm.vue";
import { fetch_announcement_details, update_announcement } from "../../api/shipper.api";
import { useToastStore } from "@/store/toastStore";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";

const router = useRouter();
const route = useRoute();
const toast = useToastStore();
const queryClient = useQueryClient();
const id = route.params.id as string;

const { data: announcement } = useQuery({
  queryKey: ["announcement", id],
  queryFn: () => fetch_announcement_details(id).then(res => res.data),
});

const mutation = useMutation({
  mutationFn: (values: any) => update_announcement(id, values),
});

const handleUpdate = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Announcement updated successfully");
      queryClient.invalidateQueries({ queryKey: ["shipper-announcement-list"] });
      router.push("/shipper/setting/announcements");
    } else {
      toast.error(res.error || "Failed to update announcement");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
