<template>
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <app-upload ref="upload" :addSong="addSong"></app-upload>
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <!-- Song 01 -->
            <composition-item
              v-for="(song, i) in songs"
              :key="song.docID"
              :song="song"
              :updateSong="updateSong"
              :index="i"
              :removeSong="removeSong"
              :updateUnsavedFlag="updateUnsavedFlag"
            ></composition-item>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// import useUserStore from '@/stores/user'
import AppUpload from '@/components/AppUpload.vue'
import CompositionItem from '@/components/CompositionItem.vue'
import { songsCollection, auth } from '@/includes/firebase'
import { query, where, getDocs } from 'firebase/firestore'

export default {
  name: 'manage-view',
  data() {
    return {
      songs: [],
      unsavedFlag: false
    }
  },
  //   beforeRouteEnter(to, from, next) {
  //     const store = useUserStore() // We call it directly since it's not initialized until 'next()' in called below

  //     if (store.userLoggedIn) {
  //       next()
  //     } else {
  //       next({ name: 'home' })
  //     }

  //     console.log('beforeRouteEnter Guard')
  //     next()
  //   }
  components: {
    AppUpload,
    CompositionItem
  },
  // This is also Navigation Guard
  // beforeRouteLeave(to, from, next) {
  //   this.$refs.upload.cancelUploads()
  //   next()
  // }
  methods: {
    // This method will be called from child component to update song in this component
    updateSong(i, values) {
      this.songs[i].modified_name = values.modified_name
      this.songs[i].genre = values.genre
    },
    removeSong(i) {
      this.songs.splice(i, 1)
    },
    // Add song AFTER it's been added to Firebase (ie uploaded) in child 'AppUpload.vue' component
    addSong(addedSongDocument) {
      // Let's set up all we need to retrieve ONE sonng (we're looping over all of them)
      const song = {
        ...addedSongDocument.data(), //this merges returned values with 'song' object (instead of one by one)
        docID: addedSongDocument.id // this need to be explicitly set (we'll need this for editing of the song)
      }
      // We add song to songs (our data property)
      this.songs.unshift(song)
    },
    updateUnsavedFlag(value) {
      this.unsavedFlag = value
    }
  },
  // Query DATABASE for data
  async created() {
    // This is the EARLIEST we can make a request in a component
    // Also...VueJS won't actaully 'wait' for request to complete to render the component
    // const snapshot = await songsCollection.where('uid', '==', auth.currentUser.uid).get()

    // snapshot.forEach(this.addSong)

    const q = query(songsCollection, where('uid', '==', auth.currentUser.uid))
    const snapshot = await getDocs(q)
    snapshot.forEach(this.addSong)
  },
  // FailsafE: REMEMBER data with which FORM was pre-filled BEFORE user accidentially navigated away from page (ie accidental swipe)
  beforeRouteLeave(to, from, next) {
    // If no unsaved changes happened (flag is 'clean') we'll allow user to navigate away
    if (!this.unsavedFlag) {
      next()
    } else {
      const leave = confirm('You have unsaved changes. Are you sure you want to leave?') //alert
      next(leave) // boolean true or false
    }
  }
}
</script>
