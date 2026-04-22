import {
  watch,
  ref,
  computed,
  type Ref,
  isRef,
  provide,
  type ComputedRef,
} from "vue";
import { useQuery } from "@tanstack/vue-query";
import {
  useTablePaginationStore,
  type TableState,
  type SortingState,
} from "@/store/tablePaginationStore";
import ApiService from "@/api/ApiService";
import type { AsyncResponse } from "@/api/types";

const rootApi = new ApiService();

export interface TablePaginationContext<T = any> {
  id: string;
  state: ComputedRef<TableState>;
  response: ComputedRef<T[]>;
  serverError: ComputedRef<string | null>;
  isLoading: Ref<boolean>;
  isFetching: Ref<boolean>;
  reset: () => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (search: string) => void;
  debouncedSearch: ComputedRef<string>;
  setSorting: (sorting: SortingState[]) => void;
  setTotalPages: (total_pages: number) => void;
  refetch: () => void;
}

interface UsePaginationOptions {
  id?: string;
  url: string;
  limit?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  autofetch?: boolean;
  params?: Record<string, any> | Ref<any>;
  resetOn?: (Ref<any> | (() => any))[];
  queryKey?: string[];
  api?: ApiService;
  withAuth?: boolean;
}

function useDebounceFn<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
) {
  let timeout: ReturnType<typeof setTimeout>;
  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

export function useTablePagination(
  id: string,
  default_sort?: string,
  default_direction: "asc" | "desc" = "desc",
  per_page = 10,
) {
  const store = useTablePaginationStore();

  const default_state: Partial<TableState> = {
    limit: per_page,
    sorting: default_sort
      ? [{ id: default_sort, desc: default_direction === "desc" }]
      : [],
  };

  store.addTable(id, default_state);

  // Use a proxy or computed properties to keep reactivity to the store
  const state = computed(() => store.tables[id]);

  return {
    state,
    setPage: (page: number) => store.setPage(id, page),
    setLimit: (limit: number) => store.setLimit(id, limit),
    setSearch: (search: string) => store.setSearch(id, search),
    setSorting: (sorting: SortingState[]) => store.setSorting(id, sorting),
    setTotalPages: (total_pages: number) =>
      store.setTotalPages(id, total_pages),
    setPending: (pending: boolean) => store.setPending(id, pending),
    setIsDirty: (is_dirty: boolean) => store.setIsDirty(id, is_dirty),
    reset: () => store.reset(id, default_state),
  };
}

export function usePagination<T = any>({
  id: prop_id,
  url,
  limit: per_page = 10,
  sortBy: sort_by,
  sortDirection: sort_direction = "desc",
  autofetch = true,
  params = {},
  resetOn = [],
  queryKey: query_key_base = [],
  api: apiInstance = rootApi,
  withAuth = true,
}: UsePaginationOptions): TablePaginationContext<T> {
  const id = prop_id || query_key_base[0] || url;

  const {
    state,
    setPage,
    setLimit,
    setSearch,
    setSorting,
    setTotalPages,
    setPending,
    setIsDirty,
    reset,
  } = useTablePagination(id, sort_by, sort_direction, per_page);

  const debounced_search = ref(state.value.search);
  const update_debounced_search = useDebounceFn((val: string) => {
    debounced_search.value = val;
  }, 500);

  watch(
    () => state.value.search,
    (new_val) => {
      update_debounced_search(new_val);
    },
  );

  // Watch for reset triggers
  watch(
    resetOn,
    () => {
      if (state.value.page !== 1) setPage(1);
      if (state.value.search !== "") setSearch("");
    },
    { deep: true },
  );

  const resolved_params = computed(() =>
    isRef(params) ? params.value : params,
  );

  const queryKey = computed(() => [
    id, // Ensure the query ID is part of the key for easy invalidation
    ...query_key_base,
    url,
    state.value.page,
    state.value.limit,
    debounced_search.value,
    state.value.sorting,
    resolved_params.value,
  ]);

  const { data, isLoading, isFetching, error, refetch } = useQuery<
    AsyncResponse<any>
  >({
    queryKey,
    queryFn: async ({ signal }) => {
      const p = resolved_params.value;

      const request_params: Record<string, any> = {
        page: state.value.page,
        limit: state.value.limit,
        q: debounced_search.value || undefined,
        sortBy: state.value.sorting?.[0]?.id,
        sortOrder: state.value.sorting?.length
          ? state.value.sorting[0].desc
            ? "desc"
            : "asc"
          : undefined,
      };

      if (p) {
        Object.entries(p).forEach(([key, value]) => {
          // Allow explicit undefined to override default params (like 'q')
          if (value === undefined) {
            request_params[key] = undefined;
          } else if (value !== "" && value !== null) {
            request_params[key] = value;
          }
        });
      }

      const caller = withAuth
        ? apiInstance.addAuthenticationHeader()
        : apiInstance;
      return await caller.get<any>(url, { params: request_params, signal });
    },
    enabled: autofetch,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  // Synchronize state with query results
  watch(
    data,
    (res) => {
      if (res?.data) {
        const res_data = res.data.data || res.data.result || res.data;
        const items = Array.isArray(res_data)
          ? res_data
          : res_data?.items && Array.isArray(res_data.items)
            ? res_data.items
            : res_data?.results && Array.isArray(res_data.results)
              ? res_data.results
              : [];

        if (items.length > 0 && !state.value.isDirty) {
          setIsDirty(true);
        }

        if (res_data && typeof res_data.totalPages === "number") {
          setTotalPages(res_data.totalPages);
        } else if (Array.isArray(res_data)) {
          const computed_pages = Math.max(
            1,
            Math.ceil(res_data.length / Math.max(1, state.value.limit)),
          );
          setTotalPages(computed_pages);
        }
      }
    },
    { immediate: true },
  );

  // Sync pending state
  watch([isLoading, isFetching], () => {
    setPending(isLoading.value || isFetching.value);
  });

  const response = computed<T[]>(() => {
    const raw = data.value?.data;
    if (!raw) return [];

    const d = raw.data || raw.result || raw;
    return Array.isArray(d)
      ? d
      : d?.items && Array.isArray(d.items)
        ? d.items
        : d?.results && Array.isArray(d.results)
          ? d.results
          : [];
  });

  const server_error = computed(() => {
    if (error.value) return (error.value as any).message;
    if (data.value && !data.value.success && data.value.error) {
      return data.value.error;
    }
    return null;
  });

  const pagination: TablePaginationContext<T> = {
    id,
    state,
    response,
    serverError: server_error,
    isLoading,
    isFetching,
    reset,
    setPage,
    setLimit,
    setSearch,
    debouncedSearch: computed(() => debounced_search.value),
    setSorting,
    setTotalPages,
    refetch: () => refetch(),
  };

  // Provide the context for children (Tables, etc.)
  provide("table-pagination-context", pagination);

  return pagination;
}
