<template>
  <!-- Mobile: print filter bottom sheet -->
  <BottomSheet v-model="mobilePrintOpen" title="Print Options">
    <div class="flex flex-col gap-4 px-4 py-3">
      <Select
        v-model="printCategories"
        :options="categoryOptions"
        label_key="label"
        value_key="value"
        multiple
        :clearable="false"
        label="Categories"
        :attributes="{ placeholder: 'Select categories' }"
      />
      <Select
        v-model="printTypes"
        :options="typeOptions"
        label_key="label"
        value_key="value"
        multiple
        :clearable="false"
        label="Types"
        :attributes="{ placeholder: 'Select types' }"
      />
      <Button
        variant="primary"
        size="lg"
        class="w-full mt-2"
        @click="
          mobilePrintOpen = false;
          handlePrint();
        "
      >
        <i class="*:size-4 mr-1" v-html="icons.file"></i>
        Print
      </Button>
    </div>
  </BottomSheet>

  <!-- Mobile: action icon buttons next to title -->
  <Teleport defer to="#page-title-actions">
    <div class="sm:hidden flex items-center gap-1">
      <button
        class="size-8 rounded-xl border border-line flex items-center justify-center text-faint-text hover:bg-surface-hover transition-colors"
        @click="mobilePrintOpen = true"
      >
        <i class="*:size-4" v-html="icons.file"></i>
      </button>
      <button
        v-if="advance?.status !== 'SETTLED'"
        :disabled="!isEligibleForSettlement"
        class="size-8 rounded-xl border border-line flex items-center justify-center text-faint-text hover:bg-surface-hover transition-colors disabled:opacity-40"
        @click="handleSettle"
      >
        <i class="*:size-4" v-html="icons.circleCheck"></i>
      </button>
      <button
        v-if="advance?.status"
        class="size-8 rounded-xl border border-line flex items-center justify-center text-faint-text hover:bg-surface-hover transition-colors"
        @click="handleCreateSettlement"
      >
        <i class="*:size-4" v-html="icons.tinAdd"></i>
      </button>
    </div>
  </Teleport>

  <Teleport defer to="#page-actions">
    <div class="hidden sm:flex flex-wrap items-center gap-2">
      <Select
        v-model="printCategories"
        :options="categoryOptions"
        label_key="label"
        value_key="value"
        multiple
        :clearable="false"
        :attributes="{ placeholder: 'Categories' }"
        class="w-36 sm:w-44"
      />
      <Select
        v-model="printTypes"
        :options="typeOptions"
        label_key="label"
        value_key="value"
        multiple
        :clearable="false"
        :attributes="{ placeholder: 'Types' }"
        class="w-36 sm:w-44"
      />
      <Button variant="outline" size="md" @click="handlePrint">
        <i v-html="icons.file" />
        Print
      </Button>
      <Button
        v-if="advance?.status !== 'SETTLED'"
        variant="outline"
        size="md"
        :disabled="!isEligibleForSettlement"
        @click="handleSettle"
        :loading="isSettling"
      >
        Mark as Settled
      </Button>
      <Button
        v-if="advance?.status"
        variant="outline"
        size="md"
        @click="handleCreateSettlement"
      >
        <i
          class="mr-1 h-4 w-4 flex items-center justify-center text-white"
          v-html="icons.tinAdd"
        />
        Create Settlement
      </Button>
    </div>
  </Teleport>

  <div class="flex flex-col gap-4 md:gap-8">
    <div v-if="isLoading" class="flex justify-center p-8">
      <i class="w-10 h-10 animate-spin text-primary" v-html="icons.spinner" />
    </div>

    <template v-else-if="advance">
      <!-- Overview Section -->
      <InfoWrapper title="Advance Overview">
        <template #title-extra>
          <Status
            class="ml-auto! w-auto!"
            :variant="advance?.status"
            type="wrapped"
          >
            {{ formatStatus(advance?.status) }}
          </Status>
        </template>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 py-2">
          <ShipmentDataLabel
            label="Advance Number"
            :value="advance.advanceNumber"
          />
          <ShipmentDataLabel label="Advance Type" :value="advance.type" />
          <ShipmentDataLabel
            label="Creation Date"
            :value="dateFormatter(advance.createdAt)"
          />
          <ShipmentDataLabel
            label="Total Subtotal"
            :value="currencyFormatter(advance.subtotal || calculatedSubtotal)"
            is-bold
          />
        </div>
      </InfoWrapper>

      <!-- Context Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <InfoWrapper title="Driver & Vehicle">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ShipmentDataLabel
              label="Driver"
              :value="formatDriverName(advance.driver)"
            />
            <ShipmentDataLabel
              label="Plate Number"
              :value="
                advance.shipment?.vehicle?.plateNumber ||
                advance.vehiclePlateNumber
              "
            />
            <ShipmentDataLabel
              label="Transporter"
              :value="
                advance.shipment?.transporter?.name ||
                advance.shipment?.carrier?.name
              "
            />
            <ShipmentDataLabel
              label="Route"
              :value="
                advance.shipment?.route?.routeName
              "
            />
          </div>
        </InfoWrapper>

        <InfoWrapper title="Approvals & Processing">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ShipmentDataLabel
              label="Authorized By"
              :value="advance.authorizedBy?.username"
            />
            <ShipmentDataLabel
              label="Approved By"
              :value="advance.approvedBy?.username"
            />
            <ShipmentDataLabel
              label="Paid By"
              :value="advance.paidBy?.username"
            />
            <ShipmentDataLabel
              label="Shipment Code"
              :value="advance.shipment?.shipmentCode || advance.shipmentCode"
            />
          </div>
        </InfoWrapper>
      </div>
      <!-- Transactions & Settlements -->
      <div class="pt-4">
        <AdvanceDetailsAdvancesTab
          v-if="activeTab === 'advances'"
          :advance="advance"
        />
        <AdvanceDetailsSettlementsTab
          v-if="activeTab === 'settlements'"
          :advance="advance"
          @refresh="refetch"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery, useMutation } from "@tanstack/vue-query";
