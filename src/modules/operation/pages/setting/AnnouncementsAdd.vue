<template>
  <Form
    id="add-announcement-form"
    :values="initialValues"
    :onSubmit="handleAdd"
  >
    <template #default>
      <Colapsable
        title="Announcement Details"
        description="Fill in the title, target audience, and message for this announcement."
      >
        <AnnouncementForm />
      </Colapsable>

      <div class="pt-10 flex justify-end gap-4">
        <Button type="button" variant="outline" @click="router.back()">
          Discard
        </Button>
        <SubmitButton>Send Announcement</SubmitButton>
      </div>
    </template>
  </Form>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { create_announcement } from "../../api/announcement.api";
import { useToastStore } from "@/store/toastStore";
import Form from "@/components/form/Form.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import AnnouncementForm from "../../components/settings/Announcement/AnnouncementForm.vue";

const router = useRouter();
const toast = useToastStore();
const queryClient = useQueryClient();

const initialValues = {
  title: "",
  message: "",
  targetAudience: "ALL",
};

const mutation = useMutation({
  mutationFn: (values: any) => create_announcement(values),
});

const handleAdd = async (values: any) => {
  const res = await mutation.mutateAsync(values);
  if (res.success) {
    toast.success("Announcement created successfully");
    queryClient.invalidateQueries({ queryKey: ["announcement-list"] });
    router.push("/setting/announcements");
  } else {
    toast.error(res.error || "Failed to create announcement");
  }
};
</script>
