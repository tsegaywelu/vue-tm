<template>
  <div class="flex flex-col h-full">
    <!-- Page Actions (Teleported) -->
    <!-- Mobile FAB -->
    <button
      v-permission="'ANNOUNCEMENT:create'"
      class="fixed bottom-6 right-6 sm:hidden z-50 w-14 h-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center active:scale-95 transition-transform"
      @click="router.push('/setting/announcements/add')"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    </button>
    <Teleport to="#page-actions" defer>
      <Button
        v-permission="'ANNOUNCEMENT:create'"
        variant="primary"
        size="md"
        class="hidden sm:flex items-center gap-2"
        @click="router.push('/setting/announcements/add')"
      >
        <i v-html="icons.plus" />
        Add Announcement
      </Button>
    </Teleport>

    <!-- Table Section -->
    <div class="flex-1 min-h-0">
      <AnnouncementTable
        ref="tableRef"
        @action="handleAction"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import AnnouncementTable from "../../components/settings/Announcement/AnnouncementTable.vue";
import Button from "@/components/Button.vue";
import { icons } from "@/utils/icons";
import { useToastStore } from "@/store/toastStore";
import { delete_announcement } from "../../api/announcement.api";

import { openModal } from "@customizer/modal-x";

const router = useRouter();
const toast = useToastStore();
const tableRef = ref();

const handleAction = async ({ row, action }: any) => {
  if (action === "edit") {
    router.push(`/setting/announcements/edit/${row._id}`);
  } else if (action === "delete") {
    const confirmed = await openModal("ConfirmationModal", {
      title: "Delete Announcement",
      message: `Are you sure you want to delete announcement "${row.title}"?`,
      confirmText: "Delete",
      action: "delete",
    });

    if (confirmed) {
      try {
        const res = await delete_announcement(row._id);
        if (res.success) {
          toast.success("Announcement deleted successfully");
          tableRef.value?.refetch();
        } else {
          toast.error(res.error || "Failed to delete announcement");
        }
      } catch (error: any) {
        toast.error(error.message || "An unexpected error occurred");
      }
    }
  }
};
</script>
