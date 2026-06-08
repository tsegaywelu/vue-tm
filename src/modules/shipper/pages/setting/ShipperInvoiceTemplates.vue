<template>
  <div class="flex flex-col h-full">
    <Teleport to="#page-actions" defer>
      <Button
        variant="primary"
        size="md"
        class="flex items-center gap-2"
        @click="router.push('/shipper/setting/invoice-templates/new')"
      >
        <i v-html="icons.plus" />
        New Template 
      </Button>
    </Teleport>

    <div class="flex-1 min-h-0">
      <Table
        id="shipper-invoice-templates-list"
        :columns="columns"
        :rows="response"
        :loading="isLoading"
        search_placeholder="Search templates..."
      >
        <template #cell-productType="{ value }">
          <span class="text-xs px-2 py-0.5 rounded-full font-medium"
            :class="{
              'bg-blue-50 text-blue-700': value === 'IN_BOUND',
              'bg-green-50 text-green-700': value === 'OUT_BOUND',
              'bg-gray-100 text-gray-600': value === 'ALL',
            }">
            {{ { IN_BOUND: 'In Bound', OUT_BOUND: 'Out Bound', ALL: 'All' }[value] ?? value }}
          </span>
        </template>

        <template #cell-updatedAt="{ value }">
          {{ value ? new Date(value).toLocaleDateString() : '-' }}
        </template>

        <template #cell-actions="{ row }">
          <div class="flex items-center gap-1">
            <button
              class="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-primary transition-colors"
              title="Edit"
              @click.stop="router.push(`/shipper/setting/invoice-templates/${row._id}`)"
            >
              <i v-html="icons.edit" />
            </button>
            <button
              class="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
              title="Delete"
              @click.stop="handleDelete(row)"
            >
              <i v-html="icons.trash" />
            </button>
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import Table from "@/components/common/Table.vue";
import Button from "@/components/Button.vue";
import { icons } from "@/utils/icons";
import { useToastStore } from "@/store/toastStore";
import { usePagination } from "@/composables/usePagination";
import { delete_invoice_template } from "@/modules/operation/api/invoice-template.api";
import { openModal } from "@customizer/modal-x";
import type { TableColumn } from "@/components/common/Table.vue";

const router = useRouter();
const toast = useToastStore();

const { response, isLoading, refetch } = usePagination<any>({
  id: "shipper-invoice-templates-list",
  url: "/invoice-template",
  searchKey: "name[regex]",
});

const columns: TableColumn<any>[] = [
  { key: "name", label: "Template Name", field: "name" },
  { key: "productType", label: "Product Type", field: "productType" },
  { key: "updatedAt", label: "Last Updated", field: "updatedAt" },
  { key: "actions", label: "", field: "", cellAlign: "right" },
];

const handleDelete = async (row: any) => {
  const confirmed = await openModal("ConfirmationModal", {
    title: "Delete Template",
    message: `Delete template "${row.name}"? This cannot be undone.`,
    confirmText: "Delete",
    action: "delete",
  });
  if (!confirmed) return;
  const res = await delete_invoice_template(row._id);
  if (res.success) {
    toast.success("Template deleted");
    refetch();
  } else {
    toast.error(res.error || "Failed to delete template");
  }
};
</script>
