import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { modalTypesPlugin } from "@customizer/modal-x/modalxPlugin.cjs";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    modalTypesPlugin({
      autoInference: true,
    }),
  ],
  envPrefix: "v_",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
