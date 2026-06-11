import {
  watch,
  ref,
  computed,
  onMounted,
  nextTick,
  type Ref,
  isRef,
  provide,
  type ComputedRef,
} from "vue";
import { useRoute, useRouter } from "vue-router";
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
  totalResults: ComputedRef<number>;
  fullResponse: ComputedRef<any>;
  refetch: () => void;
}

interface UsePaginationOptions {
  id?: string;
  url: string;
  limit?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  autofetch?: boolean;
  params?: Record<string, any> | Ref<any> | ((state: TableState) => any);
  resetOn?: (Ref<any> | (() => any))[];
  queryKey?: string[];
  api?: ApiService;
  withAuth?: boolean;
  method?: "GET" | "POST" | "PUT" | "PATCH";
  config?: Record<string, any> | Ref<any> | ((state: TableState) => any);
  paginate?: boolean;
  searchKey?: string | Ref<string>;
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
  is_pending = false,
) {
  const store = useTablePaginationStore();

  const default_state: Partial<TableState> = {
    pending: is_pending,
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
    setTotalResults: (total: number) => store.setTotalResults(id, total),
    setPending: (pending: boolean) => store.setPending(id, pending),
    setIsDirty: (is_dirty: boolean) => store.setIsDirty(id, is_dirty),
    setParams: (p: Record<string, any>) => store.setParams(id, p),
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
  method = "GET",
  config,
  paginate = true,
  searchKey = "q",
}: UsePaginationOptions): TablePaginationContext<T> {
  const id = prop_id || query_key_base[0] || url;

  const store = useTablePaginationStore();

  const {
    state,
    setPage,
    setLimit,
    setSearch,
    setSorting,
    setTotalPages,
    setTotalResults,
    setPending,
    setIsDirty,
    setParams,
    reset,
  } = useTablePagination(id, sort_by, sort_direction, per_page, autofetch);

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

  // ── URL sync (page / limit / search only) ───────────────────────────────────
  const route  = useRoute();
  const router = useRouter();

  const URL_PAGE   = `${id}_page`;
  const URL_LIMIT  = `${id}_limit`;
  const URL_SEARCH = `${id}_q`;

  // Restore page / limit / search from URL on first load
  // (Pinia already preserves these across navigation, but URL acts as a
  //  fallback for hard refreshes and shareable links)
  const urlPage   = parseInt(route.query[URL_PAGE]   as string);
  const urlLimit  = parseInt(route.query[URL_LIMIT]  as string);
  const urlSearch = (route.query[URL_SEARCH] as string) ?? "";

  if (!isNaN(urlPage)  && urlPage  > 0 && urlPage  !== state.value.page)  setPage(urlPage);
  if (!isNaN(urlLimit) && urlLimit > 0 && urlLimit !== state.value.limit) setLimit(urlLimit);
  if (urlSearch && urlSearch !== state.value.search) {
    setSearch(urlSearch);
    debounced_search.value = urlSearch;
  }
  // ────────────────────────────────────────────────────────────────────────────

  // Watch for reset triggers
  watch(
    resetOn,
    () => {
      if (state.value.page !== 1) setPage(1);
      if (state.value.search !== "") setSearch("");
    },
    { deep: true },
  );

  const resolved_config = computed(() => {
    if (typeof config === "function") {
      const stateProxy = { ...state.value, search: debounced_search.value };
      return config(stateProxy);
    }
    return isRef(config) ? config.value : config;
  });

  const resolved_params = computed(() => {
    if (typeof params === "function") {
      const stateProxy = {
        ...state.value,
        search: debounced_search.value,
      };
      return params(stateProxy);
    }
    return isRef(params) ? params.value : params;
  });

  // Push page/limit/search to URL (back-button + shareable links)
  watch(
    [() => state.value.page, () => state.value.limit, debounced_search],
    () => {
      router.replace({
        query: {
          ...route.query,
          [URL_PAGE]:   state.value.page  !== 1        ? String(state.value.page)  : undefined,
          [URL_LIMIT]:  state.value.limit !== per_page  ? String(state.value.limit) : undefined,
          [URL_SEARCH]: debounced_search.value          || undefined,
        },
      });
    },
    { flush: "post" },
  );

  // ── Post-mount guard + param persistence ────────────────────────────────────
  // Problem: callers mutate their reactive filter state synchronously right
  // after usePagination returns (e.g. ShipmentTable line 269 sets
  // activeFilters.value.searchField). That change triggers resolved_params,
  // which—without a guard—would overwrite saved params and reset page to 1.
  //
  // Vue watch callbacks flush as microtasks BEFORE onMounted fires, so
  // post_mount is still false when those init-time callbacks run.
  let post_mount = false;
  // nextTick alone is a microtask — it resolves BEFORE any setTimeout(0)
  // macrotasks (including Form.vue's `setTimeout(() => emit("change"), 0)`).
  // Wrapping in another setTimeout ensures post_mount flips AFTER those emits.
  onMounted(() => {
    // Sync Pinia-persisted values back to URL when the URL has lost them
    // (happens when the user navigated away and the browser replaced the URL).
    // Without this, a hard-refresh after navigation-back loses the search.
    nextTick(() => {
      const needsSync =
        (debounced_search.value && !route.query[URL_SEARCH]) ||
        (state.value.page !== 1 && !route.query[URL_PAGE]) ||
        (state.value.limit !== per_page && !route.query[URL_LIMIT]);

      if (needsSync) {
        router.replace({
          query: {
            ...route.query,
            [URL_PAGE]:
              state.value.page !== 1 ? String(state.value.page) : undefined,
            [URL_LIMIT]:
              state.value.limit !== per_page
                ? String(state.value.limit)
                : undefined,
            [URL_SEARCH]: debounced_search.value || undefined,
          },
        });
      }

      setTimeout(() => { post_mount = true; }, 0);
    });
  });

  // effective_params drives the query. On navigation-back it uses the Pinia-
  // saved params so the TanStack Query cache key matches the previous visit
  // and the cached data is served instantly instead of triggering a new fetch.
  const had_saved_params = !!store.tableParams[id];
  const effective_params = computed(() =>
    store.tableParams[id] ?? resolved_params.value
  );

  // Seed Pinia on first visit so the next remount finds saved params.
  if (!had_saved_params) {
    setParams(resolved_params.value ?? {});
  }

  // Save live params to Pinia after initialization. The post_mount guard
  // prevents init-time reactive noise from overwriting the saved state.
  watch(resolved_params, (p) => {
    if (post_mount) setParams(p ?? {});
  }, { deep: true });

  // Reset to page 1 when effective params change — but only post-mount so
  // navigation-back never resets the preserved page number.
  let prevParamsStr = JSON.stringify(effective_params.value);
  watch(
    effective_params,
    (newVal) => {
      const currentStr = JSON.stringify(newVal);
      if (!post_mount) { prevParamsStr = currentStr; return; }
      if (currentStr !== prevParamsStr) {
        prevParamsStr = currentStr;
        if (state.value.page !== 1) setPage(1);
      }
    },
    { deep: true },
  );
  // ────────────────────────────────────────────────────────────────────────────

  const queryKey = computed(() => [
    id,
    ...query_key_base,
    url,
    state.value.page,
    state.value.limit,
    debounced_search.value,
    isRef(searchKey) ? searchKey.value : searchKey,
    state.value.sorting,
    effective_params.value,
  ]);

  const { data, isLoading, isFetching, error, refetch } = useQuery<
    AsyncResponse<any>
  >({
    queryKey,
    queryFn: async ({ signal }) => {
      const p = effective_params.value;

      const request_params: Record<string, any> = {
        ...(paginate
          ? {
              page: state.value.page,
              limit: state.value.limit,
            }
          : {}),
        [isRef(searchKey) ? searchKey.value : searchKey]:
          debounced_search.value || undefined,
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

      const body = resolved_config.value ?? request_params;

      if (method === "POST") {
        return await caller.post<any>(url, body, { params: resolved_config.value ? request_params : undefined, signal });
      }
      if (method === "PUT") {
        return await caller.put<any>(url, body, { params: resolved_config.value ? request_params : undefined, signal });
      }
      if (method === "PATCH") {
        return await caller.patch<any>(url, body, { params: resolved_config.value ? request_params : undefined, signal });
      }
      return await caller.get<any>(url, { params: request_params, signal });
    },
    enabled: autofetch,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  // Synchronize state with query results
  watch(
    data,
    (res) => {
      const raw: any = res?.data;
      if (raw) {
        const res_data = raw.result || raw.data || raw;
        const items = Array.isArray(res_data)
          ? res_data
          : res_data?.items && Array.isArray(res_data.items)
            ? res_data.items
            : res_data?.results && Array.isArray(res_data.results)
              ? res_data.results
              : res_data?.vehicleExpenses &&
                  Array.isArray(res_data.vehicleExpenses)
                ? res_data.vehicleExpenses
                : res_data?.docs && Array.isArray(res_data.docs)
                  ? res_data.docs
                  : res_data?.documents && Array.isArray(res_data.documents)
                    ? res_data.documents
                    : res_data?.shipments && Array.isArray(res_data.shipments)
                      ? res_data.shipments
                      : res_data?.vehicles && Array.isArray(res_data.vehicles)
                        ? res_data.vehicles
                        : [];

        if (items.length > 0 && !state.value.isDirty) {
          setIsDirty(true);
        }

        if (typeof raw.totalResults === "number") {
          setTotalResults(raw.totalResults);
        }

        if (typeof raw.totalPages === "number") {
          setTotalPages(raw.totalPages);
        } else if (typeof raw.totalResults === "number") {
          const computed_pages = Math.max(
            1,
            Math.ceil(raw.totalResults / Math.max(1, state.value.limit)),
          );
          setTotalPages(computed_pages);
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
  watch(
    [isLoading, isFetching],
    () => {
      setPending(isLoading.value || isFetching.value);
    },
    { immediate: true },
  );

  const response = computed<T[]>(() => {
    const raw: any = data.value?.data;
    if (!raw) return [];

    const d = raw.result || raw.data || raw;
    return Array.isArray(d)
      ? d
      : d?.items && Array.isArray(d.items)
        ? d.items
        : d?.results && Array.isArray(d.results)
          ? d.results
          : d?.vehicleExpenses && Array.isArray(d.vehicleExpenses)
            ? d.vehicleExpenses
            : d?.docs && Array.isArray(d.docs)
              ? d.docs
              : d?.documents && Array.isArray(d.documents)
                ? d.documents
                : d?.shipments && Array.isArray(d.shipments)
                  ? d.shipments
                  : d?.vehicles && Array.isArray(d.vehicles)
                    ? d.vehicles
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
    totalResults: computed(() => state.value?.totalResults ?? 0),
    fullResponse: computed(() => data.value?.data || {}),
    refetch: () => refetch(),
  };

  // Provide the context for children (Tables, etc.)
  provide("table-pagination-context", pagination);

  return pagination;
}

/**
 * Returns a computed ref of the last params saved for a given pagination id.
 * Use this in filter components to restore the previously applied filter state.
 */
export function useTableLastParams(id: string): ComputedRef<Record<string, any>> {
  const store = useTablePaginationStore();
  return computed(() => (store.tableParams[id] ?? {}) as Record<string, any>);
}

/**
 * Returns a computed ref of the label map saved for a given pagination id.
 * Structure: { fieldName: { value: label } } — used to pass initial_labels
 * to URL-based SelectInputs when restoring filter state after navigation.
 */
export function useTableLastLabels(id: string): ComputedRef<Record<string, Record<string, string>>> {
  const store = useTablePaginationStore();
  return computed(() => (store.tableLabels[id] ?? {}) as Record<string, Record<string, string>>);
}

/**
 * Returns a computed ref of the non-API UI meta saved for a given pagination id.
 * Use this to persist UI state (e.g. selected search field) that must NOT be
 * sent to the API. Unlike tableParams, this is never overwritten by setParams.
 */
export function useTableLastMeta(id: string): ComputedRef<Record<string, any>> {
  const store = useTablePaginationStore();
  return computed(() => (store.tableMeta[id] ?? {}) as Record<string, any>);
}
