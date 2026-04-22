<template>
  <div
    class="flex flex-col w-full overflow-hidden flex-1"
    :class="$attrs.class"
  >
    <!-- Header Area: Search, Title and Actions -->
    <div
      v-if="!hide_search || tabs"
      class="px-1 flex justify-between items-center min-h-[88px]"
    >
      <div
        v-if="!hide_search"
        class="w-[800px] md:max-w-1/3 input-focus rounded-[36px] flex items-center gap-2.5 border pl-2 pr-4 border-gray-100 overflow-hidden"
      >
        <slot name="search-prefix"></slot>
        <div
          class="text-gray-500 *:size-4 flex justify-center items-center ml-2"
          v-html="icons.search"
        ></div>
        <input
          :value="local_search"
          @input="onSearchInput"
          :placeholder="search_placeholder"
          class="focus:shadow-none h-14 w-full outline-none text-base bg-transparent"
          type="text"
        />
      </div>

      <div class="flex items-center gap-3 w-full justify-end">
        <div
          v-if="!hide_actions"
          class="flex-1 flex gap-3 items-center justify-end"
        >
          <Button
            size="md"
            variant="outline"
            class="min-w-auto! px-4 gap-2 text-black border border-gray-100"
          >
            <div
              class="flex justify-center items-center *:size-4"
              v-html="icons.filter"
            ></div>
            <span class="text-sm font-medium">Filter</span>
          </Button>
        </div>
        <div>
          <slot name="extra-actions" />
        </div>
      </div>
    </div>

    <slot name="tabs" />

    <!-- Desktop Table View -->
    <div class="w-full overflow-x-auto hidden xl:flex flex-col flex-1 min-h-0">
      <table
        v-if="isLoading || rows.length > 0"
        class="default-table text-sm table-auto w-full py-2.5 border-separate border-spacing-0"
        :class="table_class_name"
      >
        <thead>
          <tr
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
            class="h-16 text-black/70 font-semibold text-sm"
          >
            <th
              v-if="!hide_numbers"
              class="w-20 bg-grey-25 rounded-l-2xl text-center"
            >
              #
            </th>
            <th
              v-for="(header, idx) in headerGroup.headers"
              :key="header.id"
              @click="handleSort(header)"
              :class="[
                'bg-grey-25 transition-colors',
                hide_numbers && idx === 0 ? 'rounded-l-2xl' : '',
                idx === headerGroup.headers.length - 1 ? 'rounded-r-2xl' : '',
                header.column.columnDef.meta?.headerClass,
                col_style?.[header.column.id],
                header.column.getCanSort() ? 'cursor-pointer select-none' : '',
              ]"
            >
              <div
                :class="[
                  'flex items-center h-full gap-2.5 px-4',
                  getAlignmentClass(
                    header.column.id,
                    header.column.columnDef.meta?.headerAlign,
                    'head',
                  ),
                ]"
              >
                <slot :name="`header-${header.column.id}`" :header="header">
                  <span>{{ header.column.columnDef.header }}</span>
                </slot>
                <span v-if="show_sort_indicators && header.column.getCanSort()">
                  <div
                    v-if="
                      props.sort_key ===
                      (header.column.columnDef.meta?.originalColumn.sort_key ||
                        header.column.id)
                    "
                    :class="[
                      'transition-transform *:size-6 size-6 flex items-center justify-center',
                      props.sort_order === 'asc' ? 'rotate-180' : 'rotate-0',
                    ]"
                    v-html="icons.longArrow"
                  ></div>
                </span>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          <template v-if="isLoading">
            <tr v-for="n in loadingRowCount" :key="n">
              <td
                v-if="!hide_numbers"
                class="h-[88px] border-b border-gray-100"
              >
                <div
                  class="h-4 animate-pulse bg-gray-100 rounded-full w-[90%] mx-auto"
                ></div>
              </td>
              <td
                v-for="col in tanstackColumns"
                :key="col.id"
                class="h-[88px] border-b border-gray-100"
                :class="col_style?.[col.id]"
              >
                <div
                  class="h-4 animate-pulse bg-gray-100 rounded-full w-[90%] mx-auto"
                ></div>
              </td>
            </tr>
          </template>

          <template v-else>
            <template
              v-for="(row, idx) in table.getRowModel().rows"
              :key="getRowKeyInternal(row.original)"
            >
              <tr
                @click="handleRowClick(row.original)"
                :class="[
                  'text-center h-[88px] transition-colors',
                  clickable_rows ? 'cursor-pointer' : '',
                  getProcessedRowClass(row.original),
                ]"
              >
                <td
                  v-if="!hide_numbers"
                  class="border-b border-gray-100 text-gray-500 w-16"
                >
                  {{ (currentPage - 1) * itemsPerPage + idx + 1 }}
                </td>
                <td
                  v-for="cell in row
                    .getVisibleCells()
                    .filter((c) => c.column.id !== '_index')"
                  :key="cell.id"
                  :class="[
                    'border-b border-gray-100 px-4 text-black',
                    cell.column.columnDef.meta?.cellClass,
                    col_style?.[cell.column.id],
                  ]"
                >
                  <div
                    :class="[
                      'flex items-center h-full gap-2.5',
                      getAlignmentClass(
                        cell.column.id,
                        cell.column.columnDef.meta?.cellAlign,
                        'row',
                      ),
                    ]"
                  >
                    <slot
                      :name="`cell-${cell.column.id}`"
                      :row="row.original"
                      :column="cell.column.columnDef.meta?.originalColumn"
                      :value="cell.getValue()"
                    >
                      <span class="text-gray-900">{{
                        cell.getValue() ?? "N/A"
                      }}</span>
                    </slot>
                  </div>
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>

      <!-- Desktop Empty State -->
      <div
        v-if="!isLoading && rows.length === 0"
        class="flex-1 flex items-center justify-center py-4"
      >
        <EmptyData :title="empty_text" />
      </div>
    </div>

    <!-- Mobile Card View -->
    <div class="xl:hidden w-full px-1">
      <div
        v-if="isLoading"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mt-4"
      >
        <div
          v-for="n in loadingRowCount"
          :key="n"
          class="grid gap-3 p-4 bg-white rounded-xl border border-greybg-grey-25 shadow-[0px_0px_24px_0px_#0000000A] grid-cols-2"
        >
          <div
            v-for="c in tanstackColumns"
            :key="c.id"
            class="flex flex-col gap-1"
          >
            <div class="h-3 w-12 animate-pulse rounded-full bg-gray-100"></div>
            <div
              class="h-4 w-full animate-pulse rounded-full bg-gray-100"
            ></div>
          </div>
        </div>
      </div>
      <div
        v-else-if="rows.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mt-4"
      >
        <ResponsiveRow
          v-for="(row, idx) in table.getRowModel().rows"
          :key="getRowKeyInternal(row.original)"
          :idx="idx"
          :row="row"
          :hide_numbers="hide_numbers"
          :alignment="row_alignment"
          :col_style="col_style"
          :on_sm_screen_row_alignment="on_sm_screen_row_alignment"
          :on_sm_screen_column_span="on_sm_screen_column_span"
          :hide_on_sm_screen="hide_on_sm_screen"
          :show_labels_in_card="show_labels_in_card"
          :top_right_cell_key="top_right_cell_key"
          :get_row_card_class_name="get_row_card_class_name"
          :action_cell="action_cell"
          @click="handleRowClick(row.original)"
        >
          <!-- Pass all slots down -->
          <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps" />
          </template>
        </ResponsiveRow>
      </div>
      <div v-else class="py-8 grid place-items-center">
        <EmptyData :title="empty_text" />
      </div>
    </div>

    <!-- Pagination Context -->
    <div
      v-if="show_pagination"
      class="flex justify-between gap-2 items-center p-4"
      :class="[
        isLoading || rows.length === 0 ? 'pointer-events-none opacity-50' : '',
      ]"
    >
      <TablePerPageSelect
        :page_size="itemsPerPage"
        @update:page_size="onItemsPerPageInput"
      />
      <PaginationNumbers
        :total_pages="totalPages > 0 ? totalPages : 1"
        :current_page="currentPage"
        @page_change="onPageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
