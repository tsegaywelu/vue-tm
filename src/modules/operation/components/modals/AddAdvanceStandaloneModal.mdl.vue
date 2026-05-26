<template>
  <FormModalParent
    title="Add Advance Payment"
    subtitle="Create an advance for a driver or shipment"
    form-id="advanceStandaloneForm"
    :submit-handler="handleFinalSubmit"
    modal-style="auto"
    :values="initialValues"
  >
    <template #center="{ form }">
      <!-- Section tabs — all clickable, free navigation -->
      <div class="flex items-center justify-between mb-8 relative">
        <div class="absolute left-0 top-4 w-full h-0.5 bg-gray-100 -z-10"></div>
        <div
          v-for="(stepName, index) in stepOrder"
          :key="stepName"
          class="flex flex-col items-center gap-2 bg-white px-2 cursor-pointer select-none"
          @click="currentStep = stepName"
        >
          <div
            class="size-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300"
            :class="
              currentStep === stepName
                ? 'primary-gradient text-white shadow-md shadow-primary/20 scale-110'
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            "
          >
            {{ index + 1 }}
          </div>
          <span
            class="text-[11px] font-bold uppercase tracking-wider transition-colors duration-200"
            :class="
              currentStep === stepName ? 'text-gray-900' : 'text-gray-400'
            "
          >
            {{ formatStepName(stepName) }}
          </span>
        </div>
      </div>

      <!-- Header fields -->
      <div class="flex flex-col gap-6 mb-6">
        <component
          :is="form.Subscribe"
          :selector="
            (state: any) => [
              state.values.operationalAdvance,
              state.values.advanceType,
            ]
          "
        >
          <template #default="[operationalAdvance, advanceType]">
            <div class="grid grid-cols-2 gap-4">
              <SelectInput
                name="operationalAdvance"
                label="Is Advance Operational?"
                :options="[
                  { label: 'Yes (linked to shipment)', value: 'true' },
                  { label: 'No (driver only)', value: 'false' },
                ]"
                :validation="{ required }"
              />
              <SelectInput
                name="advanceType"
                label="Advance Type"
                :options="[
                  { label: 'Fuel Only', value: 'FUEL_ONLY' },
                  { label: 'All', value: 'ALL' },
                ]"
                :validation="{ required }"
              />
              <SelectInput
                v-if="advanceType === 'FUEL_ONLY'"
                name="inventoryItem"
                label="Item"
                url="/inventory-items"
                label_key="name"
                value_key="_id"
                :validation="{ required }"
              />
            </div>

            <!-- Operational: shipment search + derived fields -->
            <div
              v-if="operationalAdvance === 'true'"
              class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg mt-2"
            >
              <SelectInput
                name="shipment"
                label="Select Shipment"
                url="/shipment"
                label_key="shipmentCode"
                value_key="_id"
                searchable
                :validation="{ required }"
                @select="(opt: any) => onShipmentSelected(opt?.item, form)"
              />
              <Input
                name="driverName"
                label="Driver"
                :attributes="{
                  disabled: true,
                  placeholder: 'Auto-filled on shipment select',
                }"
              />
              <Input
                name="routeName"
                label="Route"
                :attributes="{
                  disabled: true,
                  placeholder: 'Auto-filled on shipment select',
                }"
              />
              <Input
                name="vehiclePlate"
                label="Vehicle"
                :attributes="{
                  disabled: true,
                  placeholder: 'Auto-filled on shipment select',
                }"
              />
            </div>

            <!-- Non-operational: driver dropdown -->
            <div
              v-if="operationalAdvance === 'false'"
              class="bg-gray-50 p-4 rounded-lg mt-2"
            >
              <SelectInput
                name="driver"
                label="Driver"
                url="/driver"
                :label_key="
                  (item: any) =>
                    [item.firstName, item.middleName, item.lastName]
                      .filter(Boolean)
                      .join(' ')
                "
                value_key="_id"
                :params="
                  (state) => ({ q: undefined, 'name[regexAny]': state.search })
                "
                searchable
                :validation="{ required }"
              />
            </div>
          </template>
        </component>
      </div>

      <!-- Fuel section -->
      <div v-show="currentStep === 'fuel'" class="flex flex-col gap-6">
        <div class="flex justify-between items-center">
          <h3 class="font-semibold text-gray-700">Fuel Advances</h3>
          <Button variant="outline" size="sm" @click="addFuelList"
            >+ Add Another</Button
          >
        </div>

        <div
          v-for="(_, index) in fuelAdvancesList"
          :key="'fuel-' + index"
          class="border border-gray-200 p-4 rounded-lg flex flex-col gap-4 relative"
        >
          <button
            v-if="fuelAdvancesList.length > 1"
            type="button"
            class="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold"
            @click="removeFuelList(index)"
          >
            ✕
          </button>
          <div class="grid grid-cols-2 gap-4">
            <SelectInput
              :name="`fuel_${index}_paymentType`"
              label="Payment Type"
              :options="[
                { label: 'Cash', value: 'CASH' },
                { label: 'Telebirr', value: 'TELEBIRR' },
                { label: 'Voucher', value: 'VOUCHER' },
              ]"
              :validation="currentStep === 'fuel' ? { required } : {}"
            />
            <Input
              :name="`fuel_${index}_fuelStation`"
              label="Fuel Station"
              :attributes="{ placeholder: 'Station Name' }"
            />
            <Input
              :name="`fuel_${index}_fuelPrice`"
              label="Fuel Price"
              type="number"
              :attributes="{
                placeholder: '0.00',
                step: '0.01',
                onInput: () => setFuelAmount(form, index),
              }"
            />
            <Input
              :name="`fuel_${index}_refueledAmount`"
              label="Fuel Liters"
              type="number"
              :attributes="{
                placeholder: '0.00',
                step: '0.01',
                onInput: () => setFuelAmount(form, index),
              }"
            />
            <Input
              :name="`fuel_${index}_amount`"
              label="Cash Amount"
              type="number"
              :attributes="{
                placeholder: '0.00',
                step: '0.01',
                readonly: true,
                class: 'bg-gray-50 cursor-default',
              }"
            />
          </div>
          <Input
            :name="`fuel_${index}_remark`"
            label="Remark"
            :attributes="{ placeholder: 'Notes...' }"
          />
        </div>
      </div>

      <!-- Per Diem section -->
      <div v-show="currentStep === 'per_diem'" class="flex flex-col gap-6">
        <div class="flex justify-between items-center">
          <h3 class="font-semibold text-gray-700">Per Diem Expenses</h3>
          <Button variant="outline" size="sm" @click="addPerDiemList"
            >+ Add Another</Button
          >
        </div>

        <div
          v-for="(_, index) in perDiemExpensesList"
          :key="'pd-' + index"
          class="border border-gray-200 p-4 rounded-lg flex flex-col gap-4 relative"
        >
          <button
            v-if="perDiemExpensesList.length > 1"
            type="button"
            class="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold"
            @click="removePerDiemList(index)"
          >
            ✕
          </button>
          <div class="grid grid-cols-2 gap-4">
            <SelectInput
              :name="`pd_${index}_category`"
              label="Category"
              :options="[
                { label: 'Based on Days Driven', value: 'DAYS_DRIVEN' },
                { label: 'Based on Weight', value: 'WEIGHT' },
              ]"
            />
            <Input
              :name="`pd_${index}_amount`"
              label="Amount"
              type="number"
              :attributes="{ placeholder: '0.00', step: '0.01' }"
            />
            <Input
              v-if="form.state.values[`pd_${index}_category`] === 'DAYS_DRIVEN'"
              :name="`pd_${index}_daysDriven`"
              label="Days Driven"
              type="number"
            />
            <Input
              v-if="form.state.values[`pd_${index}_category`] === 'WEIGHT'"
              :name="`pd_${index}_weight`"
              label="Weight"
              type="number"
            />
          </div>
          <Input
            :name="`pd_${index}_remark`"
            label="Remark"
            :attributes="{ placeholder: 'Notes...' }"
          />
        </div>
      </div>

      <!-- Other Expenses section -->
      <div v-show="currentStep === 'other'" class="flex flex-col gap-6">
        <div class="flex justify-between items-center">
          <h3 class="font-semibold text-gray-700">Other Expenses</h3>
          <Button variant="outline" size="sm" @click="addOtherList"
            >+ Add Another</Button
          >
        </div>

        <div
          v-for="(_, index) in otherExpensesList"
          :key="'other-' + index"
          class="border border-gray-200 p-4 rounded-lg flex flex-col gap-4 relative"
        >
          <button
            v-if="otherExpensesList.length > 1"
            type="button"
            class="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold"
            @click="removeOtherList(index)"
          >
            ✕
          </button>
          <div class="grid grid-cols-2 gap-4">
            <SelectInput
              :name="`other_${index}_expenseType`"
              label="Reason"
              url="/expense-type"
              label_key="name"
              value_key="_id"
            />
            <Input
              :name="`other_${index}_amount`"
              label="Amount"
              type="number"
              :attributes="{ placeholder: '0.00', step: '0.01' }"
            />
          </div>
          <Input
            :name="`other_${index}_remark`"
            label="Remark"
            :attributes="{ placeholder: 'Notes...' }"
          />
        </div>
      </div>
    </template>

    <template #bottom>
      <div class="flex justify-end gap-3">
        <SubmitButton :loading="isLoading" form="advanceStandaloneForm">
          Complete
        </SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import { closeModal } from "@customizer/modal-x";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { required } from "@/utils/validations";
