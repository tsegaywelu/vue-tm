<template>
  <!-- Tab 1: New Infraction button -->
  <Teleport v-if="activeTab === 'infractions'" to="#page-actions" defer>
    <div class="hidden sm:flex">
      <Button
        v-permission="'INFRACTION:create'"
        size="md"
        variant="primary"
        @click="handleOpenAddModal"
      >
        New Infraction
      </Button>
    </div>
  </Teleport>

  <div class="flex flex-col gap-6">
    <!-- Tab 1: Infractions List -->
    <div v-if="activeTab === 'infractions'">
      <!-- FAB -->
      <button
        v-permission="'INFRACTION:create'"
        class="fixed bottom-6 right-6 sm:hidden z-50 w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        @click="handleOpenAddModal"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <Table
        :columns="columns"
        :rows="response"
        @row_click="navigateToDetails"
        :hide_on_sm_screen="['shipment', 'createdAt']"
        :on_sm_screen_column_span="{ driverData: 2, totalFine: 1, status: 2, actions: 2 }"
      >
        <template #cell-createdAt="{ row }">
          <span class="font-bold text-grey-900">{{
            dateFormatter(row.createdAt)
          }}</span>
        </template>
        <template #cell-driverData="{ row }">
          <span class="text-grey-600">{{
            row.driverData?.name || row.driverData?.firstName || "-"
          }}</span>
        </template>
        <template #cell-shipment="{ row }">
          <span class="text-grey-600">{{
            row.shipment?.shipmentCode || "-"
          }}</span>
        </template>
        <template #cell-totalFine="{ row }">
          <span class="font-bold text-grey-900">{{
            currencyFormatter(row.totalFine || 0)
          }}</span>
        </template>
        <template #cell-status="{ row }">
          <Status
            :variant="row.status || 'pending'"
            :label="row.status || 'Pending'"
          />
        </template>
        <template #cell-actions="{ row }">
          <div @click.stop class="flex justify-center">
            <Dropdown>
              <template #default="{ close }">
                <DropDownItem
                  label="View Details"
                  @click="close(); navigateToDetails(row);"
                />
                <DropDownItem
                  v-if="row.status === 'approved'"
                  v-permission="'INFRACTION:pay'"
                  label="Mark as Paid"
                  @click="close(); handleAction(row, 'mark-paid');"
                />
                <DropDownItem
                  v-if="row.status !== 'paid' && row.status !== 'rejected'"
                  v-permission="'INFRACTION:update'"
                  label="Edit"
                  @click="close(); handleEdit(row);"
                />
                <DropDownItem
                  v-if="row.status === 'pending'"
                  v-permission="'INFRACTION:approve'"
                  label="Approve"
                  @click="close(); handleAction(row, 'approve');"
                />
                <DropDownItem
                  v-if="row.status === 'pending'"
                  v-permission="'INFRACTION:reject'"
                  label="Reject"
                  @click="close(); handleAction(row, 'reject');"
                />
              </template>
            </Dropdown>
          </div>
        </template>
      </Table>
    </div>

    <!-- Tab 2: Infraction Types Management -->
    <div v-if="activeTab === 'types'" class="flex flex-col gap-6">
      <div
        ref="formContainer"
        class="bg-grey-25 rounded-3xl p-4 md:p-6 border border-grey-100 mt-2"
      >
        <div
          class="flex items-center justify-between mb-4 cursor-pointer sm:cursor-default"
          @click="formOpen = !formOpen"
        >
          <h3 class="text-lg font-bold text-grey-900">
            {{ selectedType ? "Edit Infraction Type" : "Add Infraction Type" }}
          </h3>
          <span class="sm:hidden size-9 flex items-center justify-center rounded-xl bg-white border border-grey-100 text-grey-500 shrink-0">
            <svg class="size-5 transition-transform duration-200" :class="{ 'rotate-180': formOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>
        <div :class="!formOpen ? 'hidden sm:block' : ''">
          <Form
            id="add-infraction-type"
            @submit="handleTypeSubmit"
            :values="typeInitialValues"
          >
            <template #default="{ form }">
              <div class="flex flex-col md:flex-row gap-4 md:items-end">
                <div class="flex-1">
                  <Input
                    name="name"
                    label="Type Name"
                    placeholder="e.g. Over Speeding"
                  />
                </div>
                <div class="grid grid-cols-2 md:flex gap-2 *:min-h-[52px] md:*:min-h-0 *:text-base md:*:text-sm *:rounded-2xl md:*:rounded-xl">
                  <Button size="md" variant="outline" @click="resetTypeForm(form)">
                    Reset
                  </Button>
                  <SubmitButton>
                    {{ selectedType ? "Update" : "Create" }}
                  </SubmitButton>
                </div>
              </div>
            </template>
          </Form>
        </div>
      </div>

      <div class="md:rounded-3xl md:p-6 md:border md:border-grey-100 bg-white">
        <Table
          :columns="typeColumns"
          :rows="typesResponse"
          :loading="typesLoading"
          :hide_on_sm_screen="['createdAt']"
          :on_sm_screen_column_span="{ name: 2, actions: 2 }"
        >
          <template #cell-name="{ row }">
            <span class="font-bold text-grey-900">{{ row.name }}</span>
          </template>
          <template #cell-description="{ row }">
            <span class="text-grey-600">{{ row.description || "-" }}</span>
          </template>
          <template #cell-createdAt="{ row }">
            <span class="text-grey-600">{{
              dateFormatter(row.createdAt)
            }}</span>
          </template>
          <template #cell-actions="{ row }">
            <Button
              class="mx-auto px-4!"
              size="sm"
              variant="outline"
              @click="handleTypeEdit(row)"
            >
              Edit
            </Button>
          </template>
        </Table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import Form from "@/components/form/Form.vue";
