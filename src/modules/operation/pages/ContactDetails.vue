<template>
  <div v-if="isLoading" class="flex justify-center py-20">
    <i class="mdi mdi-loading mdi-spin text-4xl text-primary-500"></i>
  </div>

  <div v-else-if="contact" class="flex flex-col gap-6">
    <!-- Header Section -->
    <div class="bg-grey-25 rounded-[32px] p-6 md:p-10 border border-grey-100 flex flex-col md:flex-row items-center justify-between gap-8">
      <div class="flex items-center gap-8">
        <div class="size-24 md:size-32 rounded-full bg-surface flex items-center justify-center shadow-lg border border-grey-100 p-2 overflow-hidden">
          <div
            v-if="!contact.profilePicture"
            class="h-full w-full rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-4xl uppercase"
          >
            {{ contact.name?.charAt(0)?.toUpperCase() }}
          </div>
          <img
            v-else
            :src="getProfilePictureURL(contact.profilePicture)"
            alt="Profile"
            class="w-full h-full object-cover rounded-full"
          />
        </div>
        <div class="flex flex-col gap-1">
          <h2 class="text-3xl md:text-4xl font-black text-grey-900 tracking-tight">
            {{ contact.name }}
          </h2>
          <div class="flex flex-wrap items-center gap-2 mt-1">
            <span class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
              {{ contact.group || 'OTHER' }}
            </span>
            <span
              v-if="contact.user"
              class="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider"
            >
              Login Access Enabled
            </span>
            <span
              v-else
              class="px-3 py-1 bg-grey-100 text-grey-600 text-xs font-bold rounded-full uppercase tracking-wider"
            >
              Login Access Disabled
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Details Body -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- General Contact Info Card -->
      <div class="bg-surface rounded-[32px] p-6 border border-grey-100 flex flex-col gap-4">
        <h3 class="text-lg font-bold text-grey-900 border-b border-grey-100 pb-3 flex items-center gap-2">
          <i class="mdi mdi-card-account-details-outline text-primary text-xl"></i>
          Contact Information
        </h3>

        <div class="grid grid-cols-1 gap-4">
          <div class="flex flex-col gap-1 p-3 bg-grey-25 rounded-2xl border border-grey-100">
            <span class="text-xs font-bold text-grey-500 uppercase tracking-wider">Email</span>
            <span class="text-base font-bold text-grey-900">{{ contact.email || 'N/A' }}</span>
          </div>

          <div class="flex flex-col gap-1 p-3 bg-grey-25 rounded-2xl border border-grey-100">
            <span class="text-xs font-bold text-grey-500 uppercase tracking-wider">Phone Number</span>
            <span class="text-base font-bold text-grey-900">{{ contact.phone || 'N/A' }}</span>
          </div>

          <div class="flex flex-col gap-1 p-3 bg-grey-25 rounded-2xl border border-grey-100">
            <span class="text-xs font-bold text-grey-500 uppercase tracking-wider">Employee Number</span>
            <span class="text-base font-bold text-grey-900">{{ contact.employeeNumber || 'N/A' }}</span>
          </div>

          <div class="flex flex-col gap-1 p-3 bg-grey-25 rounded-2xl border border-grey-100">
            <span class="text-xs font-bold text-grey-500 uppercase tracking-wider">Date of Birth</span>
            <span class="text-base font-bold text-grey-900">
              {{ contact.dateOfBirth ? contact.dateOfBirth.split('T')[0] : 'N/A' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Specific Info Card (DRIVER / MECHANIC) -->
      <div v-if="contact.group === 'DRIVER' || contact.group === 'MECHANIC'" class="bg-surface rounded-[32px] p-6 border border-grey-100 flex flex-col gap-4">
        <h3 class="text-lg font-bold text-grey-900 border-b border-grey-100 pb-3 flex items-center gap-2">
          <i class="mdi mdi-account-star-outline text-primary text-xl"></i>
          {{ contact.group === 'DRIVER' ? 'Driver Information' : 'Mechanic Information' }}
        </h3>

        <!-- Driver Block -->
        <div v-if="contact.group === 'DRIVER' && contact.driver" class="grid grid-cols-1 gap-3">
          <div class="flex flex-col gap-1 p-3 bg-grey-25 rounded-2xl border border-grey-100">
            <span class="text-xs font-bold text-grey-500 uppercase tracking-wider">Driver Licence Number</span>
            <span class="text-base font-bold text-grey-900">{{ contact.driver.driverLicenceNumber || 'N/A' }}</span>
          </div>
          <div class="flex flex-col gap-1 p-3 bg-grey-25 rounded-2xl border border-grey-100">
            <span class="text-xs font-bold text-grey-500 uppercase tracking-wider">Licence Expiration Date</span>
            <span class="text-base font-bold text-grey-900">
              {{ contact.driver.drivingLicenceExpirationDate ? contact.driver.drivingLicenceExpirationDate.split('T')[0] : 'N/A' }}
            </span>
          </div>
          <div class="flex flex-col gap-1 p-3 bg-grey-25 rounded-2xl border border-grey-100">
            <span class="text-xs font-bold text-grey-500 uppercase tracking-wider">Employment Status</span>
            <span class="text-base font-bold text-grey-900">{{ contact.driver.isEmployed ? 'Employed' : 'Not Employed' }}</span>
          </div>
          <div class="flex flex-col gap-1 p-3 bg-grey-25 rounded-2xl border border-grey-100" v-if="contact.driver.driverType">
            <span class="text-xs font-bold text-grey-500 uppercase tracking-wider">Driver Type</span>
            <span class="text-base font-bold text-grey-900">{{ contact.driver.driverType }}</span>
          </div>
        </div>

        <!-- Mechanic Block -->
        <div v-if="contact.group === 'MECHANIC' && contact.mechanic" class="grid grid-cols-1 gap-3">
          <div class="flex flex-col gap-1 p-3 bg-grey-25 rounded-2xl border border-grey-100">
            <span class="text-xs font-bold text-grey-500 uppercase tracking-wider">Certification</span>
            <span class="text-base font-bold text-grey-900">{{ contact.mechanic.certification || 'N/A' }}</span>
          </div>
          <div class="flex flex-col gap-1 p-3 bg-grey-25 rounded-2xl border border-grey-100">
            <span class="text-xs font-bold text-grey-500 uppercase tracking-wider">Experience</span>
            <span class="text-base font-bold text-grey-900">{{ contact.mechanic.experience || 0 }} Years</span>
          </div>
          <div class="flex flex-col gap-1 p-3 bg-grey-25 rounded-2xl border border-grey-100" v-if="contact.mechanic.workshop">
            <span class="text-xs font-bold text-grey-500 uppercase tracking-wider">Workshop</span>
            <span class="text-base font-bold text-grey-900">{{ contact.mechanic.workshop.name || contact.mechanic.workshop }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { fetch_contact_by_id } from "../api/operation.api";

const route = useRoute();
const contactId = route.params.id as string;

const { data: contactRes, isLoading } = useQuery({
  queryKey: ["contact", contactId],
  queryFn: () => fetch_contact_by_id(contactId),
});

const contact = computed(() => contactRes.value?.data);

const API_URL = import.meta.env.VITE_API_URL;
const getProfilePictureURL = (path: string) => {
  if (path) {
    return `${API_URL}/${path.replace(/\\/g, "/")}`;
  }
  return "";
};
</script>
