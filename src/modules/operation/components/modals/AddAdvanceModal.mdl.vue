<template>
  <FormModalParent
    title="Add Advance Payment"
    :subtitle="`Shipment: ${data.shipment?.shipmentCode}`"
    form-id="advancePaymentForm"
    @submit="handleFinalSubmit"
    modal-style="auto"
    :values="stepFields"
    :key="currentIndex"
  >
    <template #center="{ form }">
      <div class="flex items-center justify-between mb-8 relative z-0">
        <div
          class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-100 -z-10"
        ></div>
        <div
          class="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 primary-gradient -z-10 transition-all duration-300"
          :style="{
            width: `${(currentIndex / (stepOrder.length - 1)) * 100}%`,
          }"
        ></div>
        <div
          v-for="(stepName, index) in stepOrder"
          :key="stepName"
          class="flex flex-col items-center gap-2 bg-white px-2"
        >
          <div
            class="size-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300"
            :class="[
              index <= currentIndex
                ? 'primary-gradient text-white shadow-md shadow-primary/20 scale-110'
                : 'bg-gray-100 text-gray-400',
            ]"
          >
            <span v-if="index < currentIndex">✓</span>
            <span v-else>{{ index + 1 }}</span>
          </div>
          <span
            class="text-[11px] font-bold uppercase tracking-wider transition-colors duration-300"
            :class="index <= currentIndex ? 'text-gray-900' : 'text-gray-400'"
          >
            {{ formatStepName(stepName) }}
          </span>
        </div>
      </div>

      <!-- Always Visible Section -->
      <div class="flex flex-col gap-6 mb-6">
        <component
          :is="form.Subscribe"
          :selector="(state: any) => [state.values.advanceType]"
        >
          <template #default="[advanceType]">
            <div class="grid grid-cols-2 gap-4">
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
          </template>
        </component>

        <div class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
          <Input
            name="shipmentCode"
            label="Shipment"
            :attributes="{ disabled: true }"
          />
          <Input
            name="routeName"
            label="Route"
            :attributes="{ disabled: true }"
          />
          <Input
            name="driverName"
            label="Driver"
            :attributes="{ disabled: true }"
          />
          <Input
            name="vehiclePlate"
            label="Vehicle"
            :attributes="{ disabled: true }"
          />
        </div>
      </div>

      <!-- Basic & Fuel Step -->
      <div v-if="currentStep === 'fuel'" class="flex flex-col gap-6">
        <div class="flex justify-between items-center mt-4">
          <h3 class="font-semibold text-gray-700">Fuel Advances</h3>
          <Button variant="outline" size="sm" @click="addFuelList">
            + Add Another
          </Button>
        </div>

        <div
          v-for="(item, index) in fuelAdvancesList"
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
              :validation="{ required }"
            />
            <Input
              :name="`fuel_${index}_fuelStation`"
              label="Fuel Station"
              :attributes="{ placeholder: 'Station Name' }"
              :validation="{ required }"
            />
            <Input
              :name="`fuel_${index}_fuelPrice`"
              label="Fuel Price"
              type="number"
              :attributes="{ placeholder: '0.00', step: '0.01' }"
            />
            <Input
              :name="`fuel_${index}_refueledAmount`"
              label="Fuel Liters"
              type="number"
              :attributes="{ placeholder: '0.00', step: '0.01' }"
            />
            <Input
              :name="`fuel_${index}_amount`"
              label="Cash Amount"
              type="number"
              :attributes="{ placeholder: '0.00', step: '0.01' }"
              :validation="{ required }"
            />
          </div>
          <Input
            :name="`fuel_${index}_remark`"
            label="Remark"
            :attributes="{ placeholder: 'Notes...' }"
          />
        </div>
      </div>

      <!-- Per Diem Step -->
      <div v-if="currentStep === 'per_diem'" class="flex flex-col gap-6">
        <div class="flex justify-between items-center">
          <h3 class="font-semibold text-gray-700">Per Diem Expenses</h3>
          <Button variant="outline" size="sm" @click="addPerDiemList">
            + Add Another
          </Button>
        </div>

        <div
          v-for="(item, index) in perDiemExpensesList"
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
              :validation="{ required }"
            />
            <Input
              :name="`pd_${index}_amount`"
              label="Amount"
              type="number"
              :attributes="{ placeholder: '0.00', step: '0.01' }"
              :validation="{ required }"
            />
            <Input
              v-if="form.state.values[`pd_${index}_category`] === 'DAYS_DRIVEN'"
              :name="`pd_${index}_daysDriven`"
              label="Days Driven"
              type="number"
              :validation="{ required }"
            />
            <Input
              v-if="form.state.values[`pd_${index}_category`] === 'WEIGHT'"
              :name="`pd_${index}_weight`"
              label="Weight"
              type="number"
              :validation="{ required }"
            />
          </div>
          <Input
            :name="`pd_${index}_remark`"
            label="Remark"
            :attributes="{ placeholder: 'Notes...' }"
          />
        </div>
      </div>

      <!-- Other Expenses Step -->
      <div v-if="currentStep === 'other'" class="flex flex-col gap-6">
        <div class="flex justify-between items-center">
          <h3 class="font-semibold text-gray-700">Other Expenses</h3>
          <Button variant="outline" size="sm" @click="addOtherList">
            + Add Another
          </Button>
        </div>

        <div
          v-for="(item, index) in otherExpensesList"
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
              :validation="{ required }"
            />
            <Input
              :name="`other_${index}_amount`"
              label="Amount"
              type="number"
              :attributes="{ placeholder: '0.00', step: '0.01' }"
              :validation="{ required }"
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

    <template #bottom="{ form }">
      <div class="flex justify-end gap-3">
        <Button
          v-if="currentIndex > 0"
          variant="secondary"
          size="md"
          @click="goBack(form)"
        >
          Back
        </Button>
        <component
          :is="form.Subscribe"
          :selector="(state: any) => [state.values.advanceType]"
        >
          <template #default="[advanceType]">
            <SubmitButton :loading="isLoading" form="advancePaymentForm">
              {{
                (currentStep === "fuel" && advanceType === "FUEL_ONLY") ||
                currentStep === "other"
                  ? "Complete"
                  : "Next Step"
              }}
            </SubmitButton>
          </template>
        </component>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { closeModal } from "@customizer/modal-x";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { required } from "@/utils/validations";
