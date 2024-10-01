// https://on.cypress.io/api

/**
 * TEST GROUP for E2E Testing
 */
describe('Sanity Test', () => {
  /**
   * TEST CASE 01: Visit 'home' page
   */
  it('visits the app root url', () => {
    cy.visit('/')
    cy.contains('#header a:first-child', 'Music') // Check if the text 'You did it!' is present on the rendered page
  })
})
