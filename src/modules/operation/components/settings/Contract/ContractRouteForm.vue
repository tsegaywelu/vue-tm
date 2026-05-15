<script setup lang="ts">
import { inject, onMounted, ref, reactive, watch, computed } from "vue";
import { genId } from "@/utils/utils";
import SelectInput from "@/components/form/SelectInput.vue";
import InputParent from "@/components/form/InputParent.vue";
import ContractWaypointInput from "./ContractWaypointInput.vue";
import CommodityInput from "@/components/common/inputs/CommodityInput.vue";
import PackagingInput from "@/components/common/inputs/PackagingInput.vue";
import AgentInput from "@/components/common/inputs/AgentInput.vue";
import { getApi } from "@/utils/getApi";
import { required, number, validateArrayItems } from "@/utils/validations";
import { useAuthStore } from "@/store/authStore";

const props = defineProps<{
  mode?: "add" | "edit";
  context?: "carrier" | "shipper";
  initialRoute?: any;
}>();

const authStore = useAuthStore();
const carrierId = authStore.carrierId;

const commodityUrl = computed(() =>
  props.context === "shipper" ? "/commodity" : "/commodity/contracted",
);
const packagingUrl = computed(() =>
  props.context === "shipper" ? "/packaging" : "/packaging/contracted",
);
const agentUrl = computed(() =>
  props.context === "shipper" ? "/agent" : "/agent/shipper/carrier",
);

// Seed pre-selected items as options (raw backend objects) so label_key/value_key resolve correctly.
// finalOptions deduplicates by value_key, so remote results take precedence if they overlap.
const commodityOptions = computed(() =>
  (props.initialRoute?.commodities || []).filter(
    (c: any) => typeof c === "object" && c._id,
  ),
);

const packagingOptions = computed(() =>
  (props.initialRoute?.packagings || []).filter(
    (p: any) => typeof p === "object" && p._id,
  ),
);

const agentOptions = computed(() =>
  (props.initialRoute?.agents || []).filter(
    (a: any) => typeof a === "object" && a._id,
  ),
);

const vehicleTypeOptions = computed(() => {
  const seen = new Set<string>();
  const opts: any[] = [];
  for (const wp of props.initialRoute?.waypoints || [])
    for (const p of wp.vehiclePricing || [])
      if (
        typeof p.vehicleType === "object" &&
        p.vehicleType?._id &&
        !seen.has(p.vehicleType._id)
      ) {
        seen.add(p.vehicleType._id);
        opts.push(p.vehicleType);
      }
  return opts;
});

const formContext = inject<any>("formContext");
const form = formContext?.form;

type PricingRow = {
  fakeId: string;
  vehicleType: string;
  type: string;
  productType: string;
  pricePerUnit: number | string;
};

type TempWaypoint = {
  waypoint: string;
  name: string;
  vehiclePricing: PricingRow[];
};

const tempWaypoints = ref<TempWaypoint[]>([]);
const pricingErrors = reactive<Record<string, string>>({});
const routeLoading = ref(false);

const pricingRules = {
  vehicleType: { required },
  type: { required },
  productType: { required },
  pricePerUnit: { required, number },
};

const routeApi = getApi("/route");

function newEmptyPricing(): PricingRow {
  return {
    fakeId: genId.next().value as string,
    vehicleType: "",
    type: "",
    productType: "",
    pricePerUnit: "",
  };
}

onMounted(() => {
  if (props.mode === "edit") {
    const existing: any[] = form?.getFieldValue("waypoints") || [];
    tempWaypoints.value = existing.map((wp: any) => ({
      waypoint: typeof wp.waypoint === "object" ? wp.waypoint._id : wp.waypoint,
      name: wp.name || "",
      vehiclePricing: (wp.vehiclePricing || []).map((p: any) => ({
        vehicleType:
          typeof p.vehicleType === "object" ? p.vehicleType._id : p.vehicleType,
        type: p.type,
        productType: p.productType,
        pricePerUnit: p.pricePerUnit,
        fakeId: genId.next().value as string,
      })),
    }));
  }
});

