<template>
  <FormModalParent
    title="Approve Requisition"
    form-id="approveRequisitionForm"
    :submit-handler="handleFinalSubmit"
    modal-style="large"
    :values="formValues"
  >
    <template #center>
      <div class="flex flex-col gap-4">
        <p class="text-sm text-gray-500">
          Review the requested items for requisition 
          <span class="font-bold text-gray-700">{{ row.referenceNumber }}</span> 
          and set the approved quantities.
        </p>

        <div class="space-y-4 mt-4">
          <div 
            v-for="(item, index) in row.items" 
            :key="index"
            class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50/50 border border-gray-100 p-5 rounded-2xl relative group items-center"
          >
            <div class="md:col-span-1">
              <div class="text-xs text-gray-500 font-medium mb-1">Item Name</div>
              <div class="text-sm font-bold text-gray-900">
                {{ item.inventoryItem?.name || item.itemName || 'Unknown Item' }}
              </div>
            </div>
            <div class="md:col-span-1">
              <div class="text-xs text-gray-500 font-medium mb-1">Requested Quantity</div>
              <div class="text-sm font-bold text-gray-900">
                {{ item.quantity }}
              </div>
            </div>
            <div class="md:col-span-1">
              <Input
                :name="'approvedQuantity_' + index"
                label="Approved Quantity"
                type="number"
                placeholder="Qty"
                :validation="{ required }"
              />
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #bottom>
      <div class="flex justify-end gap-3">
        <Button size="md" variant="outline" @click="closeModal()">Cancel</Button>
        <SubmitButton form="approveRequisitionForm" :loading="isPending">Approve</SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useMutation } from "@tanstack/vue-query";
import { closeModal } from "@customizer/modal-x";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Input from "@/components/form/Input.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { required } from "@/utils/validations";
import { update_store_requisition_status } from "../../api/inventory.api";
import { useToastStore } from "@/store/toastStore";

const toast = useToastStore();

// [MODAL-X] Managed Props
export type Props = {
  requisition: any;
  onSuccess?: () => void;
};

const props = defineProps<{ data: Props; close: (val?: any) => void }>();

const row = computed(() => props.data.requisition);

const formValues = computed(() => {
  const vals: Record<string, any> = {};
  if (row.value?.items) {
    row.value.items.forEach((item: any, index: number) => {
      vals[`approvedQuantity_${index}`] = item.quantity; // Default to requested
    });
  }
  return vals;
});

const { mutateAsync, isPending } = useMutation({
  mutationFn: async (payload: any) => {
    return update_store_requisition_status(row.value._id, "APPROVE", payload);
  },
});

async function handleFinalSubmit(values: Record<string, any>) {
  const payload = {
    items: row.value.items.map((i: any, index: number) => ({
      item: i.inventoryItem?._id || i.item?._id || i.item,
      approvedQuantity: Number(values[`approvedQuantity_${index}`]) || 0,
      gtvRemainingQuantity: Number(values[`approvedQuantity_${index}`]) || 0,
      prRemainingQuantity: Number(values[`approvedQuantity_${index}`]) || 0,
      quantity: Number(i.quantity),
      remark: i.remark || "",
    })),
  };

  const res = await mutateAsync(payload);
  if (res.success) {
    toast.success("Requisition approved successfully!");
    props.data.onSuccess?.();
    props.close(true);
  } else {
    toast.error(res.error || "Failed to approve requisition");
  }
}
</script>
