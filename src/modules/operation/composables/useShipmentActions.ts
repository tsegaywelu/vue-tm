import { useRouter } from "vue-router";
import { openModal } from "@customizer/modal-x";
import type { Shipment } from "../operation.types";
import { ShipmentStatus } from "@/utils/utils";

export const useShipmentActions = (onActionComplete?: () => void) => {
  const router = useRouter();

  const handleAction = (row: Shipment, action: string) => {
    if (action === "view") {
      router.push(`/operation/shipments/${row._id}`);
    } else if (action === "edit") {
      router.push(`/operation/shipments/edit/${row._id}`);
    } else if (action === "create_advance") {
      openAddAdvanceModal(row);
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
    openStatusModal,
    openVouchersModal,
  };
};
