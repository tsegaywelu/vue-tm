<template>
  <FormModalParent
    modal-style="full"
    title="Add Route"
    subtitle="Select a route and configure waypoint pricing"
    :form-id="formId"
    :values="initialValues"
    :submit-handler="handleFormSubmit"
    @close="cancel"
  >
    <template #center>
      <ContractRouteForm mode="add" :context="props.data.context" />
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
          Add Route
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { closeModal } from "@customizer/modal-x";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { useToastStore } from "@/store/toastStore";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import ContractRouteForm from "../settings/Contract/ContractRouteForm.vue";
import { add_contract_route } from "../../api/settings.api";

export type ReturnType = boolean;
export type Props = {
  contractId: string;
  context?: "carrier" | "shipper";
};

const props = defineProps<{ data: Props; close: (res: ReturnType) => void }>();
const toast = useToastStore();
const queryClient = useQueryClient();
const formId = "contract-route-add-form";

const initialValues = {
  route: "",
  commodities: [],
  packagings: [],
  agents: [],
  productType: [],
  waypoints: [],
};

const mutation = useMutation({
  mutationFn: (data: any) => add_contract_route(props.data.contractId, data),
  onSuccess: (res) => {
    if (res.success) {
      toast.success("Route added to contract successfully");
      queryClient.invalidateQueries({ queryKey: ["contract", props.data.contractId] });
      props.close(true);
    } else {
      toast.error(res.error || "Failed to add route");
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
    route: values.route,
    waypoints: values.waypoints || [],
    commodities: values.commodities || [],
    packagings: values.packagings || [],
    agents: values.agents || [],
    productType: values.productType || [],
  };
  mutation.mutate(payload);
}
</script>
