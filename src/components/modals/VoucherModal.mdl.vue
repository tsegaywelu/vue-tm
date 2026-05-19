<template>
  <FormModalParent
    modal-style="auto"
    :title="formTitle"
    :form="form"
    form-id="voucherForm"
    @close="closeModal()"
  >
    <template #center>
      <!-- Single trip — completed/offloading states -->
      <template v-if="isSingleTripComplete">
        <Input name="shipperIssueVoucher" label="Issue Voucher" />
        <Input name="agentReceiveVoucher" label="Receiving Voucher" />
        <template v-if="isOwnedOrLeased">
          <Input type="number" name="odometerAtComplete" label="Odometer at Complete" />
          <Input type="number" name="fuelReadingAtComplete" label="Fuel Reading at Complete" />
        </template>
        <div v-if="['completed', 'offloaded_at_destination'].includes(status)" class="flex items-center gap-2 my-4">
          <span class="text-sm font-semibold text-gray-700">Rate this driver:</span>
          <div class="flex items-center gap-1">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              @click="driverRating = star"
              class="p-0.5 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                :class="['w-7 h-7 transition-all duration-150', driverRating >= star ? 'text-orange-400 scale-110' : 'text-gray-300 hover:text-orange-300']"
                viewBox="0 0 24 24"
              >
                <path pointer-events="none" d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.548 8.278L12 18.896l-7.484 4.516 1.548-8.278L0 9.306l8.332-1.151z"/>
              </svg>
            </button>
            <span v-if="driverRating > 0" class="ml-1 text-sm text-gray-500">({{ driverRating }}/5)</span>
          </div>
        </div>
      </template>

      <!-- Round trip — completed/offloading states -->
      <template v-else-if="isRoundTripComplete">
        <div class="flex items-center gap-3 mb-4">
          <label class="block text-sm font-medium text-gray-700">CKRF</label>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="ckrf" class="sr-only" />
            <div
              class="w-11 h-6 rounded-full shadow-inner transition-colors duration-300"
              :class="ckrf ? 'bg-orange-500' : 'bg-gray-200'"
            ></div>
            <div
              class="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow transform transition-transform duration-300"
              :class="ckrf ? 'translate-x-5' : 'translate-x-0'"
            ></div>
          </label>
        </div>
        <Input name="shipperIssueVoucher" label="FPIV" />
        <Input name="agentReceiveVoucher" label="Agent Receive Voucher" />
        <template v-if="!ckrf">
          <Input name="agentIssueVoucher" label="Agent Issue Voucher" />
          <Input name="shipperReceiveVoucher" label="Customer Receive Voucher" />
          <div class="flex items-center gap-2 my-4">
            <span class="text-sm font-semibold text-gray-700">Rate this driver:</span>
            <div class="flex items-center gap-1">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                @click="driverRating = star"
                class="p-0.5 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  :class="['w-7 h-7 transition-all duration-150', driverRating >= star ? 'text-orange-400 scale-110' : 'text-gray-300 hover:text-orange-300']"
                  viewBox="0 0 24 24"
                >
                  <path pointer-events="none" d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.548 8.278L12 18.896l-7.484 4.516 1.548-8.278L0 9.306l8.332-1.151z"/>
                </svg>
              </button>
              <span v-if="driverRating > 0" class="ml-1 text-sm text-gray-500">({{ driverRating }}/5)</span>
            </div>
          </div>
        </template>
        <template v-if="isOwnedOrLeased">
          <Input type="number" name="odometerAtComplete" label="Odometer at Complete" />
          <Input type="number" name="fuelReadingAtComplete" label="Fuel Reading at Complete" />
        </template>
      </template>

      <!-- Single trip — issue voucher only -->
      <template v-else-if="tripType === 'single_trip'">
        <Input name="shipperIssueVoucher" label="Issue Voucher" />
      </template>

      <!-- Round trip — FPIV only -->
      <template v-else-if="tripType === 'round_trip'">
        <Input name="shipperIssueVoucher" label="FPIV" />
      </template>
    </template>

    <template #bottom>
      <div class="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          size="md"
          @click="closeModal()"
        >
          Cancel
        </Button>
        <SubmitButton
          :loading="isSubmitting"
          variant="primary"
          size="md"
          form="voucherForm"
        >
          Save
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { ref, computed, provide } from "vue";
import { closeModal } from "@customizer/modal-x";
import { useToastStore } from "@/store/toastStore";
import { useForm } from "@tanstack/vue-form";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Input from "@/components/form/Input.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { add_other_voucher, add_issue_voucher } from "@/modules/operation/api/shipment.api";


export type Props = {
  shipment: any;
};

const props = defineProps<{ data: Props; close: (res: boolean) => void }>();

const toast = useToastStore();
const isSubmitting = ref(false);

const s = computed(() => props.data.shipment ?? {});
const formTitle = computed(() => `Voucher — ${s.value.shipmentCode ?? ""}`);

