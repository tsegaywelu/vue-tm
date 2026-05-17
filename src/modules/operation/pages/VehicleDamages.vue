<template>
  <Teleport defer to="#page-actions">
    <Button v-permission="'VEHICLE_DAMAGE:create'" variant="primary" size="md" @click="openAddDamageModal">
      <template #leftIcon>
        <i class="mdi mdi-plus text-lg"></i>
      </template>
      Add Vehicle Damage
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

  <Table
    :columns="columns"
    :rows="tableData || []"
    @row_click="handleRowClick"
    :row_alignment="{ amount: 'right', actions: 'right' }"
    :head_alignment="{ amount: 'right', actions: 'right' }"
  >
    <!-- Search / Filter actions -->
    <template #table-actions>
      <div class="flex items-center gap-4 flex-1">
        <div class="relative w-64">
          <i
            class="mdi mdi-magnify absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl"
          ></i>
          <input
            v-model="searchQuery"
            type="text"
            class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-shadow"
            placeholder="Search damages..."
          />
        </div>
      </div>
    </template>

    <template #cell-vehicle="{ row }">
      <div class="flex flex-col">
        <span class="font-bold text-gray-900">{{
          row.vehicle?.plateNumber?.toUpperCase() || "N/A"
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
        <span
          class="text-[10px] uppercase font-bold text-red-500 mt-1"
          v-if="row.severity"
          >{{ row.severity }}</span
        >
      </div>
    </template>

    <template #cell-status="{ row }">
      <div class="flex flex-col gap-1">
        <div
          v-if="activeTab === 'list' || activeTab === 'payable'"
          class="flex items-center justify-between text-[10px] min-w-[120px]"
        >
          <span class="uppercase text-gray-400">Payable:</span>
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
          <span class="uppercase text-gray-400">Receivable:</span>
          <Status
            :variant="row.receivableStatus"
            type="wrapped"
            :label="row.receivableStatus"
          />
        </div>
      </div>
    </template>

    <template #cell-amount="{ row }">
      <span class="font-black">{{
        currencyFormatter(row.actualRepairCost || 0)
      }}</span>
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

    <!-- <template #bottom>
      <div class="flex items-center justify-between mt-6">
        <TablePerPageSelect v-model="paginationParams.limit" />
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
import Button from "@/components/common/Button.vue";
import type { TableColumn } from "@/components/common/Table.vue";
import Status from "@/components/common/Status.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import { openModal } from "@customizer/modal-x";
import { useToastStore } from "@/store/toastStore";
import { currencyFormatter, dateFormatter } from "@/utils/utils";
import {
  update_vehicle_damage_status,
  delete_vehicle_damage,
} from "../api/operation.api";
import StatsCards from "@/components/common/StatsCards.vue";

const router = useRouter();
const route = useRoute();
const toast = useToastStore();

const searchQuery = ref("");
const paginationParams = ref({ limit: 10 });

const activeTab = computed(() => (route.query.tab as string) || "list");

const queryParams = computed(() => {
  const p: any = {
    name: searchQuery.value || undefined,
    limit: paginationParams.value.limit,
  };

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
  url: "/vehicle-damages",
  params: () => ({
    ...queryParams.value,
  }),
  queryKey: ["vehicle-damages", activeTab.value],
});

const columns: TableColumn[] = [
  { key: "vehicle", label: "Vehicle" },
  { key: "shipment", label: "Shipment & Route" },
  { key: "damageInfo", label: "Damage Info" },
  { key: "status", label: "Status" },
  { key: "amount", label: "Actual Repair Cost", cellAlign: "right" },
  { key: "actions", label: "Actions", cellAlign: "right" },
];

const openAddDamageModal = () => {
  openModal("AddVehicleDamageModal", {
    onSuccess: () => {
      refetch();
    },
  });
};

const openEditDamageModal = (row: any) => {
  openModal("AddVehicleDamageModal", {
    damageId: row._id,
    initialData: row,
    onSuccess: () => {
      refetch();
    },
  });
};

const handleRowClick = (row: any) => {
  router.push(`/vehicle-damages/${row._id}`);
};

const statusMutation = useMutation({
  mutationFn: ({ id, status }: { id: string; status: string }) =>
    update_vehicle_damage_status(id, status),
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
  mutationFn: (id: string) => delete_vehicle_damage(id),
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
    title: "Delete Vehicle Damage",
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