import { useToastStore } from "@/store/toastStore";
import * as api from "../../api/operation.api";
import type { Shipment } from "../../operation.types";

// [MODAL-X] AUTO-GENERATED INSTANCE
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.

export type Props = {
  shipment: Shipment;
};

const props = defineProps<{ data: Props; close: (res: any) => void }>();

const toast = useToastStore();
const isLoading = ref(false);

const shipment = props.data.shipment;
const driverName = shipment.driver
  ? `${shipment.driver.firstName} ${shipment.driver.lastName}`
  : "";
const vehiclePlate = shipment.vehicle?.plateNumber || "";
const shipmentCode = shipment.shipmentCode || "";
const routeName = shipment.route?.routeName || "";

const stepOrder = ["fuel", "per_diem", "other"] as const;
const currentStep = ref<(typeof stepOrder)[number]>("fuel");
const currentIndex = computed(() => stepOrder.indexOf(currentStep.value));

function formatStepName(step: string) {
  return step.replace("_", " ");
}

// Arrays to track dynamic lengths
const fuelAdvancesList = ref([0]);
const perDiemExpensesList = ref([0]);
const otherExpensesList = ref([0]);

function addFuelList() {
  fuelAdvancesList.value.push(fuelAdvancesList.value.length);
}
function removeFuelList(index: number) {
  fuelAdvancesList.value.splice(index, 1);
}

function addPerDiemList() {
  perDiemExpensesList.value.push(perDiemExpensesList.value.length);
}
function removePerDiemList(index: number) {
  perDiemExpensesList.value.splice(index, 1);
}

