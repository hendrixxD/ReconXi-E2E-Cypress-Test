describe('Homepage Test', () => {
    it('Visits the homepage and checks the title', () => {
      cy.visit('/');
      cy.title().should('include', 'ReconXi - AI-Powered Financial Reconciliation');
    });
  });

  // homepage.cy.js
// describe('Homepage Authentication Flow', () => {
//   it('should verify all auth buttons work correctly', () => {
//     cy.visit('https://reconxi.com')

//     // Test Get Started button
//     cy.get('[aria-label="Get Started For Free"]')
//       .should('be.visible')
//       .and('have.css', 'background-color', 'rgb(41, 123, 101)') // Verify button color
//       .click()
//     cy.get('[aria-label="Auth modal"]').should('be.visible')
//     cy.get('[aria-label="Close modal"]').click()

//     // Test Login button
//     cy.get('[aria-label="Open login modal"]')
//       .should('be.visible')
//       .and('have.css', 'border-color', 'rgb(46, 96, 74)') // Verify border color
//       .click()
//     cy.get('[aria-label="Auth modal"]').should('be.visible')
//     cy.get('[aria-label="Close modal"]').click()

//     // Test Signup button
//     cy.get('[aria-label="Open signup modal"]')
//       .should('be.visible')
//       .and('have.css', 'background-color', 'rgb(46, 96, 74)') // Verify bg color
//       .click()
//     cy.get('[aria-label="Auth modal"]').should('be.visible')
//     cy.get('[aria-label="Close modal"]').click()
//   })
// })