const tripType = computed(() => s.value.tripType);
const status = computed(() => s.value.status);
const isOwnedOrLeased = computed(
  () => s.value.vehicle?.ownership === "Owned" || s.value.vehicle?.ownership === "Leased"
);

const isSingleTripComplete = computed(
  () =>
    tripType.value === "single_trip" &&
    ["completed", "offloading_started_at_destination", "offloaded_at_destination"].includes(status.value)
);

const isRoundTripComplete = computed(
  () =>
    tripType.value === "round_trip" &&
    ["completed", "offloading_started_at_origin", "offloaded_at_origin"].includes(status.value)
);

// Manual refs for non-input bindings
const driverRating = ref(parseRating(s.value.driverRating));
const ckrf = ref(s.value.CKRF || false);

function parseRating(val: any) {
  if (val == null) return 0;
  const n = Number(val);
  return isNaN(n) ? 0 : Math.max(0, Math.min(5, n));
}

const formValues = computed(() => ({
  shipperIssueVoucher: s.value.shipperIssueVoucher || "",
  agentReceiveVoucher: s.value.agentReceiveVoucher || "",
  agentIssueVoucher: s.value.agentIssueVoucher || "",
  shipperReceiveVoucher: s.value.shipperReceiveVoucher || "",
  odometerAtComplete: s.value.odometerAtComplete || "",
  fuelReadingAtComplete: s.value.fuelReadingAtComplete || "",
}));

const form = useForm({
  defaultValues: formValues.value,
  onSubmit: async ({ value }) => {
    await confirm(value);
  },
}) as any;

provide("formContext", {
  id: "voucherForm",
  form,
  is_dirty: computed(() => form.state.isDirty),
});

async function confirm(values: any) {
  isSubmitting.value = true;
  try {
    if (isSingleTripComplete.value || isRoundTripComplete.value) {
      await voucherConfirm(values);
    } else {
      await issueVoucherConfirm(values);
    }
  } finally {
    isSubmitting.value = false;
  }
}

async function voucherConfirm(rawValues: any) {
  const values = JSON.parse(JSON.stringify(rawValues));
  let payload: any = {};

  if (tripType.value === "single_trip") {
    if (!values.agentReceiveVoucher) {
      toast.error("Agent Receive Voucher is required");
      return;
    }
    if (isOwnedOrLeased.value && !values.odometerAtComplete) {
      toast.error("Odometer at complete is required");
      return;
    }
    if (isOwnedOrLeased.value && !values.fuelReadingAtComplete) {
      toast.error("Fuel Reading at complete is required");
      return;
    }
    payload = {
      agentReceiveVoucher: String(values.agentReceiveVoucher),
      shipperIssueVoucher: String(values.shipperIssueVoucher),
      driverRating: driverRating.value,
      ...(isOwnedOrLeased.value && {
        odometerAtComplete: Number(values.odometerAtComplete),
        fuelReadingAtComplete: Number(values.fuelReadingAtComplete),
      }),
    };
  } else {
    if (!values.agentReceiveVoucher) {
      toast.error("Agent Receive Voucher is required");
      return;
    }
    if (isOwnedOrLeased.value && !values.odometerAtComplete) {
      toast.error("Odometer at complete is required");
      return;
    }
    if (isOwnedOrLeased.value && !values.fuelReadingAtComplete) {
      toast.error("Fuel at complete is required");
      return;
    }
    payload = {
      shipperIssueVoucher: String(values.shipperIssueVoucher),
      agentIssueVoucher: String(values.agentIssueVoucher),
      agentReceiveVoucher: String(values.agentReceiveVoucher),
      shipperReceiveVoucher: String(values.shipperReceiveVoucher),
      CKRF: ckrf.value,
      driverRating: driverRating.value,
      ...(isOwnedOrLeased.value && {
        odometerAtComplete: Number(values.odometerAtComplete),
        fuelReadingAtComplete: Number(values.fuelReadingAtComplete),
      }),
    };
  }

  try {
    const res = await add_other_voucher(s.value._id, payload);
    if (res.status === 200 || res.status === 201) {
      toast.success("Vouchers added successfully!");
      closeModal(true);
    } else {
      toast.error("Failed to add vouchers");
    }
  } catch (err: any) {
    toast.error(err.response?.data?.description || err.message || "Unknown error");
  }
}

async function issueVoucherConfirm(rawValues: any) {
  const values = JSON.parse(JSON.stringify(rawValues));
  if (!values.shipperIssueVoucher) {
    toast.error("Issue Voucher is required");
    return;
  }
  try {
    const res = await add_issue_voucher(s.value._id, {
      shipperIssueVoucher: String(values.shipperIssueVoucher),
    });
    if (res.status === 200 || res.status === 201) {
      toast.success("Vouchers added successfully!");
      closeModal(true);
    } else {
      toast.error("Failed to add vouchers");
    }
  } catch (err: any) {
    toast.error(err.response?.data?.description || err.message || "Unknown error");
  }
}
</script>