function addOtherList() {
  otherExpensesList.value.push(otherExpensesList.value.length);
}
function removeOtherList(index: number) {
  otherExpensesList.value.splice(index, 1);
}

// Persist fields across steps
const emptyFields = {
  advanceType: "ALL",
  inventoryItem: "",
  driverName,
  vehiclePlate,
  shipmentCode,
  routeName,
};

const stepFields = ref<Record<string, any>>(emptyFields);

function goBack(form: any) {
  Object.assign(stepFields.value, form.state.values);
  currentStep.value = stepOrder[currentIndex.value - 1];
}

async function handleFinalSubmit(values: Record<string, any>) {
  Object.assign(stepFields.value, values);

  const isFuelOnly = stepFields.value.advanceType === "FUEL_ONLY";

  if (currentStep.value === "fuel" && !isFuelOnly) {
    currentStep.value = stepOrder[currentIndex.value + 1];
    return;
  } else if (currentStep.value === "per_diem") {
    currentStep.value = stepOrder[currentIndex.value + 1];
    return;
  }

  // Final Submit
  isLoading.value = true;
  try {
    // Extract Fuel Advances
    const fuelAdvances = fuelAdvancesList.value
      .map((_, i) => ({
        paymentType: stepFields.value[`fuel_${i}_paymentType`] || "",
        fuelStation: stepFields.value[`fuel_${i}_fuelStation`] || "",
        fuelPrice: Number(stepFields.value[`fuel_${i}_fuelPrice`]) || 0,
        refueledAmount:
          Number(stepFields.value[`fuel_${i}_refueledAmount`]) || 0,
        amount: Number(stepFields.value[`fuel_${i}_amount`]) || 0,
        remark: stepFields.value[`fuel_${i}_remark`] || "",
      }))
      .filter((f) => f.paymentType !== "");

    if (isFuelOnly) {
      const payload = {
        shipment: shipment._id,
        operationalAdvance: true,
        item: stepFields.value.inventoryItem,
        driver: shipment.driver?._id,
        fuelAdvances,
        perDiemExpenses: [],
        otherExpenses: [],
      };

      const res = await api.create_fuel_advance(payload);
      if (res.status === 200 || res.status === 201) {
        toast.success("Fuel Advance added successfully!");
        closeModal(true);
      } else {
        toast.error("Failed to add advance");
      }
    } else {
      // Extract Per Diem
      const perDiemExpenses = perDiemExpensesList.value
        .map((_, i) => ({
          category: stepFields.value[`pd_${i}_category`] || "",
          amount: Number(stepFields.value[`pd_${i}_amount`]) || 0,
          daysDriven: Number(stepFields.value[`pd_${i}_daysDriven`]) || null,
          weight: Number(stepFields.value[`pd_${i}_weight`]) || null,
          remark: stepFields.value[`pd_${i}_remark`] || "",
        }))
        .filter((p) => p.amount > 0);

      // Extract Other Expenses
      const otherExpenses = otherExpensesList.value
        .map((_, i) => ({
          expenseType: stepFields.value[`other_${i}_expenseType`] || "",
          amount: Number(stepFields.value[`other_${i}_amount`]) || 0,
          remark: stepFields.value[`other_${i}_remark`] || "",
        }))
        .filter((o) => o.amount > 0);

      const payload = {
        shipment: shipment._id,
        operationalAdvance: true,
        driver: shipment.driver?._id,
        fuelAdvances,
        perDiemExpenses,
        otherExpenses,
      };

      const res = await api.create_advance(payload);
      if (res.status === 200 || res.status === 201) {
        toast.success("Advance added successfully!");
        closeModal(true);
      } else {
        toast.error("Failed to add advance");
      }
    }
  } catch (error: any) {
    toast.error(
      error.response?.data?.description || "An unexpected error occurred.",
    );
    console.error("Error adding advance:", error);
  } finally {
    isLoading.value = false;
  }
}
</script>
