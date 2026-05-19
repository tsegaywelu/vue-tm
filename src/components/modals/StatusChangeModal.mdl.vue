<template>
  <FormModalParent
    modal-style="auto"
    title="Change Shipment Status"
    :form="form"
    form-id="statusChangeForm"
    @close="cancel"
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
        :attributes="{
          rows: 4,
          placeholder: 'Enter follow-up note...',
        }"
        :validation="{ required }"
      />

      <!-- Status Time (hidden for custom) -->
      <div class="grid grid-cols-[1fr_15rem] gap-4">
        <DateInput
          v-if="currentStatus !== 'custom'"
          name="statusTime"
          label="Date"
          :attributes="{
            placeholder: 'Select time',
          }"
          :validation="{
            dateLessThanOrEqalToToday,
          }"
        />
        <TimeInput
          name="time"
          label="Time"
          :attributes="{
            placeholder: 'Select time',
          }"
        />
      </div>
    </template>

    <template #bottom>
      <div class="flex justify-end gap-3">
        <Button type="button" variant="outline" size="md" @click="cancel">
          Cancel
        </Button>
        <SubmitButton
          :loading="isSubmitting"
          variant="primary"
          size="md"
          form="statusChangeForm"
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
import Button from "@/components/common/Button.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import DateInput from "@/components/form/DateInput.vue";
import { dateLessThanOrEqalToToday, required } from "@/utils/validations";
import {
  update_shipment_status,
  add_follow_up,
} from "@/modules/operation/api/shipment.api";
import { ShipmentStatus } from "@/utils/utils";
import TimeInput from "../form/TimeInput.vue";

export type ReturnType = boolean;
export type Props = {
  shipment: any;
  statusList?: any[];
  statusListRaw?: any[];
};

const props = defineProps<{ data: Props; close: (res: ReturnType) => void }>();

const toast = useToastStore();

const shipment = computed(() => props.data.shipment ?? {});
const currentStatus = ref(shipment.value.status ?? "");
const isSubmitting = ref(false);

const formValues = computed(() => ({
  status: shipment.value.status ?? "",
  followUp: "",
  statusTime: "",
  time: "",
}));

const form = useForm({
  defaultValues: formValues.value,
  onSubmit: async ({ value }) => {
    await handleFormSubmit(value);
  },
}) as any;

// Provide context to both slots (Center and Bottom)
provide("formContext", {
  id: "statusChangeForm",
  form,
  is_dirty: computed(() => form.state.isDirty),
});

const ROUND_TRIP_ONLY_STATUSES = [
  "waiting_to_load_at_destination",
  "loading_started_at_destination",
  "loaded_at_destination",
  "en_route_to_origin",
  "arrived_at_origin",
  "waiting_to_offload_at_origin",
  "offloading_started_at_origin",
  "offloaded_at_origin",
];

const ALWAYS_VISIBLE = ["cancelled", "custom", "delayed", "terminated"];

const statusOptions = computed(() => {
  const isSingleTrip = shipment.value.tripType === "single_trip";
  const isSingleOrCKRF =
    isSingleTrip ||
    (shipment.value.tripType === "round_trip" && shipment.value.CKRF === true);

  const rawList = props.data.statusListRaw ?? ShipmentStatus;
  const list = props.data.statusList ?? ShipmentStatus;
  const current = shipment.value.status;

  if (isSingleOrCKRF) {
    const filteredByTrip = isSingleTrip
      ? rawList.filter((s: any) => !ROUND_TRIP_ONLY_STATUSES.includes(s.value))
      : rawList;

    // ordered list mirrors isStatusSelectable
    const ordered = [
      "vehicle_assigned",
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
    ];
    const currentOrderedIdx = ordered.indexOf(current);

    return filteredByTrip
      .filter((s: any) => {
        if (ALWAYS_VISIBLE.includes(s.value)) return true;
        const idx = ordered.indexOf(s.value);
        return idx === -1 || idx >= currentOrderedIdx;
      })
      .map((s: any) => ({
        ...s,
        disabled: !isStatusSelectable(s.value),
      }));
  }

  const currentIndex = list.findIndex((s: any) => s.value === current);
  return list
    .filter(
      (status: any, index: number) =>
        ALWAYS_VISIBLE.includes(status.value) || index >= currentIndex,
    )
    .map((status: any) => {
      const originalIndex = list.findIndex(
        (s: any) => s.value === status.value,
      );
      return {
        ...status,
        disabled:
          !ALWAYS_VISIBLE.includes(status.value) &&
          originalIndex > currentIndex + 1,
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

function cancel() {
  closeModal();
}

async function handleFormSubmit(values: any) {
  const id = shipment.value._id;
  isSubmitting.value = true;

  try {
    if (values.status === "custom") {
      const res = await add_follow_up(id, {
        followUp: [values.followUp.trim()],
      });
      if (res.status === 200 || res.status === 201) {
        toast.success("Status updated successfully!");
        closeModal(true);
      } else {
        toast.error("Failed to update status");
      }
    } else {
      const statusData: any = { status: values.status };
      if (values.statusTime) {
        const combined = values.time
          ? `${values.statusTime}T${values.time}:00`
          : values.statusTime;
        statusData.statusTime = combined;
      }

      const res = await update_shipment_status(id, statusData);
      if (res.status === 200 || res.status === 201) {
        toast.success("Status updated successfully!");
        closeModal(true);
      } else {
        toast.error(res.error || "Failed to update status");
      }
    }
  } catch (error: any) {
    const msg =
      error.response?.data?.description || error.message || "Unexpected error";
    toast.error(`Error: ${msg}`);
  } finally {
    isSubmitting.value = false;
  }
}
</script>
