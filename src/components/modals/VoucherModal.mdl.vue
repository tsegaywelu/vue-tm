<template>
  <FormModalParent modal-style="auto" :title="formTitle" @close="closeModal()">
    <template #center>
      <!-- Single trip — completed/offloading states -->
      <template v-if="isSingleTripComplete">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Issue Voucher</label
          >
          <input
            type="text"
            v-model="form.shipperIssueVoucher"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Receiving Voucher</label
          >
          <input
            type="text"
            v-model="form.agentReceiveVoucher"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <template v-if="isOwnedOrLeased">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Odometer at Complete</label
            >
            <input
              type="number"
              v-model="form.odometerAtComplete"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Fuel Reading at Complete</label
            >
            <input
              type="number"
              v-model="form.fuelReadingAtComplete"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </template>
        <StarRating v-model="form.driverRating" />
      </template>

      <!-- Round trip — completed/offloading states -->
      <template v-else-if="isRoundTripComplete">
        <div class="flex items-center gap-3 mb-1">
          <label class="block text-sm font-medium text-gray-700">CKRF</label>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="form.CKRF" class="sr-only" />
            <div
              class="w-11 h-6 rounded-full shadow-inner transition-colors duration-300"
              :class="form.CKRF ? 'bg-orange-500' : 'bg-gray-200'"
            ></div>
            <div
              class="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow transform transition-transform duration-300"
              :class="form.CKRF ? 'translate-x-5' : 'translate-x-0'"
            ></div>
          </label>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >FPIV</label
          >
          <input
            type="text"
            v-model="form.shipperIssueVoucher"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Agent Receive Voucher</label
          >
          <input
            type="text"
            v-model="form.agentReceiveVoucher"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <template v-if="!form.CKRF">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Agent Issue Voucher</label
            >
            <input
              type="text"
              v-model="form.agentIssueVoucher"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Customer Receive Voucher</label
            >
            <input
              type="text"
              v-model="form.shipperReceiveVoucher"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </template>
        <template v-if="isOwnedOrLeased">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Odometer at Complete</label
            >
            <input
              type="text"
              v-model="formattedOdometer"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Fuel Reading at Complete</label
            >
            <input
              type="number"
              v-model="form.fuelReadingAtComplete"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </template>
        <StarRating v-model="form.driverRating" />
      </template>

      <!-- Single trip — issue voucher only -->
      <template v-else-if="form.tripType === 'single_trip'">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Issue Voucher</label
          >
          <input
            type="text"
            v-model="form.shipperIssueVoucher"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </template>

      <!-- Round trip — FPIV only -->
      <template v-else-if="form.tripType === 'round_trip'">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >FPIV</label
          >
          <input
            type="text"
            v-model="form.shipperIssueVoucher"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </template>
    </template>

    <template #bottom>
      <div class="flex justify-end gap-3">
        <button
          @click="closeModal()"
          class="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          @click="confirm"
          :disabled="isDataLoading"
          class="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
          style="
            background: linear-gradient(
              179.87deg,
              #2222ff 0.12%,
              #16169d 104.69%
            );
          "
        >
          <span v-if="isDataLoading">Saving...</span>
          <span v-else>OK</span>
        </button>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { closeModal } from "@customizer/modal-x";
import FormModalParent from "./FormModalParent.vue";
import { useToastStore } from "@/store/toastStore";
import { add_issue_voucher, add_other_voucher } from "@/modules/operation/api/shipment.api";

// Inline star rating — keeps the file self-contained
const StarRating = {
  props: { modelValue: { type: Number, default: 0 } },
  emits: ["update:modelValue"],
  template: `
    <div class="flex items-center gap-2 my-2">
      <span class="text-sm font-semibold text-gray-700">Rate this driver:</span>
      <div class="flex items-center gap-1">
        <svg v-for="star in 5" :key="star" @click="$emit('update:modelValue', star)"
          xmlns="http://www.w3.org/2000/svg" fill="currentColor"
          :class="['w-6 h-6 cursor-pointer transition-transform duration-150', modelValue >= star ? 'text-yellow-500 scale-110' : 'text-gray-300 hover:text-yellow-400']"
          viewBox="0 0 24 24">
          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.548 8.278L12 18.896l-7.484 4.516 1.548-8.278L0 9.306l8.332-1.151z"/>
        </svg>
        <span v-if="modelValue > 0" class="ml-1 text-sm text-gray-600">({{ modelValue }}/5)</span>
      </div>
    </div>
  `,
};

const props = defineProps({ data: { type: Object, default: () => ({}) } });

const toast = useToastStore();
const isDataLoading = ref(false);

function parseRating(val: any) {
  if (val == null) return 0;
  const n = Number(val);
  return isNaN(n) ? 0 : Math.max(0, Math.min(5, n));
}

