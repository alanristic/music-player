import SongItem from '@/components/SongItem.vue'
import { shallowMount, RouterLinkStub } from '@vue/test-utils'

describe('SongItem.vue', () => {
  /**
   * We're going to test if SongItem.vue component renders passed 'song' data properly
   * More specifically, we're going to test if 'song name' renders properly from passed 'song' data
   */
  it('renders song display name data properly', () => {
    // mock song data
    const song = {
      display_name: 'Sont title'
    }

    // mock RouterLinkStub with navigate function
    // const mockRouterLinkStub = {
    //   ...RouterLinkStub,
    //   methods: {
    //     navigate: () => {}
    //   }
    // }

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
})
