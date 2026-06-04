<template>
  <div class="flex flex-col gap-6">
    <!-- Initial Settlement Balance -->
    <div class="rounded-2xl border border-line bg-surface p-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-4">
        <div>
          <p class="text-xs font-bold text-dim-text uppercase tracking-wider mb-2">
            Initial Settlement Balance
          </p>
          <p class="text-2xl font-black text-base-text">
            {{ currencyFormatter(driver.initialSettlementBalance ?? 0) }}
          </p>
          <p class="mt-1 text-sm text-dim-text">{{ balanceDirection }}</p>
        </div>
        <div v-if="driver.initialSettlementBalanceUpdatedBy" class="text-sm text-dim-text sm:text-right">
          <p>
            <span class="font-bold text-base-text">Updated by:</span>
            {{ driver.initialSettlementBalanceUpdatedBy?.username || '-' }}
          </p>
          <p class="mt-1">
            <span class="font-bold text-base-text">Updated at:</span>
            {{ driver.initialSettlementBalanceUpdatedAt ? new Date(driver.initialSettlementBalanceUpdatedAt).toLocaleString() : '-' }}
          </p>
        </div>
      </div>

      <!-- Adjustment History -->
      <div v-if="history.length">
        <p class="text-xs font-bold text-dim-text uppercase tracking-wider mb-3">
          Adjustment History
        </p>
        <div class="overflow-x-auto rounded-2xl border border-line">
          <table class="min-w-full text-sm">
            <thead class="bg-surface-muted text-left text-xs uppercase tracking-wide text-dim-text">
              <tr>
                <th class="px-4 py-3">Changed At</th>
                <th class="px-4 py-3">Changed By</th>
                <th class="px-4 py-3">Previous</th>
                <th class="px-4 py-3">New</th>
                <th class="px-4 py-3">Delta</th>
                <th class="px-4 py-3">Reason</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-line bg-surface">
              <tr v-for="item in history" :key="item._id">
                <td class="px-4 py-3 whitespace-nowrap text-dim-text">
                  {{ new Date(item.changedAt).toLocaleString() }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-dim-text">
                  {{ item.changedBy?.username || '-' }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-dim-text">
                  {{ currencyFormatter(item.previousValue) }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap font-bold text-base-text">
                  {{ currencyFormatter(item.newValue) }}
                </td>
                <td
                  class="px-4 py-3 whitespace-nowrap font-bold"
                  :class="Number(item.delta) >= 0 ? 'text-red-600' : 'text-green-600'"
                >
                  {{ Number(item.delta) > 0 ? '+' : '' }}{{ currencyFormatter(item.delta) }}
                </td>
                <td class="px-4 py-3 min-w-[200px] text-dim-text">{{ item.reason }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p v-else-if="!historyLoading" class="text-sm text-faint-text italic mt-2">No adjustment history.</p>
    </div>

    <!-- Info Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Personal Information -->
      <InfoWrapper title="Personal Information">
        <div class="space-y-4">
          <DetailItem label="Full Name" :value="`${driver.firstName} ${driver.middleName || ''} ${driver.lastName || ''}`" />
          <DetailItem label="Date of Birth" :value="formatDate(driver.dateOfBirth)" />
          <DetailItem label="Phone Number" :value="driver.phoneNumber" />
          <DetailItem label="Email" :value="driver.email" />
          <DetailItem label="Gender" :value="driver.gender" />
          <DetailItem label="Emergency Contact" :value="driver.contactPerson ? `${driver.contactPerson.name} (${driver.contactPerson.phoneNumber || ''}) - ${driver.contactPerson.address || ''}` : 'N/A'" />
        </div>
      </InfoWrapper>

      <!-- Employment Information -->
      <div class="flex flex-col gap-6">
        <InfoWrapper title="Employment Information">
          <div class="space-y-4">
            <DetailItem label="Employment Status" :value="driver.isEmployed ? 'Employee' : 'Sub Contract'" />
            <DetailItem label="Employee Number" :value="driver.employeeNumber" />
            <DetailItem label="Employment Start Date" :value="formatDate(driver.employmentStartDate)" />
            <DetailItem label="Employment End Date" :value="formatDate(driver.employmentEndDate)" />
            <DetailItem label="Current Assignment Status" :value="driver.driverStatus?.replace(/_/g, ' ')" />
            <DetailItem label="Initial Settlement Balance" :value="currencyFormatter(driver.initialSettlementBalance ?? 0)" />
          </div>
        </InfoWrapper>

        <InfoWrapper title="License & Identification">
          <div class="space-y-4">
            <DetailItem label="License Number" :value="driver.driverLicenceNumber" />
            <DetailItem label="License Expiration" :value="formatDate(driver.drivingLicenceExpirationDate)" />
            <DetailItem label="TIN" :value="driver.tin" />
            <DetailItem label="Djibouti Entrance ID" :value="driver.djboutiEntranceId" />
            <DetailItem label="Djibouti ID Expiration" :value="formatDate(driver.djboutiEntranceIdExpirationDate)" />
          </div>
        </InfoWrapper>
      </div>

      <!-- Educational Background -->
      <InfoWrapper title="Educational Background">
        <div class="space-y-4">
          <div
            v-for="(edu, index) in driver.educationalBackground"
            :key="index"
            class="bg-surface rounded-2xl p-4 shadow-sm border border-line flex flex-col gap-1"
          >
            <span class="text-xs font-medium text-dim-text uppercase tracking-wider">{{ edu.type }}</span>
            <span class="text-sm font-bold text-base-text">{{ edu.institutionName }}</span>
            <span class="text-xs text-dim-text" v-if="edu.startDate">
              {{ formatDate(edu.startDate) }} - {{ formatDate(edu.endDate) }}
            </span>
          </div>
          <span v-if="!driver.educationalBackground?.length" class="text-sm text-faint-text italic">
            No educational background added.
          </span>
        </div>
      </InfoWrapper>

      <!-- Work Experience -->
      <InfoWrapper title="Work Experience">
        <div class="space-y-4">
          <div
            v-for="(work, index) in driver.workExperience"
            :key="index"
            class="bg-surface rounded-2xl p-4 shadow-sm border border-line flex flex-col gap-1"
          >
            <span class="text-xs font-medium text-dim-text uppercase tracking-wider">{{ work.position }}</span>
            <span class="text-sm font-bold text-base-text">{{ work.companyName }}</span>
            <span class="text-xs text-dim-text" v-if="work.startDate">
              {{ formatDate(work.startDate) }} - {{ formatDate(work.endDate) }}
            </span>
          </div>
          <span v-if="!driver.workExperience?.length" class="text-sm text-faint-text italic">
            No work experience added.
          </span>
        </div>
      </InfoWrapper>
    </div>

    <!-- Educational Background -->
    <InfoWrapper title="Educational Background">
      <div class="space-y-4">
        <div
          v-for="(edu, index) in driver.educationalBackground"
          :key="index"
          class="bg-surface rounded-2xl p-4 shadow-sm border border-line flex flex-col gap-1"
        >
          <span class="text-xs font-medium text-dim-text uppercase tracking-wider">{{ edu.type }}</span>
          <span class="text-sm font-bold text-base-text">{{ edu.institutionName }}</span>
          <span class="text-xs text-dim-text" v-if="edu.startDate">
            {{ formatDate(edu.startDate) }} - {{ formatDate(edu.endDate) }}
          </span>
        </div>
        <span v-if="!driver.educationalBackground?.length" class="text-sm text-faint-text italic">
          No educational background added.
        </span>
      </div>
    </InfoWrapper>

    <!-- Work Experience -->
    <InfoWrapper title="Work Experience">
      <div class="space-y-4">
        <div
          v-for="(work, index) in driver.workExperience"
          :key="index"
          class="bg-surface rounded-2xl p-4 shadow-sm border border-line flex flex-col gap-1"
        >
          <span class="text-xs font-medium text-dim-text uppercase tracking-wider">{{ work.position }}</span>
          <span class="text-sm font-bold text-base-text">{{ work.companyName }}</span>
          <span class="text-xs text-dim-text" v-if="work.startDate">
            {{ formatDate(work.startDate) }} - {{ formatDate(work.endDate) }}
          </span>
        </div>
        <span v-if="!driver.workExperience?.length" class="text-sm text-faint-text italic">
          No work experience added.
        </span>
      </div>
    </InfoWrapper>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import DetailItem from "../vehicle-details/DetailItem.vue";
import InfoWrapper from "../shipment-details/InfoWrapper.vue";
import { currencyFormatter } from "@/utils/utils";
import { fetch_initial_settlement_balance_history } from "../../api/operation.api";

const props = defineProps<{
  driver: any;
}>();

const history = ref<any[]>([]);
const historyLoading = ref(true);

onMounted(async () => {
  try {
    const res = await fetch_initial_settlement_balance_history(props.driver._id);
    history.value = res?.data ?? [];
  } catch {
    // history is optional — silently ignore
  } finally {
    historyLoading.value = false;
  }
});

const formatDate = (date?: string) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString();
};

const balanceDirection = computed(() => {
  const v = Number(props.driver?.initialSettlementBalance ?? 0);
  if (v > 0) return "Driver owes the company.";
  if (v < 0) return "Company owes the driver.";
  return "No opening settlement balance recorded.";
});
</script>