import { useToastStore } from "@/store/toastStore";
import * as api from "../../api/operation.api";

export type Props = Record<string, never>;
export type ReturnType = boolean;

const props = defineProps<{ data?: Props; close: (res: ReturnType) => void }>();

const toast = useToastStore();
const isLoading = ref(false);

const stepOrder = ["fuel", "per_diem", "other"] as const;
type Step = (typeof stepOrder)[number];
const currentStep = ref<Step>("fuel");

function formatStepName(step: string) {
  return step.replace("_", " ");
}

const fuelAdvancesList = ref([0]);
const perDiemExpensesList = ref([0]);
const otherExpensesList = ref([0]);

const selectedShipmentDriverId = ref("");

function onShipmentSelected(shipment: any, form: any) {
  if (!shipment) return;
  selectedShipmentDriverId.value = shipment.driver?._id || "";
  const driverName = [
    shipment.driver?.firstName,
    shipment.driver?.middleName,
    shipment.driver?.lastName,
  ]
    .filter(Boolean)
    .join(" ");
  form.setFieldValue("driverName", driverName);
  form.setFieldValue("routeName", shipment.route?.routeName || "");
  form.setFieldValue("vehiclePlate", shipment.vehicle?.plateNumber || "");
}

async function setFuelAmount(form: any, index: number) {
  await nextTick();
  const vals = form?.state?.values;
  const price = Number(vals?.[`fuel_${index}_fuelPrice`]) || 0;
  const liters = Number(vals?.[`fuel_${index}_refueledAmount`]) || 0;
  form?.setFieldValue(`fuel_${index}_amount`, price * liters);
}