const s = props.data.shipment ?? {};
const form = reactive({
  _id: s._id,
  tripType: s.tripType,
  status: s.status,
  shipmentCode: s.shipmentCode,
  vehicle: s.vehicle ?? {},
  shipperIssueVoucher: s.shipperIssueVoucher || "",
  agentReceiveVoucher: s.agentReceiveVoucher || "",
  agentIssueVoucher: s.agentIssueVoucher || "",
  shipperReceiveVoucher: s.shipperReceiveVoucher || "",
  odometerAtComplete: s.odometerAtComplete || null,
  fuelReadingAtComplete: s.fuelReadingAtComplete || null,
  CKRF: s.CKRF || false,
  driverRating: parseRating(s.driverRating),
});

const isOwnedOrLeased = computed(
  () =>
    form.vehicle.ownership === "Owned" || form.vehicle.ownership === "Leased",
);
const isSingleTripComplete = computed(
  () =>
    form.tripType === "single_trip" &&
    [
      "completed",
      "offloading_started_at_destination",
      "offloaded_at_destination",
    ].includes(form.status),
);
const isRoundTripComplete = computed(
  () =>
    form.tripType === "round_trip" &&
    [
      "completed",
      "offloading_started_at_origin",
      "offloaded_at_origin",
    ].includes(form.status),
);

const formattedOdometer = computed({
  get() {
    const val = form.odometerAtComplete;
    return val != null
      ? val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : "";
  },
  set(value) {
    const n = parseInt(String(value).replace(/,/g, ""));
    form.odometerAtComplete = isNaN(n) ? 0 : n;
  },
});

const formTitle = computed(() => `Voucher — ${form.shipmentCode ?? ""}`);

async function confirm() {
  isDataLoading.value = true;
  try {
    if (isSingleTripComplete.value || isRoundTripComplete.value) {
      await voucherConfirm();
    } else {
      await issueVoucherConfirm();
    }
  } catch (error: any) {
    toast.addToast(`Error: ${error.message}`, "error");
  } finally {
    isDataLoading.value = false;
  }
}

async function voucherConfirm() {
  let payload: any = {};

  if (form.tripType === "single_trip") {
    if (form.agentReceiveVoucher === "") {
      toast.addToast("Agent Receive Voucher is required", "error");
      return;
    }
    if (isOwnedOrLeased.value && form.odometerAtComplete === null) {
      toast.addToast("Odometer at complete is required", "error");
      return;
    }
    if (isOwnedOrLeased.value && form.fuelReadingAtComplete === null) {
      toast.addToast("Fuel Reading at complete is required", "error");
      return;
    }
    payload = {
      agentReceiveVoucher: String(form.agentReceiveVoucher),
      shipperIssueVoucher: String(form.shipperIssueVoucher),
      driverRating: form.driverRating,
      ...(isOwnedOrLeased.value && {
        odometerAtComplete: Number(form.odometerAtComplete),
        fuelReadingAtComplete: Number(form.fuelReadingAtComplete),
      }),
    };
  } else {
    if (form.agentReceiveVoucher === "") {
      toast.addToast("Agent Receive Voucher is required", "error");
      return;
    }
    if (isOwnedOrLeased.value && form.odometerAtComplete === null) {
      toast.addToast("Odometer at complete is required", "error");
      return;
    }
    if (isOwnedOrLeased.value && form.fuelReadingAtComplete === null) {
      toast.addToast("Fuel at complete is required", "error");
      return;
    }
    payload = {
      shipperIssueVoucher: String(form.shipperIssueVoucher),
      agentIssueVoucher: String(form.agentIssueVoucher),
      agentReceiveVoucher: String(form.agentReceiveVoucher),
      shipperReceiveVoucher: String(form.shipperReceiveVoucher),
      CKRF: form.CKRF,
      driverRating: form.driverRating,
      ...(isOwnedOrLeased.value && {
        odometerAtComplete: Number(form.odometerAtComplete),
        fuelReadingAtComplete: Number(form.fuelReadingAtComplete),
      }),
    };
  }

  const res = await add_other_voucher(form._id, payload);
  if (res.status === 200 || res.status === 201) {
    toast.addToast("Vouchers added successfully!", "success");
    closeModal(true);
  } else {
    toast.addToast(`Error: ${res.data?.description || "Unknown error occurred."}`, "error");
  }
}

async function issueVoucherConfirm() {
  if (!form.shipperIssueVoucher) {
    toast.addToast("Issue Voucher is required", "error");
    return;
  }
  const res = await add_issue_voucher(form._id, { shipperIssueVoucher: String(form.shipperIssueVoucher) });
  if (res.status === 200 || res.status === 201) {
    toast.addToast("Vouchers added successfully!", "success");
    closeModal(true);
  } else {
    toast.addToast(`Error: ${res.data?.description || "Unknown error occurred."}`, "error");
  }
}
</script>
