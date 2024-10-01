/**
 * TEST GROUP for E2E Testing
 */
describe('Audio Player', () => {
  /**
   * TEST CASE 01: Visit 'home' page
   */
  it('plays audio', () => {
    cy.visit('/')
    cy.get('.composition-name').first().click() // Click on the first song from the list of songs
    cy.get('#play-btn').click() // Click on the play button so that the audio starts playing
    cy.wait(5000) //wait 5 seconds then pause the audio
    cy.get('#player-play-btn').click() // Click on the pause button so that the audio stops playing
  })
})
