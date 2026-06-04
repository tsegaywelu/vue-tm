<template>
  <div class="flex flex-col gap-6">
    <div
      ref="formContainer"
      class="bg-grey-25 rounded-3xl p-6 border border-grey-100"
    >
      <h3 class="text-lg font-bold text-grey-900 mb-4">
        {{ selectedGroup ? "Edit Vehicle Group" : "Add Vehicle Group" }}
      </h3>
      <Form
        id="add-vehicle-group"
        @submit="handleSubmit"
        :values="initialValues"
      >
        <template #default="{ form }">
          <div class="flex flex-col md:flex-row gap-4 items-end">
            <div class="flex-1">
              <Input
                name="name"
                label="Group Name"
                placeholder="e.g. Heavy Duty"
              />
            </div>
            <div class="flex-1">
              <Input
                name="description"
                label="Description"
                placeholder="Group description"
              />
            </div>
            <div class="shrink-0 flex gap-2">
              <Button size="md" variant="outline" @click="resetForm(form)">
                Reset
              </Button>
              <SubmitButton>
                {{ selectedGroup ? "Update" : "Create" }}
              </SubmitButton>
            </div>
          </div>
        </template>
      </Form>
    </div>

    <div class="rounded-3xl p-6 border border-grey-100 bg-surface">
      <h3 class="text-lg font-bold text-grey-900 mb-4">Vehicle Groups List</h3>
      <Table :columns="columns" :rows="response" :loading="isLoading">
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
import { add_vehicle_group, update_vehicle_group } from "../api/operation.api";
import { dateFormatter } from "@/utils/utils";
import Table from "@/components/common/Table.vue";

const formContainer = ref<HTMLElement | null>(null);
const selectedGroup = ref<any>(null);
const initialValues = ref({ name: "", description: "" });

const { response, refetch, isLoading } = usePagination({
  id: "vehicle-groups-list",
  url: "/group",
});

const columns: TableColumn<any>[] = [
  { key: "name", label: "Group Name", field: "name" },
  { key: "description", label: "Description", field: "description" },
  { key: "createdAt", label: "Created At", field: "createdAt" },
  { key: "actions", label: "Action", field: "", cellAlign: "right" },
];

const toast = useToastStore();

const createMutation = useMutation({
  mutationFn: (values: any) => add_vehicle_group(values),
});

const updateMutation = useMutation({
  mutationFn: ({ id, data }: { id: string; data: any }) =>
    update_vehicle_group(id, data),
});

const handleEdit = (row: any) => {
  selectedGroup.value = row;
  initialValues.value = {
    name: row.name || "",
    description: row.description || "",
  };

  formContainer.value?.scrollIntoView({ behavior: "smooth" });
};

const resetForm = (form: any) => {
  selectedGroup.value = null;
  initialValues.value = { name: "", description: "" };
  form.reset();
};

const handleSubmit = async (values: any) => {
  if (selectedGroup.value) {
    const res = await updateMutation.mutateAsync({
      id: selectedGroup.value._id,
      data: values,
    });
    if (res.success) {
      toast.success("Vehicle Group updated successfully");
      refetch();
      selectedGroup.value = null;
      initialValues.value = { name: "", description: "" };
    } else {
      toast.error(res.error || "Failed to update vehicle group");
    }
  } else {
    const res = await createMutation.mutateAsync(values);
    if (res.success) {
      toast.success("Vehicle Group created successfully");
      refetch();
      initialValues.value = { name: "", description: "" };
    } else {
      toast.error(res.error || "Failed to create vehicle group");
    }
  }
};
</script>
