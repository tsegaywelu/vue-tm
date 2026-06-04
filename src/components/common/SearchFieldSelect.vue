<template>
  <Select
    v-model="selected"
    :class="selectClass"
    :options="options"
    label_key="label"
    value_key="value"
    :clearable="false"
  />
</template>

<script setup lang="ts">
/**
 * Reusable search-field selector with navigation-safe persistence.
 *
 * Saves the chosen field to tableMeta (NOT tableParams) so it is never
 * sent to the API and never overwritten by usePagination's setParams.
 *
 * Usage in a parent table component:
 *   const lastMeta = useTableLastMeta("my-table-id");
 *   const selectedField = ref(
 *     lastMeta.value.searchField || "defaultFieldValue"
 *   );
 *
 *   <SearchFieldSelect
 *     v-model="selectedField"
 *     pagination-id="my-table-id"
 *     :options="searchFieldOptions"
 *   />
 */
import { ref, watch } from "vue";
import Select from "@/components/common/Select.vue";
import { useTablePaginationStore } from "@/store/tablePaginationStore";

const props = defineProps<{
  paginationId: string;
  options: { label: string; value: string }[];
  modelValue?: string;
  selectClass?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const store = useTablePaginationStore();

const selected = ref(props.modelValue ?? props.options[0]?.value ?? "");

watch(
  () => props.modelValue,
  (val) => {
    if (val !== undefined && val !== selected.value) selected.value = val;
  },
);

watch(selected, (newField) => {
  emit("update:modelValue", newField);
  store.setMeta(props.paginationId, { searchField: newField });
});
</script>
