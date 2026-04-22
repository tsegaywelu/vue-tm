<template>
  <div
    :class="[
      'flex items-center gap-1.5 border text-sm px-2 h-9 rounded-full transition-all duration-200',
      statusStyles.class,
    ]"
  >
    <div
      class="rounded-full size-2.5 border"
      :style="{
        borderColor: statusStyles.dotColor,
      }"
    ></div>
    <span class="truncate">
      <slot>{{ label }}</slot>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

export type StatusVariant =
  | "vehicle_assigned"
  | "accepted"
  | "waiting_to_load_at_origin"
  | "loading_started_at_origin"
  | "loaded_at_origin"
  | "departed"
  | "en_route_to_destination"
  | "arrived_at_destination"
  | "waiting_to_offload_at_destination"
  | "offloading_started_at_destination"
  | "offloaded_at_destination"
  | "waiting_to_load_at_destination"
  | "loading_started_at_destination"
  | "loaded_at_destination"
  | "en_route_to_origin"
  | "arrived_at_origin"
  | "waiting_to_offload_at_origin"
  | "offloading_started_at_origin"
  | "offloaded_at_origin"
  | "completed"
  | "custom"
  | "terminated"
  | "cancelled"
  | "delayed"
  | "pending"
  | "active"
  | "warning"
  | (string & {});

interface Props {
  variant: StatusVariant;
  type?: "wrapped" | "extended";
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: "extended",
});

const statusStyles = computed(() => {
  const isExtended = props.type === "extended";
  const baseClass = isExtended ? "xl:min-w-32 justify-center" : "w-fit";

  // Map of status values to their respective styles
  const styles: Record<string, { class: string; dotColor: string }> = {
    warning: {
      class: `${baseClass} border-[#FFE2BC] bg-[#FFF8EF] text-[#FA991A]`,
      dotColor: "#FA991A",
    },
    pending: {
      class: `${baseClass} border-[#FFE2BC] bg-[#FFF8EF] text-[#FA991A]`,
      dotColor: "#FA991A",
    },
    vehicle_assigned: {
      class: `${baseClass} border-[#FFE2BC] bg-[#FFF8EF] text-[#FA991A]`,
      dotColor: "#FA991A",
    },
    delayed: {
      class: `${baseClass} border-[#FFE2BC] bg-[#FFF8EF] text-[#FA991A]`,
      dotColor: "#FA991A",
    },
    accepted: {
      class: `${baseClass} border-[#A486FF] bg-[#FAF8FF] text-[#6633FF]`,
      dotColor: "#6633FF",
    },
    active: {
      class: `${baseClass} border-[#BBD7FF] bg-[#EFF6FF] text-[#2681FF]`,
      dotColor: "#2681FF",
    },
    departed: {
      class: `${baseClass} border-[#BBD7FF] bg-[#EFF6FF] text-[#2681FF]`,
      dotColor: "#2681FF",
    },
    completed: {
      class: `${baseClass} border-[#9EE4A6] bg-[#F2FFF4] text-[#02B516]`,
      dotColor: "#02B516",
    },
    cancelled: {
      class: `${baseClass} border-[#FFBBBB] bg-[#FFF8F8] text-[#FF7B7B]`,
      dotColor: "#FF7B7B",
    },
    terminated: {
      class: `${baseClass} border-[#FFBBBB] bg-[#FFF8F8] text-[#FF7B7B]`,
      dotColor: "#FF7B7B",
    },
  };

  // Check for partial matches or defaults
  const variant = props.variant.toLowerCase();

  if (styles[variant]) return styles[variant];

  // Logical groupings for statuses that might not be exact matches
  if (
    variant.includes("pending") ||
    variant.includes("waiting") ||
    variant.includes("loading") ||
    variant.includes("custom")
  ) {
    return styles.pending;
  }
  if (
    variant.includes("active") ||
    variant.includes("departed") ||
    variant.includes("route") ||
    variant.includes("arrived") ||
    variant.includes("loaded") ||
    variant.includes("offload")
  ) {
    return styles.active;
  }
  if (variant.includes("complete")) {
    return styles.completed;
  }
  if (
    variant.includes("cancel") ||
    variant.includes("terminate") ||
    variant.includes("reject")
  ) {
    return styles.cancelled;
  }

  // Default fallback
  return {
    class: `${baseClass} border-gray-200 bg-gray-50 text-gray-500`,
    dotColor: "#6b7280",
  };
});
</script>
