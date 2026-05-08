<template>
  <div class="flex flex-col gap-6">
    <!-- Tab 1: Infractions List -->
    <div v-if="activeTab === 'infractions'">
      <Teleport to="#page-actions" defer>
        <Button v-permission="'INFRACTION:create'" size="md" variant="primary" @click="handleOpenAddModal">
          New Infraction
        </Button>
      </Teleport>
      <Table :columns="columns" :rows="response" @row_click="navigateToDetails">
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
          <span class="text-grey-600">{{ row.shipment?.shipmentCode || "-" }}</span>
        </template>
        <template #cell-totalFine="{ row }">
          <span class="font-bold text-grey-900">{{
            currencyFormatter(row.totalFine || 0)
          }}</span>
        </template>
        <template #cell-status="{ row }">
          <Status :variant="row.status || 'pending'" :label="row.status || 'Pending'" />
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
                  v-if="row.status === 'approved'"
                  v-permission="'INFRACTION:pay'"
                  label="Mark as Paid"
                  @click="
                    close();
                    handleAction(row, 'mark-paid');
                  "
                />
                <DropDownItem
                  v-if="row.status !== 'paid' && row.status !== 'rejected'"
                  v-permission="'INFRACTION:update'"
                  label="Edit"
                  @click="
                    close();
                    handleEdit(row);
                  "
                />
                <DropDownItem
                  v-if="row.status === 'pending'"
                  v-permission="'INFRACTION:approve'"
                  label="Approve"
                  @click="
                    close();
                    handleAction(row, 'approve');
                  "
                />
                <DropDownItem
                  v-if="row.status === 'pending'"
                  v-permission="'INFRACTION:reject'"
                  label="Reject"
                  @click="
                    close();
                    handleAction(row, 'reject');
                  "
                />
              </template>
            </Dropdown>
          </div>
        </template>
      </Table>
    </div>

    <!-- Tab 2: Infraction Types Management -->
    <div v-if="activeTab === 'types'" class="flex flex-col gap-6">
      <div ref="formContainer" class="bg-grey-25 rounded-3xl p-6 border border-grey-100">
        <h3 class="text-lg font-bold text-grey-900 mb-4">
          {{ selectedType ? "Edit Infraction Type" : "Add Infraction Type" }}
        </h3>
        <Form
          id="add-infraction-type"
          @submit="handleTypeSubmit"
          :values="typeInitialValues"
        >
          <template #default="{ form }">
            <div class="flex flex-col md:flex-row gap-4 items-end">
              <div class="flex-1">
                <Input
                  name="name"
                  label="Type Name"
                  placeholder="e.g. Over Speeding"
                />
              </div>
              <div class="flex-1">
                <Input
                  name="description"
                  label="Description"
                  placeholder="Type description"
                />
              </div>
              <div class="shrink-0 flex gap-2">
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

      <div class="rounded-3xl p-6 border border-grey-100 bg-white">
        <h3 class="text-lg font-bold text-grey-900 mb-4">Infraction Types List</h3>
        <Table :columns="typeColumns" :rows="typesResponse" :loading="typesLoading">
          <template #cell-name="{ row }">
            <span class="font-bold text-grey-900">{{ row.name }}</span>
          </template>
          <template #cell-description="{ row }">
            <span class="text-grey-600">{{ row.description || "-" }}</span>
          </template>
          <template #cell-createdAt="{ row }">
            <span class="text-grey-600">{{ dateFormatter(row.createdAt) }}</span>
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
import Table from "@/components/common/Table.vue";
import Status from "@/components/common/Status.vue";
import { currencyFormatter, dateFormatter } from "@/utils/utils";
import { update_infraction_status, add_infraction_type, update_infraction_type } from "../api/infraction.api";
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
  const success = await openModal("AddInfractionModal", { infraction: row });
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
      toast.error(err.response?.data?.description || `Failed to approve infraction`);
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
const selectedType = ref<any>(null);
const typeInitialValues = ref({ name: "", description: "" });

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
  { key: "description", label: "Description", field: "description" },
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
  typeInitialValues.value = {
    name: row.name || "",
    description: row.description || "",
  };

  formContainer.value?.scrollIntoView({ behavior: "smooth" });
};

const resetTypeForm = (form: any) => {
  selectedType.value = null;
  typeInitialValues.value = { name: "", description: "" };
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
      typeInitialValues.value = { name: "", description: "" };
    } else {
      toast.error(res.error || "Failed to update infraction type");
    }
  } else {
    const res = await createTypeMutation.mutateAsync(values);
    if (res.success || res.status === 200 || res.status === 201) {
      toast.success("Infraction Type created successfully");
      refetchTypes();
      typeInitialValues.value = { name: "", description: "" };
    } else {
      toast.error(res.error || "Failed to create infraction type");
    }
  }
};
</script>
