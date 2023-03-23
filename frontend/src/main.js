import { createApp } from 'vue'

import { router } from './router.js'
import { store } from './store/store.js'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// import Popper from "vue3-popper";

import './assets/styles/styles.scss'
import App from './App.vue'

const app = createApp(App)

// app.component("Popper", Popper);
app.use(ElementPlus)
app.use(router)
app.use(store)

app.mount('#app')
