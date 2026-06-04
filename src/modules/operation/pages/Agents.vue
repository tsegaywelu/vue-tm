<template>
  <Teleport to="#page-actions" defer>
    <Button
      v-permission="'AGENT:create'"
      size="md"
      variant="primary"
      class="hidden sm:flex"
      @click="navigateToAddAgent"
    >
      New Agent
    </Button>
  </Teleport>

  <!-- Floating action button — mobile only -->
  <button
    v-permission="'AGENT:create'"
    class="fixed bottom-6 right-6 sm:hidden z-50 w-14 h-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center active:scale-95 transition-transform"
    @click="navigateToAddAgent"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  </button>

  <Table
    :columns="columns"
    :rows="response"
    :loading="isLoading"
    :hide_on_sm_screen="['tradeName', 'contactInfo']"
    :on_sm_screen_column_span="{ name: 2, status: 2, location: 1 }"
    @row_click="navigateToEditAgent"
  >
    <template #cell-name="{ row }">
      <span class="font-bold text-grey-900">{{ row.name }}</span>
    </template>
    <template #cell-tradeName="{ row }">
      <span class="text-grey-600">{{ row.tradeName }}</span>
    </template>
    <template #cell-contactInfo="{ row }">
      <div v-if="row.contact" class="flex flex-col text-xs text-grey-600">
        <span class="font-bold text-grey-900">{{ row.contact.fullName }}</span>
        <span>{{ row.contact.email }}</span>
        <span>{{ (row.contact.phoneNumbers || []).join(", ") }}</span>
      </div>
      <span v-else>-</span>
    </template>
    <template #cell-location="{ row }">
      <span class="text-grey-600">
        {{ row.location?.region }} - {{ row.location?.city }}
      </span>
    </template>
    <template #cell-status="{ row }">
      <Status
        :variant="row.isActive ? 'active' : 'cancelled'"
        :label="row.isActive ? 'Active' : 'Inactive'"
        type="wrapped"
      />
    </template>
    <template #cell-actions="{ row }">
      <div @click.stop class="flex justify-center">
        <Dropdown>
          <template #default="{ close }">
            <DropDownItem
              label="Edit Agent"
              @click="
                close();
                navigateToEditAgent(row);
              "
            />
          </template>
        </Dropdown>
      </div>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import Button from "@/components/common/Button.vue";
import { usePagination } from "@/composables/usePagination";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import Table from "@/components/common/Table.vue";
import Status from "@/components/common/Status.vue";
import type { TableColumn } from "@/components/common/Table.vue";

const router = useRouter();

const { response, refetch, isLoading } = usePagination({
  id: "agents-list",
  url: "/agent/shipper/carrier",
  params: (state: any) => ({
    q: undefined,
    "name[regex]": state.search,
  }),
});

const columns: TableColumn<any>[] = [
  { key: "name", label: "Agent Name", field: "name" },
  { key: "tradeName", label: "Trade Name", field: "tradeName" },
  { key: "contactInfo", label: "Contact Info", field: "contact.fullName" },
  { key: "location", label: "Location", field: "location.city" },
  { key: "status", label: "Status", field: "isActive" },
  { key: "actions", label: "Actions", field: "" },
];

const navigateToAddAgent = () => {
  router.push("/agents/add");
};

const navigateToEditAgent = (row: any) => {
  router.push(`/agents/edit/${row._id}`);
};
</script>
