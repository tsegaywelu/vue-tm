import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import modal from "@customizer/modal-x";
import VueApexCharts from 'vue3-apexcharts'
import './style.css'
import App from './App.vue'
import router from './router'
import { roleDirective } from './directives/role'
import { permissionDirective } from './directives/permission'

const app = createApp(App)
const pinia = createPinia()
const query_client = new QueryClient()

app.use(pinia)
app.use(router)
app.use(VueQueryPlugin, { queryClient: query_client })
app.use(modal)
app.use(VueApexCharts)
app.directive('role', roleDirective)
app.directive('permission', permissionDirective)

app.mount('#app')

if ('serviceWorker' in navigator) {
  // Reload when a new SW takes control (new deployment activated)
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload()
  })

  // Periodically poll for SW updates — SPAs never make full-page requests
  // so the browser never auto-checks. This forces a check every 60 seconds.
  navigator.serviceWorker.ready.then((registration) => {
    setInterval(() => registration.update(), 60 * 1000)
  })
}
