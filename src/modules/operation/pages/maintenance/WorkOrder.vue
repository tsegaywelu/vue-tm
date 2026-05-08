<template>
  <Teleport to="#page-actions" defer>
    <Button
      v-permission="'WORK_ORDER:create'"
      @click="router.push('/maintenance/work-order/add')"
    >
      <template #leading>
        <div class="size-5" v-html="all_icons.plus"></div>
      </template>
      New Work Order
    </Button>
  </Teleport>
  <WorkOrderTable @action="handleWorkOrderAction" />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import WorkOrderTable from "../../components/maintenanceTables/WorkOrderTable.vue";
import Button from "@/components/Button.vue";
import type { WorkOrder } from "../../operation.types";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";
import { useToastStore } from "@/store/toastStore";
import { openModal } from "@customizer/modal-x";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { update_work_order, delete_work_order } from "../../api/work-order.api";

const router = useRouter();
const toast = useToastStore();
const queryClient = useQueryClient();
const all_icons = { ...icons, ...raaz_icons };

const updateStatusMutation = useMutation({
  mutationFn: ({ id, status }: { id: string; status: string }) =>
    update_work_order(id, { status }),
  onSuccess: (res) => {
    if (res.success) {
      toast.success("Work Order status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["work-orders-list"] });
    } else {
      toast.error(res.message || "Failed to update Work Order status");
    }
  },
  onError: (error: any) => {
    toast.error(error.message || "An error occurred");
  },
});

const deleteMutation = useMutation({
  mutationFn: (id: string) => delete_work_order(id),
  onSuccess: (res) => {
    if (res.success) {
      toast.success("Work Order deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["work-orders-list"] });
    } else {
      toast.error(res.message || "Failed to delete Work Order");
    }
  },
  onError: (error: any) => {
    toast.error(error.message || "An error occurred");
  },
});

const handleWorkOrderAction = async ({
  row,
  action,
}: {
  row: WorkOrder;
  action: string;
}) => {
  if (action === "edit") {
    router.push(`/maintenance/work-order/edit/${row._id}`);
  } else if (action === "view") {
    router.push(`/maintenance/work-order/${row._id}`);
  } else if (action === "add") {
    router.push("/maintenance/work-order/add");
  } else if (action === "approve") {
    const isConfirmed = await openModal("ConfirmationModal", {
      title: "Approve Work Order",
      message: "Are you sure you want to approve this work order?",
      confirmText: "Approve",
      cancelText: "Cancel",
      confirmClass: "btn-primary",
    });
    if (isConfirmed && row._id) {
      updateStatusMutation.mutate({ id: row._id, status: "APPROVED" });
    }
  } else if (action === "cancel") {
    const isConfirmed = await openModal("ConfirmationModal", {
      title: "Reject Work Order",
      message: "Are you sure you want to reject this work order?",
      confirmText: "Reject",
      cancelText: "Cancel",
      confirmClass: "btn-danger",
    });
    if (isConfirmed && row._id) {
      updateStatusMutation.mutate({ id: row._id, status: "CANCELLED" });
    }
  } else if (action === "complete") {
    const isConfirmed = await openModal("ConfirmationModal", {
      title: "Complete Work Order",
      message: "Are you sure you want to mark this work order as complete?",
      confirmText: "Complete",
      cancelText: "Cancel",
      confirmClass: "btn-primary",
    });
    if (isConfirmed && row._id) {
      updateStatusMutation.mutate({ id: row._id, status: "COMPLETED" });
    }
  } else if (action === "delete") {
    const isConfirmed = await openModal("ConfirmationModal", {
      title: "Delete Work Order",
      message: "Are you sure you want to delete this work order?",
      confirmText: "Delete",
      cancelText: "Cancel",
      confirmClass: "btn-danger",
    });
    if (isConfirmed && row._id) {
      deleteMutation.mutate(row._id);
    }
  }
};
</script>
