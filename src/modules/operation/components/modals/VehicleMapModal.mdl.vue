<template>
  <ModalWrapper
    wrapper-class="flex items-center justify-center p-4"
    @close="closeModal()"
  >
    <div
      class="bg-white rounded-[28px] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col"
      style="max-height: 85vh"
    >
      <!-- Header -->
      <div
        class="border-b border-gray-100 px-6 py-4 flex justify-between items-center shrink-0"
      >
        <div class="flex items-center gap-3">
          <div
            class="size-10 rounded-full primary-gradient grid place-items-center text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-5"
            >
              <path
                d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
              />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-900">Vehicle Tracking</h2>
            <p class="text-sm text-gray-500">{{ data.plateNumber }}</p>
          </div>
        </div>
        <button
          type="button"
          @click="closeModal()"
          class="rounded-full w-10 h-10 grid place-items-center shrink-0 hover:bg-gray-100 transition-colors"
          style="
            box-shadow:
              4px 4px 44px 0px #0000000d,
              -4px -4px 44px 0px #0000000d;
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Map Container -->
      <div class="relative flex-1" style="min-height: 500px">
        <!-- Loading State -->
        <div
          v-if="isLoading"
          class="absolute inset-0 z-20 flex items-center justify-center bg-white/80 backdrop-blur-sm"
        >
          <div class="flex flex-col items-center gap-3">
            <div
              class="size-10 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"
            ></div>
            <span class="text-sm text-gray-500 font-medium"
              >Loading route data…</span
            >
          </div>
        </div>

        <!-- Error State -->
        <div
          v-if="error"
          class="absolute inset-0 z-20 flex items-center justify-center bg-white"
        >
          <div class="flex flex-col items-center gap-3 text-center px-6">
            <div
              class="size-12 rounded-full bg-red-50 grid place-items-center text-red-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p class="text-sm text-gray-600">{{ error }}</p>
            <button
              @click="fetchRoute()"
              class="text-sm font-medium text-orange-600 hover:text-orange-700"
            >
              Retry
            </button>
          </div>
        </div>

        <!-- No Data State -->
        <div
          v-if="!isLoading && !error && noData"
          class="absolute inset-0 z-20 flex items-center justify-center bg-white"
        >
          <div class="flex flex-col items-center gap-2 text-center px-6">
            <div
              class="size-12 rounded-full bg-gray-100 grid place-items-center text-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
            <p class="text-sm text-gray-500">
              No route data available for this vehicle.
            </p>
          </div>
        </div>

        <!-- The Map -->
        <div ref="mapContainer" class="w-full" style="height: 500px"></div>

        <!-- Legend -->
        <div
          v-if="!isLoading && !error && !noData"
          class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-xs text-gray-700 z-10"
        >
          <span class="flex items-center gap-1.5">
            <span
              class="inline-block w-5 rounded-full bg-[#f97316]"
              style="height: 3px"
            ></span>
            Vehicle Route
          </span>
          <span class="flex items-center gap-1.5">
            <span
              class="inline-block size-2.5 rounded-full bg-[#22c55e]"
            ></span>
            Start
          </span>
          <span class="flex items-center gap-1.5">
            <span
              class="inline-block size-2.5 rounded-full bg-[#ef4444]"
            ></span>
            End
          </span>
        </div>
      </div>
    </div>
  </ModalWrapper>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { closeModal } from "@customizer/modal-x";
import ModalWrapper from "@/components/modals/ModalWrapper.vue";
import { fetch_vehicle_track_route } from "../../api/operation.api";

export type Props = {
  vehicleId: string;
  plateNumber: string;
};

const props = defineProps<{ data: Props; close: (res: any) => void }>();

const mapContainer = ref<HTMLDivElement | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);
const noData = ref(false);

let googleMap: google.maps.Map | null = null;

async function loadGoogleMaps(): Promise<void> {
  const apiKey = import.meta.env.v_GOOGLE_MAPS_API_KEY || "";
  if (!apiKey) {
    error.value = "Google Maps API key is not configured.";
    return;
  }

  if (window.google?.maps?.importLibrary) return;

  return new Promise((resolve) => {
    ((g) => {
      var h: any,
        a: any,
        k: any,
        p = "The Google Maps JavaScript API",
        c = "google",
        l = "importLibrary",
        q = "__ib__",
        m = document,
        b: any = window;
      b = b[c] || (b[c] = {});
      var d = b.maps || (b.maps = {}),
        r = new Set(),
        e = new URLSearchParams(),
        u = () =>
          h ||
          (h = new Promise(async (f, n) => {
            await (a = m.createElement("script"));
            e.set("libraries", [...r] + "");
            for (k in g)
              e.set(
                k.replace(/[A-Z]/g, (t: string) => "_" + t[0].toLowerCase()),
                g[k],
              );
            e.set("callback", c + ".maps." + q);
            a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
            d[q] = f;
            a.onerror = () => (h = n(Error(p + " could not load.")));
            a.nonce = (m.querySelector("script[nonce]") as any)?.nonce || "";
            m.head.append(a);
          }));
      d[l]
        ? console.warn(p + " only loads once. Better to use v=weekly.")
        : (d[l] = (f: any, ...n: any[]) =>
            r.add(f) && u().then(() => d[l](f, ...n)));
    })({
      key: apiKey,
      v: "weekly",
    });
    resolve();
  });
}

async function initMap(
  points: Array<{ lat: number; lng: number }>,
): Promise<void> {
  if (!mapContainer.value || !window.google?.maps) return;

  const { Map } = (await window.google.maps.importLibrary(
    "maps",
  )) as google.maps.MapsLibrary;

  await window.google.maps.importLibrary("geometry");

  const { AdvancedMarkerElement, PinElement } =
    (await window.google.maps.importLibrary(
      "marker",
    )) as google.maps.MarkerLibrary;

  googleMap = new Map(mapContainer.value, {
    center: points[0],
    zoom: 15,
  });

  // Draw polyline
  const polyline = new google.maps.Polyline({
    path: points,
    geodesic: true,
    strokeColor: "#f97316",
    strokeOpacity: 1.0,
    strokeWeight: 4,
  });
  polyline.setMap(googleMap);

  // Fit bounds
  const bounds = new google.maps.LatLngBounds();
  points.forEach((p) => bounds.extend(p));
  googleMap.fitBounds(bounds);

  // Start marker
  new google.maps.Marker({
    position: points[0],
    map: googleMap,
    title: "Start",
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: "#22c55e",
      fillOpacity: 1,
      strokeWeight: 2,
      strokeColor: "white",
      scale: 10,
    },
  });

  // End marker
  new google.maps.Marker({
    position: points[points.length - 1],
    map: googleMap,
    title: "End",
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: "#ef4444",
      fillOpacity: 1,
      strokeWeight: 2,
      strokeColor: "white",
      scale: 10,
    },
  });
}

async function fetchRoute() {
  isLoading.value = true;
  error.value = null;
  noData.value = false;

  try {
    await loadGoogleMaps();
    const res = await fetch_vehicle_track_route(props.data.vehicleId);
    const data = (res as any)?.data || res;
    const points: Array<{ lat: number; lng: number }> = data?.points ?? [];

    if (!Array.isArray(points) || points.length < 2) {
      noData.value = true;
      return;
    }

    setTimeout(() => {
      initMap(points);
    }, 100);
  } catch (err: any) {
    console.error("Failed to load vehicle route:", err);
    error.value =
      err?.response?.data?.description ||
      err?.message ||
      "Failed to load route data.";
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchRoute();
});
</script>
