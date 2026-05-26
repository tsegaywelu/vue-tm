import { ref, onMounted, onUnmounted } from "vue";

export function useIsMobile(breakpoint = 640) {
  const isMobile = ref(false);
  let timeout: ReturnType<typeof setTimeout>;

  const update = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      isMobile.value = window.innerWidth < breakpoint;
    }, 100);
  };

  onMounted(() => {
    isMobile.value = window.innerWidth < breakpoint;
    window.addEventListener("resize", update);
  });

  onUnmounted(() => {
    clearTimeout(timeout);
    window.removeEventListener("resize", update);
  });

  return { isMobile };
}
