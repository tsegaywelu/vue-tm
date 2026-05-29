import { computed } from "vue";
import { useRouter } from "vue-router";
import { openModal } from "@customizer/modal-x";
import type { Shipment } from "../operation.types";
import { ShipmentStatus } from "@/utils/utils";
import { useAuthStore } from "@/store/authStore";

export const useShipmentActions = (onActionComplete?: () => void) => {
  const router = useRouter();
  const authStore = useAuthStore();

  // Resolve the base path based on user role
  const basePath = computed(() =>
    authStore.is_shipper ? "/shipper/shipments" : "/operation/shipments",
  );

  const handleAction = (row: Shipment, action: string) => {
    if (action === "view") {
      router.push(`${basePath.value}/${row._id}`);
    } else if (action === "edit") {
      router.push(`${basePath.value}/edit/${row._id}`);
    } else if (action === "create_advance") {
      openAddAdvanceModal(row);
    } else if (action === "create_prepayment") {
      openAddPrePaymentModal(row);
    } else {
      console.log(`Action: ${action} on Shipment: ${row.shipmentCode}`);
    }
  };

  const openAddAdvanceModal = (shipment: Shipment) => {
    openModal("AddAdvanceModal", { shipment }, (res) => {
      if (res && onActionComplete) {
        onActionComplete();
      }
    });
  };

  const openAddPrePaymentModal = (shipment: Shipment) => {
    openModal("AddPrePaymentModal", { shipment }, (res) => {
      if (res && onActionComplete) {
        onActionComplete();
      }
    });
  };

  const openStatusModal = (shipment: Shipment) => {
    openModal(
      "StatusChangeModal",
      {
        shipment,
        statusList: ShipmentStatus,
        statusListRaw: ShipmentStatus,
      },
      (res) => {
        if (res && onActionComplete) {
          onActionComplete();
        }
      },
    );
  };

  const openVouchersModal = (shipment: Shipment) => {
    openModal("VoucherModal", { shipment }, (res) => {
      if (res && onActionComplete) {
        onActionComplete();
      }
    });
  };

  return {
    handleAction,
    openAddAdvanceModal,
    openAddPrePaymentModal,
    openStatusModal,
    openVouchersModal,
    basePath,
  };
};

