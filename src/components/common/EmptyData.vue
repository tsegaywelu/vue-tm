<template>
  <div :class="['flex items-center justify-center w-full h-full', class_name]">
    <transition name="fade-up" appear>
      <div class="px-4 py-7.5 flex justify-center items-center flex-col">
        <transition name="pop-in" appear>
          <div class="grid place-items-center">
            <template v-if="img_url">
              <img
                class="size-64 sm:size-80 md:size-96 lg:size-[350px] h-auto object-contain"
                :src="img_url"
                :alt="title || 'Empty data'"
              />
            </template>
            <template v-else-if="icon">
              <div
                class="size-48 sm:size-64 md:size-80 lg:size-96 *:size-full flex justify-center items-center"
                v-html="icon"
              ></div>
            </template>
            <template v-else>
              <img
                class="size-64 sm:size-80 md:size-96 lg:size-[450px] xl:size-[550px] h-auto object-contain"
                src="/load_search_empty.png"
                alt="Empty data"
              />
            </template>
          </div>
        </transition>

        <div class="grid place-items-center text-center mt-4">
          <h2 v-if="title" class="text-xl sm:text-2xl md:text-[25px] title-xl">
            {{ title }}
          </h2>
          <p
            v-if="sub_title"
            class="text-sm sm:text-base md:text-xl sub-title-xl mt-2.5"
          >
            {{ sub_title }}
          </p>
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
defineProps({
  show: {
    type: Boolean,
    default: true,
  },
  icon: {
    type: String,
    default: "",
  },
  img_url: {
    type: String,
    default: "",
  },
  title: { type: String, default: "" },
  sub_title: { type: String, default: "" },
  class_name: { type: String, default: "" },
});
</script>

<style scoped>
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.3s ease;
}
.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.pop-in-enter-active,
.pop-in-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.pop-in-enter-from,
.pop-in-leave-to {
  opacity: 0;
  transform: scale(0.5) rotate(-45deg);
}
</style>
