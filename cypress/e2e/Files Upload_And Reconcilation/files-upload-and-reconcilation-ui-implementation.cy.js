
// cypress/e2e/file-upload.cy.js

/**
 * Validates UI Implementation Of the Authorised Page
 * Validate UI Implementation of Unauthorised page; when user is not logged in.
*/ 

describe('File Upload Authorized Page Validation: validate UI implementation', () => {
  
    beforeEach(() => {
      // cy.login()
      cy.loginEndpoint()
      cy.visit('/file-upload')
    })
  
    it('should validate main page elements', () => {

      cy.contains('h2', 'Upload Bank Statement').should('be.visible')
      cy.contains('h2', 'Upload Company Ledger').should('be.visible')

    })

    it('should validate Bank Statement Section', () => {
    
      cy.get('div[role="presentation"]')
        .should('contain.text', 'Choose file')
        .and('have.css', 'border-color', 'rgba(51, 51, 51, 0.5)');
  
    })
    
    it('should validate Company Ledger Section', () => {

      cy.contains('Upload Company Ledger')
        .parent()
        .find('div[role="presentation"]')
        .should('contain.text', 'Choose file')
        .and('have.css', 'border-color', 'rgba(51, 51, 51, 0.5)');
  
    })

    it('should validate format requirements : CSV', () => {
        
      cy.contains('Supported format: CSV')
        .should('have.length', 1)
      cy.contains('Maximum size: 2MB')
        .should('have.length', 1)

    })

    it('should validate header elements for a logged in user', () => {

      // Validate that the ReconXi logo (a link to "/") is visible and contains the logo SVG and text.
      cy.get('a[href="/"]').should('be.visible').within(() => {
        cy.get('svg').should('be.visible');
        cy.contains('ReconXi').should('be.visible');
      })

    })

    it('should check for profile icon', () => {

      cy.get('[data-slot="dropdown-menu-trigger"]').should('be.visible').first().within(() => {
        // Check either profile image or initial letter is visible
        cy.get('.rounded-full').should('be.visible')
          // If no image exists, verify first letter of username
          .then(($el) => {
            if ($el.find('img').length === 0) {
              // Replace 'T' with first letter of expected username
              cy.wrap($el).should('contain.text', 'L') 
            }
          })
        // Validate dropdown chevron
        cy.get('svg.lucide-chevron-down').should('be.visible')
      })

    })


    it('should check for profile icon with dynamic user initial using session token', () => {
      // Get the session token from the cookie
      cy.getCookie('next-auth.session-token')
        .should('exist')
        .then((cookie) => {
          // Use the cookie value as your token (prepend "Bearer " if needed)
          const sessionToken = cookie.value;
          const authHeader = sessionToken.startsWith('Bearer ')
            ? sessionToken
            : `Bearer ${sessionToken}`;
    
          // Use the session token in the API request to get the user details
          cy.request({
            method: 'GET',
            url: 'https://api-dev.reconxi.com/api/v1/user',
            headers: {
              Authorization: authHeader,
            },
          }).then((response) => {
            const userName = response.body.data.user.name;
            const firstLetter = userName.charAt(0).toUpperCase();
    
            cy.get('[data-slot="dropdown-menu-trigger"]')
              .should('be.visible')
              .first()
              .within(() => {
                cy.get('.rounded-full')
                  .should('be.visible')
                  .then(($el) => {
                    if ($el.find('img').length === 0) {
                      cy.wrap($el).should('contain.text', firstLetter);
                    }
                  });
                cy.get('svg.lucide-chevron-down').should('be.visible');
              });
          });
        });
    });
    
})


describe('File Upload Unauthorized Page Validation: validate UI implementation', () => {

  it('should redirect unauthorized users to the unauthorized page', () => {
    // Attempt to visit the file upload page without logging in
    cy.visit('/file-upload', { failOnStatusCode: false });

    // Verify that the unauthorized page is displayed
    cy.get('.w-fit.mx-auto.my-32.flex.flex-col.items-center.gap-4')
      .should('be.visible')
      .within(() => {
        cy.contains('OOPS!').should('be.visible');
        cy.contains('UNAUTHORIZED').should('be.visible');
        cy.contains('a', 'Go Back').should('be.visible');
      });

    // Verify the presence of the ReconXi logo
    cy.get('a[href="/"]')
      .should('be.visible')
      .first()
      .within(() => {
        cy.get('svg').should('be.visible'); // Assuming the logo is an SVG
        cy.contains('ReconXi').should('be.visible');
      });

    // Verify the presence of the "Login" and "Sign up" buttons
    cy.get('button').contains('Login').should('be.visible');
    cy.get('button').contains('Sign up').should('be.visible');
  });

});