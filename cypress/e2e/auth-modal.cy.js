// //  verify modal functionality:
// describe('Auth Modal Validation', () => {
//     it('should open and validate the auth modal', () => {
//       cy.visit('https://reconxi.com')
      
//       // Test all three trigger buttons
//       const buttons = [
//         '[aria-label="Get Started For Free"]',
//         '[aria-label="Open login modal"]',
//         '[aria-label="Open signup modal"]'
//       ]
  
//       buttons.forEach((selector) => {
//         cy.get(selector).click()
        
//         // Verify modal structure
//         cy.get('[role="dialog"][data-state="open"]').within(() => {
//           cy.contains('h2', 'ReconXi').should('be.visible')
//           cy.contains('button', 'Login with Google').should('be.visible')
//           cy.contains("Don't Have an Account?").should('be.visible')
//           cy.get('svg').should('have.length', 3) // X icon and Google icon
//         })
  
//         // Close modal
//         cy.get('[role="dialog"][data-state="open"]').find('button').first().click()
//       })
//     })
//   })

describe('Auth Modal Validation', () => {
    const authModals = {
      // login: {
      //   trigger: '[aria-label="Open login modal"]',
      //   title: 'Welcome Back!',
      //   description: 'Log in to continue optimizing your workflow!',
      //   buttonText: 'Login with Google',
      //   switchText: "Don't Have an Account?"
      // },
      // signup: {
      //   trigger: '[aria-label="Open signup modal"]',
      //   title: 'Use your Google account to get started quickly',
      //   buttonText: 'Continue with Google',
      //   switchText: 'Already Have an Account?'
      // },
      getStarted: {
        trigger: '[aria-label="Get Started For Free"]',
        title: 'Use your Google account to get started quickly',
        buttonText: 'Continue with Google',
        switchText: 'Already Have an Account?'
      }
    }
  
    it('should validate all auth modal variants', () => {
      cy.visit('https://reconxi.com')
  
      Object.entries(authModals).forEach(([flowType, config]) => {
        // Open modal
        cy.get(config.trigger).click()
  
        // Verify modal structure
        cy.get('[role="dialog"][data-state="open"]', { timeout: 90000 }).within(() => {
          // Common elements
          cy.contains('h2', 'ReconXi').should('be.visible')
          cy.get('svg').should('have.length.at.least', 3) // X icon + logo + Google icon
  
          // Flow-specific elements
          if (flowType === 'login') {
            cy.contains('h3', config.title).should('be.visible')
          } else {
            cy.contains('p', config.title).should('be.visible')
          }
          
          cy.contains('button', config.buttonText)
            .should('be.visible')
            // .and('have.attr', 'aria-label', 'Continue with Google')
  
          cy.contains(config.switchText).should('be.visible')
        })
  
        // Close modal
        cy.get('[role="dialog"][data-state="open"]')
         .find('button[aria-label="Close authentication modal"]')
        //  .find('button:has(.lucide-x)')
         .click()
        //   
      })
    })
  })