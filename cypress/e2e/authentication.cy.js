describe('Authentication Flow', () => {
  const authButtons = {
    getStarted: '[aria-label="Get Started For Free"]',
    login: '[aria-label="Open login modal"]',
    signup: '[aria-label="Open signup modal"]'
  }

  beforeEach(() => {
    cy.session('google-auth', () => {
      cy.googleLogin()
    })
  })

  Object.entries(authButtons).forEach(([flowType, selector]) => {
    it(`should login via Google using ${flowType} button`, () => {
      cy.visit('https://reconxi.com')
      
      // Open specific auth modal
      cy.get(selector).click()
      
      // Verify correct modal content
      cy.get('[role="dialog"][data-state="open"]').within(() => {
        if (flowType === 'login') {
          cy.contains('h3', 'Welcome Back!').should('be.visible')
          cy.contains('button', 'Login with Google').should('be.visible')
        } else {
          cy.contains('p', 'Use your Google account to get started quickly').should('be.visible')
          cy.contains('button', 'Continue with Google').should('be.visible')
        }
      })

      // Complete login
      cy.googleLogin()
      cy.url().should('include', '/dashboard')
      cy.get('[aria-label="User menu"]').should('be.visible')
    })
  })

  it('should handle logout successfully', () => {
    cy.visit('/dashboard')
    cy.logout()
    
    // Verify logout feedback
    cy.get('[role="alert"]')
      .should('be.visible')
      .and('contain', 'Log out successfully')
    
    // Verify auth buttons reappear
    cy.get(authButtons.getStarted).should('be.visible')
    cy.get(authButtons.login).should('be.visible')
    cy.get(authButtons.signup).should('be.visible')
  })
})