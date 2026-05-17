<template>
  <Teleport defer to="#page-actions">
    <Button
      v-permission="'SHIPMENT_DAMAGE:create'"
      variant="primary"
      size="md"
      @click="openAddDamageModal"
    >
      <template #leftIcon>
        <i class="mdi mdi-plus text-lg"></i>
      </template>
      Add Damage Report
    </Button>
  </Teleport>

  <Teleport to="#extra-page-data">
    <StatsCards
      :stats="[
        {
          label: 'Total Damage Amount',
          value: currencyFormatter(fullResponse?.totalAmount || 0),
        },
      ]"
    />
  </Teleport>

  <!-- Stat Cards -->
  <!-- <div class="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div
      class="p-6 bg-white rounded-[20px] shadow-sm border border-gray-100 flex flex-col items-center gap-2"
    >
      <div class="flex items-center gap-2 text-gray-500 text-sm font-medium">
        <i class="mdi mdi-currency-usd text-2xl text-primary" />
        Total Damage Amount
      </div>
      <div class="text-gray-900 text-2xl font-bold">
        {{ currencyFormatter(fullResponse?.totalAmount || 0) }}
      </div>
      <div class="text-xs text-gray-400">
        {{ fullResponse?.totalResults || 0 }} total records
      </div>
    </div>
  </div> -->
  <Table
    :columns="columns"
    :rows="tableData || []"
    @row_click="handleRowClick"
    :row_alignment="{ amount: 'right', actions: 'right' }"
    :head_alignment="{ amount: 'right', actions: 'right' }"
    :search_placeholder="dynamicSearchPlaceholder"
  >
    <template #search-prefix>
      <div
        class="h-full flex items-center border-r border-gray-200 pr-2 mr-2 w-48"
      >
        <Select
          class="[&_.input-focus]:shadow-none! [&_.input-focus]:border-none [&_.input-focus]:min-h-full min-w-48"
          v-model="selectedSearchField"
          :options="searchFieldOptions"
          label_key="label"
          value_key="value"
          :clearable="false"
        />
      </div>
    </template>

    <template #cell-vehicle="{ row }">
      <div class="flex flex-col">
        <span class="font-bold text-gray-900">{{
          row.shipment?.vehiclePlateNumber?.toUpperCase() || "N/A"
        }}</span>
        <span class="text-xs text-gray-500">{{
          row.responsibleDriver?.name || "N/A"
        }}</span>
      </div>
    </template>

    <template #cell-shipment="{ row }">
      <div class="flex flex-col">
        <span class="font-bold text-gray-900">{{
          row.shipment?.shipmentCode || "N/A"
        }}</span>
        <span class="text-xs text-gray-500">{{
          row.shipment?.routeName || "N/A"
        }}</span>
      </div>
    </template>

    <template #cell-damageInfo="{ row }">
      <div class="flex flex-col">
        <span class="text-sm text-gray-900">{{
          dateFormatter(row.damageDate)
        }}</span>
        <span class="text-xs text-gray-500"
          >By {{ row.preparedBy?.username || "N/A" }}</span
        >
      </div>
    </template>

    <template #cell-status="{ row }">
      <div class="flex gap-2 gap-1">
        <div
          v-if="activeTab === 'list' || activeTab === 'payable'"
          class="flex items-center justify-between text-[10px] min-w-[120px]"
        >
          <Status
            :variant="row.payableStatus"
            type="wrapped"
            :label="row.payableStatus"
          />
        </div>
        <div
          v-if="activeTab === 'list' || activeTab === 'receivable'"
          class="flex items-center justify-between text-[10px] min-w-[120px]"
        >
          <Status
            :variant="row.receivableStatus"
            type="wrapped"
            :label="row.receivableStatus"
          />
        </div>
      </div>
    </template>

    <template #cell-amount="{ row }">
      <span class="font-black">{{ currencyFormatter(row.total) }}</span>
    </template>

    <template #cell-actions="{ row }">
      <Dropdown>
        <DropDownItem @click="handleRowClick(row)">View Details</DropDownItem>
        <DropDownItem
          v-if="row.payableStatus === 'PENDING'"
          @click="openEditDamageModal(row)"
        >
          Edit
        </DropDownItem>

        <!-- Payable Actions -->
        <template v-if="activeTab === 'payable' || activeTab === 'list'">
          <DropDownItem
            v-if="row.payableStatus === 'AUTHORIZED'"
            @click="handleStatusUpdate(row._id, 'pay-payable')"
            variant="default"
          >
            Pay
          </DropDownItem>
          <DropDownItem
            v-if="row.payableStatus === 'PENDING'"
            @click="handleStatusUpdate(row._id, 'authorize-payable')"
            variant="default"
          >
            Authorize
          </DropDownItem>
          <DropDownItem
            v-if="row.payableStatus === 'PENDING'"
            @click="handleStatusUpdate(row._id, 'cancel-payable')"
            variant="danger"
          >
            Cancel
          </DropDownItem>
        </template>

        <!-- Receivable Actions -->
        <template v-if="activeTab === 'receivable'">
          <DropDownItem
            v-if="row.receivableStatus === 'AUTHORIZED'"
            @click="handleStatusUpdate(row._id, 'receive-receivable')"
            variant="default"
          >
            Collect
          </DropDownItem>
          <DropDownItem
            v-if="row.receivableStatus === 'PENDING'"
            @click="handleStatusUpdate(row._id, 'authorize-receivable')"
            variant="default"
          >
            Authorize
          </DropDownItem>
          <DropDownItem
            v-if="row.receivableStatus === 'PENDING'"
            @click="handleStatusUpdate(row._id, 'cancel-receivable')"
            variant="danger"
          >
            Cancel
          </DropDownItem>
        </template>

        <div class="h-px bg-gray-100 my-1"></div>
        <DropDownItem @click="deleteItem(row._id)" variant="danger"
          >Delete</DropDownItem
        >
      </Dropdown>
    </template>

    <!-- Pagination -->
    <!-- <template #bottom>
      <div class="flex items-center justify-between mt-6">
        asd
        <TablePerPageSelect v-model="paginationParams.limit" />
        <div class="flex items-center gap-2">
        </div>
      </div>
    </template> -->
  </Table>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { usePagination } from "@/composables/usePagination";
