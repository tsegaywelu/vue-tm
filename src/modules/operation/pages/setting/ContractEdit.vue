<template>
  <div class="p-6">
    <div v-if="isLoading" class="flex justify-center py-20">
      <i class="mdi mdi-loading mdi-spin text-4xl text-primary"></i>
    </div>

    <Form v-else-if="initialValues" :id="formId" :values="initialValues" :onSubmit="handleSubmit">
      <template #default>
        <ContractForm>
          <template #actions="{ addedRoutes, counterpartyId }">
            <Button variant="outline" @click="router.back()">Discard Changes</Button>
            <SubmitButton :disabled="!counterpartyId || addedRoutes.length === 0">
              Update Contract
            </SubmitButton>
          </template>
        </ContractForm>
      </template>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import ContractForm from "../../components/settings/Contract/ContractForm.vue";
import Button from "@/components/Button.vue";
import Form from "@/components/form/Form.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { fetch_contract_details, update_contract } from "../../api/settings.api";
import { useToastStore } from "@/store/toastStore";

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const queryClient = useQueryClient();
const formId = "edit-contract-form";
const contractId = route.params.id as string;

const { data: response, isLoading } = useQuery({
  queryKey: ["contract", contractId],
  queryFn: () => fetch_contract_details(contractId),
  enabled: !!contractId,
});

const initialValues = computed(() => {
  if (!response.value?.data) return null;
  const contract = (response.value.data as any).result || response.value.data;
  return {
    shipper: contract.shipper?._id || '',
    routes: contract.routes || [],
    tempRouteId: '',
    tempCommodities: [],
    tempPackagings: [],
    tempAgents: [],
    tempProductTypes: [],
  };
});

const mutation = useMutation({
  mutationFn: (data: any) => update_contract(contractId, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["contract-list"] });
    queryClient.invalidateQueries({ queryKey: ["contract", contractId] });
  },
});

const handleSubmit = async (values: any) => {
  try {
    if (!values.routes || values.routes.length === 0) {
      toast.error("Please add at least one route to the contract");
      return;
    }
    const payload = {
      shipper: values.shipper,
      routes: values.routes.map((r: any) => ({
        route: r.route,
        waypoints: r.waypoints.map((wp: any) => ({
          waypoint: wp.waypoint,
          vehiclePricing: wp.vehiclePricing.map((vp: any) => ({
            ...vp,
            pricePerUnit: Number(vp.pricePerUnit),
          })),
        })),
        commodities: r.commodities,
        packagings: r.packagings,
        agents: r.agents,
        productType: r.productType,
      })),
    };
    const res = await mutation.mutateAsync(payload);
    if (res.success) {
      toast.success("Contract updated successfully");
      router.push("/setting/contracts");
    } else {
      toast.error(res.error || "Failed to update contract");
    }
  } catch (err: any) {
    toast.error(err.message || "An unexpected error occurred");
  }
};
</script>
