<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link
        class="text-white font-bold uppercase text-2xl mr-4"
        :to="{ name: 'home' }"
        exact-active-class="no-active"
        >Music</router-link
      >

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li>
            <router-link class="text-white px-2" :to="{ name: 'about' }">About</router-link>
          </li>
          <li v-if="!userStore.userLoggedIn">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal"
              >Login / Register</a
            >
          </li>
          <template v-else>
            <li>
              <router-link class="px-2 text-white" :to="{ name: 'manage' }">Manage</router-link>
            </li>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent="logout">LogOut</a>
            </li>
          </template>
        </ul>
        <ul class="ml-auto">
          <li>
            <a class="px-2 text-white" href="#" @click.prevent="changeLanguagee">{{
              currentLanguage
            }}</a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapStores } from 'pinia'
import useModalStore from '@/stores/modal'
import useUserStore from '@/stores/user'

export default {
  name: 'AppHeader',
  computed: {
    ...mapStores(useModalStore, useUserStore),
    currentLanguage() {
      return this.$i18n.locale === 'en' ? 'French' : 'English'
    }
  },
  methods: {
    toggleAuthModal() {
      this.modalStore.isOpen = !this.modalStore.isOpen
      console.log('DBG: this.modalStore.isOpen=' + this.modalStore.isOpen)
    },
    // just a use-case how we can use local fnc to dispatch store's fnc
    logout() {
      this.userStore.logout() // We''re dispatching Store's logout via this Component's local logou()

      // if (this.$route.name === 'manage') {
      if (this.$route.meta.requiresAuth) {
        this.$router.push({ name: 'home' }) // Redirect user
      }
    },
    changeLanguagee() {
      this.$i18n.locale = this.$i18n.locale === 'en' ? 'fr' : 'en'
    }
  }
}
</script>
