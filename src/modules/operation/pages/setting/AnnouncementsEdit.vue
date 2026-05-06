<template>
  <div v-if="isLoading" class="flex justify-center p-12">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
  <AnnouncementForm
    v-else-if="initialValues"
    form-id="edit-announcement-form"
    :initial-values="initialValues"
    :on-submit="handleEdit"
  >
    <template #submit-btn="{ form }">
      <Button size="md" variant="outline" @click="router.back()">
        Discard
      </Button>
      <SubmitButton> Update Announcement </SubmitButton>
    </template>
  </AnnouncementForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import AnnouncementForm from "../../components/settings/Announcement/AnnouncementForm.vue";
import { fetch_announcements, update_announcement } from "../../api/announcement.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useMutation, useQuery } from "@tanstack/vue-query";

const router = useRouter();
const route = useRoute();
const toast = useToastStore();
const id = route.params.id as string;

// Note: fetch_announcements doesn't have a detail endpoint shown in api file, 
// but usually it's /{id}. If it fails, we can find it in the list.
const { data: response, isLoading } = useQuery({
  queryKey: ["announcement", id],
  queryFn: () => fetch_announcements(), // Fetching all and finding by id as a fallback
  select: (data) => {
    const list = data?.data?.results || data?.data || [];
    return list.find((a: any) => a._id === id);
  },
  enabled: !!id,
});

const initialValues = computed(() => {
  if (!response.value) return null;
  const data = response.value;
  return {
    title: data.title || "",
    message: data.message || "",
    targetAudience: data.targetAudience || "ALL",
  };
});

const mutation = useMutation({
  mutationFn: (values: any) => update_announcement(id, values),
});

const handleEdit = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Announcement updated successfully");
      router.push("/setting/announcements");
    } else {
      toast.error(res.error || "Failed to update announcement");
    }
  } catch (err: any) {
    toast.error(err.message || "An unexpected error occurred");
  }
};
</script>
