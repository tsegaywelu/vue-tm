<template>
  <div class="flex flex-col gap-6">
    <!-- Add/Edit Form -->
    <div
      ref="formContainer"
      class="bg-grey-25 rounded-3xl p-4 md:p-6 border border-grey-100 mt-2"
    >
      <div
        class="flex items-center justify-between mb-4 cursor-pointer sm:cursor-default"
        @click="formOpen = !formOpen"
      >
        <h3 class="text-lg font-bold text-grey-900">
          {{ selectedItem ? `Edit ${activeTabLabel}` : `Add ${activeTabLabel}` }}
        </h3>
        <span class="sm:hidden size-9 flex items-center justify-center rounded-xl bg-white border border-grey-100 text-grey-500 shrink-0">
          <svg class="size-5 transition-transform duration-200" :class="{ 'rotate-180': formOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>
      <div :class="!formOpen ? 'hidden sm:block' : ''">
      <Form
        :id="`form-${activeTab}`"
        @submit="handleSubmit"
        :values="initialValues"
      >
        <template #default="{ form }">
          <div class="flex flex-col md:flex-row gap-4 md:items-end">
            <div class="flex-1">
              <Input
                name="name"
                :label="`${activeTabLabel} Name`"
                :placeholder="`e.g. ${activeTabPlaceholder}`"
              />
            </div>
            <div class="grid grid-cols-2 md:flex gap-2 *:min-h-[52px] md:*:min-h-0 *:text-base md:*:text-sm *:rounded-2xl md:*:rounded-xl">
              <Button size="md" variant="outline" @click="resetForm(form)">
                Reset
              </Button>
              <SubmitButton>
                {{ selectedItem ? "Update" : "Create" }}
              </SubmitButton>
            </div>
          </div>
        </template>
      </Form>
      </div>
    </div>

    <!-- List Table -->
    <div class="md:rounded-3xl md:p-6 md:border md:border-grey-100 bg-white">
      <Table :columns="columns" :rows="response" :hide_on_sm_screen="['createdAt']" :on_sm_screen_column_span="{ name: 2, actions: 2 }">
        <template #cell-name="{ row }">
          <span class="font-bold text-grey-900">{{ row.name }}</span>
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
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import Form from "@/components/form/Form.vue";
import Input from "@/components/form/Input.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/common/Button.vue";
import { usePagination } from "@/composables/usePagination";
import { useMutation } from "@tanstack/vue-query";
import { useToastStore } from "@/store/toastStore";
import { dateFormatter } from "@/utils/utils";
import ApiService from "@/api/ApiService";
import Table from "@/components/common/Table.vue";

const route = useRoute();

const tabs = [
  { label: "Marker", value: "marker" },
  { label: "Vehicle Model", value: "vehicle-model" },
  { label: "Type", value: "type" },
];

const activeTab = computed(() => (route.query.tab as string) || "marker");

const activeTabLabel = computed(() => {
  const t = tabs.find((x) => x.value === activeTab.value);
  return t ? t.label : "Marker";
});

const activeTabPlaceholder = computed(() => {
  if (activeTab.value === "marker") return "Volvo";
  if (activeTab.value === "vehicle-model") return "FH16";
  return "Heavy Duty";
});

const formContainer = ref<HTMLElement | null>(null);
const selectedItem = ref<any>(null);
const formOpen = ref(false);
const initialValues = ref({ name: "" });

const markerPagination = usePagination({
  id: "vehicle-standards-marker-list",
  url: "/maker",
});

const modelPagination = usePagination({
  id: "vehicle-standards-model-list",
  url: "/vehicle-model",
});

const typePagination = usePagination({
  id: "vehicle-standards-type-list",
  url: "/type",
});

const pagination = computed(() => {
  if (activeTab.value === "marker") return markerPagination;
  if (activeTab.value === "vehicle-model") return modelPagination;
  return typePagination;
});

const response = computed(() => pagination.value.response.value);
const isLoading = computed(() => pagination.value.isLoading.value);
const refetch = () => pagination.value.refetch();

const columns: TableColumn<any>[] = [
  { key: "name", label: "Name", field: "name" },
  { key: "createdAt", label: "Created At", field: "createdAt" },
  { key: "actions", label: "Action", field: "", cellAlign: "right" },
];

const toast = useToastStore();
const api = new ApiService();

const createMutation = useMutation({
  mutationFn: ({ url, data }: { url: string; data: any }) =>
    api.addAuthenticationHeader().post(url, data),
});

const updateMutation = useMutation({
  mutationFn: ({ url, id, data }: { url: string; id: string; data: any }) =>
    api.addAuthenticationHeader().patch(`${url}/${id}`, data),
});

watch(activeTab, () => {
  selectedItem.value = null;
  initialValues.value = { name: "" };
});

const handleEdit = (row: any) => {
  selectedItem.value = row;
  formOpen.value = true;
  initialValues.value = {
    name: row.name || "",
  };
  formContainer.value?.scrollIntoView({ behavior: "smooth" });
};

const resetForm = (form: any) => {
  selectedItem.value = null;
  initialValues.value = { name: "" };
  form.reset();
};

const handleSubmit = async (values: any) => {
  const url =
    activeTab.value === "marker"
      ? "/maker"
      : activeTab.value === "vehicle-model"
        ? "/vehicle-model"
        : "/type";

  if (selectedItem.value) {
    const res = await updateMutation.mutateAsync({
      url,
      id: selectedItem.value._id,
      data: values,
    });
    if (res.success || res.status === 200 || res.status === 201) {
      toast.success(`${activeTabLabel.value} updated successfully`);
      refetch();
      selectedItem.value = null;
      initialValues.value = { name: "" };
    } else {
      toast.error(
        res.error || `Failed to update ${activeTabLabel.value.toLowerCase()}`,
      );
    }
  } else {
    const res = await createMutation.mutateAsync({ url, data: values });
    if (res.success || res.status === 200 || res.status === 201) {
      toast.success(`${activeTabLabel.value} created successfully`);
      refetch();
      initialValues.value = { name: "" };
    } else {
      toast.error(
        res.error || `Failed to create ${activeTabLabel.value.toLowerCase()}`,
      );
    }
  }
};
</script>
