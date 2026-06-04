<template>
  <div class="flex items-center gap-2">
    <!-- First page button -->
    <Button
      class="p-0! h-10 w-10 rounded-full border border-line flex items-center justify-center"
      variant="outline"
      @click="onPageChange(1)"
      :disabled="current_page <= 1"
    >
      <div class="text-base-text *:size-4" v-html="icons.doubleAngle"></div>
    </Button>

    <!-- Previous page button -->
    <Button
      class="p-0! h-10 w-10 rounded-full border border-line flex items-center justify-center"
      variant="outline"
      @click="onPageChange(current_page - 1)"
      :disabled="current_page <= 1"
    >
      <div class="text-base-text *:size-4" v-html="icons.leftAngle"></div>
    </Button>

    <!-- Page numbers with ellipsis -->
    <template v-for="(page, index) in page_range" :key="`${page}-${index} `">
      <template v-if="page === 'ellipsis-start' || page === 'ellipsis-end'">
        <template
          v-if="show_input === (page === 'ellipsis-start' ? 'start' : 'end')"
        >
          <input
            type="number"
            :min="1"
            :max="total_pages"
            autofocus
            v-model="input_value"
            @keydown="handleInputSubmit"
            @click.stop
            placeholder="Go to"
            class="h-10 w-16 rounded-full border border-line bg-surface text-base-text text-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </template>
        <template v-else>
          <Button
            variant="outline"
            @click.stop="
              handleEllipsisClick(page === 'ellipsis-start' ? 'start' : 'end')
            "
            class="h-10 w-10 rounded-full text-sm font-extrabold border-none text-base-text hover:bg-surface-hover flex items-center justify-center"
            title="Click to enter page number"
          >
            ...
          </Button>
        </template>
      </template>

      <template v-else>
        <Button
          variant="outline"
          :class="[
            page === current_page
              ? 'primary-gradient !text-white !border-transparent'
              : 'text-base-text',
            'h-10 w-10 rounded-full p-0! text-sm font-extrabold border border-line flex items-center justify-center',
          ]"
          @click="onPageChange(+page)"
        >
          {{ page }}
        </Button>
      </template>
    </template>

    <!-- Next page button -->
    <Button
      class="p-0! h-10 w-10 rounded-full border border-line flex items-center justify-center"
      variant="outline"
      @click="onPageChange(current_page + 1)"
      :disabled="current_page >= total_pages"
    >
      <div
        class="text-black rotate-180 *:size-4"
        v-html="icons.leftAngle"
      ></div>
    </Button>

    <!-- Last page button -->
    <Button
      class="p-0! h-10 w-10 rounded-full border border-line flex items-center justify-center"
      variant="outline"
      @click="onPageChange(total_pages)"
      :disabled="current_page >= total_pages"
    >
      <div
        class="rotate-180 text-base-text *:size-4 flex justify-center items-center"
        v-html="icons.doubleAngle"
      ></div>
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import Button from "./Button.vue";
import { icons } from "@/utils/icons.js";

const props = defineProps({
  total_pages: { type: Number, required: true },
  current_page: { type: Number, required: true },
  sibling_count: { type: Number, default: 1 },
});

const emit = defineEmits(["page_change"]);

const input_value = ref("");
const show_input = ref<"start" | "end" | null>(null);

const handleClickOutside = () => {
  show_input.value = null;
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

const onPageChange = (page: number) => {
  emit("page_change", page);
};

const handleInputSubmit = (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    const page_num = parseInt(input_value.value, 10);
    if (!isNaN(page_num) && page_num >= 1 && page_num <= props.total_pages) {
      onPageChange(page_num);
    }
    show_input.value = null;
    input_value.value = "";
  } else if (e.key === "Escape") {
    show_input.value = null;
    input_value.value = "";
  }
};

const handleEllipsisClick = (type: "start" | "end") => {
  show_input.value = type;
  input_value.value = "";
};

const page_range = computed(() => {
  const totalPages = props.total_pages;
  const currentPage = props.current_page;
  const siblingCount = props.sibling_count;

  const totalPageNumbers = siblingCount * 2 + 5;

  if (totalPages <= totalPageNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, "ellipsis-end", totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + i + 1,
    );
    return [1, "ellipsis-start", ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i,
  );
  return [1, "ellipsis-start", ...middleRange, "ellipsis-end", totalPages];
});
</script>
