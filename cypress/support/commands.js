// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


// Cypress.Commands.add('googleLogin', () => {
//     cy.visit('https://reconxi.com')
//     cy.get('body').then(($body) => {
//       if ($body.find('[data-testid="auth-modal"]').length === 0) {
//         cy.get('[data-testid="Get Started For Free"]').click()
//       }
//     })
//     cy.origin('https://accounts.google.com', () => {
//       cy.get('input[type="email"]').type(Cypress.env('GOOGLE_USER'))
//       cy.get('button').contains('Next').click()
//       cy.get('input[type="password"]').type(Cypress.env('GOOGLE_PASSWORD'))
//       cy.get('button').contains('Sign in').click()
//     })
//   })
  
//   Cypress.Commands.add('logout', () => {
//     cy.get('[data-testid="user-menu"]').click()
//     cy.get('[data-testid="logout-button"]').click()
//   })


// Updated commands.js with proper selectors
// Cypress.Commands.add('googleLogin', () => {
//     cy.visit('https://reconxi.com')
    
//     // Verify homepage buttons exist using aria-labels
//     cy.get('[aria-label="Get Started For Free"]').should('exist')
//     cy.get('[aria-label="Open login modal"]').should('exist')
//     cy.get('[aria-label="Open signup modal"]').should('exist')
  
//     // Open auth modal if not already open
//     cy.get('body').then(($body) => {
//       if (!$body.find('[aria-label="Auth modal"]').length) {
//         // Using aria-label for Get Started button
//         cy.get('[aria-label="Get Started For Free"]').click()
//       }
//     })
  
//     // Verify modal opened and click Google auth
//     cy.get('[aria-label="Auth modal"]').should('be.visible')
//     cy.contains('button', 'Continue with Google').click()
  
//     // Google auth flow remains the same
//     cy.origin('https://accounts.google.com', () => {
//       cy.get('input[type="email"]').type(Cypress.env('GOOGLE_USER'))
//       cy.contains('button', 'Next').click()
//       cy.get('input[type="password"]').type(Cypress.env('GOOGLE_PASSWORD'))
//       cy.contains('button', 'Sign in').click()
//     })
//   })

// // cypress/support/commands.js
// Cypress.Commands.add('googleLogin', () => {
//     cy.visit('https://reconxi.com')
    
//     // Click any auth trigger button if needed
//     cy.get('body').then(($body) => {
//       if (!$body.find('[role="dialog"]').length) { // Common modal role
//         cy.get('[aria-label="Get Started For Free"]').click()
//       }
//     })
  
//     // Wait for modal animation/display
//     cy.get('[role="dialog"]', { timeout: 10000 })
//       .should('be.visible')
//       .within(() => {
//         cy.contains('button', 'Continue with Google').click()
//       })
  
//     // Google auth flow
//     cy.origin('https://accounts.google.com', () => {
//       cy.get('input[type="email"]').type(Cypress.env('GOOGLE_USER'))
//       cy.contains('button', 'Next').click()
//       cy.get('input[type="password"]').type(Cypress.env('GOOGLE_PASSWORD'))
//       cy.contains('button', 'Sign in').click()
//     })
//   })

// // cypress/support/commands.js
// Cypress.Commands.add('googleLogin', () => {
//     cy.visit('https://reconxi.com')
    
//     // Click any auth trigger button if modal not open
//     cy.get('body').then(($body) => {
//       if (!$body.find('[role="dialog"][data-state="open"]').length) {
//         cy.get('[aria-label="Get Started For Free"]').click()
//       }
//     })
  
//     // Wait for modal animation and verify contents
//     cy.get('[role="dialog"][data-state="open"]', { timeout: 20000 })
//       .should('be.visible')
//       .within(() => {
//         // Verify modal contents
//         cy.contains('h2', 'Welcome Back!').should('be.visible')
//         cy.contains('button', 'Login with Google').click()
//       })
  
//     // Google auth flow
//     cy.origin('https://accounts.google.com', () => {
//       cy.get('input[type="email"]').type(Cypress.env('GOOGLE_USER'))
//       cy.contains('button', 'Next').click()
//       cy.get('input[type="password"]').type(Cypress.env('GOOGLE_PASSWORD'))
//       cy.contains('button', 'Sign in').click()
//     })
//   })

// cypress/support/commands.js
Cypress.Commands.add('googleLogin', () => {
    cy.visit('https://reconxi.com')
    
    // Handle any auth trigger buttons
    cy.get('body').then(($body) => {
      if (!$body.find('[role="dialog"][data-state="open"]').length) {
        // Randomly select an auth trigger button to test all entry points
        const authButtons = [
          '[aria-label="Get Started For Free"]',
          '[aria-label="Open login modal"]',
          '[aria-label="Open signup modal"]'
        ]
        cy.get(Cypress._.sample(authButtons)).click()
      }
    })
  
    // Handle both modal variants
    cy.get('[role="dialog"][data-state="open"]', { timeout: 40000 })
      .should('be.visible')
      .within(() => {
        // Determine modal type based on content
        cy.get('body').then(($body) => {
          if ($body.text().includes('Welcome Back!')) {
            // Login modal
            cy.contains('button', 'Login with Google').click()
          } else {
            // Signup modal
            cy.contains('button', 'Continue with Google').click()
          }
        })
      })
  
    // Google authentication flow
    cy.origin('https://accounts.google.com', () => {
      cy.get('input[type="email"]').type(Cypress.env('GOOGLE_USER'))
      cy.contains('button', 'Next').click()
      cy.get('input[type="password"]').type(Cypress.env('GOOGLE_PASSWORD'))
      cy.contains('button', 'Sign in').click()
    })
  })
  
//   Cypress.Commands.add('logout', () => {
//     cy.get('[aria-label="User menu"]').click()
//     cy.get('[role="menu"]').within(() => {
//       cy.contains('button', 'Log out').click({ force: true })
//     })
//   })