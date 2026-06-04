<script setup lang="ts">
const props = withDefaults(
  defineProps<{ show_text?: boolean; loop?: boolean; slow?: boolean; duration?: string }>(),
  { show_text: true, loop: false, slow: false, duration: '14s' },
);
</script>

<template>
  <div class="flex items-center gap-2.5 h-full" :style="props.slow ? { '--anim-dur': props.duration } : {}">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="100 220 880 640"
      class="h-full w-auto flex-shrink-0"
    >
      <g
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="43"
      >
        <path
          :class="props.slow ? 'anim-bg-1' : props.loop ? 'anim-path-loop' : 'anim-path'"
          d="M300,384 L300,268 L700,264 C700,264 774.044,265.999 776,354 C778,444 700,452 700,452 L522,452 C522,452 479.778,446.009 478,398 C476,344 524,342 524,342 L634,344"
        />
        <path
          :class="props.slow ? 'anim-bg-2' : props.loop ? 'anim-path-loop' : 'anim-path'"
          d="M296,396 L146,398 L146,748 C146,748 164,818 244,818 C324,818 332,738 332,738 L332,584 C332,584 324,538 278,538 C232,538 226,586 226,586 L228,686"
        />
        <path
          :class="props.slow ? 'anim-bg-3' : props.loop ? 'anim-path-loop' : 'anim-path'"
          d="M294,396 C294,396 354,408 384,446 C414,484 424,526 424,560 C424,594 422,810 422,810 L822,812 C822,812 940.192,787.845 934,664 C928,544 788,538 788,538 L554,538 C554,538 496,558 498,622 C500,686 576,698 576,698 L760,700"
        />
      </g>
    </svg>

    <div
      v-if="props.show_text"
      class="flex flex-col justify-center leading-none select-none text-base-text"
    >
      <span class="text-[14px] font-black tracking-[0.25em] uppercase">CHINET</span>
      <span class="text-[10px] font-semibold tracking-[0.4em] uppercase opacity-70 mt-0.5">TMS</span>
    </div>
  </div>
</template>

<style scoped>
/* one-shot draw */
.anim-path {
  stroke-dasharray: 9999;
  stroke-dashoffset: 9999;
  animation: path-draw 4s cubic-bezier(0.333, 0, 0.667, 1) forwards;
}

/* infinite: draw → hold → fade → repeat */
.anim-path-loop {
  stroke-dasharray: 9999;
  stroke-dashoffset: 9999;
  animation: path-loop 2.4s cubic-bezier(0.333, 0, 0.667, 1) infinite;
}

@keyframes path-draw {
  to { stroke-dashoffset: 0; }
}

@keyframes path-loop {
  0%   { stroke-dashoffset: 9999; opacity: 1; }
  60%  { stroke-dashoffset: 0;    opacity: 1; }
  80%  { stroke-dashoffset: 0;    opacity: 0; }
  100% { stroke-dashoffset: 9999; opacity: 0; }
}

/* background: independent traveling segments, no fade, always moving */
/* --anim-offset on a parent shifts this instance's phase without breaking inter-path offsets */
.anim-bg-1 {
  stroke-dasharray: 1600 12000;
  animation: bg-travel 18s linear infinite;
  animation-delay: var(--anim-offset, 0s);
}
.anim-bg-2 {
  stroke-dasharray: 2400 12000;
  animation: bg-travel 25s linear infinite;
  animation-delay: calc(var(--anim-offset, 0s) - 9s);
}
.anim-bg-3 {
  stroke-dasharray: 1000 12000;
  animation: bg-travel 14s linear infinite;
  animation-delay: calc(var(--anim-offset, 0s) - 5s);
}

@keyframes bg-travel {
  from { stroke-dashoffset: 2500; }
  to   { stroke-dashoffset: -12000; }
}
</style>
