<template>
  <div class="h-full flex flex-col">
    <div v-if="isLoading" class="flex justify-center py-20">
      <i class="mdi mdi-loading mdi-spin text-4xl text-primary"></i>
    </div>

    <Form
      v-else-if="initialValues"
      id="payment-collection-edit"
      :values="initialValues"
      :onSubmit="handleFormSubmit"
    >
      <template #default>
        <Colapsable
          title="Collection Details"
          description="Update reference, status, and voucher numbers."
        >
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Input
              name="reference"
              label="Reference"
              :attributes="{ placeholder: 'Enter reference' }"
            />
            <SelectInput
              name="status"
              label="Status"
              :options="statusOptions"
              :attributes="{ placeholder: 'Select status' }"
            />
            <Input name="crv" label="CRV" :attributes="{ placeholder: 'CRV' }" />
            <Input name="csi" label="CSI" :attributes="{ placeholder: 'CSI' }" />
          </div>
        </Colapsable>

        <Colapsable
          title="Associated Shipments"
          description="Manage the shipments included in this payment collection."
        >
          <ShipmentsInput name="shipments" />
        </Colapsable>

        <div class="pt-10 flex justify-end gap-4">
          <Button type="button" variant="outline" @click="router.back()">Cancel</Button>
          <SubmitButton variant="primary" :loading="updateMutation.isPending.value">
            Save Changes
          </SubmitButton>
        </div>
      </template>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { fetch_invoice_details, update_payment_request } from "../../api/invoice.api";
import Form from "@/components/form/Form.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import Button from "@/components/Button.vue";
import ShipmentsInput from "../../components/finance/ShipmentsInput.vue";
import { useToastStore } from "@/store/toastStore";

const route = useRoute();
const router = useRouter();
const queryClient = useQueryClient();
const toast = useToastStore();
const invoiceId = route.params.id as string;

const statusOptions = [
  { label: "Approved", value: "PAYMENT_APPROVED" },
  { label: "Paid / Collected", value: "PAID" },
  { label: "Rejected", value: "REJECTED" },
];

const { data: response, isLoading } = useQuery({
  queryKey: ["payment-collection", invoiceId],
  queryFn: () => fetch_invoice_details(invoiceId),
  enabled: !!invoiceId,
});

const originalInvoice = computed<any>(() => response.value?.data);

const initialValues = computed(() => {
  const inv = originalInvoice.value;
  if (!inv) return null;
  return {
    reference: inv.reference || "",
    status: inv.status || "PAYMENT_APPROVED",
    crv: inv.crv || "",
    csi: inv.csi || "",
    shipments: inv.shipments || [],
  };
});

const updateMutation = useMutation({
  mutationFn: (data: any) => update_payment_request(invoiceId, data),
  onSuccess: () => {
    toast.success("Collection updated successfully");
    queryClient.invalidateQueries({ queryKey: ["payment-collection", invoiceId] });
    router.back();
  },
  onError: (error: any) => {
    toast.error(error.response?.data?.description || "Failed to update collection");
  },
});

const handleFormSubmit = async (values: Record<string, any>) => {
  const shipmentIds = (values.shipments || []).map((s: any) => s._id);
  const totalAmount = (values.shipments || []).reduce(
    (sum: number, s: any) => sum + (s.totalPrice || 0),
    0,
  );
  updateMutation.mutate({
    reference: values.reference,
    status: values.status,
    crv: values.crv,
    csi: values.csi,
    totalAmount,
    shipments: shipmentIds,
  });
};
</script>
