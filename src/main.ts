import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles/main.css'

/**
 * Vue 3 Application Entry Point:
 * 1. Instantiates the root Vue application instance from App.vue.
 * 2. Registers Pinia state management plugin.
 * 3. Registers Vue Router for client-side navigation.
 * 4. Mounts the app to the `#app` DOM element in index.html.
 */
const app = createApp(App)

// Enable global state management
app.use(createPinia())

// Enable client-side routing
app.use(router)

// Mount application
app.mount('#app')
