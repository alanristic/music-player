import './assets/base.css'
import './assets/main.css'
import 'nprogress/nprogress.css' // CSS for progress bar (it comes with pre-defines styles, but loading them is optional )

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VeeValidatePlugin from './includes/validation'
import { auth } from '@/includes/firebase'
import Icon from '@/directives/icons'
import i18n from './includes/i18n'
// import { registerSW } from 'virtual:pwa-register' // Registration of the service worker

// Registring GLOBAL komponent
import GlobalComponents from '@/includes/_globals'
import progressBar from './includes/progress-bar' // Import the progress bar (non-vue component)

// We'll 1st initialize Firebase and check if user is authenticated BEFORE we load VueJS App

// registerSW({ immediate: true }) // Register the service worker

progressBar(router) // Register the progress bar with our router object so that it can be used/acessed by it

let app
auth.onAuthStateChanged(() => {
  // Since this can be fired multiple times, we'll only want to
  // initialize app ONCE
  if (!app) {
    app = createApp(App)

    // plugin registrations
    app.use(createPinia()) //State management
    app.use(router) //Router
    app.use(VeeValidatePlugin) // Form validation
    app.use(i18n) // Translations

    // Global components import registration
    app.use(GlobalComponents)

    // Adding a global DIRECTIVE (2nd argument is the directive config. object)
    // NAME 'icon' important as it will be used in the template as 'v-icon'
    app.directive('icon', Icon)

    app.mount('#app')
  }
})
