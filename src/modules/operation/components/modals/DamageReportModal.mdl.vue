<template>
  <FormModalParent
    title="Add Shipment Damage"
    description="Record details of damaged items in this shipment."
    form-id="damageReportForm"
    :initial-values="initialValues"
    :on-submit="handleSubmit"
    @close="closeModal()"
  >
    <template #center="{ form }">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DateInput
          name="damageDate"
          label="Damage Date"
          :validation="{ required }"
        />
        <Input name="location" label="Location" :validation="{ required }" />
        <SelectInput
          name="paymentToBeReceivedFrom"
          label="Payment Received From"
          :options="[
            { label: 'Driver', value: 'DRIVER' },
            { label: 'Insurance', value: 'INSURANCE' },
            { label: 'Transporter', value: 'TRANSPORTER' },
            { label: 'Third Party', value: 'THIRD_PARTY' },
          ]"
          :validation="{ required }"
        />
      </div>

      <div class="mt-8">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Items Details</h3>
        <div class="space-y-4">
          <div
            v-for="(_, index) in itemsList"
            :key="index"
            class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-gray-50 p-4 rounded-2xl relative"
          >
            <div class="md:col-span-4">
              <SelectInput
                :name="`items[${index}].item`"
                label="Commodity"
                url="/commodity"
                label_key="name"
                value_key="_id"
                :validation="{ required }"
              />
            </div>
            <div class="md:col-span-2">
              <SelectInput
                :name="`items[${index}].uom`"
                label="UOM"
                :options="[
                  { label: 'PCS', value: 'pcs' },
                  { label: 'CTN', value: 'ctn' },
                  { label: 'BOX', value: 'box' },
                  { label: 'BAG', value: 'bag' },
                  { label: 'SET', value: 'set' },
                  { label: 'KG', value: 'kg' },
                  { label: 'DOZ', value: 'doz' },
                  { label: 'LTR', value: 'ltr' },
                  { label: 'GAL', value: 'gal' },
                  { label: 'BULK', value: 'bulk' },
                ]"
                :validation="{ required }"
              />
            </div>
            <div class="md:col-span-2">
              <Input
                :name="`items[${index}].unitPrice`"
                label="Unit Price"
                :attributes="{ type: 'number' }"
                :validation="{ required }"
              />
            </div>
            <div class="md:col-span-2">
              <Input
                :name="`items[${index}].quantity`"
                label="Quantity"
                :attributes="{ type: 'number' }"
                :validation="{ required }"
              />
            </div>
            <div class="md:col-span-2 flex justify-end pb-2">
              <button
                v-if="itemsList.length > 1"
                type="button"
                class="text-red-500 hover:text-red-700 p-2"
                @click="removeItem(index, form)"
              >
                <i class="mdi mdi-delete text-xl"></i>
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          class="mt-4 flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs"
          @click="addItem(form)"
        >
          <i class="mdi mdi-plus-circle-outline text-lg"></i>
          Add Item
        </button>
      </div>

      <div class="mt-8 flex flex-col items-end gap-2">
        <div class="text-sm font-medium text-gray-500">
          Subtotal:
          {{ currencyFormatter(calculateTotal(form.state.values.items)) }}
        </div>
        <ToggleInput name="vatInclusive" label="VAT Inclusive (15%)" />
        <div class="text-2xl font-black text-primary mt-2">
          Total:
          {{
            currencyFormatter(
              calculateTotal(
                form.state.values.items,
                form.state.values.vatInclusive,
              ),
            )
          }}
        </div>
      </div>

      <div class="mt-6">
        <TextareaInput name="remark" label="General Remark" />
      </div>
    </template>

    <template #bottom>
      <div class="flex justify-end gap-3">
        <SubmitButton :loading="isLoading" form="damageReportForm">
          Submit Damage Report
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { closeModal } from "@customizer/modal-x";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import DateInput from "@/components/form/DateInput.vue";
import ToggleInput from "@/components/form/ToggleInput.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { required } from "@/utils/validations";
import { currencyFormatter } from "@/utils/utils";
import { add_shipment_damage } from "../../api/operation.api";
import { useToastStore } from "@/store/toastStore";

export type Props = {
  shipmentId: string;
};

export type ReturnType = boolean;

const props = defineProps<{ data: Props; close: (res: ReturnType) => void }>();

const toast = useToastStore();
const isLoading = ref(false);
const itemsList = ref([0]);

const initialValues = {
  shipment: props.data.shipmentId,
  damageDate: new Date().toISOString().split("T")[0],
  location: "",
  paymentToBeReceivedFrom: "DRIVER",
  items: [{ item: "", uom: "", unitPrice: 0, quantity: 0, remark: "" }],
  vatInclusive: false,
  remark: "",
};

function addItem(form: any) {
  itemsList.value.push(itemsList.value.length);
  const currentItems = form.state.values.items || [];
  form.setFieldValue("items", [
    ...currentItems,
    { item: "", uom: "", unitPrice: 0, quantity: 0, remark: "" },
  ]);
}

function removeItem(index: number, form: any) {
  itemsList.value.splice(index, 1);
  const currentItems = [...(form.state.values.items || [])];
  currentItems.splice(index, 1);
  form.setFieldValue("items", currentItems);
}

function calculateTotal(items: any[], vatInclusive = false) {
  const subtotal =
    items?.reduce(
      (sum, i) => sum + (Number(i.unitPrice) || 0) * (Number(i.quantity) || 0),
      0,
    ) || 0;
  return vatInclusive ? subtotal * 1.15 : subtotal;
}

async function handleSubmit(values: any) {
  isLoading.value = true;
  try {
    const payload = {
      ...values,
      items: values.items.map((i: any) => ({
        ...i,
        totalPrice: Number(i.unitPrice) * Number(i.quantity),
      })),
      total: calculateTotal(values.items, values.vatInclusive),
    };

    const res = await add_shipment_damage(payload);
    if (res.success) {
      toast.success("Damage report submitted successfully");
      props.close(true);
    } else {
      toast.error(res.error || "Failed to submit damage report");
    }
  } catch (err: any) {
    toast.error(err.message || "An error occurred");
  } finally {
    isLoading.value = false;
  }
}
</script>
