<template>
  <div class="flex flex-col gap-6">
    <div
      ref="formContainer"
      class="bg-grey-25 rounded-3xl p-6 border border-grey-100"
    >
      <h3 class="text-lg font-bold text-grey-900 mb-4">
        {{
          selectedType
            ? `Edit Goal for ${selectedType.name}`
            : "Set Vehicle Type Goal"
        }}
      </h3>
      <Form
        id="add-vehicle-type-goal"
        @submit="handleSubmit"
        :values="initialValues"
      >
        <template #default="{ form }">
          <div class="flex flex-col gap-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <Input
                name="targetDistanceKm"
                label="Distance (km)"
                type="number"
                placeholder="e.g. 5000"
              />
              <Input
                name="targetFuelEfficiency"
                label="Fuel Efficiency"
                type="number"
                placeholder="e.g. 10.5"
              />
              <Input
                name="targetShipmentCount"
                label="Shipment Count"
                type="number"
                placeholder="e.g. 20"
              />
              <div class="flex justify-end gap-2">
                <Button size="md" variant="outline" @click="resetForm(form)">
                  Reset
                </Button>
                <SubmitButton>
                  {{ selectedType ? "Update" : "Create" }}
                </SubmitButton>
              </div>
            </div>
          </div>
        </template>
      </Form>
    </div>

    <div class="rounded-3xl p-6 border border-grey-100 bg-white">
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4"
      >
        <h3 class="text-lg font-bold text-grey-900">Vehicle Type Goals List</h3>
        <!-- Filter Area -->
        <Form
          id="goals-filter"
          @change="
            (values) => {
              if (values.year) filterParams.year = values.year;
              if (values.month) filterParams.month = values.month;
            }
          "
          class="flex gap-4 items-end [&_.input-focus]:bg-grey-25"
          :values="{ year: filterParams.year, month: filterParams.month }"
        >
          <div class="w-40">
            <SelectInput
              label="Year"
              name="year"
              :options="yearOptions"
              size="xs"
            />
          </div>
          <div class="w-40">
            <SelectInput
              label="Month"
              name="month"
              :options="monthOptions"
              size="xs"
            />
          </div>
        </Form>
      </div>

      <Table :columns="columns" :rows="response" :loading="isLoading">
        <template #cell-name="{ row }">
          <span class="font-bold text-grey-900">{{ row.name }}</span>
        </template>
        <template #cell-period="{ row }">
          <span class="text-grey-600 font-semibold">{{
            row.month && row.year
              ? `${String(row.month).padStart(2, "0")}/${row.year}`
              : "N/A"
          }}</span>
        </template>
        <template #cell-targetDistanceKm="{ row }">
          <span class="text-grey-600 font-semibold">{{
            row.targetDistanceKm !== null && row.targetDistanceKm !== undefined
              ? row.targetDistanceKm
              : "-"
          }}</span>
        </template>
        <template #cell-targetFuelEfficiency="{ row }">
          <span class="text-grey-600 font-semibold">{{
            row.targetFuelEfficiency !== null &&
            row.targetFuelEfficiency !== undefined
              ? row.targetFuelEfficiency
              : "-"
          }}</span>
        </template>
        <template #cell-targetShipmentCount="{ row }">
          <span class="text-grey-600 font-semibold">{{
            row.targetShipmentCount !== null &&
            row.targetShipmentCount !== undefined
              ? row.targetShipmentCount
              : "-"
          }}</span>
        </template>
        <template #cell-actions="{ row }">
          <Button
            class="mx-auto px-4!"
            size="sm"
            variant="outline"
            @click="handleEdit(row)"
          >
            Edit
          </Button>
        </template>
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Form from "@/components/form/Form.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/common/Button.vue";
import { usePagination } from "@/composables/usePagination";
import { useMutation } from "@tanstack/vue-query";
import { useToastStore } from "@/store/toastStore";
import ApiService from "@/api/ApiService";
import { required } from "@/utils/validations";
import Table from "@/components/common/Table.vue";

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;