function addFuelList() {
  fuelAdvancesList.value.push(fuelAdvancesList.value.length);
}
function removeFuelList(i: number) {
  fuelAdvancesList.value.splice(i, 1);
}
function addPerDiemList() {
  perDiemExpensesList.value.push(perDiemExpensesList.value.length);
}
function removePerDiemList(i: number) {
  perDiemExpensesList.value.splice(i, 1);
}
function addOtherList() {
  otherExpensesList.value.push(otherExpensesList.value.length);
}
function removeOtherList(i: number) {
  otherExpensesList.value.splice(i, 1);
}

const initialValues = {
  operationalAdvance: "true",
  advanceType: "ALL",
  inventoryItem: "",
  shipment: "",
  driver: "",
  driverName: "",
  routeName: "",
  vehiclePlate: "",
};

async function handleFinalSubmit(values: Record<string, any>) {
  const isOperational = values.operationalAdvance === "true";
  const isFuelOnly = values.advanceType === "FUEL_ONLY";

  const fuelAdvances = fuelAdvancesList.value
    .map((_, i) => ({
      paymentType: values[`fuel_${i}_paymentType`] || "",
      fuelStation: values[`fuel_${i}_fuelStation`] || "",
      fuelPrice: Number(values[`fuel_${i}_fuelPrice`]) || 0,
      refueledAmount: Number(values[`fuel_${i}_refueledAmount`]) || 0,
      amount: Number(values[`fuel_${i}_amount`]) || 0,
      remark: values[`fuel_${i}_remark`] || "",
    }))
    .filter((f) => f.amount > 0 || f.paymentType);

  const perDiemExpenses = perDiemExpensesList.value
    .map((_, i) => ({
      category: values[`pd_${i}_category`] || "",
      amount: Number(values[`pd_${i}_amount`]) || 0,
      daysDriven: Number(values[`pd_${i}_daysDriven`]) || null,
      weight: Number(values[`pd_${i}_weight`]) || null,
      remark: values[`pd_${i}_remark`] || "",
    }))
    .filter((p) => p.amount > 0);

  const otherExpenses = otherExpensesList.value
    .map((_, i) => ({
      expenseType: values[`other_${i}_expenseType`] || "",
      amount: Number(values[`other_${i}_amount`]) || 0,
      remark: values[`other_${i}_remark`] || "",
    }))
    .filter((o) => o.amount > 0);

  if (
    !fuelAdvances.length &&
    !perDiemExpenses.length &&
    !otherExpenses.length
  ) {
    toast.error("Fill at least one section (Fuel, Per Diem, or Other)");
    return;
  }

  const driverId = isOperational
    ? selectedShipmentDriverId.value
    : values.driver;

  isLoading.value = true;
  try {
    if (isFuelOnly) {
      const payload: any = {
        operationalAdvance: isOperational,
        item: values.inventoryItem,
        driver: driverId,
        fuelAdvances,
        perDiemExpenses: [],
        otherExpenses: [],
      };
      if (isOperational) payload.shipment = values.shipment;

      const res = await api.create_fuel_advance(payload);
      if (res.status === 200 || res.status === 201) {
        toast.success("Fuel Advance added successfully!");
        closeModal(true);
      } else {
        toast.error("Failed to add advance");
      }
    } else {
      const payload: any = {
        operationalAdvance: isOperational,
        driver: driverId,
        fuelAdvances,
        perDiemExpenses,
        otherExpenses,
      };
      if (isOperational) payload.shipment = values.shipment;

      const res = await api.create_advance(payload);
      if (res.status === 200 || res.status === 201) {
        toast.success("Advance added successfully!");
        closeModal(true);
      } else {
        toast.error(res.error || "Failed to add advance");
      }
    }
  } catch (error: any) {
    toast.error(
      error.response?.data?.description || "An unexpected error occurred.",
    );
  } finally {
    isLoading.value = false;
  }
}
</script>
