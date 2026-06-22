import { reactive } from "vue";

/**
 * Module-level reactive registry that lets a `MobileTableOptions` sheet and a
 * sibling control (e.g. `SelectModeToggle`) coordinate without an ancestor
 * relationship (provide/inject can't reach siblings).
 *
 * - `mounted`     — a MobileTableOptions component is present on the page.
 * - `open`        — its bottom sheet is currently open (the in-sheet teleport
 *                   target only exists while open, since BottomSheet v-if-mounts
 *                   its content).
 * - `hasActions`  — at least one action (e.g. the Select toggle) is registered,
 *                   which flips the sheet to the shipment-style "Options" layout.
 * - `actionsId`   — id of the teleport landing element rendered at the top of the
 *                   sheet's options.
 */
const state = reactive({
  mounted: false,
  open: false,
  hasActions: false,
  actionsId: "mobile-table-options-actions",
});

export function registerMobileTableOptions() {
  state.mounted = true;
  return () => {
    state.mounted = false;
    state.open = false;
  };
}

export function setMobileTableOptionsOpen(open: boolean) {
  state.open = open;
}

export function registerTableAction() {
  state.hasActions = true;
  return () => {
    state.hasActions = false;
  };
}

export function useMobileTableOptions() {
  return state;
}
