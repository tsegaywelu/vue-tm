<template>
  <Teleport to="#page-actions" defer>
    <Button
      v-permission="'CONTACT:create'"
      size="md"
      variant="primary"
      @click="openContactModal(null)"
    >
      New Contact
    </Button>
  </Teleport>

  <div class="flex flex-col gap-4">
    <!-- Contacts Table -->
    <Table
      id="contacts-list"
      :columns="columns"
      :rows="response"
      :loading="isLoading"
      search_placeholder="Search contacts..."
      @row_click="navigateToDetails"
      :head_alignment="{
        contactInfo: 'left',
      }"
      :row_alignment="{
        contactInfo: 'left',
      }"
    >
      <!-- Put Select in the search input prefix slot -->
      <template #search-prefix>
        <div
          class="h-full flex items-center border-r border-gray-200 pr-2 mr-2 w-48"
        >
          <Select
            class="[&_.input-focus]:shadow-none! [&_.input-focus]:border-none [&_.input-focus]:min-h-full min-w-48"
            v-model="selectedGroup"
            :options="groupOptions"
            label_key="label"
            value_key="value"
            :clearable="false"
          />
        </div>
      </template>

      <template #cell-contactInfo="{ row }">
        <div class="flex items-center space-x-3">
          <div
            v-if="!row.profilePicture"
            class="h-10 w-10 bg-grey-150 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm"
          >
            {{ row.name?.charAt(0)?.toUpperCase() }}
          </div>
          <img
            v-else
            :src="getProfilePictureURL(row.profilePicture)"
            alt="Contact"
            class="h-10 w-10 rounded-full object-cover border border-grey-200"
          />
          <div class="flex flex-col">
            <span class="font-bold text-grey-900">{{ row.name }}</span>
            <span class="text-xs text-grey-500">{{ row.phone || "-" }}</span>
          </div>
        </div>
      </template>

      <template #cell-group="{ row }">
        <Status
          :variant="getVariantForGroup(row.group)"
          :label="row.group || 'OTHER'"
          type="wrapped"
        />
      </template>

      <template #cell-jobTitle="{ row }">
        <div class="flex flex-col">
          <span class="text-grey-900 font-medium">{{
            row.jobTitle || "-"
          }}</span>
          <span class="text-xs text-grey-500">{{ row.email || "-" }}</span>
        </div>
      </template>

      <template #cell-loginAccess="{ row }">
        <Status
          :variant="row.user ? 'active' : 'cancelled'"
          :label="row.user ? 'Enabled' : 'Disabled'"
          type="wrapped"
        />
      </template>

      <template #cell-actions="{ row }">
        <div @click.stop class="flex justify-center">
          <Dropdown>
            <template #default="{ close }">
              <DropDownItem
                label="View Details"
                @click="
                  close();
                  navigateToDetails(row);
                "
              />
              <DropDownItem
                v-permission="'CONTACT:update'"
                label="Edit Contact"
                @click="
                  close();
                  openContactModal(row);
                "
              />
              <!-- <DropDownItem
                v-permission="'CONTACT:delete'"
                label="Delete"
                @click="
                  close();
                  handleDelete(row);
                "
              /> -->
            </template>
          </Dropdown>
        </div>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { usePagination } from "@/composables/usePagination";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import Table from "@/components/common/Table.vue";
import Select from "@/components/common/Select.vue";
import type { TableColumn } from "@/components/common/Table.vue";
import Status from "@/components/common/Status.vue";
import Button from "@/components/common/Button.vue";
import { openModal } from "@customizer/modal-x";
import { useToastStore } from "@/store/toastStore";
import { useMutation } from "@tanstack/vue-query";
import { delete_contact } from "../api/operation.api";

const router = useRouter();
const toast = useToastStore();

const selectedGroup = ref("");

const groupOptions = [
  { label: "All Groups", value: "" },
  { label: "Driver", value: "DRIVER" },
  { label: "Mechanic", value: "MECHANIC" },
  { label: "Staff", value: "STAFF" },
  { label: "Vendor", value: "VENDOR" },
  { label: "Other", value: "OTHER" },
];

const paginationParams = computed(() => {
  const p: Record<string, any> = {};
  if (selectedGroup.value) {
    p.group = selectedGroup.value;
  }
  return p;
});

const { response, refetch, isLoading } = usePagination({
  id: "contacts-list",
  url: "/contact",
  params: paginationParams,
});

const columns: TableColumn<any>[] = [
  { key: "contactInfo", label: "Contact Info", field: "name" },
  { key: "group", label: "Group", field: "group" },
  { key: "jobTitle", label: "Job Title", field: "jobTitle" },
  { key: "loginAccess", label: "Login Access", field: "user" },
  { key: "actions", label: "Actions", field: "" },
];

const openContactModal = async (contact: any = null) => {
  const res = await openModal("ContactModal", { contact });
  if (res) {
    refetch();
  }
};

const navigateToDetails = (row: any) => {
  router.push(`/contacts/${row._id}`);
};

const getVariantForGroup = (group: string) => {
  switch (group) {
    case "DRIVER":
      return "active";
    case "MECHANIC":
      return "info";
    case "STAFF":
      return "wrapped";
    default:
      return "cancelled";
  }
};

const API_URL = import.meta.env.VITE_API_URL;
const getProfilePictureURL = (path: string) => {
  if (path) {
    return `${API_URL}/${path.replace(/\\/g, "/")}`;
  }
  return "";
};

const deleteMutation = useMutation({
  mutationFn: delete_contact,
});

const handleDelete = async (row: any) => {
  if (confirm(`Are you sure you want to delete ${row.name}?`)) {
    const res = await deleteMutation.mutateAsync(row._id);
    if (res.success || res.status === 200 || res.status === 204) {
      toast.success("Contact deleted successfully!");
      refetch();
    } else {
      toast.error(res.error || "Failed to delete contact");
    }
  }
};
</script>
