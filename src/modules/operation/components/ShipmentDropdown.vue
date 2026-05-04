<template>
  <Dropdown>
    <template #default="{ close }">
      <DropDownItem
        v-if="shouldShow('view')"
        :icon="icons.eye"
        label="Details"
        @click.stop="
          handleAction(shipment, 'view');
          close();
        "
      />
      <DropDownItem
        v-if="shouldShow('edit')"
        :icon="icons.editIcon"
        label="Edit Shipment"
        @click.stop="
          handleAction(shipment, 'edit');
          close();
        "
      />
      <DropDownItem
        v-if="shouldShow('create_advance')"
        :icon="icons.plusIcon"
        label="Create Advance"
        @click.stop="
          handleAction(shipment, 'create_advance');
          close();
        "
      />
      <DropDownItem
        v-if="shouldShow('update_status')"
        :icon="icons.editIcon"
        label="Update Status"
        @click.stop="
          openStatusModal(shipment);
          close();
        "
      />
      <DropDownItem
        v-if="shouldShow('add_voucher')"
        :icon="icons.plusIcon"
        label="Add Voucher"
        @click.stop="
          openVouchersModal(shipment);
          close();
        "
      />
    </template>
  </Dropdown>
</template>

<script setup lang="ts">
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import { icons } from "@/utils/icons";
import type { Shipment } from "../operation.types";
import { useShipmentActions } from "../composables/useShipmentActions";

type ShipmentDropdownFilterType = boolean | ((shipment: Shipment) => boolean);

export interface ShipmentDropdownFilters {
  view?: ShipmentDropdownFilterType;
  edit?: ShipmentDropdownFilterType;
  create_advance?: ShipmentDropdownFilterType;
  update_status?: ShipmentDropdownFilterType;
  add_voucher?: ShipmentDropdownFilterType;
}

const props = defineProps<{
  shipment: Shipment;
  onActionComplete?: () => void;
  filters?: ShipmentDropdownFilters;
}>();

const shouldShow = (key: keyof ShipmentDropdownFilters) => {
  if (!props.filters) return true;
  const filter = props.filters[key];
  if (filter === undefined) return true;
  if (typeof filter === "function") {
    return filter(props.shipment);
  }
  return filter;
};

const { handleAction, openStatusModal, openVouchersModal } = useShipmentActions(
  props.onActionComplete,
);
</script>
