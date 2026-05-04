<template>
  <div class="space-y-6">
    <!-- Carrier Selection -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SelectInput
        name="carrier"
        label="Carrier"
        url="/carrier"
        label_key="name"
        value_key="_id"
        :validation="{ required }"
      />
    </div>

    <!-- Route Selection and Waypoints Box -->
    <div class="border border-gray-200 rounded-lg p-6 bg-gray-50 space-y-6">
      <div class="relative">
        <SelectInput
          name="tempRouteId"
          label="Route"
          :url="carrierId ? `/route/carrierAllRoutes/${carrierId}` : ''"
          label_key="routeName"
          value_key="_id"
          searchable
          :disabled="!carrierId"
          placeholder="Search routes..."
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div class="relative">
          <SelectInput
            name="tempCommodities"
            label="Commodities"
            url="/commodity"
            label_key="name"
            value_key="_id"
            multiple
            :disabled="!carrierId"
          />
        </div>

        <div class="relative">
          <SelectInput
            name="tempPackagings"
            label="Packagings"
            url="/packaging"
            label_key="name"
            value_key="_id"
            multiple
            :disabled="!carrierId"
          />
        </div>

        <div class="relative">
          <SelectInput
            name="tempAgents"
            label="Agents"
            url="/agent"
            :label_key="(item: any) => `${item.name} - ${item?.location?.city ?? ''}`"
            value_key="_id"
            multiple
            :disabled="!carrierId"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Product Types</label>
          <div class="flex flex-wrap gap-4">
            <label v-for="type in productTypeOptions" :key="type" class="flex items-center gap-2 text-sm text-gray-600">
              <input 
                type="checkbox" 
                :value="type" 
                v-model="tempConfig.productTypes" 
                class="rounded border-gray-300 text-primary focus:ring-primary"
                :disabled="!carrierId"
              >
              {{ type.replace('_', ' ') }}
            </label>
          </div>
        </div>
      </div>

      <!-- Waypoints and Pricing (only if route is selected) -->
      <div v-if="selectedRouteData" class="space-y-6 pt-4 border-t border-gray-200">
        <div v-for="(wp, index) in tempConfig.waypoints" :key="wp.waypoint" class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 class="text-sm font-semibold text-gray-800 mb-4">
            Waypoint {{ index + 1 }}: {{ wp.name }}
          </h3>
          
          <div v-for="(pricing, pIndex) in wp.vehiclePricing" :key="pIndex" class="p-4 border rounded-lg bg-gray-50 mb-4 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectInput
                :name="`pricing-${index}-${pIndex}-ptype`"
                label="Product Type"
                :options="[{label: 'Inbound', value: 'IN_BOUND'}, {label: 'Outbound', value: 'OUT_BOUND'}, {label: 'Site Transfer', value: 'SITE_TRANSFER'}]"
                v-model="pricing.productType"
                :validation="{ required }"
              />
              <SelectInput
                :name="`pricing-${index}-${pIndex}-vtype`"
                label="Vehicle Type"
                :url="`/vehicle-type/carrier/${carrierId}`"
                label_key="name"
                value_key="_id"
                v-model="pricing.vehicleType"
                :validation="{ required }"
              />
              <SelectInput
                :name="`pricing-${index}-${pIndex}-type`"
                label="Type"
                :options="[{label: 'Per Kilometer', value: 'per_kilometer'}, {label: 'Per Quintal', value: 'per_quintal'}, {label: 'Per Truck', value: 'per_truck'}]"
                v-model="pricing.type"
                :validation="{ required }"
              />
            </div>
            
            <div class="flex items-end gap-4">
              <div class="flex-1">
                <label class="block text-xs font-medium text-gray-500 mb-1">Amount</label>
                <input 
                  type="number" 
                  v-model="pricing.pricePerUnit" 
                  class="w-full h-10 px-3 border border-gray-300 rounded focus:ring-2 focus:ring-primary outline-none text-sm transition-all"
                  placeholder="Enter amount"
                >
              </div>
              <Button variant="ghost" size="sm" @click="removePricing(index, pIndex)" class="text-error-600 h-10">
                Remove
              </Button>
            </div>
          </div>
          
          <Button variant="primary" size="sm" @click="addPricing(index)" class="bg-blue-600 hover:bg-blue-700 text-white">
            + Add Pricing
          </Button>
        </div>

        <Button 
            variant="primary" 
            class="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 font-semibold rounded-md"
            @click="addRouteToContract"
        >
            Add Route
        </Button>
      </div>
    </div>

    <!-- Added Routes Preview -->
    <div v-if="addedRoutes.length > 0" class="mt-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 class="text-sm font-semibold text-gray-800 mb-4">Added Routes</h3>
      <div v-for="(r, idx) in addedRoutes" :key="idx" class="mb-4 p-4 bg-white rounded-lg border border-gray-100 flex justify-between items-center shadow-sm">
        <div class="space-y-1">
          <p class="font-medium text-sm text-gray-900">Route Name: {{ r.routeName }}</p>
          <div class="text-xs text-gray-500 line-clamp-1">
            {{ r.waypoints.map((wp: any) => wp.name).join(' → ') }}
          </div>
        </div>
        <Button variant="ghost" @click="removeRouteFromContract(idx)" class="text-error-600 text-xs underline font-medium">
          Remove
        </Button>
      </div>
    </div>

    <div class="flex justify-end pt-4">
      <slot name="actions" :addedRoutes="addedRoutes" :carrierId="carrierId"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive, computed } from 'vue';
