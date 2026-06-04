<template>
  <div
    @click="onClick"
    :class="[
      'grid p-4 bg-surface rounded-3xl items-center transition-colors grid-cols-3',
      $attrs.onClick ? 'cursor-pointer' : '',
      typeof get_row_card_class_name === 'function' ? get_row_card_class_name(row.original) : '',
      class_name,
    ]"
    style="
      background-image: linear-gradient(45deg, #0001, var(--color-surface) 50%, var(--color-surface));
      border: 1px solid var(--color-line);
      box-shadow: 0px 0px 10px 0px #0000001b;
    "
  >
    <!-- Top-right cell -->
    <div
      v-if="topRightCell"
      :class="['flex items-center justify-end h-full pr-2 pb-2']"
      style="grid-column: 3; grid-row: 1"
    >
      <div
        v-if="show_labels_in_card && topRightCell.label"
        class="text-xs text-gray-400 mb-1 block mr-2"
      >
        {{ topRightCell.label }}
      </div>
      <slot
        :name="`cell-${topRightCell.cell.column.id}`"
        v-bind="getSlotData(topRightCell.cell)"
      >
        <span class="text-sm font-medium">{{
          topRightCell.cell.getValue() ?? "N/A"
        }}</span>
      </slot>
    </div>

    <!-- Other grid positions -->
    <div
      v-for="pos in positions"
      :key="pos.cellItem.cell.id"
      :class="[
        'flex flex-col gap-1 min-w-0 px-2 pt-1 pb-2',
        pos.col + pos.span - 1 !== colCount
          ? 'border-r border-gray-50 pr-2'
          : '',
        getAlignmentClass(pos.cellItem.key),
        pos.span === 2 ? 'col-span-2' : pos.span === 3 ? 'col-span-3' : '',
      ]"
      :style="`grid-column: ${pos.col} / span ${pos.span}; grid-row: ${pos.row};`"
    >
      <span
        v-if="show_labels_in_card && pos.cellItem.label"
        class="text-[10px] uppercase text-faint-text font-medium"
      >
        {{ pos.cellItem.label }}
      </span>
      <div
        class="text-sm truncate h-full w-full flex items-center"
        :class="
          getAlignmentClass(pos.cellItem.key) === 'items-center text-center'
            ? 'justify-center'
            : getAlignmentClass(pos.cellItem.key) === 'items-end text-right'
              ? 'justify-end'
              : 'justify-start'
        "
      >
        <slot
          :name="`cell-${pos.cellItem.cell.column.id}`"
          v-bind="getSlotData(pos.cellItem.cell)"
        >
          <span class="font-medium text-base-text">{{
            pos.cellItem.cell.getValue() ?? "N/A"
          }}</span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
import { computed } from "vue";
import type { Row, Cell } from "@tanstack/vue-table";

const props = defineProps<{
  idx: number;
  row: Row<T>;
  hide_numbers?: boolean;
  alignment?: { [key in keyof T | (string & {})]?: "left" | "center" | "right" };
  col_style?: { [key in keyof T | (string & {})]?: string };
  on_sm_screen_row_alignment?: { [key in keyof T | (string & {})]?: number };
  on_sm_screen_column_span?: { [key in keyof T | (string & {})]?: number };
  hide_on_sm_screen?: (keyof T | (string & {}))[];
  show_labels_in_card?: boolean;
  top_right_cell_key?: string;
  get_row_card_class_name?: (row: T) => string;
  class_name?: string;
  action_cell?: string;
}>();

const emit = defineEmits<{
  (e: "click"): void;
}>();

const onClick = () => emit("click");

const getSlotData = (cell: Cell<T, any>) => {
  return {
    row: props.row.original,
    column: cell.column.columnDef.meta?.originalColumn,
    value: cell.getValue(),
  };
};

const getAlignmentClass = (key: string) => {
  const align = props.alignment?.[key] || "left";
  const styles = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  };
  return styles[align] || styles.left;
};

// Logic replication of ResponsiveRow.tsx cells sorting algorithm
const colCount = 3;

const calculatedData = computed(() => {
  const visibleReactCells = props.row.getVisibleCells();

  // To avoid `_index` throwing off our alignment since react didn't push index into visibleCells internally the same way.
  const cells = visibleReactCells.filter((c) => c.column.id !== "_index");

  const cellData = cells.map((cell) => ({
    cell,
    key: cell.column.id,
    label: cell.column.columnDef.header as string,
  }));

  const hiddenSet = new Set(props.hide_on_sm_screen || []);
  const visibleCells = cellData.filter((c) => !hiddenSet.has(c.key));

  let topRightCell: (typeof cellData)[0] | null = null;
  let remainingCells = [...visibleCells];

  const targetTopRightKey = props.top_right_cell_key || props.action_cell || "actions";
  if (targetTopRightKey) {
    const topRightIdx = remainingCells.findIndex(
      (c) => c.key === targetTopRightKey,
    );
    if (topRightIdx !== -1) {
      topRightCell = remainingCells[topRightIdx];
      remainingCells = remainingCells.filter((_, i) => i !== topRightIdx);
    }
  }

  let swappedCells = [...remainingCells];
  if (
    props.on_sm_screen_row_alignment &&
    Object.keys(props.on_sm_screen_row_alignment).length > 0
  ) {
    const sortedSwaps = Object.entries(props.on_sm_screen_row_alignment)
      .map(([key, pos]) => ({ key, pos }))
      .sort((a, b) => (a.pos as number) - (b.pos as number));

    for (const { key, pos } of sortedSwaps) {
      const sourceIdx = swappedCells.findIndex((c) => c.key === key);
      const targetIdx = (pos as number) - 1;
      if (
        sourceIdx !== -1 &&
        targetIdx >= 0 &&
        targetIdx <= swappedCells.length
      ) {
        const [item] = swappedCells.splice(sourceIdx, 1);
        swappedCells.splice(targetIdx, 0, item);
      }
    }
  }

  let curCol = 1;
  let curRow = 1;
  const occupied = new Set<string>();
  if (topRightCell) occupied.add(`1,${colCount}`);

  const positions: {
    cellItem: (typeof cellData)[0];
    row: number;
    col: number;
    span: number;
  }[] = [];

  for (const cellItem of swappedCells) {
    const span = props.on_sm_screen_column_span?.[cellItem.key] || 1;
    const actualSpan = Math.min(span, colCount);

    while (true) {
      let canFit = true;
      for (let i = 0; i < actualSpan; i++) {
        if (curCol + i > colCount || occupied.has(`${curRow},${curCol + i}`)) {
          canFit = false;
          break;
        }
      }

      if (canFit) {
        positions.push({
          cellItem,
          row: curRow,
          col: curCol,
          span: actualSpan,
        });
        for (let i = 0; i < actualSpan; i++)
          occupied.add(`${curRow},${curCol + i}`);
        curCol += actualSpan;
        if (curCol > colCount) {
          curCol = 1;
          curRow++;
        }
        break;
      } else {
        curCol = 1;
        curRow++;
      }
    }
  }

  const maxRow = curCol === 1 ? curRow - 1 : curRow;

  return { positions, topRightCell, maxRow };
});

const positions = computed(() => calculatedData.value.positions);
const topRightCell = computed(() => calculatedData.value.topRightCell);
const maxRow = computed(() => calculatedData.value.maxRow);
</script>
