<template>
  <div class="flex flex-col h-full">
   
   

    <!-- Table Section -->
    <div class="flex-1 min-h-0">
      <RouteRequestTable
        ref="tableRef"
        @action="handleAction"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import RouteRequestTable from "../../components/settings/RouteRequest/RouteRequestTable.vue";

import { useToastStore } from "@/store/toastStore";
import { delete_route_request } from "../../api/route-request.api";

const router = useRouter();
const toast = useToastStore();
const tableRef = ref();

const handleAction = async ({ row, action }: any) => {
  if (action === "edit") {
    router.push(`/setting/route-request/edit/${row._id}`);
  } else if (action === "delete") {
    if (confirm(`Are you sure you want to delete this route request?`)) {
      try {
        const res = await delete_route_request(row._id);
        if (res.success) {
          toast.success("Route request deleted successfully");
          tableRef.value?.refetch();
        } else {
          toast.error(res.error || "Failed to delete route request");
        }
      } catch (error: any) {
        toast.error(error.message || "An unexpected error occurred");
      }
    }
  }
};
</script>
