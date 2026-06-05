<template>
  <div class="grid grid-cols-1 @[560px]:grid-cols-2 @[900px]:grid-cols-4 gap-4">
    <div
      v-for="card in cards"
      :key="card.label"
      class="bg-surface rounded-2xl border border-gray-100 shadow-sm p-5"
    >
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center justify-center w-9 h-9 rounded-full" :class="card.iconBg">
          <i class="mdi text-lg" :class="[card.icon, card.iconColor]"></i>
        </div>
        <span class="text-xs font-semibold px-2 py-0.5 rounded-full" :class="card.badgeClass">
          {{ card.subtitle }}
        </span>
      </div>
      <div class="text-2xl font-extrabold leading-none text-gray-900 mt-2">
        {{ counts?.[card.key] ?? 0 }}
      </div>
      <div class="text-xs mt-1.5 font-medium text-gray-400">{{ card.label }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  counts?: {
    uploadedCount: number;
    delayedReceivableCount: number;
    delayedInvoicesCount: number;
    availableVehicleCount: number;
  } | null;
}>();

const cards = [
  {
    key: "uploadedCount",
    label: "Uploaded Shipments",
    subtitle: "In period",
    icon: "mdi-upload",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    badgeClass: "bg-indigo-50 text-indigo-600",
  },
  {
    key: "delayedReceivableCount",
    label: "Delayed Receivables",
    subtitle: "> 15 days",
    icon: "mdi-clock-alert-outline",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    badgeClass: "bg-amber-50 text-amber-600",
  },
  {
    key: "delayedInvoicesCount",
    label: "Delayed Invoices",
    subtitle: "> 15 days",
    icon: "mdi-file-alert-outline",
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    badgeClass: "bg-red-50 text-red-500",
  },
  {
    key: "availableVehicleCount",
    label: "Available Vehicles",
    subtitle: "Snapshot",
    icon: "mdi-truck-check-outline",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    badgeClass: "bg-emerald-50 text-emerald-600",
  },
] as const;
</script>
