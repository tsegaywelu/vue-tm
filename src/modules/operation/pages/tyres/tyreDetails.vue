<template>
  <div class="h-full flex flex-col gap-4">
    <!-- Header Section -->
    <div
      class="bg-white flex flex-col md:flex-row md:items-center justify-between px-3 md:px-4 py-4 md:py-3 rounded-[20px] gap-4 shadow-sm border border-gray-100"
    >
      <div class="flex flex-col gap-2 flex-1">
        <h1 class="font-bold text-2xl leading-tight text-gray-900">
          {{ tyre?.serialNumber || "-------" }}
        </h1>
        <div class="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
          <span class="text-sm text-gray-600">
            Plate Number
            <span class="font-bold text-black text-sm ml-1">
              {{ tyre?.vehicle?.plateNumber || "-------" }}
            </span>
          </span>
        </div>
      </div>

      <div
        class="flex flex-row items-center justify-between md:justify-end gap-3 md:gap-4"
      >
        <div
          class="flex flex-row lg:flex-col items-start md:items-end gap-1 md:gap-2"
        >
          <span
            class="text-xs md:text-sm text-gray-600"
            v-if="tyre?.installationDate"
          >
            Installation Date
            <span class="font-bold text-black ml-1">
              {{ dateFormatter(tyre?.installationDate) }}
            </span>
          </span>
        </div>

        <!-- Actions Dropdown -->
        <div class="flex-1 md:flex-none justify-end flex">
          <Dropdown>
            <template #default="{ close }">
              <DropDownItem
                :icon="icons.editIcon"
                label="Edit Tyre"
                @click="handleEdit"
              />
            </template>
          </Dropdown>
        </div>
      </div>
    </div>

    <!-- Tabs List -->
    <!-- <div
      class="rounded-[20px] bg-white px-3 md:px-5 py-2.5 flex items-center gap-3 overflow-x-auto no-scrollbar whitespace-nowrap shadow-sm border border-gray-100"
    >
      <Button
        v-for="tab in tabs"
        :key="tab.key"
        :variant="activeTab === tab.key ? 'default' : 'ghost'"
        size="lg"
        class="h-11 text-sm gap-1.5 pr-4 pl-3 shrink-0 min-w-auto transition-colors"
        :class="{ 'text-gray-500': activeTab !== tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </Button>
    </div> -->

    <!-- Tab Content Area -->
    <div class="flex-1 min-h-0 overflow-y-auto">
      <component
        :is="activeTabComponent"
        :tyre="tyre"
        @refresh="refetch"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery, useMutation } from "@tanstack/vue-query";
import { fetch_tyre_by_id, delete_tyre } from "../../api/tyre.api";
import { type Tyre } from "../../operation.types";
import Dropdown from "@/components/common/Dropdown.vue";
import DropDownItem from "@/components/common/DropDownItem.vue";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";
import { dateFormatter } from "@/utils/utils";
import { useToastStore } from "@/store/toastStore";

// Import Tabs Content
import TyreOverviewTab from "../../components/tyre-details/TyreOverviewTab.vue";

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const tyreId = route.params.id as string;
const all_icons = { ...icons, ...raaz_icons };

const activeTab = ref("tyre-info");

const tabs = [
  {
    label: "Basic Information",
    key: "tyre-info",
    icon: all_icons.infoIcon || icons.info,
  },
];

const { data: tyreResponse, refetch } = useQuery <Tyre>({
  queryKey: ["tyre", tyreId],
  queryFn: () => fetch_tyre_by_id(tyreId) as any,
});

const tyre = computed(() => tyreResponse.value?.data  );

const activeTabComponent = computed(() => {
  switch (activeTab.value) {
    case "tyre-info":
      return TyreOverviewTab;
    default:
      return TyreOverviewTab;
  }
});

const handleEdit = () => {
  router.push(`/vehicle-tyres/edit/${tyreId}`);
};

const deleteMutation = useMutation({
  mutationFn: () => delete_tyre(tyreId),
});

const handleDelete = async () => {
  if (confirm("Are you sure you want to delete this tyre?")) {
    try {
      const res = await deleteMutation.mutateAsync();
      if (res.success) {
        toast.success("Tyre deleted successfully");
        router.push("/operation/vehicle-tyres");
      } else {
        toast.error(res.error || "Failed to delete tyre");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    }
  }
};
</script>