import { ref, computed, watch, inject } from "vue";
import {
  useVueTable,
  getCoreRowModel,
  type ColumnDef,
  type Header,
  type RowData,
} from "@tanstack/vue-table";
import Button from "@/components/common/Button.vue";
import EmptyData from "./EmptyData.vue";
import TablePerPageSelect from "./TablePerPageSelect.vue";
import PaginationNumbers from "./PaginationNumbers.vue";
import ResponsiveRow from "./ResponsiveRow.vue";
import type { TablePaginationContext } from "@/composables/usePagination";

export interface TableColumn<T = any> {
  key?: string;
  field?: keyof T | string | ((row: T) => any);
  label: string;
  sortable?: boolean;
  sort_key?: string;
  cellAlign?: "left" | "center" | "right";
  headerAlign?: "left" | "center" | "right";
  headerClass?: string;
  cellClass?: string;
}

interface GenericProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  row_key?: keyof T | string | ((row: T) => any);
  loading?: boolean | null;
  items_per_page?: number | null;
  loading_rows?: number;
  empty_text?: string;
  show_pagination?: boolean;
  title?: string;
  current_page?: number | null;
  total_pages?: number | null;
  total_results?: number | string | null;
  clickable_rows?: boolean;
  row_class?: string | ((row: T) => string);
  sort_key?: string;
  sort_order?: "asc" | "desc";
  show_sort_indicators?: boolean;
  hide_search?: boolean;
  search_placeholder?: string;
  hide_actions?: boolean;
  hide_numbers?: boolean;
  search_value?: string | null;
  table_class_name?: string;
  tabs?: boolean;

  // Responsive row props
  row_alignment?: Record<string, "left" | "center" | "right">;
  head_alignment?: Record<string, "left" | "center" | "right">;
  col_style?: Record<string, string>;
  on_sm_screen_row_alignment?: Record<string, number>;
  on_sm_screen_column_span?: Record<string, number>;
  hide_on_sm_screen?: string[];
  show_labels_in_card?: boolean;
  top_right_cell_key?: string;
  get_row_card_class_name?: (row: T) => string;
  action_cell?: string;
}

