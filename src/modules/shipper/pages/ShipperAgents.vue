<template>
  <Teleport to="#page-actions" defer>
    <Button
      v-permission="'AGENT:create'"
      size="md"
      variant="primary"
      @click="handleOpenAddModal"
    >
      New Agent
    </Button>
  </Teleport>

  <Table alignment="left" :columns="columns" :rows="response">
    <template #cell-name="{ row }">
      <span class="font-bold text-grey-900">{{ row.name }}</span>
    </template>
    <template #cell-tradeName="{ row }">
      <span class="text-grey-600">{{ row.tradeName || "-" }}</span>
    </template>
    <template #cell-contactInfo="{ row }">
      <div class="flex flex-col gap-1 py-2">
        <span class="text-sm font-bold text-grey-900">{{
          row.contact?.fullName || "-"
        }}</span>
        <span class="text-xs text-grey-600">{{
          row.contact?.email || "-"
        }}</span>
        <span class="text-xs text-grey-600">{{
          row.contact?.phoneNumbers
            ?.map((phone: string) => formatPhoneNumberForDisplay(phone))
            .join(", ") || "-"
        }}</span>
      </div>
    </template>
    <template #cell-location="{ row }">
      <div class="flex flex-col gap-1 py-2">
        <span class="text-sm font-medium text-grey-900">{{
          row.location?.region || "-"
        }}</span>
        <span class="text-xs text-grey-600">{{
          row.location?.city || "-"
        }}</span>
      </div>
    </template>
    <template #cell-isActive="{ row }">
      <Status :variant="row.isActive ? 'success' : 'error'" />
    </template>
    <template #cell-actions="{ row }">
      <div @click.stop class="flex justify-center">
        <Dropdown>
          <template #default="{ close }">
            <DropDownItem
              label="Edit Agent"
              @click="
                close();
                handleOpenEditModal(row);
              "
            />
          </template>
        </Dropdown>
      </div>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "@/store/authStore";
import { usePagination } from "@/composables/usePagination";
import Table, { type TableColumn } from "@/components/common/Table.vue";
import Button from "@/components/common/Button.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import { useRouter } from "vue-router";
import { formatPhoneNumberForDisplay } from "@/utils/utils";
import Status from "@/components/common/Status.vue";

const authStore = useAuthStore();
const router = useRouter();
const shipperId = computed(
  () => authStore.current_user?.user?.shipper?._id || "",
);

const { response, refetch } = usePagination({
  id: "shipper-agents-list",
  url: `/agent`,
  params(state) {
    return {
      name: {
        regex: state.search,
      },
      q: undefined,
    };
  },
});

const columns: TableColumn<any>[] = [
  { key: "name", label: "Name", field: "name" },
  { key: "tradeName", label: "Trade Name", field: "tradeName" },
  { key: "contactInfo", label: "Contact Info", field: "contact" },
  { key: "location", label: "Location", field: "location" },
  { key: "isActive", label: "Status", field: "isActive" },
  { key: "actions", label: "Action", field: "" },
];

const handleOpenAddModal = () => {
  router.push({ name: "shipper_agent_add" });
};

const handleOpenEditModal = (row: any) => {
  router.push({ name: "shipper_agent_edit", params: { id: row._id } });
};
</script>
