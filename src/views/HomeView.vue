<template>
  <main>
    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
      <div
        class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        :style="{ backgroundImage: `url(${headerImage})` }"
      ></div>
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5">{{ $t('home.listen') }}</h1>
          <p class="w-full md:w-8/12 mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et dolor mollis,
            congue augue non, venenatis elit. Nunc justo eros, suscipit ac aliquet imperdiet,
            venenatis et sapien. Duis sed magna pulvinar, fringilla lorem eget, ullamcorper urna.
          </p>
        </div>
      </div>

      <img
        class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
        src="@/assets/img/introduction-music.png"
      />
    </section>

    <!-- Main Content (different for every page) -->
    <section class="container mx-auto">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div
          class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
          v-icon-secondary="{ icon: 'headphones-alt', right: true }"
        >
          <span class="card-title">Songs</span>
          <!-- Icon -->
        </div>
        <!-- Playlist -->
        <ol id="playlist">
          <song-item v-for="song in songs" :key="song.docID" :song="song"></song-item>
        </ol>
        <!-- .. end Playlist -->
      </div>
    </section>
  </main>
</template>

<script>
import { getDocs, query, orderBy, startAfter, limit, doc, getDoc } from 'firebase/firestore'
import headerImage from '@/assets/img/header.png'
import { db, songsCollection } from '@/includes/firebase'
import SongItem from '@/components/SongItem.vue'

// Local import of Directivee (vs. Global as with 'icon')
import IconSecondary from '@/directives/icon-secondary'

export default {
  name: 'HomeView',
  data() {
    return {
      headerImage,
      songs: [],
      maxPerPage: 25,
      pendingRequest: false // This will help us keep track of the pending request (we dont' want many at the same time as it can distort resuts!)
    }
  },
  directives: {
    'icon-secondary': IconSecondary // NAME of the directive
  },
  components: {
    SongItem
  },
  // We'll request data when component is CREATED
  async created() {
    this.getSongs()

    window.addEventListener('scroll', this.handleScroll)
  },
  // Helps me prevent 'memory leak' on scroll event
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    // Helps us manage current scroll position on the page
    handleScroll() {
      const { scrollTop, offsetHeight } = document.documentElement
      const { innerHeight } = window
      const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight

      if (bottomOfWindow) {
        console.log('DBG: Bottom of the page')
        this.getSongs()
      }
    },
    // Retrieves resutls
    async getSongs() {
      // IF we have pending request, we DON'T make another
      if (this.pendingRequest) {
        // we simply 'exit' from fnc
        return
      }

      this.pendingRequest = true

      let snapshots
      // IF we have songs in the array, it's safe to assume we already have songs on the page and are requesting NEW/MORE songs
      if (this.songs.length) {
        const lastDocRef = doc(db, 'songs', this.songs[this.songs.length - 1].docID)
        const lastDocSnap = await getDoc(lastDocRef)
        const q = query(
          songsCollection,
          orderBy('modified_name'),
          startAfter(lastDocSnap),
          limit(this.maxPerPage)
        )
        snapshots = await getDocs(q)
      } else {
        // This is the 1st load
        const q = query(songsCollection, orderBy('modified_name'), limit(this.maxPerPage))
        snapshots = await getDocs(q)
      }

      snapshots.forEach((songDocument) => {
        this.songs.push({
          docID: songDocument.id,
          ...songDocument.data()
        })
      })

      // We loaded 'MORE' songs. so we 'release' 'pending request' flag
      this.pendingRequest = false
    }
  }
}
</script>
ß
