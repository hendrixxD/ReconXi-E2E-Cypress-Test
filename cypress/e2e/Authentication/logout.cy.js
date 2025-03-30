
/**
 * Validate user logout
 */
// describe('Login and Logout Flow', () => {
//   beforeEach(() => {
//     cy.loginEndpoint()
//     cy.visit('/')
//   })
  
//     it('should handle logout successfully', () => {
//       cy.visit('/dashboard')
      
//       // Use custom logout command
//       cy.logout().then(() => {
//         // Verify logout feedback
//         cy.get('[role="alert"]', { timeout: 5000 })
//           .should('be.visible')
//           .and('contain.text', 'Log out successfully')
  
//         // Verify auth buttons reappear
//         cy.get(authButtons.getStarted).should('be.visible')
//         cy.get(authButtons.login).should('be.visible')
//         cy.get(authButtons.signup).should('be.visible')
//       })
//     })
// })

// describe('Login and Logout Flow', () => {
//   beforeEach(() => {
//     // Log in once using your custom command and visit the homepage.
//     cy.loginEndpoint();
//     cy.visit('/dashboard');
//   });

//   it('should handle logout successfully', () => {
//     // Navigate to a protected page (dashboard) where the user is logged in.
//     //cy.visit('/dashboard');

//     // Use your custom logout command.
//     // (Make sure cy.logout() is implemented to perform the logout action,
//     // for example by clicking on the profile dropdown and then the logout button.)
//     cy.LogOut().then(() => {
//       cy.visit('/');
//       // cy.get('[data-testid="get-started"]').should('be.visible');
//       // cy.get('[aria-label="Open login modal"]').should('be.visible');
//       // cy.get('[aria-label="Open signup modal"]').should('be.visible');
//     });
//   });
// });

// describe('Login and Logout Flow', () => {
//   beforeEach(() => {
//     cy.loginEndpoint();
//     cy.visit('/');
//   });
  
//   it('should handle logout successfully', () => {
//     cy.visit('/dashboard');
    
//     // Perform logout using the custom command
//     cy.logout().then(() => {
//       // Verify that a logout success message is displayed.
//       // (Adjust the selector or text if your app shows a different alert.)
//       cy.get('[role="alert"]', { timeout: 5000 })
//         .should('be.visible')
//         .and('contain.text', 'Log out successfully');

//       // Verify that the authentication buttons reappear
//       // (Replace authButtons.getStarted, authButtons.login, authButtons.signup with your actual selectors.)
//       cy.get('[data-testid="get-started-button"]').should('be.visible');
//       cy.get('[data-testid="login-button"]').should('be.visible');
//       cy.get('[data-testid="signup-button"]').should('be.visible');
//     });
//   });
// });

describe('Login and Logout Flow', () => {
  beforeEach(() => {
    cy.loginEndpoint()
    cy.visit('/dashboard')
  })

  it('should handle logout successfully', () => {
    // Open profile dropdown
    cy.get('[data-slot="dropdown-menu-trigger"]')
      .should('be.visible')
      .click()

    // Wait for dropdown to animate in
    cy.get('[data-slot="dropdown-menu-content"]')
    .should('be.visible')
    .wait(300)
    .within(() => {
      //Use the exact DOM hierarchy from your HTML
      cy.get('button')  // Target the parent button
        .find('div.text-red-600')  // Find the red text container
        .should('contain', 'Log out')
        .click({ force: true })
    })

    // Verify logout confirmation
    cy.get('[role="alert"]', { timeout: 10000 })
      .should('be.visible')
      .and('contain.text', 'Log out successfully')
      
  })
})