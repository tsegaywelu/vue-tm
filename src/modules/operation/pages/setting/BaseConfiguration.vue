<template>
  <div class="flex flex-col h-full">
    <!-- Tab Navigation -->
    <div class="mb-4 px-2">
      <nav class="flex space-x-8 border-b border-gray-200">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="currentTab = tab.id"
          :class="[
            currentTab === tab.id
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors'
          ]"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Page Actions (Teleported) -->
    <Teleport to="#page-actions" defer>
      <Button
        variant="primary"
        size="md"
        class="flex items-center gap-2"
        @click="handleAdd"
      >
        <i v-html="icons.plus" />
        Add {{ activeTabLabel }}
      </Button>
    </Teleport>

    <!-- Tab Content -->
    <div class="flex-1 min-h-0">
      <CarrierSettingTable
        v-if="currentTab === 'settings'"
        ref="settingsTableRef"
        @action="(data) => handleAction(data, 'settings')"
      />
      <RoadTypeTable
        v-else-if="currentTab === 'roadType'"
        ref="roadTypeTableRef"
        @action="(data) => handleAction(data, 'roadType')"
      />
      <TerrainTypeTable
        v-else-if="currentTab === 'terrainType'"
        ref="terrainTypeTableRef"
        @action="(data) => handleAction(data, 'terrainType')"
      />
      <BankTable
        v-else-if="currentTab === 'bank'"
        ref="bankTableRef"
        @action="(data) => handleAction(data, 'bank')"
      />
      <BankInsuranceTable
        v-else-if="currentTab === 'insurance'"
        ref="insuranceTableRef"
        @action="(data) => handleAction(data, 'insurance')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import CarrierSettingTable from "../../components/settings/BaseConfiguration/CarrierSettingTable.vue";
import RoadTypeTable from "../../components/settings/BaseConfiguration/RoadTypeTable.vue";
import TerrainTypeTable from "../../components/settings/BaseConfiguration/TerrainTypeTable.vue";
import BankTable from "../../components/settings/BaseConfiguration/BankTable.vue";
import BankInsuranceTable from "../../components/settings/BaseConfiguration/BankInsuranceTable.vue";
import Button from "@/components/Button.vue";
import { icons } from "@/utils/icons";
import { useToastStore } from "@/store/toastStore";
import {
  delete_carrier_setting,
  delete_road_type,
  delete_terrain_type,
  delete_bank,
  delete_insurance,
} from "../../api/settings.api";

const router = useRouter();
const route = useRoute();
const toast = useToastStore();

const tabs = [
  { id: "settings", name: "Settings" },
  { id: "roadType", name: "Road Type" },
  { id: "terrainType", name: "Terrain Type" },
  { id: "bank", name: "Bank" },
  { id: "insurance", name: "Insurance Provider" },
];

const currentTab = ref((route.query.tab as string) || tabs[0].id);

watch(currentTab, (newTab) => {
  router.replace({ query: { ...route.query, tab: newTab } });
});

const activeTabLabel = computed(() => {
  return tabs.find((t) => t.id === currentTab.value)?.name || "";
});

// Table References for refetching
const settingsTableRef = ref();
const roadTypeTableRef = ref();
const terrainTypeTableRef = ref();
const bankTableRef = ref();
const insuranceTableRef = ref();

const handleAdd = () => {
  const tabPathMap: Record<string, string> = {
    settings: "/setting/base-configuration/settings/add",
    roadType: "/setting/base-configuration/road-type/add",
    terrainType: "/setting/base-configuration/terrain-type/add",
    bank: "/setting/base-configuration/bank/add",
    insurance: "/setting/base-configuration/insurance/add",
  };
  router.push(tabPathMap[currentTab.value]);
};

const handleAction = async ({ row, action }: any, type: string) => {
  if (action === "edit") {
    const editPathMap: Record<string, string> = {
      settings: `/setting/base-configuration/settings/edit/${row._id}`,
      roadType: `/setting/base-configuration/road-type/edit/${row._id}`,
      terrainType: `/setting/base-configuration/terrain-type/edit/${row._id}`,
      bank: `/setting/base-configuration/bank/edit/${row._id}`,
      insurance: `/setting/base-configuration/insurance/edit/${row._id}`,
    };
    router.push(editPathMap[type]);
  } else if (action === "delete") {
    const label = row.name || row._id;
    if (confirm(`Are you sure you want to delete "${label}"?`)) {
      try {
        let res;
        switch (type) {
          case "settings": res = await delete_carrier_setting(row._id); break;
          case "roadType": res = await delete_road_type(row._id); break;
          case "terrainType": res = await delete_terrain_type(row._id); break;
          case "bank": res = await delete_bank(row._id); break;
          case "insurance": res = await delete_insurance(row._id); break;
        }

        if (res?.success) {
          toast.success("Deleted successfully");
          // Refetch appropriate table
          if (type === "settings") settingsTableRef.value?.refetch();
          else if (type === "roadType") roadTypeTableRef.value?.refetch();
          else if (type === "terrainType") terrainTypeTableRef.value?.refetch();
          else if (type === "bank") bankTableRef.value?.refetch();
          else if (type === "insurance") insuranceTableRef.value?.refetch();
        } else {
          toast.error(res?.error || "Failed to delete");
        }
      } catch (error: any) {
        toast.error(error.message || "An unexpected error occurred");
      }
    }
  }
};
</script>
