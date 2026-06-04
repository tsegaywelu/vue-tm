<script setup lang="ts">
import { inject, onMounted, ref, reactive, watch, computed } from "vue";
import { genId } from "@/utils/utils";
import SelectInput from "@/components/form/SelectInput.vue";
import InputParent from "@/components/form/InputParent.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import Button from "@/components/Button.vue";
import ContractWaypointInput from "./ContractWaypointInput.vue";
import { getApi } from "@/utils/getApi";
import { required, number, validateArrayItems } from "@/utils/validations";
import { useAuthStore } from "@/store/authStore";

const props = defineProps<{
  mode?: "carrier" | "shipper";
}>();

const authStore = useAuthStore();
const authCarrierId = authStore.carrierId;

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

// In carrier mode: counterpartyId = selectedShipperId (used to enable/disable fields)
// In shipper mode: counterpartyId = selectedCarrierId (also drives the route URL)
const counterpartyId = ref("");

// Route URL: carrier mode = auth carrier ID; shipper mode = selected carrier ID
const routeCarrierId = computed(() =>
  props.mode === "shipper" ? counterpartyId.value : authCarrierId,
);

const counterpartyFieldName = computed(() =>
  props.mode === "shipper" ? "carrier" : "shipper",
);

const selectedRouteData = ref<any>(null);
const routeLoading = ref(false);
const addedRoutes = ref<any[]>([]);
const tempWaypoints = ref<TempWaypoint[]>([]);
const pricingErrors = reactive<Record<string, string>>({});
const addRouteError = ref("");

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

function resetStaging(clearRoutes = false) {
  selectedRouteData.value = null;
  routeLoading.value = false;
  tempWaypoints.value = [];
  addRouteError.value = "";
  form?.setFieldValue("tempRouteId", "");
  form?.setFieldValue("tempCommodities", []);
  form?.setFieldValue("tempPackagings", []);
  form?.setFieldValue("tempAgents", []);
  form?.setFieldValue("tempProductTypes", []);
  if (clearRoutes) addedRoutes.value = [];
}

onMounted(() => {
  const existingCounterparty = form?.getFieldValue(counterpartyFieldName.value);
  if (existingCounterparty) counterpartyId.value = existingCounterparty;

  const existingRoutes = form?.getFieldValue("routes");
  if (existingRoutes?.length) {
    addedRoutes.value = existingRoutes.map((r: any) => ({
      ...r,
      fakeId: genId.next().value as string,
    }));
  }
});

watch(
  addedRoutes,
  () => {
    form?.setFieldValue("routes", addedRoutes.value);
  },
  { deep: true },
);

const onCounterpartyChange = (val: string) => {
  counterpartyId.value = val;
  resetStaging(true);
};

