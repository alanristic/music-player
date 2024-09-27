<template>
  <!-- Header -->
  <app-header></app-header>

  <router-view v-slot="{ Component }">
    <!-- Ghost component we use to load component dynamically and TAKE CONTROL of the rendering components process -->
    <transition name="fade" mode="out-in">
      <component :is="Component"></component>
    </transition>
  </router-view>

  <app-player></app-player>

  <!-- Auth Modal (login/regsiter) -->
  <app-auth></app-auth>
</template>

<script>
// Components import
import AppHeader from '@/components/AppHeader.vue'
import AppAuth from './components/AppAuth.vue'
import AppPlayer from './components/AppPlayer.vue' // we import PLAYER store

import headerImage from '@/assets/img/header.png' // Asset registered locally as direct linking didn't work (likely caching issue)

import { auth } from '@/includes/firebase'
import { mapWritableState } from 'pinia' // we import Pinia stores ability
import useUserStore from '@/stores/user' // we import USER store

export default {
  data() {
    return {
      headerImage
    }
  },
  components: {
    AppHeader,
    AppAuth,
    AppPlayer
  },
  computed: {
    ...mapWritableState(useUserStore, ['userLoggedIn'])
  },
  created() {
    if (auth.currentUser) {
      this.userLoggedIn = true
    }
  }
}
</script>

<style>
.fade-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: all 0.5s linear;
}
.fade-leave-to {
  transition: all 0.5s linear;
  opacity: 0;
}
</style>
