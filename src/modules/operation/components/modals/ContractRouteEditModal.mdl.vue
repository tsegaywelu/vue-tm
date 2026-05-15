<template>
  <FormModalParent
    modal-style="full"
    title="Edit Route"
    subtitle="Update waypoint pricing, commodities, packagings and agents"
    :form-id="formId"
    :values="initialValues"
    :submit-handler="handleFormSubmit"
    @close="cancel"
  >
    <template #center>
      <ContractRouteForm mode="edit" :context="props.data.context" :initial-route="props.data.route" />
    </template>
    <template #bottom>
      <div class="flex justify-end gap-3 w-full">
        <Button type="button" variant="outline" size="md" @click="cancel">
          Cancel
        </Button>
        <SubmitButton
          :loading="mutation.isPending.value"
          variant="primary"
          size="md"
          :form="formId"
        >
          Save Changes
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { closeModal } from "@customizer/modal-x";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { useToastStore } from "@/store/toastStore";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import ContractRouteForm from "../settings/Contract/ContractRouteForm.vue";
import { update_contract_route } from "../../api/settings.api";

export type ReturnType = boolean;
export type Props = {
  contractId: string;
  route: any;
  context?: "carrier" | "shipper";
};

const props = defineProps<{ data: Props; close: (res: ReturnType) => void }>();
const toast = useToastStore();
const queryClient = useQueryClient();
const formId = "contract-route-edit-form";

// Normalize the existing route data into form-ready values
const initialValues = computed(() => {
  const r = props.data.route;
  return {
    commodities: (r.commodities || []).map((c: any) => (typeof c === "object" ? c._id : c)),
    packagings: (r.packagings || []).map((p: any) => (typeof p === "object" ? p._id : p)),
    agents: (r.agents || []).map((a: any) => (typeof a === "object" ? a._id : a)),
    productType: r.productType || [],
    // waypoints include name for display; fakeIds are added by ContractRouteForm in onMounted
    waypoints: (r.waypoints || []).map((wp: any) => ({
      waypoint: typeof wp.waypoint === "object" ? wp.waypoint._id : wp.waypoint,
      name: typeof wp.waypoint === "object" ? wp.waypoint.name : "",
      vehiclePricing: (wp.vehiclePricing || []).map((p: any) => ({
        vehicleType: typeof p.vehicleType === "object" ? p.vehicleType._id : p.vehicleType,
        type: p.type,
        productType: p.productType,
        pricePerUnit: p.pricePerUnit,
      })),
    })),
  };
});

const mutation = useMutation({
  mutationFn: (data: any) =>
    update_contract_route(props.data.contractId, props.data.route._id, data),
  onSuccess: (res) => {
    if (res.success) {
      toast.success("Route updated successfully");
      queryClient.invalidateQueries({ queryKey: ["contract", props.data.contractId] });
      props.close(true);
    } else {
      toast.error(res.error || "Failed to update route");
    }
  },
  onError: (err: any) => {
    toast.error(err?.message || "An error occurred");
  },
});

function cancel() {
  closeModal();
}

async function handleFormSubmit(values: any) {
  const payload = {
    waypoints: values.waypoints || [],
    commodities: values.commodities || [],
    packagings: values.packagings || [],
    agents: values.agents || [],
    productType: values.productType || [],
  };
  mutation.mutate(payload);
}
</script>
