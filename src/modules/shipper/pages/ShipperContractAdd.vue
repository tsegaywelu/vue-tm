<template>
  <Form :id="formId" :values="initialValues" :onSubmit="handleSubmit">
    <template #default>
      <ContractForm mode="shipper">
        <template #actions="{ addedRoutes, counterpartyId }">
          <Button variant="outline" @click="router.back()">Discard</Button>
          <SubmitButton :disabled="!counterpartyId || addedRoutes.length === 0">
            Create Contract
          </SubmitButton>
        </template>
      </ContractForm>
    </template>
  </Form>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import ContractForm from "../../operation/components/settings/Contract/ContractForm.vue";
import Button from "@/components/Button.vue";
import Form from "@/components/form/Form.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { create_shipper_contract } from "../api/shipper.api";
import { useToastStore } from "@/store/toastStore";

const router = useRouter();
const toast = useToastStore();
const formId = "shipper-add-contract-form";
const queryClient = useQueryClient();

const initialValues = {
  carrier: "",
  routes: [],
  tempRouteId: "",
  tempCommodities: [],
  tempPackagings: [],
  tempAgents: [],
  tempProductTypes: [],
};

const mutation = useMutation({
  mutationFn: (data: any) => create_shipper_contract(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["shipper-contracts-list"] });
  },
});

const handleSubmit = async (values: any) => {
  try {
    if (!values.routes || values.routes.length === 0) {
      toast.error("Please add at least one route to the contract");
      return;
    }
    const payload = {
      carrier: values.carrier,
      routes: values.routes.map((r: any) => ({
        route: r.route,
        waypoints: r.waypoints.map((wp: any) => ({
          waypoint: wp.waypoint,
          vehiclePricing: wp.vehiclePricing,
        })),
        commodities: r.commodities,
        packagings: r.packagings,
        agents: r.agents,
        productType: r.productType,
      })),
    };
    const res = await mutation.mutateAsync(payload);
    if (res.success) {
      toast.success("Contract created successfully");
      router.push("/shipper/contracts");
    } else {
      toast.error(res.error || "Failed to create contract");
    }
  } catch (err: any) {
    toast.error(err.message || "An unexpected error occurred");
  }
};
</script>
