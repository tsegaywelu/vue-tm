type T = { createdAt: string, id: number };

type CellSlots<T> = {
  [K in keyof T as `cell-${string & K}`]?: (props: {
    value: T[K];
  }) => any;
};

type CustomCellSlots<T> = {
  [K in `cell-${string}`]?: (props: {
    value: any;
  }) => any;
};

type Slots = CellSlots<T> & CustomCellSlots<T>;

declare function useSlot(slotName: 'cell-createdAt', props: Parameters<NonNullable<Slots['cell-createdAt']>>[0]): void;

// Simulate template usage:
const test1: NonNullable<Slots['cell-createdAt']> = (props) => {
    let val: string = props.value; // what is val?
    // @ts-expect-error
    let val2: number = props.value; 
};
