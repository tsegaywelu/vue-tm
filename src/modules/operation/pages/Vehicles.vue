<template>
  <Teleport to="#page-actions" defer>
    <Button
      variant="outline"
      size="md"
      @click="() => $router.push({ path: '/vehicles/metrics' })"
    >
      Vehicle Metrics
    </Button>
    <Button v-permission="'VEHICLE:create'" variant="primary" size="md" @click="handleRegisterVehicle">
      Register Vehicle
    </Button>
  </Teleport>
  <VehicleTable ref="tableRef" @action="handleAction" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import DashboardPage from "@/components/common/DashboardPage.vue";
import Button from "@/components/common/Button.vue";
import VehicleTable from "../components/VehicleTable.vue";
import { icons } from "@/utils/icons";
import { openModal } from "@customizer/modal-x";

const router = useRouter();
const tableRef = ref();

const handleRegisterVehicle = () => {
  router.push("/vehicles/add");
};

const handleAction = async ({ row, action }: { row: any; action: string }) => {
  if (action === "view") {
    router.push(`/vehicles/${row._id}`);
  } else if (action === "edit") {
    router.push(`/vehicles/edit/${row._id}`);
  } else if (action === "edit-status") {
    const res = await openModal("EditVehicleStatusModal", { vehicle: row });
    if (res) {
      tableRef.value?.refetch();
    }
  } else if (action === "track") {
    openModal("VehicleMapModal", {
      vehicleId: row._id,
      plateNumber: row.plateNumber,
    });
  }
};
</script>
