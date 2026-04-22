import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import modal from "@customizer/modal-x";
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()
const query_client = new QueryClient()

app.use(pinia)
app.use(router)
app.use(VueQueryPlugin, { queryClient: query_client })
app.use(modal)

app.mount('#app')
