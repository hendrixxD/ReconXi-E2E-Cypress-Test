it('should handle logout successfully', () => {
    cy.visit('/dashboard')
    cy.logout()
    
    // Verify logout feedback
    cy.get('[role="alert"]')
      .should('be.visible')
      .and('contain', 'Log out successfully')
    
    // Verify auth buttons reappear
    cy.get(authButtons.getStarted).should('be.visible')
    // cy.get(authButtons.login).should('be.visible')
    // cy.get(authButtons.signup).should('be.visible')
  })