watch(
  tempWaypoints,
  () => {
    form?.setFieldValue(
      "waypoints",
      tempWaypoints.value.map((wp) => ({
        waypoint: wp.waypoint,
        vehiclePricing: wp.vehiclePricing.map(({ fakeId: _id, ...p }) => ({
          ...p,
        })),
      })),
    );
  },
  { deep: true },
);

const onRouteChange = async (routeId: string) => {
  tempWaypoints.value = [];
  for (const key of Object.keys(pricingErrors)) delete pricingErrors[key];
  if (!routeId) return;

  routeLoading.value = true;
  try {
    const res = await routeApi.addAuthenticationHeader().get(`/${routeId}`);
    if (res.success) {
      const data = (res.data as any).result ?? res.data;
      tempWaypoints.value = data.waypoints.map((wp: any) => ({
        waypoint: wp._id,
        name: wp.name,
        vehiclePricing: [newEmptyPricing()],
      }));
    }
  } finally {
    routeLoading.value = false;
  }
};

function addPricing(wpIndex: number) {
  const allPricing = tempWaypoints.value.flatMap((wp) => wp.vehiclePricing);
  const err = validateArrayItems(allPricing, pricingErrors, pricingRules);
  if (err) return;
  tempWaypoints.value[wpIndex].vehiclePricing.push(newEmptyPricing());
}

function removePricing(wpIndex: number, pIndex: number) {
  tempWaypoints.value[wpIndex].vehiclePricing.splice(pIndex, 1);
}
</script>

<template>
  <div class="space-y-6">
    <!-- Route select — add mode only -->
    <SelectInput
      v-if="mode !== 'edit'"
      name="route"
      label="Route"
      :url="`/route/carrierAllRoutes/${carrierId}`"
      label_key="routeName"
      value_key="_id"
      searchable
      :params="{ limit: 20 }"
      :validation="{ required }"
      :on_change="onRouteChange"
    />

    <!-- Commodities / Packagings / Agents / Product Types -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <CommodityInput
        name="commodities"
        label="Commodities"
        :url="commodityUrl"
        multiple
        :options="commodityOptions"
      />
      <PackagingInput
        name="packagings"
        label="Packagings"
        :url="packagingUrl"
        multiple
        :options="packagingOptions"
      />
      <AgentInput
        name="agents"
        label="Agents"
        :url="agentUrl"
        :label_key="
          (item: any) => `${item.name} - ${item?.location?.city ?? ''}`
        "
        multiple
        :options="agentOptions"
      />
      <SelectInput
        name="productType"
        label="Product Types"
        :options="[
          { label: 'In Bound', value: 'IN_BOUND' },
          { label: 'Out Bound', value: 'OUT_BOUND' },
          { label: 'Site Transfer', value: 'SITE_TRANSFER' },
        ]"
        multiple
        :show_validation_status="false"
      />
    </div>

    <!-- Waypoints -->
    <InputParent
      name="waypoints"
      :validation="{
        hasWaypoints(val: any[]) {
          return val?.length
            ? [true, '']
            : [false, 'Select a route to load waypoints'];
        },
      }"
    >
      <div
        v-if="routeLoading"
        class="flex items-center justify-center gap-3 py-8 text-sm text-gray-400"
      >
        <i class="mdi mdi-loading mdi-spin text-xl"></i>
        Loading route details...
      </div>

      <div v-else-if="tempWaypoints.length > 0" class="space-y-4">
        <ContractWaypointInput
          v-for="(wp, wpIndex) in tempWaypoints"
          :key="wp.waypoint"
          :waypoint="wp"
          :waypoint-index="wpIndex"
          :carrier-id="carrierId"
          :errors="pricingErrors"
          :vehicle-type-options="vehicleTypeOptions"
          @add-pricing="addPricing(wpIndex)"
          @remove-pricing="(pIndex) => removePricing(wpIndex, pIndex)"
        />
      </div>

      <p v-else-if="mode !== 'edit'" class="text-xs text-gray-400 italic py-2">
        Select a route above to configure waypoint pricing.
      </p>
    </InputParent>
  </div>
</template>
