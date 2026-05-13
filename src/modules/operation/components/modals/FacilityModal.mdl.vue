<template>
  <FormModalParent
    :title="facility ? 'Edit Facility' : 'Add New Facility'"
    :subtitle="
      facility ? 'Update facility details' : 'Add a new facility to a shipper'
    "
    form-id="facility-form"
    :submit-handler="handleSubmit"
    modal-style="auto"
    :values="initialFormValues"
  >
    <template #center>
      <FacilityForm :hideShipper="isShipper" />
    </template>
    <template #bottom>
      <div class="flex justify-end gap-3 mt-4">
        <Button size="md" variant="outline" @click="closeModal(false)">
          Cancel
        </Button>
        <SubmitButton>
          {{ facility ? "Update" : "Create" }}
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import FacilityForm from "../FacilityForm.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { closeModal } from "@customizer/modal-x";
import { useToastStore } from "@/store/toastStore";
import { add_facility, update_facility } from "../../api/operation.api";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import {
  create_shipper_facility,
  update_shipper_facility,
} from "@/modules/shipper/api/shipper.api";

const props = defineProps<{
  data?: { facility?: any; shipperId?: string; isShipper?: boolean };
}>();

const facility = computed(() => props.data?.facility);
const isShipper = computed(
  () => props.data?.isShipper || !!props.data?.shipperId,
);
const shipperId = computed(() => props.data?.shipperId);

const initialFormValues = computed(() => {
  const base = facility.value || {};
  return {
    shipper: base.shipper?._id || base.shipper || shipperId.value || "",
    name: base.name || "",
    region: base.location?.region || base.region || "",
    city: base.location?.city || base.city || "",
  };
});

// Removed manual shipper options fetching as it's now handled by SelectInput in FacilityForm

// Removed redundant regionOptions as they are now in FacilityForm

const toast = useToastStore();
const queryClient = useQueryClient();

// API mutations handling both shipper and admin (carrier-context) endpoints
const createMutation = useMutation({
  mutationFn: (data: any) =>
    isShipper.value ? create_shipper_facility(data) : add_facility(data),
});

const updateMutation = useMutation({
  mutationFn: ({ id, data }: { id: string; data: any }) =>
    isShipper.value
      ? update_shipper_facility(id, data)
      : update_facility(id, data),
});

const handleSubmit = async (values: any) => {
  const payload: any = {
    name: values.name,
    location: {
      region: values.region,
      city: values.city,
    },
  };

  if (!isShipper.value && values.shipper) {
    payload.shipper = values.shipper;
  }

  if (facility.value) {
    const res = await updateMutation.mutateAsync({
      id: facility.value._id,
      data: payload,
    });
    if (res.success || res.status === 200 || res.status === 201) {
      toast.success("Facility updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["shipper-facilities-list"] });
      closeModal(true);
    } else {
      toast.error(res.error || "Failed to update facility");
    }
  } else {
    const res = await createMutation.mutateAsync(payload);
    if (res.success || res.status === 200 || res.status === 201) {
      toast.success("Facility created successfully!");
      queryClient.invalidateQueries({ queryKey: ["shipper-facilities-list"] });
      closeModal(true);
    } else {
      toast.error(res.error || "Failed to create facility");
    }
  }
};
</script>
