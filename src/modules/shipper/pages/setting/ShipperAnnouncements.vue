<template>
  <div class="flex flex-col h-full">
    <!-- Page Actions (Teleported) -->
    <Teleport to="#page-actions" defer>
      <Button
        v-permission="'ANNOUNCEMENT:create'"
        variant="primary"
        size="md"
        class="flex items-center gap-2"
        @click="openModal('AnnouncementModal', {}).then(res => res && tableRef?.refetch())"
      >
        <i v-html="icons.plus" />
        Add Announcement
      </Button>
    </Teleport>

    <!-- Table Section -->
    <div class="flex-1 min-h-0">
      <ShipperAnnouncementTable
        ref="tableRef"
        @action="handleAction"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import ShipperAnnouncementTable from "../../components/setting/Announcement/ShipperAnnouncementTable.vue";
import Button from "@/components/Button.vue";
import { icons } from "@/utils/icons";
import { useToastStore } from "@/store/toastStore";
import { delete_announcement } from "../../api/shipper.api";
import { openModal } from "@customizer/modal-x";

const router = useRouter();
const toast = useToastStore();
const tableRef = ref();

const handleAction = async ({ row, action }: any) => {
  if (action === "edit") {
    const res = await openModal("AnnouncementModal", { announcement: row });
    if (res) tableRef.value?.refetch();
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