import { useMutation } from "@tanstack/vue-query";
import Table from "@/components/common/Table.vue";
import Select from "@/components/common/Select.vue";
import Button from "@/components/common/Button.vue";
import type { TableColumn } from "@/components/common/Table.vue";
import Status from "@/components/common/Status.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import { openModal } from "@customizer/modal-x";
import { useToastStore } from "@/store/toastStore";
import { currencyFormatter, dateFormatter } from "@/utils/utils";
import {
  update_shipment_damage_status,
  delete_shipment_damage,
} from "../api/operation.api";
import StatsCards from "@/components/common/StatsCards.vue";

const router = useRouter();
const route = useRoute();
const toast = useToastStore();

const selectedSearchField = ref("shipmentCode");

const searchFieldOptions = [
  { label: "Shipment Code", value: "shipmentCode" },
  { label: "Plate Number", value: "vehiclePlateNumber" },
  { label: "Driver Name", value: "driverName" },
  { label: "Damage Remark", value: "damageRemark" },
  { label: "Item Remark", value: "itemRemark" },
];

const dynamicSearchPlaceholder = computed(() => {
  const option = searchFieldOptions.find(
    (o) => o.value === selectedSearchField.value,
  );
  return option ? `Search by ${option.label}...` : "Search damages...";
});

const activeTab = computed(() => (route.query.tab as string) || "list");

const tabFilters = computed(() => {
  const p: any = {};
  if (activeTab.value === "payable") {
    p.payableStatus = JSON.stringify(["PENDING", "AUTHORIZED"]);
  } else if (activeTab.value === "receivable") {
    p.receivableStatus = JSON.stringify(["PENDING", "AUTHORIZED"]);
  }
  return p;
});

const {
  response: tableData,
  fullResponse,
  refetch,
} = usePagination({
  url: "/shipment-damages",
  params: (state) => ({
    ...tabFilters.value,
    ...(state.search
      ? {
          name: {
            regex: state.search,
          },
        }
      : {}),
    searchBy: selectedSearchField.value,
    q: undefined,
  }),
  queryKey: ["shipment-damages", activeTab.value],
});

const columns: TableColumn[] = [
  { key: "vehicle", label: "Vehicle & Driver" },
  { key: "shipment", label: "Shipment & Route" },
  { key: "damageInfo", label: "Damage Info" },
  { key: "amount", label: "Amount", cellAlign: "right" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions", cellAlign: "right" },
];

const openAddDamageModal = () => {
  openModal("DamageReportModal", {
    onSuccess: () => {
      refetch();
    },
  });
};

const openEditDamageModal = (row: any) => {
  openModal("DamageReportModal", {
    shipperId: row.shipper._id,
    damageId: row._id,
    initialData: row,
    onSuccess: () => {
      refetch();
    },
  });
};

const handleRowClick = (row: any) => {
  router.push(`/shipment-damages/${row._id}`);
};

const statusMutation = useMutation({
  mutationFn: ({ id, status }: { id: string; status: string }) =>
    update_shipment_damage_status(id, status),
  onSuccess: (res: any) => {
    if (res.success) {
      toast.success("Status updated successfully");
      refetch();
    } else {
      toast.error(res.error || "Failed to update status");
    }
  },
  onError: () => {
    toast.error("Failed to update status");
  },
});

const deleteMutation = useMutation({
  mutationFn: (id: string) => delete_shipment_damage(id),
  onSuccess: (res: any) => {
    if (res.success) {
      toast.success("Damage record deleted");
      refetch();
    } else {
      toast.error(res.error || "Failed to delete damage record");
    }
  },
  onError: () => {
    toast.error("Failed to delete damage record");
  },
});

const handleStatusUpdate = async (id: string, status: string) => {
  const isConfirmed = await openModal("ConfirmationModal", {
    title: "Confirm Action",
    message: `Are you sure you want to perform this action?`,
    confirmText: "Yes, proceed",
  });

  if (isConfirmed) {
    statusMutation.mutate({ id, status });
  }
};

const deleteItem = async (id: string) => {
  const isConfirmed = await openModal("ConfirmationModal", {
    title: "Delete Shipment Damage",
    message:
      "Are you sure you want to delete this record? This action cannot be undone.",
    confirmText: "Delete",
    action: "delete",
  });

  if (isConfirmed) {
    deleteMutation.mutate(id);
  }
};
</script>