import SelectInput from "@/components/form/SelectInput.vue";
import Button from "@/components/Button.vue";
import { getApi } from "@/utils/getApi";
import { required } from "@/utils/validations";

const props = defineProps<{
  form: any;
}>();

const carrierId = computed(() => props.form.state.values.carrier);
const selectedRouteId = computed(() => props.form.state.values.tempRouteId);
const selectedRouteData = ref<any>(null);
const addedRoutes = ref<any[]>([]);

const productTypeOptions = ["IN_BOUND", "OUT_BOUND", "SITE_TRANSFER"];

const tempConfig = reactive({
  productTypes: [],
  waypoints: [] as any[]
});

const routeApi = getApi('/route');

watch(selectedRouteId, async (newId) => {
  if (newId) {
    const res = await routeApi.addAuthenticationHeader().get(`/${newId}`);
    if (res.success) {
      selectedRouteData.value = res.data;
      tempConfig.waypoints = res.data.waypoints.map((wp: any) => ({
        waypoint: wp._id,
        name: wp.name,
        vehiclePricing: [{ vehicleType: '', pricePerUnit: 0, type: '', productType: '' }]
      }));
    }
  } else {
    selectedRouteData.value = null;
  }
});

const addPricing = (wpIndex: number) => {
  tempConfig.waypoints[wpIndex].vehiclePricing.push({ vehicleType: '', pricePerUnit: 0, type: '', productType: '' });
};

const removePricing = (wpIndex: number, pIndex: number) => {
  if (tempConfig.waypoints[wpIndex].vehiclePricing.length > 1) {
    tempConfig.waypoints[wpIndex].vehiclePricing.splice(pIndex, 1);
  }
};

const addRouteToContract = () => {
  if (!selectedRouteId.value) return;
  
  addedRoutes.value.push({
    route: selectedRouteId.value,
    routeName: selectedRouteData.value.routeName,
    waypoints: tempConfig.waypoints.map(wp => ({
      waypoint: wp.waypoint,
      name: wp.name,
      vehiclePricing: [...wp.vehiclePricing]
    })),
    commodities: props.form.state.values.tempCommodities || [],
    packagings: props.form.state.values.tempPackagings || [],
    agents: props.form.state.values.tempAgents || [],
    productType: [...tempConfig.productTypes]
  });

  // Reset current route config in form
  props.form.setFieldValue('tempRouteId', '');
  props.form.setFieldValue('tempCommodities', []);
  props.form.setFieldValue('tempPackagings', []);
  props.form.setFieldValue('tempAgents', []);
  tempConfig.productTypes = [];
  tempConfig.waypoints = [];
};

const removeRouteFromContract = (index: number) => {
  addedRoutes.value.splice(index, 1);
};

// Reset everything if carrier changes
watch(carrierId, () => {
  addedRoutes.value = [];
  props.form.setFieldValue('tempRouteId', '');
});
</script>
