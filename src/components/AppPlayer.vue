<template>
  <!-- Player (bottom audio player) -->
  <div class="fixed bottom-0 left-0 bg-white p-5 pb-4 text-left align-top w-full h-16">
    <div class="relative">
      <!-- Play/Pause Button -->
      <div class="float-left w-7 h-7 leading-3">
        <button type="button" @click.prevent="toggleAudio" id="player-play-btn">
          <i
            class="fa text-gray-500 text-xl"
            :class="{ 'fa-play': !playing, 'fa-pause': playing }"
          ></i>
        </button>
      </div>
      <!-- Current Position -->
      <div class="float-left w-7 h-7 leading-3 text-gray-400 mt-0 text-lg w-14 ml-5 mt-1">
        <span class="player-currenttime">{{ seek }}</span>
      </div>
      <!-- Scrub Container -->
      <div class="float-left w-7 h-7 leading-3 ml-7 mt-2 player-scrub" @click.prevent="updateSeek">
        <!-- Song Info -->
        <div
          class="absolute left-0 right-0 text-lg text-center mx-auto player-song-info"
          v-if="current_song.modified_name"
        >
          <span class="song-title">{{ current_song.modified_name }}</span> by
          <span class="song-artist">{{ current_song.display_name }}</span>
        </div>
        <span class="block w-full h-2 rounded m-1 mt-2 bg-gray-200 relative cursor-pointer">
          <!-- Player Ball -->
          <span class="absolute top-neg-8 text-gray-800 text-lg" :style="{ left: playerProgress }">
            <i class="fas fa-circle"></i>
          </span>
          <!--Player Progress Bar -->
          <span
            class="block h-2 rounded bg-gradient-to-r from-green-500 to-green-400"
            :style="{ width: playerProgress }"
          ></span>
        </span>
      </div>
      <!-- Duration -->
      <div class="float-left w-7 h-7 leading-3 text-gray-400 mt-0 text-lg w-14 ml-8 mt-1">
        <span class="player-duration">{{ duration }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import usePlayerStore from '@/stores/player'

export default {
  name: 'AppPlayer',
  data() {
    return {
      // Your component data goes here
    }
  },
  computed: {
    ...mapState(usePlayerStore, ['playing', 'duration', 'seek', 'playerProgress', 'current_song'])
  },
  methods: {
    // Your component methods go here
    ...mapActions(usePlayerStore, ['toggleAudio', 'updateSeek'])
  }
}
</script>
