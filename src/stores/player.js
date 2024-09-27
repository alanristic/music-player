import { defineStore } from 'pinia'
import { Howl } from 'howler'
import helper from '@/includes/helper'

export default defineStore('player', {
  state: () => ({
    songProgress: 0,
    current_song: {},
    sound: {},
    seek: '00:00', // Name of the current position of the played song in the format '00:00' (like Howler uses it)
    duration: '00:00',
    playerProgress: '0%'
  }),
  actions: {
    /**
     * Plays a song in the player
     * @param {*} song
     */
    async newSong(song) {
      // If there is a song playing, we unload it (prevent playing from multiple overlaping sources)
      if (this.sound instanceof Howl) {
        this.sound.unload()
      }

      this.current_song = song

      this.sound = new Howl({
        src: [song.url], // Includes complete HTTP path to the song file
        html5: true // This solves 'crossorigin policy' problem
      })

      this.sound.play()

      this.sound.on('play', () => {
        // Currently it's callse only ONCE, when the song starts playing (recursion is done in progress() fnc)
        requestAnimationFrame(this.progress)
      })
    },
    async toggleAudio() {
      // We check if 'playing' fnc is defined, signalling us Song is Howl instance
      if (!this.sound.playing) {
        // There isn't an audio file playing, so we exit the function
        return
      }

      if (this.sound.playing()) {
        this.sound.pause()
      } else {
        this.sound.play()
      }
    },
    // Does mutation on the state properties used in player
    progress() {
      this.seek = helper.formatTime(this.sound.seek())
      this.duration = helper.formatTime(this.sound.duration())

      this.playerProgress = (this.sound.seek() / this.sound.duration()) * 100 + '%'

      if (this.sound.playing()) {
        // this.songProgress = (this.sound.seek() / this.sound.duration()) * 100
        // Recursive call to keep updating the progress
        requestAnimationFrame(this.progress)
      }
    },
    /**
     * Updates the seek of the song when the user clicks on the progress bar
     * @param {*} event
     * @returns
     */
    updateSeek(event) {
      if (!this.sound.playing) {
        // No song is playing, so we exit the function
        return
      }

      const { left, width } = event.target.getBoundingClientRect()
      const clickPosition = event.clientX - left
      const percentage = clickPosition / width
      const seconds = this.sound.duration() * percentage

      this.sound.seek(seconds)
      this.sound.once('seek', this.progress) // 'seek' event is emitted when the seek is done via Howler
    }
  },
  getters: {
    playing: (state) => {
      // We check if 'playing' fnc is defined, signalling us Song is Howl instance
      if (state.sound.playing) {
        return state.sound.playing()
      }

      return false
    }
  }
})