const filterParams = ref({
  year: currentYear,
  month: currentMonth,
  page: undefined,
  limit: undefined,
});

const { response, refetch, isLoading } = usePagination({
  id: "vehicle-type-goals-list",
  url: "/vehicle/goals/vehicle-type",
  params: filterParams,
});

const columns: TableColumn<any>[] = [
  { key: "name", label: "Vehicle Type", field: "name" },
  { key: "period", label: "Period", field: "period" },
  {
    key: "targetDistanceKm",
    label: "Distance (km)",
    field: "targetDistanceKm",
  },
  {
    key: "targetFuelEfficiency",
    label: "Fuel Efficiency",
    field: "targetFuelEfficiency",
  },
  {
    key: "targetShipmentCount",
    label: "Shipments",
    field: "targetShipmentCount",
  },
  { key: "actions", label: "Action", field: "", cellAlign: "right" },
];

const selectedType = ref<any>(null);
const initialValues = ref({
  vehicleTypeId: "",
  year: currentYear,
  month: currentMonth,
  targetDistanceKm: "",
  targetFuelEfficiency: "",
  targetShipmentCount: "",
});

const toast = useToastStore();
const api = new ApiService();

const yearOptions = computed(() => {
  const years = [];
  for (let y = currentYear - 2; y <= currentYear + 5; y++) {
    years.push({ label: String(y), value: y });
  }
  return years;
});

const monthOptions = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];

const updateMutation = useMutation({
  mutationFn: ({ id, payload }: { id: string; payload: any }) =>
    api
      .addAuthenticationHeader()
      .patch(`/vehicle/goals/vehicle-type/${id}`, payload),
});

const formContainer = ref<HTMLElement | null>(null);

const handleEdit = (row: any) => {
  selectedType.value = row;
  initialValues.value = {
    vehicleTypeId: row._id || "",
    year: row.year || filterParams.value.year,
    month: row.month || filterParams.value.month,
    targetDistanceKm:
      row.targetDistanceKm !== null && row.targetDistanceKm !== undefined
        ? String(row.targetDistanceKm)
        : "",
    targetFuelEfficiency:
      row.targetFuelEfficiency !== null &&
      row.targetFuelEfficiency !== undefined
        ? String(row.targetFuelEfficiency)
        : "",
    targetShipmentCount:
      row.targetShipmentCount !== null && row.targetShipmentCount !== undefined
        ? String(row.targetShipmentCount)
        : "",
  };

  formContainer.value?.scrollIntoView({ behavior: "smooth" });
};

const resetForm = (form: any) => {
  selectedType.value = null;
  initialValues.value = {
    vehicleTypeId: "",
    year: filterParams.value.year,
    month: filterParams.value.month,
    targetDistanceKm: "",
    targetFuelEfficiency: "",
    targetShipmentCount: "",
  };
  form.reset();
};

const handleSubmit = async (values: any) => {
  if (!values.vehicleTypeId) {
    toast.error("Please select a vehicle type");
    return;
  }

  const payload = {
    year: Number(values.year),
    month: Number(values.month),
    targetDistanceKm:
      values.targetDistanceKm !== "" ? Number(values.targetDistanceKm) : null,
    targetFuelEfficiency:
      values.targetFuelEfficiency !== ""
        ? Number(values.targetFuelEfficiency)
        : null,
    targetShipmentCount:
      values.targetShipmentCount !== ""
        ? Number(values.targetShipmentCount)
        : null,
  };

  const res = await updateMutation.mutateAsync({
    id: values.vehicleTypeId,
    payload,
  });
  if (res.success || res.status === 200 || res.status === 201) {
    toast.success("Goal saved successfully");
    refetch();
    selectedType.value = null;
    initialValues.value = {
      vehicleTypeId: "",
      year: filterParams.value.year,
      month: filterParams.value.month,
      targetDistanceKm: "",
      targetFuelEfficiency: "",
      targetShipmentCount: "",
    };
  } else {
    toast.error(res.error || "Failed to save goal");
  }
};
</script>
