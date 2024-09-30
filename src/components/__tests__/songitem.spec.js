import SongItem from '@/components/SongItem.vue'
import { shallowMount, RouterLinkStub } from '@vue/test-utils'

describe('SongItem.vue', () => {
  /**
   * TEST CASE 01: We're going to test if SongItem.vue component renders passed 'song' data properly
   * More specifically, we're going to test if 'song name' renders properly from passed 'song' data
   */
  it('renders song display name data properly', () => {
    // mock song data
    const song = {
      display_name: 'Sont title'
    }

    // Wrapped we're going to use in our tests
    const wrapper = shallowMount(SongItem, {
      props: {
        song
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub // stubbing router-link component
        }
      }
    })

    const compositionAuthor = wrapper.find('.text-gray-500') // Find exact placeholder for our value

    expect(compositionAuthor.text()).toBe(song.display_name)
  })

  /**
   * TEST CASE 02: testing dynamic attribute binding
   *
   * NOTES:
   *  - it only makes sense to DYNAMIC attributes in the component
   */
  it('render sond.docID in ID attribute', () => {
    // mock song data
    const song = {
      docID: 'abc'
    }

    // Wrapped we're going to use in our tests
    const wrapper = shallowMount(SongItem, {
      props: {
        song
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub // stubbing router-link component
        }
      }
    })

    // CHECK 01: Check if ID attribute is properly binded with song.docID in the component
    expect(wrapper.attributes().id).toBe(`song-id-${song.docID}`)

    // CHECK 02: Check if CLASS attribute is properly binded with song.docID in the component
    expect(wrapper.classes()).toContain(`song-id-${song.docID}`)
  })
})