const props = withDefaults(defineProps<GenericProps<T>>(), {
  columns: () => [],
  rows: () => [],
  row_key: "_id" as any,
  loading: null,
  items_per_page: null,
  loading_rows: 0,
  empty_text: "No data available",
  show_pagination: true,
  title: "",
  current_page: null,
  total_pages: null,
  total_results: null,
  clickable_rows: true,
  row_class: "",
  sort_key: "",
  sort_order: "asc",
  show_sort_indicators: true,
  hide_search: false,
  search_placeholder: "Search for...",
  hide_actions: true,
  hide_numbers: false,
  search_value: null,
  table_class_name: "",
  tabs: false,
  show_labels_in_card: true,
  action_cell: "",
});

type CellSlots<T> = {
  [K in keyof T as `cell-${string & K}`]?: (props: {
    row: T;
    value: T[K];
    column: TableColumn<T>;
  }) => any;
};

type CustomCellSlots<T> = {
  [K in `cell-${string}`]?: (props: {
    row: T;
    value: any;
    column: TableColumn<T>;
  }) => any;
};

defineSlots<
  CellSlots<T> &
    CustomCellSlots<T> & {
      [K in `header-${string}`]?: (props: { header: any }) => any;
    } & {
      "search-prefix"?: () => any;
      "extra-actions"?: () => any;
      tabs?: () => any;
      [key: string]: any;
    }
>();

const emit = defineEmits<{
  (e: "items-per-page-input", limit: number): void;
  (e: "page-change", page: number): void;
  (e: "row_click", row: T): void;
  (e: "page_change", page: number): void;
  (e: "items_per_page_input", limit: number): void;
  (
    e: "sort_change",
    payload: { key: string; order: string; column: TableColumn<T> },
  ): void;
  (e: "update:search_value", value: string): void;
  (e: "search", value: string): void;
}>();

// --- Injected Context ---
const paginationContext = inject<TablePaginationContext<T>>(
  "table-pagination-context",
  null as any,
);

const isLoading = computed(() => {
  if (props.loading != null) return props.loading;
  return paginationContext?.state?.value?.pending ?? false;
});

const currentPage = computed(() => {
  if (props.current_page != null) return props.current_page;
  return paginationContext?.state?.value?.page ?? 1;
});

const totalPages = computed(() => {
  if (props.total_pages != null) return props.total_pages;
  return paginationContext?.state?.value?.totalPages ?? 0;
});

const itemsPerPage = computed(() => {
  if (props.items_per_page != null) return props.items_per_page;
  return paginationContext?.state?.value?.limit ?? 10;
});

