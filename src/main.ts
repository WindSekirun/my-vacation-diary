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

import 'vue-fullpage.js/dist/style.css'

// currently, vue-fullpage doesn't support typescript typings
// https://github.com/alvarotrigo/vue-fullpage.js/issues/253
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import VueFullPage from 'vue-fullpage.js'

const app = createApp(App)
app.use(VueFullPage)


registerPlugins(app)

app.mount('#app')
