type T = { createdAt: string, id: number };
type TableColumn<T> = any;

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

type Slots = CellSlots<T> & CustomCellSlots<T>;

declare function useSlot<K extends keyof Slots>(slotName: K, props: Parameters<NonNullable<Slots[K]>>[0]): void;

// Simulate template usage:
const test1: NonNullable<Slots['cell-createdAt']> = (props) => {
    const val = props.value; // what is val?
};
