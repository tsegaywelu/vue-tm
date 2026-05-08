<template>
  <Teleport to="#page-actions" defer>
    <Button v-permission="'AGENT:create'" size="md" variant="primary" @click="navigateToAddAgent">
      New Agent
    </Button>
  </Teleport>

  <Table
    :columns="columns"
    :rows="response"
    :loading="isLoading"
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
