<template>
  <Teleport to="#page-actions" defer>
    <Button variant="primary" size="md" @click="openAddModal">
      Add Contract
    </Button>
  </Teleport>

  <LeasedVehicleTable ref="tableRef" @action="handleAction" />

  <!-- Extend Agreement Modal -->
  <div
    v-if="showExtendModal"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >
    <div
      class="bg-white rounded-3xl p-6 border border-grey-100 max-w-sm w-full flex flex-col gap-4 shadow-xl m-4"
    >
      <h3 class="text-lg font-bold text-grey-900">
        Extend Vehicle Lease Agreement
      </h3>
      <Form
        id="extend-lease-form"
        @submit="submitExtendForm"
        :defaultValues="{ endDate: '' }"
      >
        <template #default>
          <div class="flex flex-col gap-4">
            <Input type="date" name="endDate" label="End Date" />
            <div class="flex justify-end gap-2 mt-2">
              <Button
                size="md"
                variant="outline"
                @click="showExtendModal = false"
                >Cancel</Button
              >
              <SubmitButton>Submit</SubmitButton>
            </div>
          </div>
        </template>
      </Form>
    </div>
  </div>
  c

  <!-- Renew Agreement Modal -->
  <div
    v-if="showRenewModal"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >
    <div
      class="bg-white rounded-3xl p-6 border border-grey-100 max-w-lg w-full flex flex-col gap-4 shadow-xl m-4 overflow-auto max-h-[90vh]"
    >
      <h3 class="text-xl font-bold text-grey-900">
        Renew Vehicle Lease Agreement
      </h3>
      <Form
        id="renew-lease-form"
        @submit="submitRenewForm"
        :defaultValues="renewInitialValues"
      >
        <template #default>
          <div class="flex flex-col gap-4">
            <div class="grid grid-cols-2 gap-4">
              <Input type="date" name="startDate" label="Start Date" />
              <Input type="date" name="endDate" label="End Date" />
            </div>
            <Input type="number" name="amount" label="Amount" />
            <div class="grid grid-cols-2 gap-4">
              <ToggleInput
                name="coversMaintenance"
                label="Covers Maintenance"
              />
              <ToggleInput name="coversAdvance" label="Covers Advance" />
            </div>
            <div class="flex justify-end gap-2 mt-2">
              <Button
                size="md"
                variant="outline"
                @click="showRenewModal = false"
                >Cancel</Button
              >
              <SubmitButton>Submit</SubmitButton>
            </div>
          </div>
        </template>
      </Form>
    </div>
  </div>

  <!-- Terminate Agreement Modal -->
  <div
    v-if="showTerminateModal"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >
    <div
      class="bg-white rounded-3xl p-6 border border-grey-100 max-w-sm w-full flex flex-col gap-4 shadow-xl m-4"
    >
      <h3 class="text-lg font-bold text-grey-900">Confirm Termination</h3>
      <p class="text-grey-600">
        Are you sure you want to terminate this agreement?
      </p>
      <div class="flex justify-end gap-2 mt-2">
        <Button size="md" variant="outline" @click="showTerminateModal = false"
          >No</Button
        >
        <Button size="md" variant="primary" @click="submitTerminate"
          >Yes, Terminate It</Button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useMutation } from "@tanstack/vue-query";
import { openModal } from "@customizer/modal-x";
import Button from "@/components/common/Button.vue";
import Form from "@/components/form/Form.vue";
import Input from "@/components/form/Input.vue";
import ToggleInput from "@/components/form/ToggleInput.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import LeasedVehicleTable from "../components/LeasedVehicleTable.vue";
import { useToastStore } from "@/store/toastStore";
import ApiService from "@/api/ApiService";

const router = useRouter();
const tableRef = ref();
const toast = useToastStore();
const api = new ApiService();

const showExtendModal = ref(false);
const showRenewModal = ref(false);
const showTerminateModal = ref(false);

const selectedLease = ref<any>(null);

const renewInitialValues = computed(() => {
  if (!selectedLease.value)
    return {
      startDate: "",
      endDate: "",
      amount: "",
      coversMaintenance: true,
      coversAdvance: true,
    };
  return {
    startDate: selectedLease.value.startDate
      ? new Date(selectedLease.value.startDate).toISOString().substr(0, 10)
      : "",
    endDate: selectedLease.value.endDate
      ? new Date(selectedLease.value.endDate).toISOString().substr(0, 10)
      : "",
    amount: selectedLease.value.amount || "",
    coversMaintenance:
      selectedLease.value.leaseAgreement?.coversMaintenance ?? true,
    coversAdvance: selectedLease.value.leaseAgreement?.coversAdvance ?? true,
  };
});

const addMutation = useMutation({
  mutationFn: (data: any) =>
    api.addAuthenticationHeader().post("/vehicle-lease-agreement", data),
});

const extendMutation = useMutation({
  mutationFn: ({ id, data }: { id: string; data: any }) =>
    api
      .addAuthenticationHeader()
      .patch(`/vehicle-lease-agreement/${id}/extend`, data),
});

const terminateMutation = useMutation({
  mutationFn: ({ id }: { id: string }) =>
    api
      .addAuthenticationHeader()
      .patch(`/vehicle-lease-agreement/${id}/change-status`, {
        status: "TERMINATED",
      }),
});

const openAddModal = async () => {
  const res = await openModal("AddLeasedVehicleModal");
  if (res) {
    tableRef.value?.refetch();
  }
};

const handleAction = async ({ row, action }: { row: any; action: string }) => {
  selectedLease.value = row;
  if (action === "view" && row.vehicle?._id) {
    router.push(`/vehicles/${row.vehicle._id}`);
  } else if (action === "extend") {
    showExtendModal.value = true;
  } else if (action === "renew") {
    showRenewModal.value = true;
  } else if (action === "terminate") {
    showTerminateModal.value = true;
  }
};

const submitExtendForm = async (values: any) => {
  if (!selectedLease.value) return;
  const res = await extendMutation.mutateAsync({
    id: selectedLease.value._id,
    data: { endDate: values.endDate },
  });
  if (res.success) {
    toast.success("Agreement extended successfully");
    showExtendModal.value = false;
    tableRef.value?.refetch();
  } else {
    toast.error(res.error || "Failed to extend agreement");
  }
};

const submitRenewForm = async (values: any) => {
  if (!selectedLease.value) return;
  const payload = {
    startDate: values.startDate,
    endDate: values.endDate,
    amount: Number(values.amount),
    vehicle: selectedLease.value.vehicle?._id || selectedLease.value.vehicle,
    transporter:
      selectedLease.value.transporter?._id || selectedLease.value.transporter,
    leaseAgreement: {
      coversMaintenance: values.coversMaintenance ?? true,
      coversAdvance: values.coversAdvance ?? true,
    },
  };

  const res = await addMutation.mutateAsync(payload);
  if (res.success) {
    toast.success("Agreement renewed successfully");
    showRenewModal.value = false;
    tableRef.value?.refetch();
  } else {
    toast.error(res.error || "Failed to renew agreement");
  }
};

const submitTerminate = async () => {
  if (!selectedLease.value) return;
  const res = await terminateMutation.mutateAsync({
    id: selectedLease.value._id,
  });
  if (res.success) {
    toast.success("Agreement terminated successfully");
    showTerminateModal.value = false;
    tableRef.value?.refetch();
  } else {
    toast.error(res.error || "Failed to terminate agreement");
  }
};
</script>
