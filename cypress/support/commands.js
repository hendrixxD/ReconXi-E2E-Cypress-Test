// // ***********************************************
// // This example commands.js shows you how to
// // create various custom commands and overwrite
// // existing commands.
// //
// // For more comprehensive examples of custom
// // commands please read more here:
// // https://on.cypress.io/custom-commands
// // ***********************************************
// //
// //
// // -- This is a parent command --
// // Cypress.Commands.add('login', (email, password) => { ... })
// //
// //
// // -- This is a child command --
// // Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
// //
// //
// // -- This is a dual command --
// // Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
// //
// //
// // -- This will overwrite an existing command --
// // Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })




// // cypress/support/commands.js
// Cypress.Commands.add('googleLogin', () => {
//     cy.visit('https://reconxi.com')
    
//     // Handle any auth trigger buttons
//     // cy.get('body').then(($body) => {
//     //   if (!$body.find('[role="dialog"][data-state="open"]').length) {
//     //     // Randomly select an auth trigger button to test all entry points
//     //     const authButtons = [
//     //       '[aria-label="Get Started For Free"]',
//     //       '[aria-label="Open login modal"]',
//     //       '[aria-label="Open signup modal"]'
//     //     ]
//     //     cy.get(Cypress._.sample(authButtons)).click()
//     //   }
//     // })

  
//     // Handle both modal variants
//     cy.get('[role="dialog"][data-state="open"]', { timeout: 40000 })
//       // .should('be.visible')
//       .within(() => {
//         cy.contains('button', 'aria-label="Get Started For Free"').click()
//         // cy.contains('button', "Get Started For Free")
//         //Determine modal type based on contcent
//         // cy.get('body').then(($body) => {
//         //   if ($body.text().includes('Welcome Back!')) {
//         //     // Login modal
//         //     cy.contains('button', 'Login with Google').click()
//         //   } else {
//         //     // Signup modal
//         //     cy.contains('button', 'Continue with Google').click()
//         //   }
//         // })
//       })
  
//     // Google authentication flow
//     cy.origin('https://accounts.google.com', () => {
//       cy.get('input[type="email"]').type(Cypress.env('GOOGLE_USER'))
//       cy.contains('button', 'Next').click()
//       cy.get('input[type="password"]').type(Cypress.env('GOOGLE_PASSWORD'))
//       cy.contains('button', 'Sign in').click()
//     })
//   })
  

// Cypress.Commands.add('loginByGoogleApi', () => {
//   cy.log('Logging in to Google')
//   cy.request({
//     method: 'POST',
//     url: 'https://www.googleapis.com/oauth2/v4/token',
//     body: {
//       // grant_type: 'refresh_token',
//       client_id: Cypress.env('googleClientId'),
//       client_secret: Cypress.env('googleClientSecret'),
//       // refresh_token: Cypress.env('googleRefreshToken'),
//     },
//   }).then(({ body }) => {
//     const { access_token, id_token } = body
//     cy.log(body);

//     cy.request({
//       method: 'POST',
//       // url: 'https://www.googleapis.com/oauth2/v3/userinfo',
//       url: 'https://api-dev.reconxi.com/api/v1/auth/google-login',
//       // headers: { Authorization: `Bearer ${access_token}` },
//       body: {id_token}
//     }).then(({ body }) => {
//       cy.log(body).data().user()
//       // const userItem = {
//       //   token: id_token,
//       //   user: {
//       //     googleId: body.sub,
//       //     email: body.email,
//       //     givenName: body.given_name,
//       //     familyName: body.family_name,
//       //     imageUrl: body.picture,
//       //   },
//       // }
//       window.localStorage.setItem('googleCypress', JSON.stringify(userItem))
//       cy.visit('/dashboard')
//     })
//   })
// })

// cypress/support/commands.js
Cypress.Commands.add('login', (user = {}) => {
  const baseUrl = Cypress.config().baseUrl || 'http://localhost:3000';
  
  // Default test user
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    image: 'https://example.com/avatar.jpg',
    ...user
  };

  // Set the session cookie directly
  cy.setCookie('next-auth.session-token', 'mock-session-token', {
    domain: new URL(baseUrl).hostname,
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite: 'lax'
  });

  // Mock the session response
  cy.intercept('/api/auth/session', {
    body: {
      user: testUser,
      expires: new Date(Date.now() + 86400 * 1000).toISOString()
    }
  }).as('session');

  // Mock the CSRF token if needed
  cy.intercept('/api/auth/csrf', { body: { csrfToken: 'mock-csrf-token' } });
  
  // Mock the providers if needed
  cy.intercept('/api/auth/providers', { body: {} });
  
  // Visit a protected page
  cy.visit('/');
});