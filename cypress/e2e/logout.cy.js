describe('Login and Logout Flow', () => {
    beforeEach(() => {
      cy.login()
    })
  
    it('should handle logout successfully', () => {
      cy.visit('/dashboard')
      
      // Use custom logout command
      cy.logout().then(() => {
        // Verify logout feedback
        cy.get('[role="alert"]', { timeout: 5000 })
          .should('be.visible')
          .and('contain.text', 'Log out successfully')
  
        // Verify auth buttons reappear
        cy.get(authButtons.getStarted).should('be.visible')
        cy.get(authButtons.login).should('be.visible')
        cy.get(authButtons.signup).should('be.visible')
      })
    })
  })