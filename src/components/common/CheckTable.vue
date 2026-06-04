<template>
  <Table
    v-bind="tableProps"
    :columns="augmentedColumns"
    :rows="rows"
    :row_class="getRowClass"
    :get_row_card_class_name="getRowCardClassName"
    :top_right_cell_key="topRightCellKey"
    :hide_on_sm_screen="computedHideOnSmScreen"
    show_pagination
    @row_click="handleRowClick"
  >
    <!-- Pass through all slots except the checkbox ones we're handling -->
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>

    <!-- Header Checkbox -->
    <template #header-checkbox>
      <div
        class="flex items-center justify-center cursor-pointer select-none"
        @click.stop="toggleAll"
      >
        <div
          class="size-5 rounded transition-colors flex items-center justify-center"
          :class="[
            allChecked
              ? 'bg-primary border-primary'
              : isIndeterminate
                ? 'bg-primary border-primary'
                : 'bg-white border-grey-300',
            allChecked ? '' : 'border-2',
          ]"
        >
          <div v-if="allChecked" class="w-2.5 h-0.5 bg-white"></div>
          <div
            v-if="isIndeterminate"
            class="rotate-45 w-2.5 h-0.5 bg-white"
          ></div>
        </div>
      </div>
    </template>

    <!-- Row Checkbox -->
    <template #cell-checkbox="{ row }">
      <div
        class="flex items-center justify-center cursor-pointer select-none"
        @click.stop="toggleRow(row)"
      >
        <div
          class="size-5 rounded border-2 transition-colors flex items-center justify-center"
          :class="[
            isChecked(row)
              ? 'bg-primary border-primary'
              : 'bg-white border-gray-400',
          ]"
        >
          <i class="*:size-3.5" v-if="isChecked(row)" v-html="icons.check"></i>
        </div>
      </div>
    </template>
  </Table>
</template>

<script setup lang="ts" generic="T">
import { computed, onMounted, watch } from "vue";
import Table from "./Table.vue";
import type { TableColumn, TableProps } from "./Table.vue";
import { icons } from "@/utils/icons";

interface CheckTableProps<T> extends TableProps<T> {
  // Checkbox specific props
  modelValue?: T[];
  unique_key?: keyof T | (string & {});
  check_column?: "first" | "last" | number;
  canBeSelected?: boolean;
  url?: string;
}

const props = withDefaults(defineProps<CheckTableProps<T>>(), {
  row_key: "_id" as any,
  unique_key: "_id" as any,
  check_column: "first",
  modelValue: () => [],
  canBeSelected: true,
  clickable_rows: true,
  hide_on_sm_screen: () => [],
  action_cell: "actions",
  show_labels_in_card: true,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: T[]): void;
  (e: "selection-change", value: T[]): void;
  (e: "row_click", row: T): void;
}>();

onMounted(() => {
  if (!props.url) return;
  const stored = sessionStorage.getItem(props.url);
  if (!stored) return;
  try {
    const parsed = JSON.parse(stored) as T[];
    emit("update:modelValue", parsed);
    emit("selection-change", parsed);
  } catch {}
});

watch(
  () => props.modelValue,
  (val) => {
    if (props.url) {
      sessionStorage.setItem(props.url, JSON.stringify(val));
    }
  },
  { deep: true },
);

// Filter out checkbox specific props to pass to base Table
const tableProps = computed(() => {
  const {
    modelValue,
    unique_key,
    check_column,
    columns,
    row_class,
    get_row_card_class_name,
    top_right_cell_key,
    hide_on_sm_screen,
    canBeSelected,
    url,
    ...rest
  } = props;
  return rest;
});

const getUniqueValue = (row: T): any => {
  if (typeof props.unique_key === "string") {
    return (row as any)[props.unique_key];
  }
  return row[props.unique_key as keyof T];
};

const isChecked = (row: T) => {
  const val = getUniqueValue(row);
  return props.modelValue.some((item) => getUniqueValue(item) === val);
};

const allChecked = computed(() => {
  if (props.rows.length === 0) return false;
  return props.rows.every((row) => isChecked(row));
});

const isIndeterminate = computed(() => {
  const checkedCount = props.rows.filter((row) => isChecked(row)).length;
  return checkedCount > 0 && checkedCount < props.rows.length;
});

const toggleRow = (row: T) => {
  const newValue = [...props.modelValue];
  const val = getUniqueValue(row);
  const index = newValue.findIndex((item) => getUniqueValue(item) === val);

  if (index > -1) {
    newValue.splice(index, 1);
  } else {
    newValue.push(row);
  }

  emit("update:modelValue", newValue);
  emit("selection-change", newValue);
};

const toggleAll = () => {
  let newValue = [...props.modelValue];

  if (allChecked.value) {
    // Uncheck all rows that are currently in the rows list
    const currentKeys = new Set(props.rows.map(getUniqueValue));
    newValue = newValue.filter(
      (item) => !currentKeys.has(getUniqueValue(item)),
    );
  } else {
    // Check all rows that are currently in the rows list
    const currentKeys = new Set(newValue.map(getUniqueValue));
    props.rows.forEach((row) => {
      if (!currentKeys.has(getUniqueValue(row))) {
        newValue.push(row);
      }
    });
  }

  emit("update:modelValue", newValue);
  emit("selection-change", newValue);
};

const augmentedColumns = computed(() => {
  if (!props.canBeSelected) return props.columns;

  const checkboxCol: TableColumn<T> = {
    key: "checkbox",
    label: "",
    sortable: false,
    cellAlign: "center",
    headerAlign: "center",
    cellClass: "!w-12 !px-0",
    headerClass: "!w-12 !px-0",
  };

  const cols = [...props.columns];
  if (props.check_column === "first") {
    cols.unshift(checkboxCol);
  } else if (props.check_column === "last") {
    cols.push(checkboxCol);
  } else if (typeof props.check_column === "number") {
    cols.splice(props.check_column, 0, checkboxCol);
  }

  return cols;
});

const getRowClass = (row: T) => {
  const baseClass =
    typeof props.row_class === "function"
      ? props.row_class(row)
      : props.row_class || "";
  return isChecked(row) ? `${baseClass} bg-primary/5` : baseClass;
};

const getRowCardClassName = (row: T) => {
  return isChecked(row) ? "bg-primary/5!" : "";
};

const topRightCellKey = computed(() => {
  return props.canBeSelected ? "checkbox" : props.action_cell;
});

const computedHideOnSmScreen = computed(() => {
  const hidden = [...props.hide_on_sm_screen];
  if (!props.canBeSelected) {
    hidden.push("checkbox");
  } else if (props.action_cell) {
    hidden.push(props.action_cell);
  }
  return hidden;
});

const handleRowClick = (row: T) => {
  emit("row_click", row);
};
</script>
