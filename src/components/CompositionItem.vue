<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <!-- Song Name -->
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
      <!-- DELETE Song -->
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click.prevent="deleteSong"
      >
        <i class="fa fa-times"></i>
      </button>
      <!-- EDIT Song -->
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showForm = true"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <!-- EDIT Song FORM -->
    <div v-show="showForm">
      <div
        class="text-white text-center font-bold p-4 mb-4"
        v-if="show_alert"
        :class="alert_variant"
      >
        {{ alert_mesage }}
      </div>
      <vee-form :validation-schema="songSchema" :initial-values="song" @submit="edit">
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field
            name="modified_name"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="modified_name"></ErrorMessage>
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field
            name="genre"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="genre"></ErrorMessage>
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="in_submission"
        >
          Submit
        </button>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
          @click.prevent="showForm = false"
          :disabled="in_submission"
        >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script>
import { doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'
import { db, songsCollection, storage } from '@/includes/firebase'

export default {
  name: 'CompositionItem',
  props: {
    song: {
      type: Object,
      required: true
    },
    updateSong: {
      type: Function,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    removeSong: {
      type: Function,
      required: true
    },
    updateUnsavedFlag: {
      type: Function
    }
  },
  data() {
    return {
      showForm: false,
      songSchema: {
        modified_name: 'required',
        genre: 'alpha_spaces'
      },
      in_submission: false,
      show_alert: false,
      alert_variant: 'bg-blue-500',
      alert_mesage: 'Please wait! Updating song info.'
    }
  },
  methods: {
    // Editing Song Method
    async edit(values) {
      //console.log('DBG: Song edit() was called')
      this.in_submission = true
      this.show_alert = true
      this.alert_variant = 'bg-blue-500'
      this.alert_mesage = 'Please wait! Updating song info.'

      try {
        // EXAMPLE of DEPRACETED Namespaced API update
        // await songsCollection.doc(this.song.docID).update(values.modified_name, values.genre)

        const songDoc = doc(db, 'songs', this.song.docID)
        await updateDoc(songDoc, {
          modified_name: values.modified_name,
          genre: values.genre
        })
      } catch (error) {
        this.in_submission = false
        this.alert_variant = 'bg-red-500'
        this.alert_mesage = 'Something went wrong! Try again later.'
        return
      }

      this.updateSong(this.index, values)
      this.updateUnsavedFlag(false)

      //Song at this point was successfuly updates
      this.in_submission = false //enable back the form for submitting
      this.alert_variant = 'bg-green-500'
      this.alert_mesage = 'Song was succssfuly updated!'
    },
    async deleteSong() {
      // EXAMPLE of DEPRACETED Namespaced API delete
      // const storageRef = storage.ref()
      // const songRef = storageRef.child(`songs/${this.song.original_name}`)

      const storageRef = ref(storage, `songs/${this.song.original_name}`)
      const songDocRef = doc(db, 'songs', this.song.docID)

      try {
        // EXAMPLE of DEPRACETED Namespaced API delete
        // await songRef.delete() // Delete song from Firebase (Object) Storage
        // await songsCollection.doc(this.song.docID).delete() // Delete song from Firebase Database (aka Document Storage)
        // this.removeSong(this.index)

        await deleteObject(storageRef) // Delete song from Firebase Storage
        await deleteDoc(songDocRef) // Delete song from Firestore
        this.removeSong(this.index)
      } catch (error) {
        console.log('DBG: deletion failed')
      }
    }
  }
}
</script>
