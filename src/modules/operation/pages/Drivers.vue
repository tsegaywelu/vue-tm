<template>
  <Teleport to="#page-actions" defer>
    <div class="hidden sm:flex">
      <Button
        v-permission="'DRIVER:create'"
        size="md"
        variant="primary"
        @click="addDriver"
      >
        New Driver
      </Button>
    </div>
  </Teleport>

  <!-- FAB -->
  <button
    v-permission="'DRIVER:create'"
    class="fixed bottom-6 right-6 sm:hidden z-50 w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
    @click="addDriver"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-7 h-7"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2.5"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  </button>

  <div class="flex flex-col gap-4">
    <!-- Drivers Table -->
    <Table
      id="drivers-list"
      :columns="columns"
      :rows="response"
      :loading="isLoading"
      search_placeholder="Search drivers..."
      @row_click="navigateToDetails"
      :hide_on_sm_screen="['employmentInfo', 'licenseTin', 'employmentDates']"
      :on_sm_screen_column_span="{ driverInfo: 2, driverStatus: 2, actions: 2 }"
      :head_alignment="{
        driverInfo: 'left',
        employmentInfo: 'left',
        licenseTin: 'left',
        employmentDates: 'left',
        driverStatus: 'center',
      }"
      :row_alignment="{
        driverInfo: 'left',
        employmentInfo: 'left',
        licenseTin: 'left',
        employmentDates: 'left',
        driverStatus: 'center',
      }"
    >
      <template #cell-driverInfo="{ row }">
        <div class="flex items-center space-x-3">
          <div
            v-if="!row.profilePicture"
            class="h-10 w-10 bg-grey-150 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm shrink-0"
          >
            {{ row.firstName?.charAt(0)?.toUpperCase() }}
          </div>
          <img
            v-else
            :src="getProfilePictureURL(row.profilePicture)"
            alt="Driver photo"
            class="h-10 w-10 rounded-full object-cover border border-grey-200 shrink-0"
          />
          <div class="flex flex-col">
            <span class="font-bold text-grey-900">
              {{ row.firstName }} {{ row.middleName }} {{ row.lastName }}
            </span>
            <span class="text-xs text-grey-500">
              {{ row.phoneNumber || "N/A" }}
            </span>
          </div>
        </div>
      </template>

      <template #cell-employmentInfo="{ row }">
        <div class="flex flex-col">
          <span class="font-bold text-grey-900">
            {{ row.isEmployed ? "Employee" : "Sub Contract" }}
          </span>
          <span class="text-xs text-grey-500">
            {{ row.employeeNumber || "N/A" }}
          </span>
        </div>
      </template>

      <template #cell-licenseTin="{ row }">
        <div class="flex flex-col">
          <span class="font-bold text-grey-900">
            {{ row.driverLicenceNumber || "N/A" }}
          </span>
          <span class="text-xs text-grey-500">
            {{ row.tin || "N/A" }}
          </span>
        </div>
      </template>

      <template #cell-employmentDates="{ row }">
        <div class="flex flex-col">
          <span class="font-bold text-grey-900">
            {{
              row.employmentStartDate
                ? row.employmentStartDate.split("T")[0]
                : "N/A"
            }}
          </span>
          <span class="text-xs text-grey-500">
            {{
              row.employmentEndDate ? row.employmentEndDate.split("T")[0] : "-"
            }}
          </span>
        </div>
      </template>

      <template #cell-driverStatus="{ row }">
        <div @click.stop="openEditStatusModal(row)">
          <Status
            :variant="getStatusVariant(row.driverStatus)"
            :label="formatCategoryType(row.driverStatus)"
            type="wrapped"
            class="cursor-pointer transition-colors hover:opacity-80"
          />
        </div>
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
                v-permission="'DRIVER:change_status'"
                label="Edit Driver Status"
                @click="
                  close();
                  openEditStatusModal(row);
                "
              />
              <DropDownItem
                v-permission="'DRIVER:update'"
                label="Edit Driver"
                @click="
                  close();
                  $router.push(`/drivers/edit/${row._id}`);
                "
              />
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

const router = useRouter();

const selectedSearchField = ref("name");

const searchFieldOptions = [
  { label: "Name", value: "name" },
  { label: "Phone Number", value: "phoneNumber" },
  { label: "TIN", value: "tin" },
];

const paginationParams = computed(() => {
  const p: Record<string, any> = {};
  if (selectedSearchField.value) {
    p.searchField = selectedSearchField.value;
  }
  return p;
});

const { response, refetch, isLoading } = usePagination({
  id: "drivers-list",
  url: "/driver",
  params: (state) => ({
    name: {
      regexAny: state.search,
    },
    q: undefined,
  }),
});

const columns: TableColumn<any>[] = [
  { key: "driverInfo", label: "Driver Info", field: "firstName" },
  { key: "employmentInfo", label: "Employment Info", field: "isEmployed" },
  { key: "licenseTin", label: "License & TIN", field: "driverLicenceNumber" },
  {
    key: "employmentDates",
    label: "Employment Dates",
    field: "employmentStartDate",
  },
  { key: "driverStatus", label: "Driver Status", field: "driverStatus" },
  { key: "actions", label: "Actions", field: "" },
];

const addDriver = async () => {
  router.push("/drivers/add");
};

const openEditStatusModal = async (driver: any) => {
  const res = await openModal("EditDriverStatusModal", { driver });
  if (res) {
    refetch();
  }
};

const navigateToDetails = (row: any) => {
  router.push(`/drivers/${row._id}`);
};

const formatCategoryType = (type: string | undefined) => {
  if (!type) return "N/A";
  const formatted = type
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return formatted;
};

const getStatusVariant = (status: string | undefined) => {
  switch (status) {
    case "ready_to_dispatch":
      return "active";
    case "dispatched":
      return "info";
    case "vehicle_not_assigned":
      return "wrapped";
    case "unavailable":
      return "info";
    case "suspended":
      return "cancelled";
    case "terminated":
    case "fired":
      return "cancelled";
    default:
      return "info";
  }
};

const API_URL = import.meta.env.v_STATIC_PATH;
const getProfilePictureURL = (path: string) => {
  if (path) {
    return `${API_URL}/${path.replace(/\\/g, "/")}`;
  }
  return "";
};

const getDriverInitials = (row: any) => {
  const first = row.firstName?.charAt(0) || "";
  const last = row.lastName?.charAt(0) || row.middleName?.charAt(0) || "";
  return (first + last).toUpperCase() || "D";
};
</script>
