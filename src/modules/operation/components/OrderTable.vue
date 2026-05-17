<template>
  <Table
    :row_alignment="{
      order: 'left',
      details: 'left',
      shipper: 'left',
      carrier: 'left',
      actions: 'center',
    }"
    :head_alignment="{
      order: 'left',
      details: 'left',
      shipper: 'left',
      carrier: 'left',
      actions: 'center',
    }"
    id="order-list"
    :columns="columns"
    :rows="response"
    @row_click="(row) => router.push(`${resolvedBasePath}/${row._id}`)"
  >
    <template #after-search>
      <div
        class="items-center gap-4 inline-flex border-l border-grey-100 overflow-x-auto px-3"
      >
        <i v-html="icons.filter" />
        <OrderFilters @change="handleFilterChange" pagination-id="order-list" />
      </div>
    </template>

    <template #cell-order="{ row }">
      <div class="flex flex-col">
        <div class="flex items-center gap-1">
          <span class="font-semibold text-base text-gray-900">
            {{ row?.route?.routeName || "N/A" }}
          </span>
          <div
            v-if="row.priority"
            class="w-4 h-4 flex items-center justify-center text-[10px] rounded-full"
            :class="{
              'bg-red-100 text-red-600 font-semibold':
                row.priority === 'URGENT',
              'bg-orange-100 text-orange-500 font-semibold':
                row.priority === 'HIGH',
              'bg-yellow-100 text-yellow-500 font-medium':
                row.priority === 'MEDIUM',
              'bg-blue-100 text-blue-500 font-normal': row.priority === 'LOW',
            }"
          >
            {{ row.priority?.charAt(0) }}
          </div>
        </div>
        <span class="text-gray-400 text-base font-medium">
          {{ row.agent?.name || "N/A" }}
        </span>
      </div>
    </template>

    <template #cell-details="{ row }">
      <div class="flex flex-col">
        <span class="font-semibold text-gray-900">
          {{ row?.vehicleType?.name || "N/A" }}
        </span>
        <span class="text-gray-400 font-medium">
          {{
            Array.isArray(row.commodity)
              ? row.commodity.map((c: any) => c.name).join(", ")
              : row.commodity?.name || row.commodity || ""
          }}
        </span>
        <span class="text-gray-400 font-medium">
          {{ row.totalRequest }} - {{ row.unitOfMeasurement }}
        </span>
      </div>
    </template>

    <template #cell-created="{ row }">
      <span class="text-base">
        {{ row.createdAt?.split("T")[0] }}
      </span>
    </template>

    <template #cell-shipper="{ row }">
      <span class="font-medium text-gray-900">
        {{ row.shipper?.name || "N/A" }}
      </span>
    </template>

    <template #cell-carrier="{ row }">
      <div class="flex flex-col">
        <span class="font-semibold text-gray-900">
          {{ row.carrier?.name }}
        </span>
        <span class="text-gray-400 font-medium">{{ row.orderCode }}</span>
      </div>
    </template>

    <template #cell-status="{ row }">
      <Status :variant="row.status" type="wrapped">
        {{ row.status }}
      </Status>
    </template>

    <template #cell-actions="{ row }">
      <Dropdown>
        <template #default="{ close }">
          <DropDownItem
            :icon="icons.eye"
            label="Details"
            @click.stop="
              router.push(`${resolvedBasePath}/${row._id}`);
              close();
            "
          />
          <DropDownItem
            v-if="row.status === 'pending' && isShipper"
            :icon="icons.check"
            label="Approve"
            @click.stop="
              emitAction(row, 'approve');
              close();
            "
          />
          <DropDownItem
            v-if="row.status === 'pending' && isShipper"
            :icon="icons.close"
            label="Cancel"
            @click.stop="
              emitAction(row, 'cancel');
              close();
            "
          />
          <DropDownItem
            v-if="row.status === 'approved' && !isShipper"
            :icon="icons.truck"
            label="Ship"
            @click.stop="
              emitAction(row, 'ship');
              close();
            "
          />
          <DropDownItem
            v-permission="'ORDER:update'"
            :icon="icons.editIcon"
            label="Edit"
            @click.stop="
              emitAction(row, 'edit');
              close();
            "
          />
        </template>
      </Dropdown>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import Table from "@/components/common/Table.vue";
import type { TableColumn } from "@/components/common/Table.vue";
import Status from "@/components/common/Status.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import OrderFilters from "./OrderFilters.vue";
import { icons } from "@/utils/icons";
import { useAuthStore } from "@/store/authStore";
import { usePagination } from "@/composables/usePagination";
import type { ShipmentFilterParams } from "../operation.types";

const router = useRouter();
const emit = defineEmits(["action"]);

const props = defineProps<{
  filters?: any;
  basePath?: string;
}>();

const resolvedBasePath = computed(() => props.basePath || "/operation/orders");

const authStore = useAuthStore();
const isShipper = computed(() => authStore.is_shipper);

const columns = computed(() => {
  const cols: TableColumn[] = [
    { key: "order", label: "Order", field: "route" },
    { key: "details", label: "Details", field: "vehicleType" },
    { key: "created", label: "Created", field: "createdAt" },
  ];

  if (!isShipper.value) {
    cols.push({ key: "shipper", label: "Shipper", field: "shipper" });
  }

  cols.push(
    { key: "carrier", label: "Carrier", field: "carrier" },
    { key: "status", label: "Status", field: "status" },
    { key: "actions", label: "Actions", field: "", cellAlign: "right" },
  );

  return cols;
});

const activeFilters = ref<ShipmentFilterParams>({});

const { response, refetch } = usePagination({
  queryKey: ["order-list", isShipper.value],
  id: "order-list",
  url: isShipper.value ? "/order/shipper" : "/order",
  params: (state: any) => {
    return {
      orderCode: state.search || "",
      ...props.filters,
      ...activeFilters.value,
      q: undefined,
    };
  },
});

const emitAction = (row: any, action: string) => {
  emit("action", { row, action });
};

const handleFilterChange = (newFilters: ShipmentFilterParams) => {
  activeFilters.value = { ...newFilters };
};

defineExpose({ refetch });
</script>
