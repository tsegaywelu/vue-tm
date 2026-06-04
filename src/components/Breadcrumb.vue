<script setup lang="ts">
import { computed } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { icons } from "@/utils/icons";
import type { Navs } from "@/types/navigation";
import { getNestedRoute } from "@/utils/utils";

const props = defineProps<{
  navs: Navs[];
}>();

const route = useRoute();
const currentPath = computed(() => route.path);

const breadCrumbs = computed(() => {
  return getNestedRoute(props.navs as any, currentPath.value) || [];
});
</script>

<template>
  <div class="ml-2 hidden md:block bg-surface rounded-2xl z-10 w-fit">
    <div class="px-3 py-2.5">
      <div class="flex gap-2 items-center">
        <i v-html="icons.homeIcon" class="*:size-4"></i>
        <template
          v-for="(crumb, index) in breadCrumbs"
          :key="crumb.name || index"
        >
          <i
            v-if="index === 0"
            v-html="icons.leftAngle"
            class="*:bg-surface *:min-w-2 *:min-h-3.5 text-grey-400 flex items-center justify-center transform rotate-180"
          />
          <i
            v-else
            v-html="icons.leftAngle"
            class="*:bg-surface *:min-w-2 *:min-h-3.5 text-grey-400 flex items-center justify-center transform rotate-180"
          />
          <RouterLink
            :to="crumb.path || '#'"
            class="text-base-text text-[0.875rem] font-semibold leading-[18px]"
          >
            {{ crumb.name }}
          </RouterLink>
        </template>
        <i
          v-if="breadCrumbs.length > 0"
          v-html="icons.leftAngle"
          class="*:bg-surface *:min-w-2 *:min-h-3.5 text-grey-400 flex items-center justify-center transform rotate-180"
        />
      </div>
    </div>
  </div>
</template>
