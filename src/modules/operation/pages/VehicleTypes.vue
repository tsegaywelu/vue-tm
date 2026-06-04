<template>
  <div class="flex flex-col gap-6">
    <div
      ref="formContainer"
      class="bg-grey-25 rounded-3xl p-4 md:p-6 border border-grey-100 mt-2"
    >
      <div
        class="flex items-center justify-between mb-4 cursor-pointer sm:cursor-default"
        @click="formOpen = !formOpen"
      >
        <h3 class="text-lg font-bold text-grey-900">
          {{ selectedType ? "Edit Vehicle Type" : "Add Vehicle Type" }}
        </h3>
        <span
          class="sm:hidden size-9 flex items-center justify-center rounded-xl bg-white border border-grey-100 text-grey-500 shrink-0"
        >
          <svg
            class="size-5 transition-transform duration-200"
            :class="{ 'rotate-180': formOpen }"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>
      <div :class="!formOpen ? 'hidden sm:block' : ''">
        <Form
          id="add-vehicle-type"
          @submit="handleSubmit"
          :values="initialValues"
        >
          <template #default="{ form }">
            <div class="flex flex-col md:flex-row gap-4 md:items-end">
              <div class="flex-1">
                <Input name="name" label="Type Name" placeholder="e.g. FSR" />
              </div>
              <div class="flex-1">
                <Input
                  name="description"
                  label="Description"
                  placeholder="Short description"
                />
              </div>
              <div
                class="grid grid-cols-2 md:flex gap-2 *:min-h-[52px] md:*:min-h-0 *:text-base md:*:text-sm *:rounded-2xl md:*:rounded-xl"
              >
                <Button size="md" variant="outline" @click="resetForm(form)">
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

    <div class="rounded-3xl p-6 border border-grey-100 bg-surface">
            <h3 class="text-lg font-bold text-grey-900 mb-4">Vehicle Types List</h3>
      <Table
        :columns="columns"
        :rows="response"
        :hide_on_sm_screen="['createdAt']"
        :on_sm_screen_column_span="{ name: 2, description: 2, actions: 2 }"
      >
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
import { ref } from "vue";
import Form from "@/components/form/Form.vue";
import Input from "@/components/form/Input.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/common/Button.vue";
import { usePagination } from "@/composables/usePagination";
import { useMutation } from "@tanstack/vue-query";
import { useToastStore } from "@/store/toastStore";
import { add_vehicle_type, update_vehicle_type } from "../api/operation.api";
import { dateFormatter } from "@/utils/utils";
import Table, { type TableColumn } from "@/components/common/Table.vue";

const selectedType = ref<any>(null);
const initialValues = ref({ name: "", description: "" });
const formOpen = ref(false);

const { response, refetch, isLoading } = usePagination({
  id: "vehicle-types-list",
  url: "/vehicle-type",
});

const columns: TableColumn<any>[] = [
  { key: "name", label: "Type Name", field: "name" },
  { key: "description", label: "Description", field: "description" },
  { key: "createdAt", label: "Created At", field: "createdAt" },
  { key: "actions", label: "Action", field: "", cellAlign: "right" },
];

const toast = useToastStore();

const createMutation = useMutation({
  mutationFn: (values: any) => add_vehicle_type(values),
});

const updateMutation = useMutation({
  mutationFn: ({ id, data }: { id: string; data: any }) =>
    update_vehicle_type(id, data),
});

const formContainer = ref<HTMLElement | null>(null);

const handleEdit = (row: any) => {
  selectedType.value = row;
  initialValues.value = {
    name: row.name || "",
    description: row.description || "",
  };
  formOpen.value = true;
  formContainer.value?.scrollIntoView({ behavior: "smooth" });
};

const resetForm = (form: any) => {
  selectedType.value = null;
  initialValues.value = { name: "", description: "" };
  form.reset();
};

const handleSubmit = async (values: any) => {
  if (selectedType.value) {
    const res = await updateMutation.mutateAsync({
      id: selectedType.value._id,
      data: values,
    });
    if (res.success) {
      toast.success("Vehicle Type updated successfully");
      refetch();
      selectedType.value = null;
      initialValues.value = { name: "", description: "" };
    } else {
      toast.error(res.error || "Failed to update vehicle type");
    }
  } else {
    const res = await createMutation.mutateAsync(values);
    if (res.success) {
      toast.success("Vehicle Type created successfully");
      refetch();
      initialValues.value = { name: "", description: "" };
    } else {
      toast.error(res.error || "Failed to create vehicle type");
    }
  }
};
</script>
