<template>
  <div v-if="isLoading" class="flex justify-center py-10">
    <i class="mdi mdi-loading mdi-spin text-4xl text-primary"></i>
  </div>
  <MeterEntryForm
    v-else-if="initialValues"
    form-id="edit-meter-entry-form"
    :initial-values="initialValues"
    :labels="labels"
    :on-submit="handleUpdate"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">
        Cancel
      </Button>
      <SubmitButton>Save Changes</SubmitButton>
    </template>
  </MeterEntryForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import MeterEntryForm from "../components/MeterEntryForm.vue";
import { fetch_meter_entries, update_meter_entry } from "../api/fleet.api";
import { useToastStore } from "@/store/toastStore";
import Button from "@/components/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const queryClient = useQueryClient();
const id = route.params.id as string;

const { data: response, isLoading } = useQuery({
  queryKey: ["meter-entry", id],
  queryFn: () => fetch_meter_entries({ _id: id }),
  enabled: !!id,
});

const entry = computed(() => {
  const data = response.value?.data as any;
  return Array.isArray(data?.result) ? data.result[0] : data;
});

const initialValues = computed(() => {
  if (!entry.value) return null;
  const e = entry.value;
  return {
    vehicle: typeof e.vehicle === "object" ? e.vehicle._id : e.vehicle,
    meterType: e.meterType || "ODOMETER",
    reading: e.reading ?? "",
    entryDate: e.entryDate || "",
    entrySource: e.entrySource || "",
    comment: e.comment || "",
    isOverride: e.isOverride || false,
    overrideReason: e.overrideReason || "",
  };
});

const labels = computed(() => {
  if (!entry.value) return {};
  const e = entry.value;
  return {
    vehicle: typeof e.vehicle === "object" ? e.vehicle.plateNumber : "",
  };
});

const mutation = useMutation({
  mutationFn: (data: FormData) => update_meter_entry(id, data),
});

const handleUpdate = async (formData: FormData) => {
  const res = await mutation.mutateAsync(formData);
  if (res.success) {
    toast.success("Meter entry updated successfully");
    queryClient.invalidateQueries({ queryKey: ["meter-entry-list"] });
    queryClient.invalidateQueries({ queryKey: ["meter-entry", id] });
    router.push("/fleet/meter-entries");
  } else {
    toast.error(res.error || "Failed to update meter entry");
  }
};
</script>
