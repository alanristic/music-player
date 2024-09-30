import { shallowMount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import SongItem from '@/components/SongItem.vue'

/**
 * TEST GROUP for Router Llinks
 */
describe('Router', () => {
  it('renders route link', () => {
    const song = {
      docID: '123'
    }

    const wrapper = shallowMount(SongItem, {
      props: { song },
      global: {
        components: {
          'router-link': RouterLinkStub
        }
        // stubs: ['router-link']
      }
    })

    /**
     * TEST CASE 01: Test if router link is rendered correctly to our SongItem page
     */
    expect(wrapper.findComponent(RouterLinkStub).props().to).toEqual({
      name: 'song',
      params: { id: song.docID }
    })
  })
})
