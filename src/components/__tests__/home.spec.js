import { shallowMount, flushPromises } from '@vue/test-utils'
import { getDocs, query, orderBy, startAfter, limit, doc, getDoc } from 'firebase/firestore'
// import { describe, it, expect, beforeEach, vi } from 'vitest'
import HomeView from '@/views/HomeView.vue'
import SongItem from '@/components/SongItem.vue'

// Mock Firebase modules (needed by new Module API)
vi.mock('firebase/firestore', () => ({
  getDocs: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  startAfter: vi.fn(),
  limit: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn()
}))

// Mock the Firebase configuration
vi.mock('@/includes/firebase', () => ({
  db: {},
  songsCollection: {}
}))

/**
 * TEST GROUP for HomeView component
 */
describe('HomeView.vue', () => {
  let wrapper
  const songs = [
    { id: '1', modified_name: 'Song 1', other_data: 'data1' },
    { id: '2', modified_name: 'Song 2', other_data: 'data2' },
    { id: '3', modified_name: 'Song 3', other_data: 'data3' }
  ]

  /**
   * HOOK that rund before each 'it'/'test' block
   */
  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks()

    // Mock getDocs to return our test songs
    vi.mocked(getDocs).mockResolvedValue({
      forEach: (callback) =>
        songs.forEach((song) =>
          callback({
            id: song.id,
            data: () => ({ modified_name: song.modified_name, other_data: song.other_data })
          })
        )
    })

    // Mock other Firebase functions
    vi.mocked(query).mockReturnValue({})
    vi.mocked(orderBy).mockReturnValue({})
    vi.mocked(startAfter).mockReturnValue({})
    vi.mocked(limit).mockReturnValue({})
    vi.mocked(doc).mockReturnValue({})
    vi.mocked(getDoc).mockResolvedValue({})
  })

  /**
   * TEST CASE 01: HomeView renders properly
   */
  it('renders list of songs (child components)', async () => {
    wrapper = shallowMount(HomeView, {
      global: {
        mocks: {
          $t: (message) => message
        },
        stubs: ['router-link']
      }
    })

    // Wait for the component to finish updating
    await flushPromises()

    const songItems = wrapper.findAllComponents(SongItem)

    // Test to see if the number of child components is equal to the length of dummy data
    expect(songItems.length).toBe(songs.length)

    // Test to see if songs render in correct order
    songItems.forEach((item, index) => {
      expect(item.props().song).toMatchObject({
        docID: songs[index].id,
        modified_name: songs[index].modified_name,
        other_data: songs[index].other_data
      })
    })
  })

  /**
   * TEST CASE 02: If HomeView comp. loads more songs when scrolled to bottom
   */
  it('loads more songs when scrolled to bottom', async () => {
    wrapper = shallowMount(HomeView, {
      global: {
        mocks: {
          $t: (message) => message
        },
        stubs: ['router-link']
      }
    })

    await flushPromises()

    // Mock window scroll event
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(500)
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(1000)
    Object.defineProperty(document.documentElement, 'scrollTop', { value: 1000 })
    Object.defineProperty(document.documentElement, 'offsetHeight', { value: 1500 })

    await wrapper.vm.handleScroll()
    await flushPromises()

    // Check if getDocs was called twice (initial load + scroll load)
    expect(getDocs).toHaveBeenCalledTimes(2)
  })

  /**
   * TEST CASE 03: If HomeView comp. loads songs in correct order
   */
  it('loads songs in correct order', async () => {
    wrapper = shallowMount(HomeView, {
      global: {
        mocks: {
          $t: (message) => message
        },
        stubs: ['router-link']
      }
    })

    await flushPromises()

    const songItems = wrapper.findAllComponents(SongItem)

    // CHECK 01: Check if the number of child components is equal to the length of dummy data
    expect(songItems).toHaveLength(songs.length)

    // CHECK 02: Check if songs render in correct order
    songItems.forEach((songItem, index) => {
      expect(songItem.props().song).toMatchObject({
        docID: songs[index].id,
        modified_name: songs[index].modified_name,
        other_data: songs[index].other_data
      })
    })
  })
})
