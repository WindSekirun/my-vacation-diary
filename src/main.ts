/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'
import "leaflet"

// currently, vue-horizontal doesn't support typescript typings
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import VueHorizontal from "vue-horizontal";

const app = createApp(App)
app.component(VueHorizontal)

registerPlugins(app)

app.mount('#app')
