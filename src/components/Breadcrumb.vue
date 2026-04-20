<script setup lang="ts">
import { computed } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { icons } from "@/utils/icons";
import type { Navs } from "@/types/navigation";

const props = defineProps<{
  navs: Navs[];
}>();

const route = useRoute();
const currentPath = computed(() => route.path);

const getNestedRoute = (navs: Navs[], path: string): Navs[] => {
  let breadcrumbs: Navs[] = [];

  const findPath = (items: Navs[], currentPath: string): boolean => {
    for (const item of items) {
      if (item.path && currentPath === item.path) {
        breadcrumbs.push(item);
        return true;
      }
      if (item.children && item.children.length > 0) {
        if (findPath(item.children, currentPath)) {
          breadcrumbs.unshift(item);
          return true;
        }
      }
    }
    return false;
  };

  findPath(navs, path);
  return breadcrumbs;
};

const breadCrumbs = computed(() =>
  getNestedRoute(props.navs, currentPath.value),
);
</script>

<template>
  <div class="ml-2 hidden md:block bg-white rounded-2xl z-10 w-fit">
    <div class="px-3 py-2.5">
      <div class="flex gap-2 items-center">
        <!-- Home Icon -->
        <i v-html="icons.homeIcon" class="*:size-4"></i>

        <template
          v-for="(crumb, index) in breadCrumbs"
          :key="crumb.name || index"
        >
          <!-- Separator before the first crumb -->
          <i
            v-if="index === 0"
            v-html="icons.leftAngle"
            class="*:bg-white *:min-w-2 *:min-h-3.5 text-grey-400 flex items-center justify-center transform rotate-180"
          />

          <!-- Separator between crumbs -->
          <i
            v-else
            v-html="icons.leftAngle"
            class="*:bg-white *:min-w-2 *:min-h-3.5 text-grey-400 flex items-center justify-center transform rotate-180"
          />

          <RouterLink
            :to="crumb.path || '#'"
            class="text-[#000] text-[0.875rem] font-semibold leading-[18px]"
          >
            {{ crumb.name }}
          </RouterLink>
        </template>

        <!-- Separator after the last crumb (based on raaz implementation) -->
        <i
          v-if="breadCrumbs.length > 0"
          v-html="icons.leftAngle"
          class="*:bg-white *:min-w-2 *:min-h-3.5 text-grey-400 flex items-center justify-center transform rotate-180"
        />
      </div>
    </div>
  </div>
</template>
