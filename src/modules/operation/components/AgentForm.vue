<template>
  <Form
    :id="formId"
    :values="initialFormValues"
    :on-submit="handleSubmit"
    class="w-full flex flex-col gap-6"
  >
    <template #default="{ form }">
      <!-- Agent Details -->
      <Colapsable
        title="Agent Information"
        description="Specify name, trade name, code, and location."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SelectInput
            v-if="!hideShipper"
            name="shipper"
            label="Shipper"
            url="/shipper"
            label_key="name"
            value_key="_id"
            :validation="{ required }"
            :attributes="{ placeholder: 'Select shipper' }"
          />
          <Input
            name="name"
            label="Agent Name"
            :attributes="{ placeholder: 'Enter agent name' }"
            :validation="{ required }"
          />
          <Input
            name="tradeName"
            label="Trade Name"
            :attributes="{ placeholder: 'Enter trade name' }"
            :validation="{ required }"
          />
          <Input
            name="agentCode"
            label="Agent Code"
            :attributes="{ placeholder: 'Enter agent code' }"
            :validation="{ required }"
          />
          <SelectInput
            name="region"
            label="Region"
            :options="regionOptions"
            :validation="{ required }"
            :attributes="{ placeholder: 'Select region' }"
          />
          <Input
            name="city"
            label="City"
            :attributes="{ placeholder: 'Enter city' }"
            :validation="{ required }"
          />
          <SelectInput
            name="cargoType"
            label="Cargo Type"
            :options="cargoTypeOptions"
            :attributes="{ placeholder: 'Select cargo type' }"
          />
        </div>
      </Colapsable>

      <!-- Map Picker -->
      <div
        class="bg-white rounded-[20px] p-5 border border-gray-100 flex flex-col gap-3"
        style="box-shadow: 0px 0px 24px 0px #00000014"
      >
        <div>
          <h2 class="text-xl font-bold text-gray-900 tracking-tight">
            Location Coordinates
          </h2>
          <p class="mt-1 text-sm text-gray-500 font-medium">
            Pick the agent's location on the map.
          </p>
        </div>
        <div class="flex flex-col gap-3">
          <div
            id="agent-location-map"
            class="w-full h-[350px] border border-grey-100 rounded-3xl bg-grey-25 overflow-hidden z-0"
            style="min-height: 350px"
          ></div>
          <p class="text-xs text-grey-500">
            Click anywhere on the map to place a marker.
          </p>
          <div
            v-if="selectedLocation.latitude && selectedLocation.longitude"
            class="p-4 bg-grey-25 rounded-2xl border border-grey-100 flex flex-wrap gap-4 text-sm font-medium text-grey-700"
          >
            <span>
              <strong class="text-grey-900">Latitude:</strong>
              {{ selectedLocation.latitude.toFixed(6) }}
            </span>
            <span>
              <strong class="text-grey-900">Longitude:</strong>
              {{ selectedLocation.longitude.toFixed(6) }}
            </span>
          </div>
          <div v-if="mapError" class="text-xs text-red-500 font-bold">
            {{ mapError }}
          </div>
        </div>
      </div>

      <!-- Contact Details -->
      <Colapsable
        title="Contact Information"
        description="Provide the agent's contact point details."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            name="fullName"
            label="Full Name"
            :attributes="{ placeholder: 'Enter contact full name' }"
          />
          <Input
            name="email"
            label="Email"
            :validation="{ email }"
            :attributes="{ placeholder: 'Enter contact email' }"
          />
        </div>
        <div class="border-t border-grey-100 pt-4 mt-6">
          <MultiPhoneInput name="phoneNumbers" />
        </div>
      </Colapsable>

      <div class="px-5">
        <Checkbox name="isActive" label="Agent is active" />
      </div>

      <!-- Form Logic Slot -->
      <slot name="form-logic" :form="form"></slot>

      <!-- Action Footer -->
      <div class="pt-10 flex justify-end gap-4">
        <slot :form="form" name="submit-btn"></slot>
      </div>
    </template>
  </Form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import Form from "@/components/form/Form.vue";
import Input from "@/components/form/Input.vue";
import CommonInput from "@/components/common/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import Button from "@/components/common/Button.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import MultiPhoneInput from "./inputs/MultiPhoneInput.vue";
import { email, required } from "@/utils/validations";

const props = defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  onSubmit: (values: any) => Promise<void> | void;
  hideShipper?: boolean;
}>();

