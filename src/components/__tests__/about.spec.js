import AboutView from '@/views/AboutView.vue'
import { shallowMount } from '@vue/test-utils' // Test Utilities package it was installed by CLI plugin

describe('AboutView.vue', () => {
  it('renders inner text properly', () => {
    const wrapper = shallowMount(AboutView) // mount the component with usefull methods for testing

    expect(wrapper.text()).toContain('About') // we expect the text to contain the text 'about'
  })
})
