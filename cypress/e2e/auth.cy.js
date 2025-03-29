describe('Google', function () {
    beforeEach(function () {
    cy.login()
    })
  
    it('shows dashboard', function () {
    //   cy.contains('Get Started').should('be.visible')
    cy.visit('/dashboard')
    })
})
