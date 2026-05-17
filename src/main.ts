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
