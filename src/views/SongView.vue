<template>
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        :style="{ backgroundImage: `url(${headerImage})` }"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
          @click.prevent="newSong(song)"
        >
          <i class="fas" :class="{ 'fa-play': !playing, 'fa-pause': playing }"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <div class="text-3xl font-bold">{{ song.modified_name }}</div>
          <div>{{ song.genre }}</div>
          <!-- TODO: Apply some sort of conversion calculation, not just 'string translation' -->
          <div clas="song-price">{{ $n(1, 'currency', 'jp') }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6" id="comments">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <span class="card-title">{{
            $tc('song.comment_count', song.comment_count, { count: song.comment_count })
          }}</span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <div
            class="text-white text-center font-bold p-4 mb-4"
            v-if="comment_show_alert"
            :class="comment_alert_variant"
          >
            {{ comment_alert_msg }}
          </div>
          <vee-form :validation-schema="commentSchema" @submit="addComment" v-if="userLoggedIn">
            <vee-field
              as="textarea"
              name="comment"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."
            ></vee-field>
            <ErrorMessage class="text-red-600" name="comment"></ErrorMessage>
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600"
              :disabled="comment_in_submission"
            >
              Submit
            </button>
          </vee-form>
          <select
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            v-model="sort"
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto" v-for="comment in sortedComments" :key="comment.docID">
      <li class="p-6 bg-gray-50 border border-gray-200">
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time>{{ comment.datePosted }}</time>
        </div>

        <p>
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </main>
</template>

<script>
import headerImage from '@/assets/img/song-header.png'
import { db, songsCollection, commentsCollection, auth } from '@/includes/firebase'
import { doc, getDoc, addDoc, updateDoc, query, where, getDocs } from 'firebase/firestore'
import { mapState, mapActions } from 'pinia'
import useUserStore from '@/stores/user'
import usePlayerStore from '@/stores/player'

export default {
  name: 'SongView',
  data() {
    return {
      headerImage,
      song: [],
      commentSchema: {
        comment: 'required|min:3'
      },
      comment_in_submission: false,
      comment_show_alert: false,
      comment_alert_variant: 'bg-blue-500',
      comment_alert_msg: 'Please wait! Your comment is being submitted.',
      comments: [],
      sort: '1' // 1 = latest first, 2 = oldets first
    }
  },
  computed: {
    ...mapState(useUserStore, ['userLoggedIn']), // we map STATE from user.js Pinia Store
    ...mapState(usePlayerStore, ['playing']), // we map STATE from player.js Pinia Store
    sortedComments() {
      //NOTE: we shouldn't mutate original array from computed property!!! That's why we're using slice() fnc to make a copy
      return this.comments.slice().sort((a, b) => {
        if (this.sort === '1') {
          return new Date(b.datePosted) - new Date(a.datePosted)
        }
        return new Date(a.datePosted) - new Date(b.datePosted)
      })
    }
  },
  // We'll fetch data from Firebase
  // async created() {
  /**
   * This hook, fetches data before the component is even created (on the page) so that the contect loads WITH the component
   * This is not always required though, as we can fetch data after the component is created (mounted) as well (initial solution
   * using 'created()' lifecycle hook)
   *
   * NOTE: Keep in mind that Navigation Guards are not called on initial page load (when you enter the page by entering the URL in the address bar or by refreshing the page).
   *
   * @param to
   * @param from
   * @param next
   */
  async beforeRouteEnter(to, from, next) {
    // Extract ID from url parameter (aka internal $route.params object)
    // const docSongSnapshot = await songsCollection.doc(this.$route.params.id).get()

    //TODO: DELETE THIS WHEN DONE TESTING
    // const docSongSnapshot = await songsCollection.doc(to.params.id).get()

    const docRef = doc(db, 'songs', to.params.id)
    const docSongSnapshot = await getDoc(docRef)

    next((vm) => {
      // At this point 'vm' is the context component instance and loaded data is available (aka replaces 'this' in the component)

      // Let's check if 'document' is actually in the collection (Firebase doesn't care)
      if (!docSongSnapshot.exists) {
        // IF it doesn't exist, we want to redirect the user away from this page
        vm.$router.push({ name: 'home' }) // Redirect to Home page (based on 'named property' from router)
        return // we don't want fnx to run any further
      }

      const { sort } = vm.$route.query

      vm.sort = sort === '1' || sort === '2' ? sort : '1' //NOTE: this will trigger Watcher on evey page load! Throw an error if value doesn't change OR isn't handled in Watcher(preffered solution)

      vm.song = docSongSnapshot.data()
      vm.getComments()
    })
  },
  methods: {
    ...mapActions(usePlayerStore, ['newSong']), // we map ACTIONS (methods) from player.js Pinia Store so we can use them in this component
    /**
     * Fnc for adding new Comment to DB
     * @param values
     * @param context Methods and Objects bound to our Form, returned by vee-validate (NOTE: we'll only use destructured resetForm fnc from whole 'context')
     */
    async addComment(values, { resetForm }) {
      this.comment_in_submission = true // disable re-submission
      this.comment_show_alert = true // show alert box feedback to the user
      this.comment_alert_variant = 'bg-blue-500'
      this.comment_alert_msg = 'Please wait! Your comment is being submitted.'

      const comment = {
        content: values.comment,
        datePosted: new Date().toString(), //we're converting it to String as Firebase only support that. We'll reconvert this back to Date on retrieval
        sid: this.$route.params.id, // ID of the song
        name: auth.currentUser.displayName, // name of the current user
        uid: auth.currentUser.uid // ID of the current user who's making the comment
      }

      // Add new comment to Firebase DB
      await addDoc(commentsCollection, comment)

      this.song.comment_count += 1 // we're tracking comments count as we go rather than making additional query to DB
      // await songsCollection.doc(this.$route.params.id).update({
      //   comment_count: this.song.comment_count // we'll update just this one property
      // }) //we'll update total number of comments for a song in a DB

      const songDocRef = doc(db, 'songs', this.$route.params.id)
      await updateDoc(songDocRef, {
        comment_count: this.song.comment_count // we'll update just this one property
      })

      // Dynamically update list of comments
      this.getComments()

      // Notify the user
      this.comment_in_submission = false // disable re-submission
      this.comment_alert_variant = 'bg-green-500'
      this.comment_alert_msg = 'Comment added!'

      resetForm() // vee-validate fnc to reset the Form to original state
    },
    /**
     * Fetch comments from DB
     */
    async getComments() {
      const q = query(commentsCollection, where('sid', '==', this.$route.params.id))
      const commentsSnapshots = await getDocs(q)

      this.comments = []

      commentsSnapshots.forEach((doc) => {
        // NOTE: we always set 'Comment' ID explicitly as it isn't available as stored data in document but as document ID per se (ie Firebase thing)
        // in Relational DB, we'd likely push whole thing as 'row ID' is part of retrieved record already
        this.comments.push({
          docID: doc.id,
          ...doc.data()
        })
      })
    }
  },
  watch: {
    sort(newVal) {
      if (newVal === this.$route.query.sort) {
        // IF 'sort' query paramenter didn't change, simply exit
        return
      }
      this.$router.push({
        // it's the same as the to="" property
        query: {
          sort: newVal
        }
      })
    }
  }
}
</script>