import { fetch_advance_details, settle_advance } from "../api/operation.api";
import InfoWrapper from "../components/shipment-details/InfoWrapper.vue";
import ShipmentDataLabel from "../components/shipment-details/ShipmentDataLabel.vue";
import Status from "@/components/common/Status.vue";
import Button from "@/components/common/Button.vue";
import { dateFormatter, currencyFormatter } from "@/utils/utils";
import AdvanceDetailsAdvancesTab from "../components/advance-details/AdvanceDetailsAdvancesTab.vue";
import AdvanceDetailsSettlementsTab from "../components/advance-details/AdvanceDetailsSettlementsTab.vue";
import { useToastStore } from "@/store/toastStore";
import { openModal } from "@customizer/modal-x";
import { printAdvance } from "../utils/printAdvance";
import { useAuthStore } from "@/store/authStore";
import { icons } from "@/utils/icons";
import Select from "@/components/common/Select.vue";
import BottomSheet from "@/components/BottomSheet.vue";

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const authStore = useAuthStore();
const advanceId = computed(() => route.params.id as string);

const activeTab = computed({
  get: () => (route.query.tab as string) || "advances",
  set: (val) => {
    router.push({
      ...route,
      query: {
        ...route.query,
        tab: val,
      },
    });
  },
});

const {
  data: response,
  isLoading,
  refetch,
} = useQuery({
  queryKey: ["advance-details", advanceId.value],
  queryFn: () => fetch_advance_details(advanceId.value),
  enabled: !!advanceId.value,
});

const advance = computed(() => response.value?.data);

const calculatedSubtotal = computed(() => {
  if (!advance.value) return 0;
  const fuel = (advance.value.fuelAdvances || []).reduce(
    (acc: number, item: any) => acc + (item.amount || 0),
    0,
  );
  const perdiem = (advance.value.perDiemExpenses || []).reduce(
    (acc: number, item: any) => acc + (item.amount || 0),
    0,
  );
  const other = (advance.value.otherExpenses || []).reduce(
    (acc: number, item: any) => acc + (item.amount || 0),
    0,
  );
  return fuel + perdiem + other;
});

