<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-500 border-green-400 border-solid': is_dragover }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="is_dragover = false"
        @dragover.prevent.stop="is_dragover = true"
        @dragenter.prevent.stop="is_dragover = true"
        @dragleave.prevent.stop="is_dragover = false"
        @drop.prevent.stop="upload($event)"
      >
        <h5>Drop your files here</h5>
      </div>
      <input type="file" multiple @change="upload($event)" />
      <hr class="my-6" />
      <!-- Progres Bars -->
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <div class="font-bold text-sm" :class="upload.text_class">
          <i :class="upload.icon"></i> {{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar bg-blue-400"
            :class="upload.variant"
            :style="{ width: upload.current_progress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db, storage, auth, songsCollection } from '@/includes/firebase'
import { addDoc, getDoc } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

export default {
  name: 'App-Upload',
  data() {
    return {
      is_dragover: false,
      uploads: [] // indicator of how many uploaded songs we have (in paralel)
    }
  },
  props: ['addSong'],
  methods: {
    upload($event) {
      this.is_dragover = false
      // console.log($event)

      // weird bug in Chrome not letting us access file info directly
      //   const { files } = $event.dataTransfer
      const files = $event.dataTransfer ? [...$event.dataTransfer.files] : [...$event.target.files] // check if DNDrop exists or backup upload input was used

      // We'll loop trough all the files (aka paralel uploads)
      files.forEach((file) => {
        // let's check file MIME type (note: we'll also check this on Firebase)
        if (file.type !== 'audio/mpeg') {
          // returns iteration of the loop
          return
        }

        // Let's check if user is offline (upload doesn't work in this case)
        if (!navigator.onLine) {
          // We'll turn progress bar to red
          this.uploads.push({
            task: {}, // this is stores info about the upload
            current_progress: 100, // 'full progress' signals user attempt was made, but was unsuccessful
            name: file.name,
            variant: 'bg-red-400',
            icon: 'fas fa-times',
            text_class: 'text-red-400'
          })

          alert('You are offline. Please check your connection & try again.')
          return
        }

        // TODO: DELETE WHEN DONE REFACTORING
        // const storageRef = storage.ref() // this is reference to our bucket 'ud-music-27489.appspot.com' (root storage)
        // const songsRef = storageRef.child(`songs/${file.name}`) //ud-music-27489.appspot.com'/songs/example.mp3
        // const task = songsRef.put(file) //this does actual upload of file to Firebase

        const storageRef = ref(storage, `songs/${file.name}`) //ud-music-27489.appspot.com'/songs/example.mp3//ud-music-27489.appspot.com'/songs/example.mp3
        const task = uploadBytesResumable(storageRef, file) //this does actual upload of file to Firebase

        // we'll fill the 'uploads' array just so we have access to stuff outside of the loop (ie in the progres)
        const uploadIndex =
          this.uploads.unshift({
            task,
            current_progress: 0,
            name: file.name,
            variant: 'bg-blue-400',
            icon: 'fa fa-spinner fa-spin',
            text_class: ''
          }) - 1

        // We attach our variable to event listener (it's triggered avery time progress is updated by the Firebase server)
        task.on(
          'state_changed',
          // Upload progress cb
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100 // this gives us calculation of how the amount of transfered data
            this.uploads[uploadIndex].current_progress = progress // we must upload correct file when we have multiple
          },
          // Error cb
          (error) => {
            this.uploads[uploadIndex].variant = 'bg-red-400'
            this.uploads[uploadIndex].icon = 'fas fa-times'
            this.uploads[uploadIndex].text_class = 'text-red-400'
            console.log(error)
          },
          // Success cb
          async () => {
            const song = {
              uid: auth.currentUser.uid, // this us user-song 'Secondary Key'
              display_name: auth.currentUser.displayName, // something in the likes of 'author name'
              original_name: task.snapshot.ref.name,
              modified_name: task.snapshot.ref.name,
              genre: '',
              comment_count: 0
            }

            // TODO: DELETE WHEN DONE REFACTORING
            // song.url = await task.snapshot.ref.getDownloadURL()
            // const addedSongDocumentRef = await songsCollection.add(song) // We get a REFERENCE (ie no 'data()' fnc!!!) to the song we just added
            // const addedSongDocumentSnapshot = await addedSongDocumentRef.get()

            song.url = await getDownloadURL(task.snapshot.ref)
            const addedSongDocumentRef = await addDoc(songsCollection, song)
            const addedSongDocumentSnapshot = await getDoc(addedSongDocumentRef)

            this.addSong(addedSongDocumentSnapshot) // we'll push that reference to PARENT component

            //Feedback to user
            this.uploads[uploadIndex].variant = 'bg-green-400'
            this.uploads[uploadIndex].icon = 'fas fa-check'
            this.uploads[uploadIndex].text_class = 'text-green-400'
          }
        )
      })

      // console.log(files)
    },
    cancelUploads() {
      console.log('DBG: cancelUploads() called')
      // Ideal time for canceling events as this method has access to ALL data, refs, etc.
      // It's an ideal place to cleanup stuff, VueJS won't cleanup by itself
      this.uploads.forEach((upload) => {
        upload.task.cancel()
      })
    },
    beforeUnmount() {
      console.log('DBG: beforeUnmount() called')
      // Ideal time for canceling events as this method has access to ALL data, refs, etc.
      // It's an ideal place to cleanup stuff, VueJS won't cleanup by itself
      this.uploads.forEach((upload) => {
        upload.task.cancel()
      })
    }
  }
}
</script>