const onRouteChange = async (routeId: string) => {
  selectedRouteData.value = null;
  tempWaypoints.value = [];
  for (const key of Object.keys(pricingErrors)) delete pricingErrors[key];
  addRouteError.value = "";
  if (!routeId) return;

  routeLoading.value = true;
  try {
    const res = await routeApi.addAuthenticationHeader().get(`/${routeId}`);
    if (res.success) {
      const data = (res.data as any).result ?? res.data;
      selectedRouteData.value = data;
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

function addRouteToContract() {
  const routeId = form?.getFieldValue("tempRouteId");
  if (!selectedRouteData.value || !routeId) {
    addRouteError.value = "Please select a route first";
    return;
  }

  if (addedRoutes.value.find((r) => r.route === routeId)) {
    addRouteError.value = "This route has already been added to the contract";
    return;
  }

  const allPricing = tempWaypoints.value.flatMap((wp) => wp.vehiclePricing);
  const err = validateArrayItems(allPricing, pricingErrors, pricingRules);
  if (err) return;

  addRouteError.value = "";
  addedRoutes.value.push({
    fakeId: genId.next().value as string,
    route: routeId,
    routeName: selectedRouteData.value.routeName,
    waypoints: tempWaypoints.value.map((wp) => ({
      waypoint: wp.waypoint,
      name: wp.name,
      vehiclePricing: wp.vehiclePricing.map(({ fakeId: _id, ...p }) => ({
        ...p,
        pricePerUnit: Number(p.pricePerUnit),
      })),
    })),
    commodities: form?.getFieldValue("tempCommodities") || [],
    packagings: form?.getFieldValue("tempPackagings") || [],
    agents: form?.getFieldValue("tempAgents") || [],
    productType: form?.getFieldValue("tempProductTypes") || [],
  });

  resetStaging(false);
}

function removeRouteFromContract(idx: number) {
  addedRoutes.value.splice(idx, 1);
}
</script>

<template>
  <!-- Route Configuration Box -->
  <Colapsable
    title="Route Configuration"
    description="Select a route and configure pricing per waypoint."
    :open="false"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Counterparty select: Shipper (carrier mode) or Carrier (shipper mode) -->
      <SelectInput
        :name="counterpartyFieldName"
        :label="mode === 'shipper' ? 'Carrier' : 'Shipper'"
        :url="mode === 'shipper' ? '/carrier' : '/shipper'"
        label_key="name"
        value_key="_id"
        searchable
        :validation="{ required }"
        :on_change="onCounterpartyChange"
      />
      <!-- Route select: remounts when routeCarrierId changes (shipper mode) -->
      <SelectInput
        :key="`route-${routeCarrierId}`"
        name="tempRouteId"
        label="Route"
        :url="routeCarrierId ? `/route/carrierAllRoutes/${routeCarrierId}` : ''"
        label_key="routeName"
        value_key="_id"
        searchable
        :show_validation_status="false"
        :attributes="{ disabled: !routeCarrierId }"
        :on_change="onRouteChange"
      />
    </div>
    <div class="space-y-6">
      <!-- Commodity / Packaging / Agents / Product Types -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectInput
          name="tempCommodities"
          label="Commodities"
          url="/commodity/contracted"
          label_key="name"
          value_key="_id"
          multiple
          :show_validation_status="false"
          :attributes="{ disabled: !counterpartyId }"
        />
        <SelectInput
          name="tempPackagings"
          label="Packagings"
          url="/packaging/contracted"
          label_key="name"
          value_key="_id"
          multiple
          :show_validation_status="false"
          :attributes="{ disabled: !counterpartyId }"
        />
        <SelectInput
          name="tempAgents"
          label="Agents"
          url="/agent/shipper/carrier"
          :label_key="
            (item: any) => `${item.name} - ${item?.location?.city ?? ''}`
          "
          value_key="_id"
          multiple
          searchable
          :params="(state) => ({ q: undefined, 'name[regex]': state.search })"
          :show_validation_status="false"
          :attributes="{ disabled: !counterpartyId }"
        />
        <SelectInput
          name="tempProductTypes"
          label="Product Types"
          :options="[
            { label: 'In Bound', value: 'IN_BOUND' },
            { label: 'Out Bound', value: 'OUT_BOUND' },
            { label: 'Site Transfer', value: 'SITE_TRANSFER' },
          ]"
          multiple
          :show_validation_status="false"
          :attributes="{ disabled: !counterpartyId }"
        />
      </div>

      <!-- Waypoints area -->
      <div class="pt-4 border-t border-gray-200">
        <div
          v-if="routeLoading"
          class="flex items-center justify-center gap-3 py-8 text-sm text-gray-400"
        >
          <i class="mdi mdi-loading mdi-spin text-xl"></i>
          Loading route details...
        </div>

        <div v-else-if="selectedRouteData" class="space-y-4">
          <ContractWaypointInput
            v-for="(wp, wpIndex) in tempWaypoints"
            :key="wp.waypoint"
            :waypoint="wp"
            :waypoint-index="wpIndex"
            :carrier-id="routeCarrierId"
            :errors="pricingErrors"
            @add-pricing="addPricing(wpIndex)"
            @remove-pricing="(pIndex) => removePricing(wpIndex, pIndex)"
          />
        </div>

        <p v-else class="text-xs text-gray-400 italic py-2">
          Select a route above to configure waypoint pricing.
        </p>
      </div>

      <p v-if="addRouteError" class="text-xs text-red-500">
        {{ addRouteError }}
      </p>

      <Button
        variant="primary"
        class="w-full"
        :disabled="!selectedRouteData"
        @click="addRouteToContract"
      >
        + Add Route to Contract
      </Button>
    </div>
  </Colapsable>

  <!-- Routes field — registers the form field and validates at least one route -->
  <InputParent
    name="routes"
    :validation="{
      hasRoutes(val: any[]) {
        return val?.length
          ? [true, '']
          : [false, 'At least one route is required'];
      },
    }"
  >
    <div
      v-if="addedRoutes.length > 0"
      class="bg-gray-50 p-6 rounded-lg border border-gray-200"
    >
      <h3 class="text-sm font-semibold text-gray-800 mb-4">Added Routes</h3>
      <div
        v-for="(r, idx) in addedRoutes"
        :key="r.fakeId"
        class="mb-4 p-4 bg-surface rounded-lg border border-gray-100 flex justify-between items-center shadow-sm"
      >
        <div class="space-y-1">
          <p class="font-medium text-sm text-gray-900">{{ r.routeName }}</p>
          <p class="text-xs text-gray-500">
            {{ r.waypoints.map((wp: any) => wp.name).join(" → ") }}
          </p>
        </div>
        <Button
          variant="ghost"
          class="text-error-600 text-xs underline"
          @click="removeRouteFromContract(idx)"
        >
          Remove
        </Button>
      </div>
    </div>
  </InputParent>

  <div class="pt-4 flex flex-col sm:flex-row justify-end gap-3 *:w-full sm:*:w-auto *:min-h-[52px] sm:*:min-h-0 *:text-base sm:*:text-sm *:rounded-2xl sm:*:rounded-xl">
    <slot
      name="actions"
      :addedRoutes="addedRoutes"
      :counterpartyId="counterpartyId"
    />
  </div>
</template>