const initialFormValues = computed(() => {
  return {
    shipper:
      props.initialValues?.shipper?._id || props.initialValues?.shipper || "",
    name: props.initialValues?.name || "",
    tradeName: props.initialValues?.tradeName || "",
    agentCode: props.initialValues?.agentCode || "",
    region: props.initialValues?.location?.region || "",
    city: props.initialValues?.location?.city || "",
    cargoType: props.initialValues?.cargoType || "",
    fullName: props.initialValues?.contact?.fullName || "",
    email: props.initialValues?.contact?.email || "",
    isActive:
      props.initialValues?.isActive !== undefined
        ? props.initialValues.isActive
        : true,
    phoneNumbers: props.initialValues?.contact?.phoneNumbers || [],
  };
});

const regionOptions = [
  { label: "Addis Ababa", value: "Addis Ababa" },
  { label: "Afar", value: "Afar" },
  { label: "Amhara", value: "Amhara" },
  { label: "Benishangul-Gumuz", value: "Benishangul-Gumuz" },
  { label: "Dire Dawa", value: "Dire Dawa" },
  { label: "Gambela", value: "Gambela" },
  { label: "Harari", value: "Harari" },
  { label: "Oromia", value: "Oromia" },
  { label: "Sidama", value: "Sidama" },
  { label: "Somali", value: "Somali" },
  {
    label: "SNNPR",
    value: "Southern Nations, Nationalities, and Peoples' Region (SNNPR)",
  },
  { label: "Tigray", value: "Tigray" },
];

const cargoTypeOptions = [
  { label: "In Bound", value: "IN_BOUND" },
  { label: "Out Bound", value: "OUT_BOUND" },
  { label: "Site Transfer", value: "SITE_TRANSFER" },
];

const selectedLocation = ref({
  latitude: props.initialValues?.locationGPS?.latitude || null,
  longitude: props.initialValues?.locationGPS?.longitude || null,
});

const mapError = ref<string>("");

let map: any = null;
let marker: any = null;

const initLeaflet = async (): Promise<any> => {
  if (typeof (window as any).L !== "undefined") {
    return (window as any).L;
  }
  if (!document.getElementById("leaflet-css")) {
    const link = document.createElement("link");
    link.id = "leaflet-css";
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => resolve((window as any).L);
    script.onerror = () => reject(new Error("Failed to load Leaflet"));
    document.head.appendChild(script);
  });
};

onMounted(async () => {
  await nextTick();
  setTimeout(async () => {
    try {
      const L = await initLeaflet();
      const mapContainer = document.getElementById("agent-location-map");
      if (!mapContainer || map) return;

      const startLat = selectedLocation.value.latitude || 9.145;
      const startLng = selectedLocation.value.longitude || 40.4897;

      map = L.map(mapContainer).setView([startLat, startLng], 6);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      if (selectedLocation.value.latitude && selectedLocation.value.longitude) {
        marker = L.marker([
          selectedLocation.value.latitude,
          selectedLocation.value.longitude,
        ]).addTo(map);
      }

      map.on("click", (e: any) => {
        const { lat, lng } = e.latlng;
        selectedLocation.value = { latitude: lat, longitude: lng };
        if (marker) {
          marker.setLatLng([lat, lng]);
        } else {
          marker = L.marker([lat, lng]).addTo(map);
        }
        mapError.value = "";
      });

      // Crucial: refresh map dimensions to remove grey box
      setTimeout(() => {
        if (map) map.invalidateSize();
      }, 50);
    } catch (err: any) {
      console.error(err);
      mapError.value = "Unable to load map picker.";
    }
  }, 100);
});

onUnmounted(() => {
  if (map) {
    map.remove();
    map = null;
    marker = null;
  }
});

const handleSubmit = async (values: any) => {
  if (!selectedLocation.value.latitude || !selectedLocation.value.longitude) {
    mapError.value = "Please select a location on the map.";
    return;
  }

  const payload: any = {
    shipper: values.shipper,
    name: values.name,
    tradeName: values.tradeName,
    agentCode: values.agentCode,
    location: {
      region: values.region,
      city: values.city,
    },
    locationGPS: {
      latitude: selectedLocation.value.latitude,
      longitude: selectedLocation.value.longitude,
    },
    isActive: values.isActive,
  };

  if (values.cargoType) {
    payload.cargoType = values.cargoType;
  }

  if (
    values.fullName ||
    values.email ||
    (values.phoneNumbers && values.phoneNumbers.length > 0)
  ) {
    payload.contact = {};
    if (values.fullName) payload.contact.fullName = values.fullName;
    if (values.email) payload.contact.email = values.email;
    if (values.phoneNumbers && values.phoneNumbers.length > 0) {
      payload.contact.phoneNumbers = values.phoneNumbers;
    }
  }

  await props.onSubmit(payload);
};
</script>
