type T = any;
type TableColumn<T> = any;
type MySlots = {
  [K in `cell-${string}`]: (props: {
    row: T;
    value: any;
    column: TableColumn<T>;
  }) => any;
  [K in `header-${string}`]: (props: { header: any }) => any;
  "search-prefix"?: () => any;
  "extra-actions"?: () => any;
  tabs?: () => any;
};
