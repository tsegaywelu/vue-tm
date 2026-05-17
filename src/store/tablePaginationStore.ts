import { defineStore } from "pinia";
import { ref } from "vue";

export interface SortingState {
  id: string;
  desc: boolean;
}

export type TableState = {
  pending: boolean;
  page: number;
  limit: number;
  totalPages: number;
  search: string;
  sorting: SortingState[];
  isDirty: boolean;
};

const initial_state: TableState = {
  pending: false,
  page: 1,
  limit: 10,
  totalPages: 1,
  search: "",
  sorting: [],
  isDirty: false,
};

export const useTablePaginationStore = defineStore("tablePagination", () => {
  const tables = ref<Record<string, TableState>>({});
  const tableParams = ref<Record<string, Record<string, any>>>({});
  const tableLabels = ref<
    Record<string, Record<string, Record<string, string>>>
  >({});

  function addTable(id: string, state?: Partial<TableState>) {
    if (tables.value[id]) return;
    tables.value[id] = { ...initial_state, ...state };
  }

  function removeTable(id: string) {
    delete tables.value[id];
  }

  function setPage(id: string, page: number) {
    if (tables.value[id]) tables.value[id].page = page;
  }

  function setLimit(id: string, limit: number) {
    if (tables.value[id]) {
      tables.value[id].limit = limit;
      tables.value[id].page = 1;
    }
  }

  function setSearch(id: string, search: string) {
    if (tables.value[id]) {
      tables.value[id].search = search;
      tables.value[id].page = 1;
    }
  }

  function setSorting(id: string, sorting: any[]) {
    if (tables.value[id]) {
      tables.value[id].sorting = sorting;
      tables.value[id].page = 1;
    }
  }

  function setTotalPages(id: string, total: number) {
    if (tables.value[id]) tables.value[id].totalPages = total;
  }

  function setPending(id: string, pending: boolean) {
    if (tables.value[id]) tables.value[id].pending = pending;
  }

  function setIsDirty(id: string, is_dirty: boolean) {
    if (tables.value[id]) tables.value[id].isDirty = is_dirty;
  }

  function setParams(id: string, params: Record<string, any>) {
    tableParams.value[id] = params;
  }

  function setLabels(
    id: string,
    labels: Record<string, Record<string, string>>,
  ) {
    tableLabels.value[id] = labels;
  }

  function reset(id: string, state?: Partial<TableState>) {
    if (tables.value[id]) {
      tables.value[id] = { ...initial_state, ...state };
    }
  }

  return {
    tables,
    tableParams,
    tableLabels,
    addTable,
    removeTable,
    setPage,
    setLimit,
    setSearch,
    setSorting,
    setTotalPages,
    setPending,
    setIsDirty,
    setParams,
    setLabels,
    reset,
  };
});
