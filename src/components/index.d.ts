import type { RowData } from "@tanstack/vue-table";

declare module "@tanstack/vue-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    cellAlign?: "left" | "center" | "right";
    headerAlign?: "left" | "center" | "right";
    headerClass?: string;
    cellClass?: string;
    originalColumn: any;
  }
}
