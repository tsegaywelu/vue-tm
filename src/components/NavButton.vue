<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Navs } from "@/types/navigation";
import { pathMatches, isRouteActive } from "@/utils/navigation";
import { icons } from "@/utils/icons";

const props = defineProps<{
  nav: Navs;
  className?: string;
  type?: "opened" | "closed";
  nested?: boolean;
  hide_text?: boolean;
}>();

const emit = defineEmits<{
  (e: "nav_item_click"): void;
}>();

const route = useRoute();
const router = useRouter();
const is_open = ref(false);

const route_style = {
  true: "rounded-[36px] text-white",
  false: "rounded-3xl border-transparent hover:bg-grey-50",
  trueInner: "rounded-[36px] bg-primary/5 text-primary",
  innerActive: "!text-primary bg-grey-50",
  notNested: "primary-gradient shadow-lg shadow-primary/20",
};

const nav_button_styles = {
  opened: "justify-start px-3",
  closed: "justify-center px-0 w-12 mx-auto",
};

const is_nav_closed = computed(() => props.type === "closed");
const is_active = computed(() =>
  props.nav.path ? pathMatches(props.nav.path, route.path) : false,
);
const is_inner_active = computed(() =>
  props.nav.children?.some((child) => isRouteActive(child, route.path)),
);
const children_showable = computed(() =>
  (props.nav.children || []).filter((child) => child.show !== false),
);

const handle_click = () => {
  if (props.nav.onClick) {
    props.nav.onClick();
  }
  if (props.nav.path) {
    router.push(props.nav.path);
    emit("nav_item_click");
  }

  if (children_showable.value.length) {
    is_open.value = !is_open.value;
    emit("nav_item_click");
  }
};

watchEffect(() => {
  if (is_inner_active.value) {
    is_open.value = true;
  }
});
</script>

<template>
  <div role="button" class="shadow-none flex flex-col gap-1 w-full">
    <button
      tabindex="0"
      @click="handle_click"
      class="duration-200 transition-all flex truncate items-center flex-1 gap-3"
      :class="[
        route_style[String(is_active) as 'true' | 'false'],
        !nested && is_active && route_style.notNested,
        nested ? 'min-h-10! pl-12 pr-4' : 'min-h-[46px] text-[15px]',
        nav_button_styles[type || 'opened'],
        is_inner_active ? route_style.trueInner : route_style.false,
        nested && is_active ? route_style.innerActive : '',
        nested && 'pl-6!',
        className,
      ]"
    >
      <i
        v-if="nav.icon"
        class="flex items-center justify-center transition-all duration-300 shrink-0"
        :class="[
          nested ? '*:size-5' : '*:size-6',
          is_active && !nested
            ? 'text-white'
            : is_active
              ? 'text-primary'
              : 'text-grey-400',
        ]"
        v-html="icons[nav.icon] || nav.icon"
      ></i>

      <template v-if="!is_nav_closed">
        <span
          :class="[nested ? 'text-sm' : 'text-base']"
          class="truncate transition-colors"
          >{{ nav.name }}</span
        >
      </template>

      <span
        v-if="children_showable.length && !is_nav_closed"
        class="ml-auto size-5 grid place-items-center transition-transform duration-300"
        :class="is_open ? 'rotate-90' : 'rotate-0'"
      >
        <i class="*:size-4" v-html="icons.leftAngle"></i>
      </span>
    </button>

    <Transition
      name="expand"
      @enter="
        (el: Element) =>
          ((el as HTMLElement).style.height = el.scrollHeight + 'px')
      "
      @after-enter="
        (el: Element) => ((el as HTMLElement).style.height = 'auto')
      "
      @leave="
        (el: Element) =>
          ((el as HTMLElement).style.height = el.scrollHeight + 'px')
      "
      @before-leave="(el: Element) => (el as HTMLElement).offsetHeight"
      @leave-to="(el: Element) => ((el as HTMLElement).style.height = '0')"
    >
      <div
        v-if="is_open && !is_nav_closed"
        class="overflow-hidden transition-all pl-4 duration-300 ease-in-out"
      >
        <div
          v-if="children_showable.length"
          class="flex flex-col gap-1 border-l border-grey-300 py-1 px-2"
        >
          <NavButton
            v-for="(child, index) in children_showable"
            :key="index"
            :nav="child"
            :nested="true"
            @nav_item_click="$emit('nav_item_click')"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition:
    height 0.3s ease-in-out,
    opacity 0.3s ease-in-out;
}

.expand-enter-from,
.expand-leave-to {
  height: 0;
  opacity: 0;
}
</style>
