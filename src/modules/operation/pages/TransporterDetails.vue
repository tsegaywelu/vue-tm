<template>
  <!-- Desktop actions -->
  <Teleport to="#page-actions" defer>
    <div class="hidden sm:flex items-center gap-2">
      <Button variant="outline" size="md" @click="handleOpenEditModal">
        <i class="*:size-4 mr-1" v-html="icons.edit"></i> Edit
      </Button>
    </div>
  </Teleport>

  <!-- Mobile: edit icon button next to title -->
  <Teleport to="#page-title-actions" defer>
    <button
      class="sm:hidden size-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
      @click="handleOpenEditModal"
    >
      <i class="*:size-4" v-html="icons.edit"></i>
    </button>
  </Teleport>

  <div v-if="isLoading" class="flex justify-center py-20">
    <i class="w-10 h-10 animate-spin text-primary" v-html="icons.spinner"></i>
  </div>

  <div v-else-if="transporter" class="flex flex-col gap-4 md:gap-6">
    <!-- Header Info Card -->
    <div class="bg-grey-25 rounded-[32px] p-4 md:p-10 border border-grey-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8">
      <div class="flex items-center gap-4 md:gap-8">
        <div class="size-16 md:size-32 shrink-0 rounded-full bg-surface flex items-center justify-center shadow-lg border border-grey-100 p-3 md:p-4 overflow-hidden">
          <i class="*:size-full text-primary" v-html="icons.trasporter"></i>
        </div>
        <div class="flex flex-col gap-1">
          <h2 class="text-2xl md:text-4xl font-black text-grey-900 tracking-tight">
            {{ transporter.name }}
          </h2>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase">
              {{ transporter.tradeName }}
            </span>
            <span class="px-3 py-1 bg-grey-100 text-grey-600 text-xs font-bold rounded-full uppercase">
              {{ transporter.type || "Transporter" }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Details Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <div class="bg-surface rounded-[32px] p-4 md:p-6 border border-grey-100 flex flex-col gap-4 md:gap-6">
        <h3 class="text-xl font-bold text-grey-900">General Information</h3>
        <div class="grid grid-cols-2 gap-3 md:gap-4">
          <div class="flex flex-col gap-1 p-3 md:p-4 bg-grey-25 rounded-2xl border border-grey-100">
            <span class="text-xs font-bold text-grey-500 uppercase tracking-wider">Transporter Name</span>
            <span class="text-base font-bold text-grey-900">{{ transporter.name }}</span>
          </div>
          <div class="flex flex-col gap-1 p-3 md:p-4 bg-grey-25 rounded-2xl border border-grey-100">
            <span class="text-xs font-bold text-grey-500 uppercase tracking-wider">Trade Name</span>
            <span class="text-base font-bold text-grey-900">{{ transporter.tradeName }}</span>
          </div>
          <div class="flex flex-col gap-1 p-3 md:p-4 bg-grey-25 rounded-2xl border border-grey-100 col-span-2">
            <span class="text-xs font-bold text-grey-500 uppercase tracking-wider">TIN</span>
            <span class="text-base font-bold text-grey-900">{{ transporter.tin || "-" }}</span>
          </div>
        </div>
      </div>

      <div class="bg-surface rounded-[32px] p-4 md:p-6 border border-grey-100 flex flex-col gap-4 md:gap-6">
        <h3 class="text-xl font-bold text-grey-900">Contact & Address</h3>
        <div class="grid grid-cols-2 gap-3 md:gap-4">
          <div class="flex flex-col gap-1 p-3 md:p-4 bg-grey-25 rounded-2xl border border-grey-100">
            <span class="text-xs font-bold text-grey-500 uppercase tracking-wider">Phone</span>
            <span class="text-base font-bold text-grey-900">{{ transporter.phoneNumber || "-" }}</span>
          </div>
          <div class="flex flex-col gap-1 p-3 md:p-4 bg-grey-25 rounded-2xl border border-grey-100">
            <span class="text-xs font-bold text-grey-500 uppercase tracking-wider">Email</span>
            <span class="text-base font-bold text-grey-900">{{ transporter.email || "-" }}</span>
          </div>
          <div class="flex flex-col gap-1 p-3 md:p-4 bg-grey-25 rounded-2xl border border-grey-100 col-span-2">
            <span class="text-xs font-bold text-grey-500 uppercase tracking-wider">City</span>
            <span class="text-base font-bold text-grey-900">{{ transporter.city || "-" }}</span>
          </div>
          <div class="flex flex-col gap-1 p-3 md:p-4 bg-grey-25 rounded-2xl border border-grey-100 col-span-2">
            <span class="text-xs font-bold text-grey-500 uppercase tracking-wider">Address</span>
            <span class="text-base font-bold text-grey-900">{{ transporter.address || "-" }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bank Accounts Section -->
    <div class="bg-surface rounded-[32px] p-4 md:p-6 border border-grey-100 flex flex-col gap-4 md:gap-6">
      <h3 class="text-xl font-bold text-grey-900">Bank Accounts</h3>
      <div v-if="transporter.bankAccount && transporter.bankAccount.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <div
          v-for="(bank, index) in transporter.bankAccount"
          :key="index"
          class="flex flex-col gap-3 p-4 md:p-5 bg-grey-25 border border-grey-100 rounded-2xl relative shadow-sm"
        >
          <div class="absolute top-4 right-4" v-if="bank.preferred">
            <span class="px-2.5 py-0.5 bg-green-50 text-green-700 border border-green-200 text-xs font-bold rounded-full uppercase">
              Preferred
            </span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs font-bold text-grey-500 uppercase tracking-wider">Bank Name</span>
            <span class="text-base font-bold text-grey-900">{{ bank.bank?.name || "Not specified" }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-xs font-bold text-grey-500 uppercase tracking-wider">Account Number</span>
            <span class="text-base font-semibold text-grey-800">{{ bank.accountNumber || "Not specified" }}</span>
          </div>
        </div>
      </div>
      <div v-else class="text-grey-500 py-6 text-center border border-dashed border-grey-200 rounded-2xl">
        No bank accounts registered.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import Button from "@/components/common/Button.vue";
import { fetch_transporter_by_id, delete_transporter } from "../api/operation.api";
import { openModal } from "@customizer/modal-x";
import { useToastStore } from "@/store/toastStore";
import { icons } from "@/utils/icons";

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const transporterId = route.params.id as string;

const { data: transporterRes, isLoading, refetch } = useQuery({
  queryKey: ["transporter", transporterId],
  queryFn: () => fetch_transporter_by_id(transporterId),
});

const transporter = computed(() => transporterRes.value?.data);

const handleOpenEditModal = async () => {
  const res = await openModal("AddTransporterModal", { transporter: transporter.value });
  if (res) {
    refetch();
  }
};

const handleDelete = async () => {
  const confirmDelete = await openModal("ConfirmationModal", {
    title: "Delete Transporter",
    message: `Are you sure you want to delete ${transporter.value.name}? This action cannot be undone.`,
  });

  if (confirmDelete) {
    try {
      const res: any = await delete_transporter(transporterId);
      if (res.success || res.status === 200 || res.status === 204) {
        toast.success("Transporter deleted successfully!");
        router.push("/transporters");
      } else {
        toast.error(res.error || "Failed to delete transporter");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.description || "An error occurred while deleting the transporter.");
    }
  }
};
</script>
