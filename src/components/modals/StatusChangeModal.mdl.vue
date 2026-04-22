<template>
  <FormModalParent
    :values="formValues"
    @submit="handleFormSubmit"
    modal-style="auto"
    title="Change Shipment Status"
    form-id="statusChangeForm"
  >
    <template #center>
      <!-- Status Select -->
      <SelectInput
        name="status"
        label="Status"
        :options="statusOptions"
        label-key="label"
        value-key="value"
        :validation="{ required }"
        :on-change="onStatusChange"
      />

      <!-- Follow-up Note (only when custom) -->
      <TextareaInput
        v-if="currentStatus === 'custom'"
        name="followUp"
        label="Set note"
        :rows="4"
        :validation="{ required }"
      />

      <!-- Status Time (hidden for custom) -->
      <DateInput
        :validation="{ required }"
        v-if="currentStatus !== 'custom'"
        name="statusTime"
        label="Time"
        :attributes="{
          placeholder: 'Select time',
        }"
      />
    </template>

    <template #bottom>
      <div class="flex justify-end gap-3">
        <Button type="button" variant="secondary" size="lg-sm"> Cancel </Button>
        <SubmitButton variant="primary" size="lg-sm"> Save </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { ref, computed, provide } from "vue";
import { closeModal } from "@customizer/modal-x";
import { useForm } from "@tanstack/vue-form";
import FormModalParent from "./FormModalParent.vue";
import Button from "@/components/common/Button.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import DateInput from "@/components/form/DateInput.vue";
import { required } from "@/utils/validations";
import { useToastStore } from "@/store/toastStore";
import {
  update_shipment_status,
  add_follow_up,
} from "@/modules/operation/api/shipment.api";

export type ReturnType = boolean;
export type Props = {
  shipment: any;
  statusList?: any[];
  statusListRaw?: any[];
};

const props = defineProps<{ data: Props; close: (res: ReturnType) => void }>();

const toast = useToastStore();
const isLoading = ref(false);

const shipment = computed(() => props.data.shipment ?? {});
const currentStatus = ref(shipment.value.status ?? "");

const formValues = computed(() => ({
  status: shipment.value.status ?? "",
  followUp: "",
  statusTime: "",
}));

// Initialize TanStack form at the modal level
const statusOptions = computed(() => {
  const isSingleOrCKRF =
    shipment.value.tripType === "single_trip" ||
    (shipment.value.tripType === "round_trip" && shipment.value.CKRF === true);

  if (isSingleOrCKRF) {
    return (props.data.statusListRaw ?? []).map((s: any) => ({
      ...s,
      disabled: !isStatusSelectable(s.value),
    }));
  }

  const list = props.data.statusList ?? [];
  const currentIndex = list.findIndex(
    (s: any) => s.value === shipment.value.status,
  );
  return list.map((status: any, index: number) => {
    const alwaysEnabled = ["cancelled", "custom", "delayed", "terminated"];
    return {
      ...status,
      disabled:
        !alwaysEnabled.includes(status.value) && index > currentIndex + 1,
    };
  });
});

function isStatusSelectable(statusValue: string) {
  const current = shipment.value.status;
  if (
    (statusValue === "delayed" || statusValue === "cancelled") &&
    current !== "vehicle_assigned"
  )
    return false;
  const ordered = [
    "accepted",
    "waiting_to_load_at_origin",
    "loading_started_at_origin",
    "loaded_at_origin",
    "departed",
    "en_route_to_destination",
    "arrived_at_destination",
    "waiting_to_offload_at_destination",
    "offloading_started_at_destination",
    "offloaded_at_destination",
    "completed",
    "cancelled",
    "delayed",
  ];
  return ordered.indexOf(statusValue) <= ordered.indexOf(current) + 1;
}

function onStatusChange(val: any) {
  currentStatus.value = val;
}

async function handleFormSubmit(values: any) {
  const id = shipment.value._id;
  isLoading.value = true;

  try {
    let res: any;
    if (values.status === "custom") {
      res = await add_follow_up(id, { followUp: [values.followUp.trim()] });
    } else {
      const statusData: any = { status: values.status };
      if (values.statusTime) statusData.statusTime = values.statusTime;
      res = await update_shipment_status(id, statusData);
    }

    if (res.status === 200 || res.status === 201) {
      toast.addToast("Status updated successfully!", "success");
      closeModal(true);
    } else {
      toast.addToast(
        `Error: ${res.data?.description || "Unknown error occurred."}`,
        "error",
      );
    }
  } catch (error: any) {
    const msg =
      error.response?.data?.description || error.message || "Unexpected error";
    toast.addToast(`Error: ${msg}`, "error");
  } finally {
    isLoading.value = false;
  }
}
</script>
