<template>
  <div v-if="isLoading" class="flex justify-center p-12">
    <i class="mdi mdi-loading mdi-spin text-4xl text-primary"></i>
  </div>

  <Form
    v-else-if="initialValues"
    id="edit-announcement-form"
    :values="initialValues"
    :onSubmit="handleEdit"
  >
    <template #default>
      <Colapsable
        title="Announcement Details"
        description="Update the title, target audience, and message."
      >
        <AnnouncementForm />
      </Colapsable>

      <div class="pt-10 flex justify-end gap-4">
        <Button type="button" variant="outline" @click="router.back()">
          Discard
        </Button>
        <SubmitButton>Update Announcement</SubmitButton>
      </div>
    </template>
  </Form>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import {
  fetch_announcement_by_id,
  update_announcement,
} from "../../api/announcement.api";
import { useToastStore } from "@/store/toastStore";
import Form from "@/components/form/Form.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import AnnouncementForm from "../../components/settings/Announcement/AnnouncementForm.vue";

const router = useRouter();
const route = useRoute();
const toast = useToastStore();
const queryClient = useQueryClient();
const id = route.params.id as string;

const { data: response, isLoading } = useQuery({
  queryKey: ["announcement", id],
  queryFn: () => fetch_announcement_by_id(id),
  enabled: !!id,
});

const initialValues = computed(() => {
  const data = response.value?.data;
  if (!data) return null;
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
  const res = await mutation.mutateAsync(values);
  if (res.success) {
    toast.success("Announcement updated successfully");
    queryClient.invalidateQueries({ queryKey: ["announcement-list"] });
    router.push("/setting/announcements");
  } else {
    toast.error(res.error || "Failed to update announcement");
  }
};
</script>