const searchValue = computed(() => {
  if (props.search_value != null) return props.search_value;
  return paginationContext?.state?.value?.search ?? "";
});

const local_search = ref(searchValue.value);

const icons = {
  search: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`,
  filter: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg>`,
  longArrow: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z"/></svg>`,
};

const alignmentStyles = {
  left: "justify-start text-left",
  center: "justify-center text-center",
  right: "justify-end text-right",
};

const getAlignmentClass = (
  columnId: string,
  metaAlign: "left" | "center" | "right" | undefined,
  type: "head" | "row",
) => {
  const alignment =
    type === "head"
      ? props.head_alignment?.[columnId]
      : props.row_alignment?.[columnId];
  if (alignment && (alignmentStyles as any)[alignment])
    return (alignmentStyles as any)[alignment];
  return (
    (metaAlign && (alignmentStyles as any)[metaAlign]) ||
    "justify-center text-center"
  );
};

watch(searchValue, (newVal) => {
  local_search.value = newVal;
});

const onSearchInput = (e: Event) => {
  const val = (e.target as HTMLInputElement).value;
  local_search.value = val;
  if (paginationContext) {
    paginationContext.setSearch(val);
  }
  emit("update:search_value", val);
  emit("search", val);
};

const resolveValue = (
  row: T,
  field: keyof T | string | ((row: T) => any) | undefined,
) => {
  if (!field) return undefined;
  if (typeof field === "function") return field(row);
  if (typeof field !== "string") return undefined;
  return field.split(".").reduce((acc: any, key: string) => acc?.[key], row);
};

const tanstackColumns = computed(() => {
  return props.columns.map((col) => {
    const id =
      col.key || (typeof col.field === "string" ? col.field : col.label);
    return {
      id,
      accessorFn: (row: T) => resolveValue(row, col.field),
      header: col.label,
      enableSorting: !!col.sortable,
      meta: {
        cellAlign: col.cellAlign,
        headerAlign: col.headerAlign,
        headerClass: col.headerClass,
        cellClass: col.cellClass,
        originalColumn: col,
      },
    } as ColumnDef<T, any> & { id: string };
  });
});

const tableData = computed(() => props.rows);

const table = useVueTable({
  get data() {
    return tableData.value;
  },
  get columns() {
    return tanstackColumns.value;
  },
  getCoreRowModel: getCoreRowModel(),
  manualPagination: true,
  manualSorting: true,
  manualFiltering: true,
});

const loadingRowCount = computed(() =>
  props.loading_rows > 0 ? props.loading_rows : itemsPerPage.value,
);

const getRowKeyInternal = (row: T) => {
  if (typeof props.row_key === "function") return props.row_key(row) as string;
  if (typeof props.row_key === "string" && row)
    return (row as any)[props.row_key];
  return (row as any)?._id || (row as any)?.id;
};

const getProcessedRowClass = (row: T) => {
  let cls =
    typeof props.row_class === "function"
      ? props.row_class(row)
      : props.row_class;
  if (typeof cls === "string") {
    return cls.replace(/hover:bg-\S+/g, "");
  }
  return cls;
};

const handleRowClick = (row: T) => {
  if (!props.clickable_rows) return;
  emit("row_click", row);
};

const handleSort = (header: Header<T, any>) => {
  const meta = header.column.columnDef.meta as
    | { originalColumn: TableColumn<T> }
    | undefined;
  const originalCol = meta?.originalColumn;
  if (!originalCol?.sortable) return;

  const key =
    originalCol.sort_key ||
    originalCol.key ||
    (typeof originalCol.field === "string" ? originalCol.field : "");
  if (!key) return;

  let order = "asc" as "asc" | "desc";
  if (props.sort_key === key) {
    order = props.sort_order === "asc" ? "desc" : "asc";
  }
  if (paginationContext) {
    paginationContext.setSorting([{ id: key, desc: order === "desc" }]);
  }
  emit("sort_change", { key, order, column: originalCol });
};

const onPageChange = (page: number) => {
  if (paginationContext) {
    paginationContext.setPage(page);
  }
  emit("page-change", page);
};

const onItemsPerPageInput = (limit: number) => {
  if (paginationContext) {
    paginationContext.setLimit(limit);
  }
  emit("items-per-page-input", limit);
};
</script>