// Metrics (copied from SettlementsTab for settlement button eligibility)
const metrics = computed(() => {
  const transactions = advance.value?.transactions || [];
  const paidTransactions = transactions.filter(
    (tx: any) => tx?.status === "PAID",
  );

  const totalGivenToDriver = paidTransactions
    .filter(
      (tx: any) =>
        ["INITIAL", "ADDITIONAL"].includes(tx?.type) &&
        tx?.category === "OTHER",
    )
    .reduce(
      (sum: number, tx: any) => sum + (tx.approvedAmount ?? tx.amount ?? 0),
      0,
    );

  const totalApprovedExpenses = paidTransactions
    .filter((tx: any) => tx?.type === "EXPENSE")
    .reduce(
      (sum: number, tx: any) => sum + (tx.approvedAmount ?? tx.amount ?? 0),
      0,
    );

  const totalApprovedReturns = paidTransactions
    .filter((tx: any) => tx?.type === "RETURN")
    .reduce(
      (sum: number, tx: any) =>
        sum + Math.abs(tx.approvedAmount ?? tx.amount ?? 0),
      0,
    );

  const delta = Number(
    (
      totalGivenToDriver -
      (totalApprovedExpenses + totalApprovedReturns)
    ).toFixed(2),
  );

  return { delta };
});

const isEligibleForSettlement = computed(() => {
  if (!advance.value) return false;
  const transactions = advance.value.transactions || [];
  const hasNonTerminal = transactions.some(
    (tx: any) => !["PAID", "REJECTED", "CANCELLED"].includes(tx?.status),
  );

  return (
    advance.value.status === "PAID" &&
    transactions.length > 0 &&
    !hasNonTerminal &&
    metrics.value.delta === 0
  );
});

const settleMutation = useMutation({
  mutationFn: () => settle_advance(advanceId.value),
  onSuccess: () => {
    toast.success("Advance settled successfully");
    refetch();
  },
  onError: (error: any) => {
    toast.error(
      error.response?.data?.description || "Failed to settle advance",
    );
  },
});

const isSettling = computed(() => settleMutation.isPending.value);

const handleSettle = () => {
  openModal("ConfirmationModal", {
    title: "Settle Advance",
    message: "Are you sure you want to mark this advance as settled?",
    confirmLabel: "Settle",
    onConfirm: () => {
      settleMutation.mutate();
    },
  });
};


const formatStatus = (status?: string) => {
  if (!status) return "Unknown";
  return status.replace(/_/g, " ");
};

const formatDriverName = (driver: any) => {
  if (!driver) return "";
  return [driver.firstName, driver.middleName, driver.lastName]
    .filter(Boolean)
    .join(" ");
};

// --- Print filter state ---
const mobilePrintOpen = ref(false);
const printCategories = ref<string[]>(["PERDIEM", "OTHER", "FUEL"]);
const printTypes = ref<string[]>(["ADDITIONAL", "RETURN", "INITIAL", "EXPENSE"]);

const categoryOptions = [
  { label: "Perdiem", value: "PERDIEM" },
  { label: "Other Expenses", value: "OTHER" },
  { label: "Fuel", value: "FUEL" },
];

const typeOptions = [
  { label: "Initial", value: "INITIAL" },
  { label: "Additional", value: "ADDITIONAL" },
  { label: "Return", value: "RETURN" },
  { label: "Expense", value: "EXPENSE" },
];

const handlePrint = () => {
  if (!advance.value) return;

  if (!advance.value.transactions || advance.value.transactions.length === 0) {
    toast.warning("No transactions found to print");
    return;
  }

  if (!printCategories.value.length || !printTypes.value.length) {
    toast.warning("Please select at least one category and one type to print");
    return;
  }

  printAdvance(advance.value, authStore.current_user, {
    categories: printCategories.value,
    types: printTypes.value,
  });
};

const handleCreateSettlement = () => {
  if (!advance.value) return;
  openModal("AddSettlementModal", {
    id: advanceId.value,
    onSuccess: () => refetch(),
  });
};
</script>
