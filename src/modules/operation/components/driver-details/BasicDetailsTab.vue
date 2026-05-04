<template>
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

    <!-- Professional & Employment Information -->
    <div class="flex flex-col gap-6">
      <InfoWrapper title="Employment Information">
        <div class="space-y-4">
          <DetailItem label="Employment Status" :value="driver.isEmployed ? 'Employee' : 'Sub Contract'" />
          <DetailItem label="Employee Number" :value="driver.employeeNumber" />
          <DetailItem label="Employment Start Date" :value="formatDate(driver.employmentStartDate)" />
          <DetailItem label="Employment End Date" :value="formatDate(driver.employmentEndDate)" />
          <DetailItem label="Current Assignment Status" :value="driver.driverStatus?.replace(/_/g, ' ')" />
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
          class="bg-white rounded-2xl p-4 shadow-sm border border-grey-100 flex flex-col gap-1"
        >
          <span class="text-xs font-medium text-grey-500 uppercase tracking-wider">{{ edu.type }}</span>
          <span class="text-sm font-bold text-grey-900">{{ edu.institutionName }}</span>
          <span class="text-xs text-grey-500" v-if="edu.startDate">
            {{ formatDate(edu.startDate) }} - {{ formatDate(edu.endDate) }}
          </span>
        </div>
        <span v-if="!driver.educationalBackground?.length" class="text-sm text-grey-400 italic">
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
          class="bg-white rounded-2xl p-4 shadow-sm border border-grey-100 flex flex-col gap-1"
        >
          <span class="text-xs font-medium text-grey-500 uppercase tracking-wider">{{ work.position }}</span>
          <span class="text-sm font-bold text-grey-900">{{ work.companyName }}</span>
          <span class="text-xs text-grey-500" v-if="work.startDate">
            {{ formatDate(work.startDate) }} - {{ formatDate(work.endDate) }}
          </span>
        </div>
        <span v-if="!driver.workExperience?.length" class="text-sm text-grey-400 italic">
          No work experience added.
        </span>
      </div>
    </InfoWrapper>
  </div>
</template>

<script setup lang="ts">
import DetailItem from "../vehicle-details/DetailItem.vue";
import InfoWrapper from "../shipment-details/InfoWrapper.vue";

defineProps<{
  driver: any;
}>();

const formatDate = (date?: string) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString();
};
</script>
