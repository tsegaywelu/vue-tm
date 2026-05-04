<template>
  <div v-if="isLoading" class="flex justify-center py-20">
    <i class="mdi mdi-loading mdi-spin text-4xl text-primary"></i>
  </div>

  <div v-else-if="customer" class="flex flex-col gap-6">
    <!-- Header Info Card -->
    <div
      class="bg-grey-25 rounded-[32px] p-6 md:p-10 border border-grey-100 flex flex-col md:flex-row items-center justify-between gap-8"
    >
      <div class="flex items-center gap-8">
        <div
          class="size-24 md:size-32 rounded-full bg-white flex items-center justify-center shadow-lg border border-grey-100 p-4 overflow-hidden"
        >
          <img
            v-if="customer.logo"
            :src="`${API_URL}/${customer.logo.replace(/\\/g, '/')}`"
            class="w-full h-full object-cover rounded-2xl"
          />
          <i v-else class="mdi mdi-account-box text-5xl text-grey-400"></i>
        </div>
        <div class="flex flex-col gap-1">
          <h2
            class="text-3xl md:text-4xl font-black text-grey-900 tracking-tight"
          >
            {{ customer.name }}
          </h2>
          <div class="flex items-center gap-2">
            <span
              class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase"
            >
              {{ customer.tradeName }}
            </span>
            <span
              class="px-3 py-1 bg-grey-100 text-grey-600 text-xs font-bold rounded-full uppercase"
            >
              {{ customer.customerCode || customer.shipperCode }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Tab Panel -->
    <div class="bg-white rounded-[32px] p-6 border border-grey-100">
      <!-- Basic Details -->
      <div
        v-if="activeTab === 'basic'"
        class="flex flex-col gap-6 animate-fade-in"
      >
        <h3 class="text-xl font-bold text-grey-900">
          Basic Shipper Information
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            class="flex flex-col gap-1 p-4 bg-grey-25 rounded-2xl border border-grey-100"
          >
            <span
              class="text-xs font-bold text-grey-500 uppercase tracking-wider"
              >Customer Name</span
            >
            <span class="text-base font-bold text-grey-900">{{
              customer.name
            }}</span>
          </div>
          <div
            class="flex flex-col gap-1 p-4 bg-grey-25 rounded-2xl border border-grey-100"
          >
            <span
              class="text-xs font-bold text-grey-500 uppercase tracking-wider"
              >TIN</span
            >
            <span class="text-base font-bold text-grey-900">{{
              customer.tin || "-"
            }}</span>
          </div>
          <div
            class="flex flex-col gap-1 p-4 bg-grey-25 rounded-2xl border border-grey-100"
          >
            <span
              class="text-xs font-bold text-grey-500 uppercase tracking-wider"
              >Trading Name</span
            >
            <span class="text-base font-bold text-grey-900">{{
              customer.tradeName
            }}</span>
          </div>
          <div
            class="flex flex-col gap-1 p-4 bg-grey-25 rounded-2xl border border-grey-100"
          >
            <span
              class="text-xs font-bold text-grey-500 uppercase tracking-wider"
              >Phone</span
            >
            <span class="text-base font-bold text-grey-900">{{
              customer.phone
            }}</span>
          </div>
          <div
            class="flex flex-col gap-1 p-4 bg-grey-25 rounded-2xl border border-grey-100"
          >
            <span
              class="text-xs font-bold text-grey-500 uppercase tracking-wider"
              >Email</span
            >
            <span class="text-base font-bold text-grey-900">{{
              customer.email || "-"
            }}</span>
          </div>
          <div
            class="flex flex-col gap-1 p-4 bg-grey-25 rounded-2xl border border-grey-100"
          >
            <span
              class="text-xs font-bold text-grey-500 uppercase tracking-wider"
              >Customer Code</span
            >
            <span class="text-base font-bold text-grey-900">{{
              customer.customerCode || customer.shipperCode
            }}</span>
          </div>
          <div
            class="flex flex-col gap-1 p-4 bg-grey-25 rounded-2xl border border-grey-100 md:col-span-2"
          >
            <span
              class="text-xs font-bold text-grey-500 uppercase tracking-wider"
              >Address</span
            >
            <span class="text-base font-bold text-grey-900">{{
              customer.address
            }}</span>
          </div>
        </div>
      </div>

      <!-- Facility -->
      <div
        v-else-if="activeTab === 'facility'"
        class="flex flex-col gap-6 animate-fade-in"
      >
        <h3 class="text-xl font-bold text-grey-900">Facility Information</h3>
        <Table :columns="facilityColumns" :rows="facilityRows">
          <template #cell-name="{ row }">
            <span class="font-bold text-grey-900">{{ row.name }}</span>
          </template>
          <template #cell-region="{ row }">
            <span class="text-grey-600">{{
              row.location?.region || row.region || "-"
            }}</span>
          </template>
          <template #cell-city="{ row }">
            <span class="text-grey-600">{{
              row.location?.city || row.city || "-"
            }}</span>
          </template>
        </Table>
      </div>

      <!-- Contact -->
      <div
        v-else-if="activeTab === 'contact'"
        class="flex flex-col gap-6 animate-fade-in"
      >
        <h3 class="text-xl font-bold text-grey-900">Contacts</h3>
        <Table :columns="contactColumns" :rows="contactRows">
          <template #cell-username="{ row }">
            <span class="font-bold text-grey-900">{{ row.username }}</span>
          </template>
          <template #cell-roleName="{ row }">
            <span class="text-grey-600">{{ row.role?.name || "-" }}</span>
          </template>
          <template #cell-roleType="{ row }">
            <span class="text-grey-600">{{ row.role?.type || "-" }}</span>
          </template>
        </Table>
      </div>

      <!-- Agent -->
      <div
        v-else-if="activeTab === 'agent'"
        class="flex flex-col gap-6 animate-fade-in"
      >
        <h3 class="text-xl font-bold text-grey-900">Agent Information</h3>
        <Table :columns="agentColumns" :rows="agentRows">
          <template #cell-name="{ row }">
            <span class="font-bold text-grey-900">{{ row.name }}</span>
          </template>
          <template #cell-activity="{ row }">
            <span class="text-grey-600">{{
              row.isActive ? "Active" : "Inactive"
            }}</span>
          </template>
        </Table>
      </div>

      <!-- Order -->
      <div
        v-else-if="activeTab === 'order'"
        class="flex flex-col gap-6 animate-fade-in"
      >
        <h3 class="text-xl font-bold text-grey-900">Order Information</h3>
        <Table :columns="orderColumns" :rows="orders" :loading="ordersLoading">
          <template #cell-orderCode="{ row }">
            <span class="font-bold text-primary">{{ row.orderCode }}</span>
          </template>
          <template #cell-status="{ row }">
            <Status :variant="row.status" type="wrapped" :label="row.status" />
          </template>
          <template #cell-plannedDueDate="{ row }">
            <span class="text-grey-600">{{
              row.plannedDueDate ? dateFormatter(row.plannedDueDate) : "-"
            }}</span>
          </template>
          <template #cell-route="{ row }">
            <span class="text-grey-600">{{ row.route?.routeName || "-" }}</span>
          </template>
          <template #cell-commodity="{ row }">
            <span class="text-grey-600">{{ row.commodity?.name || "-" }}</span>
          </template>
          <template #cell-totalPrice="{ row }">
            <span class="text-grey-600">{{ row.totalPrice || "-" }}</span>
          </template>
        </Table>
      </div>

      <!-- Shipment -->
      <div
        v-else-if="activeTab === 'shipment'"
        class="flex flex-col gap-6 animate-fade-in"
      >
        <h3 class="text-xl font-bold text-grey-900">Shipment Information</h3>
        <Table
          :columns="shipmentColumns"
          :rows="shipments"
          :loading="shipmentsLoading"
        >
          <template #cell-shipmentCode="{ row }">
            <span class="font-bold text-primary">{{ row.shipmentCode }}</span>
          </template>
          <template #cell-status="{ row }">
            <Status :variant="row.status" type="wrapped" :label="row.status" />
          </template>
          <template #cell-dispatchDate="{ row }">
            <span class="text-grey-600">{{
              row.dispatchDate ? dateFormatter(row.dispatchDate) : "-"
            }}</span>
          </template>
          <template #cell-route="{ row }">
            <span class="text-grey-600">{{ row.route?.routeName || "-" }}</span>
          </template>
          <template #cell-waypoint="{ row }">
            <span class="text-grey-600">{{ row.waypoint?.name || "-" }}</span>
          </template>
          <template #cell-orderCode="{ row }">
            <span class="text-grey-600">{{ row.orderCode || "-" }}</span>
          </template>
          <template #cell-driver="{ row }">
            <span class="text-grey-600">{{
              row.vehicle?.driver
                ? `${row.vehicle.driver.firstName} ${row.vehicle.driver.lastName}`
                : "-"
            }}</span>
          </template>
          <template #cell-totalPrice="{ row }">
            <span class="text-grey-600">{{ row.totalPrice || "-" }}</span>
          </template>
        </Table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import BaseTable, { type TableColumn } from "@/components/common/Table.vue";
import Status from "@/components/common/Status.vue";
import { fetch_customer_by_id } from "../api/operation.api";
import { usePagination } from "@/composables/usePagination";
import ApiService from "@/api/ApiService";
import { dateFormatter } from "@/utils/utils";
import Table from "@/components/common/Table.vue";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const route = useRoute();
const api = new ApiService();
const customerId = route.params.id as string;

// Fetch Customer Basic Information
const { data: customerRes, isLoading } = useQuery({
  queryKey: ["customer", customerId],
  queryFn: () => fetch_customer_by_id(customerId),
});

const customer = computed(() => customerRes.value?.data);

const tabs = computed(() => (route.meta.tabs || []) as any[]);
const activeTab = computed(() => {
  return (
    (route.query.tab as string) || (tabs.value?.[0]?.value as string) || "basic"
  );
});

// Fetch Facilities
const { data: facilitiesRes } = useQuery({
  queryKey: ["customer-facilities", customerId],
  queryFn: () =>
    api.addAuthenticationHeader().get(`/customer/${customerId}/facilities`),
  enabled: computed(() => activeTab.value === "facility"),
});
const facilityRows = computed(() => facilitiesRes.value?.data || []);

// Fetch Contacts
const { data: contactsRes } = useQuery({
  queryKey: ["customer-contacts", customerId],
  queryFn: () => api.addAuthenticationHeader().get(`/auth/users`),
  enabled: computed(() => activeTab.value === "contact"),
});
const contactRows = computed(() => {
  const allUsers = contactsRes.value?.data || [];
  return allUsers.filter((user: any) => user.customer?._id === customerId);
});

// Fetch Agents
const { data: agentsRes } = useQuery({
  queryKey: ["customer-agents", customerId],
  queryFn: () =>
    api.addAuthenticationHeader().get(`/customer/${customerId}/agents`),
  enabled: computed(() => activeTab.value === "agent"),
});
const agentRows = computed(() => agentsRes.value?.data || []);

// Fetch Orders
const { response: orders, isLoading: ordersLoading } = usePagination({
  id: `customer-orders-${customerId}`,
  url: "/order",
  params: computed(() => ({ shipper: customerId })),
});

// Fetch Shipments
const { response: shipments, isLoading: shipmentsLoading } = usePagination({
  id: `customer-shipments-${customerId}`,
  url: "/shipment",
  params: computed(() => ({ shipper: customerId })),
});

// Table columns
const facilityColumns: TableColumn<any>[] = [
  { key: "name", label: "Facility Name", field: "name" },
  { key: "region", label: "Region", field: "region" },
  { key: "city", label: "City", field: "city" },
];

const contactColumns: TableColumn<any>[] = [
  { key: "username", label: "Name", field: "username" },
  { key: "roleName", label: "Role Name", field: "role.name" },
  { key: "roleType", label: "Role Type", field: "role.type" },
];

const agentColumns: TableColumn<any>[] = [
  { key: "name", label: "Agent Name", field: "name" },
  { key: "activity", label: "Activity", field: "isActive" },
];

const orderColumns: TableColumn<any>[] = [
  { key: "orderCode", label: "Order Code", field: "orderCode" },
  { key: "status", label: "Status", field: "status" },
  { key: "plannedDueDate", label: "Dispatch Date", field: "plannedDueDate" },
  { key: "route", label: "Route", field: "route.routeName" },
  { key: "commodity", label: "Commodity", field: "commodity.name" },
  { key: "totalPrice", label: "Total Price", field: "totalPrice" },
];

const shipmentColumns: TableColumn<any>[] = [
  { key: "shipmentCode", label: "Shipment Code", field: "shipmentCode" },
  { key: "dispatchDate", label: "Dispatch Date", field: "dispatchDate" },
  { key: "route", label: "Route", field: "route.routeName" },
  { key: "waypoint", label: "WayPoint", field: "waypoint" },
  { key: "orderCode", label: "Order Code", field: "orderCode" },
  { key: "driver", label: "Driver", field: "" },
  { key: "totalPrice", label: "Total Price", field: "totalPrice" },
  { key: "status", label: "Status", field: "status" },
];
</script>