import Input from "@/components/form/Input.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/common/Button.vue";
import { usePagination } from "@/composables/usePagination";
import { openModal } from "@customizer/modal-x";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import Table, { type TableColumn } from "@/components/common/Table.vue";
import Status from "@/components/common/Status.vue";
import { currencyFormatter, dateFormatter } from "@/utils/utils";
import {
  fetch_infraction_by_id,
  update_infraction_status,
  add_infraction_type,
  update_infraction_type,
} from "../api/infraction.api";
import { useToastStore } from "@/store/toastStore";
import { useMutation } from "@tanstack/vue-query";

const router = useRouter();
const route = useRoute();
const toast = useToastStore();

const activeTab = computed(() => (route.query.tab as string) || "infractions");

const switchTab = (tabValue: string) => {
  router.replace({ query: { ...route.query, tab: tabValue } });
};

// Infractions Pagination
const { response, refetch } = usePagination({
  id: "infractions-list",
  url: "/infraction",
  params: (state) => ({
    q: state.search || "",
  }),
});

const columns: TableColumn<any>[] = [
  { key: "driverData", label: "Driver", field: "" },
  { key: "shipment", label: "Shipment Code", field: "" },
  { key: "totalFine", label: "Total Fine", field: "totalFine" },
  { key: "createdAt", label: "Creation Date", field: "createdAt" },
  { key: "status", label: "Status", field: "status" },
  { key: "actions", label: "Actions", field: "" },
];

const handleOpenAddModal = async () => {
  const success = await openModal("AddInfractionModal");
  if (success) {
    refetch();
  }
};

const handleEdit = async (row: any) => {
  const res = await fetch_infraction_by_id(row._id);
  const infraction = res?.data ?? row;
  const success = await openModal("AddInfractionModal", { infraction });
  if (success) {
    refetch();
  }
};

const handleAction = async (row: any, action: string) => {
  if (action === "approve") {
    const confirm = await openModal("ConfirmationModal", {
      title: "Approve Infraction",
      message: "Are you sure you want to approve this infraction report?",
      confirmLabel: "Approve",
      confirmText: "Approve",
    });
    if (!confirm) return;

    try {
      const res: any = await update_infraction_status(row._id, action);
      if (res.success || res.status === 200 || res.status === 201) {
        toast.success(`Infraction approved successfully`);
        refetch();
      } else {
        toast.error(res.error || `Failed to approve infraction`);
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.description || `Failed to approve infraction`,
      );
    }
  } else if (action === "reject") {
    const success = await openModal("RejectInfractionModal", {
      infractionId: row._id,
    });
    if (success) {
      refetch();
    }
  } else if (action === "mark-paid") {
    const success = await openModal("MarkAsPaidModal", {
      infractionId: row._id,
    });
    if (success) {
      refetch();
    }
  }
};

const navigateToDetails = (row: any) => {
  router.push(`/infractions/${row._id}`);
};

// Infraction Types Management
const formContainer = ref<HTMLElement | null>(null);
const formOpen = ref(false);
const selectedType = ref<any>(null);
const typeInitialValues = ref({ name: "" });

const {
  response: typesResponse,
  refetch: refetchTypes,
  isLoading: typesLoading,
} = usePagination({
  id: "infraction-types-list",
  url: "/infraction-type",
  params: (state) => ({
    q: state.search || "",
  }),
});

const typeColumns: TableColumn<any>[] = [
  { key: "name", label: "Type Name", field: "name" },
  { key: "createdAt", label: "Created At", field: "createdAt" },
  { key: "actions", label: "Action", field: "", cellAlign: "right" },
];

const createTypeMutation = useMutation({
  mutationFn: (values: any) => add_infraction_type(values),
});

const updateTypeMutation = useMutation({
  mutationFn: ({ id, data }: { id: string; data: any }) =>
    update_infraction_type(id, data),
});

const handleTypeEdit = (row: any) => {
  selectedType.value = row;
  typeInitialValues.value = { name: row.name || "" };
  formOpen.value = true;
  formContainer.value?.scrollIntoView({ behavior: "smooth" });
};

const resetTypeForm = (form: any) => {
  selectedType.value = null;
  typeInitialValues.value = { name: "" };
  form.reset();
};

const handleTypeSubmit = async (values: any) => {
  if (selectedType.value) {
    const res = await updateTypeMutation.mutateAsync({
      id: selectedType.value._id,
      data: values,
    });
    if (res.success || res.status === 200 || res.status === 201) {
      toast.success("Infraction Type updated successfully");
      refetchTypes();
      selectedType.value = null;
      typeInitialValues.value = { name: "" };
    } else {
      toast.error(res.error || "Failed to update infraction type");
    }
  } else {
    const res = await createTypeMutation.mutateAsync(values);
    if (res.success || res.status === 200 || res.status === 201) {
      toast.success("Infraction Type created successfully");
      refetchTypes();
      typeInitialValues.value = { name: "" };
    } else {
      toast.error(res.error || "Failed to create infraction type");
    }
  }
};
</script>
