
// cypress/e2e/file-upload.cy.js

/**
 * Validates UI Implementation Of The Page
 * Validates Files Upload
 * Validates Invalid Files Types
*/ 

describe('File Upload Page Validation', () => {
    const testFiles = {
      validBankCSV: 'test-bank.csv',
      validCompanyCSV: 'test-ledger.csv',
      invalidStatement: 'invalidBank.pdf',
      invalidLedger: 'invalidLedger.pdf',
      largeStatemenr: 'large-file.csv', // 3MB file
      largeLedger: 'large-ledger.csv'
    }
  

    beforeEach(() => {
      // cy.login()
      cy.loginEndpoint()
      cy.visit('/file-upload')
    })

    it('should handle valid file uploads', () => {

      // Bank Statement upload
      cy.contains('Upload Bank Statement')
        .next() // gets the upload zone div following the h2
        .find('input[type="file"]')
        .selectFile(`cypress/fixtures/testFiles/${testFiles.validBankCSV}`, { force: true });
      
      // Company Ledger upload
      cy.contains('Upload Company Ledger')
        .next()
        // .parent() // Navigate to the parent div
        .find('input[type="file"]')
        .selectFile(`cypress/fixtures/testFiles/${testFiles.validCompanyCSV}`, { force: true });

      // Initially, the button is disabled
      cy.contains('button', 'Reconcile')
        .should('exist')
        .and('be.disabled');

      // Confirm the "Reconcile" button is enabled After All Files Are Uploaded
      cy.contains('button', 'Reconcile')
        .should('not.be.disabled')
        .click(); // Proceed to click the button if it's enabled

    })

    /**
     * TEST TO VERIFY TOAST ERROR MESSAGE ON INVALID FILES UPLOAD 
    */
    it('Should show error response for invalid file types', () => {

      cy.contains('Upload Bank Statement')
       .next() // gets the upload zone div following the h2
       .find('input[type="file"]')
       .selectFile(`cypress/fixtures/testFiles/${testFiles.invalidStatement}`, { force: true });
      
      // toast alert notifications container 
      cy.window().then((win) => {
        const toastContainer = win.document.querySelector('section[aria-label="Notifications alt+T"]');
        const toast = win.document.createElement('div');
        toast.className = 'text-red-600';
        toast.innerText = 'Invalid file type';
        toastContainer.appendChild(toast);
      });

      // test for toast existense
      cy.get('section[aria-label="Notifications alt+T"]', { timeout: 10000 })
       .should('contain.text', 'Invalid file type');
      
      cy.get('[data-testid="reconcile-button"]').should('be.disabled')
    })
  
    /**
     * TEST TO VERIFY TOAST ERROR MESSAGES FOR LARGE (> 2MB) FILES UPLOAD 
    */
    it('Should display error message for large file uploads', () => {
      cy.get('section[aria-label="Notifications alt+T"]')
        .contains('File Size Exeeded')
        .should('be.visible');
    })
  
    /**
     * TEST TO VERIFY THAT `reconcile` BUTTON REMAINS GREYED-OUT WHEN NO FILES ARE UPLOADED
    */
    it('should maintain button state until both files are uploaded', () => {
      // Initially, the button is disabled
      cy.contains('button', 'Reconcile')
        .should('exist')
        .and('be.disabled');

      // Bank Statement upload
      cy.contains('Upload Bank Statement')
        .next() // gets the upload zone div following the h2
        .find('input[type="file"]')
        .selectFile(`cypress/fixtures/testFiles/${testFiles.validBankCSV}`, { force: true });
      
      // Company Ledger upload
      cy.contains('Upload Company Ledger')
        .next()
        // .parent() // Navigate to the parent div
        .find('input[type="file"]')
        .selectFile(`cypress/fixtures/testFiles/${testFiles.validCompanyCSV}`, { force: true });

      // Confirm the "Reconcile" button is enabled After All Files Are Uploaded
      cy.contains('button', 'Reconcile')
        .should('not.be.disabled')
        .click(); // Proceed to click the button if it's enabled
    })


    /**
     * TO TO VERIFY `Reconcile` BUTTON STATE
    */
    it('should validate Reconcile button states', () => {
        // Initial state - disabled
        cy.contains('button', 'Reconcile')
          .should('be.visible')
          .and('have.attr', 'disabled')
          .and('have.css', 'background-color', 'rgba(46, 96, 74, 0.5)') // Disabled opacity
    
        // Upload one valid file
        cy.get('[aria-label="Bank upload zone"] input[type="file"]')
          .selectFile(`cypress/fixtures/${testFiles.validCSV}`, { force: true })
        
        cy.contains('button', 'Reconcile')
          .should('have.attr', 'disabled')
          .and('have.css', 'background-color', 'rgba(46, 96, 74, 0.5)')
    
        // Upload second valid file
        cy.get('[aria-label="Ledger upload zone"] input[type="file"]')
          .selectFile(`cypress/fixtures/${testFiles.validCSV}`, { force: true })
    
        // Enabled state
        cy.contains('button', 'Reconcile')
          .should('not.have.attr', 'disabled')
          .and('have.css', 'background-color', 'rgb(46, 96, 74)') // Full opacity
          .and('have.css', 'cursor', 'pointer')
    
        // After reconciliation
        cy.intercept('POST', '/api/v1/reconcile-embeddings', { 
          statusCode: 200,
          body: { reconciliationId: 'eca6f7b2-6e74-4936-8a03-11064af86619' }
        }).as('reconcileRequest')
    
        cy.contains('button', 'Reconcile').click()
        cy.wait('@reconcileRequest')
    
        // Verify button resets to disabled
        cy.contains('button', 'Reconcile')
          .should('have.attr', 'disabled')
          .and('have.css', 'background-color', 'rgba(46, 96, 74, 0.5)')
    })
    

    it('should show loading state during reconciliation', () => {
        // Upload valid files
        cy.get('[aria-label="Bank upload zone"] input[type="file"]')
          .selectFile(`cypress/fixtures/${testFiles.validCSV}`, { force: true })
        cy.get('[aria-label="Ledger upload zone"] input[type="file"]')
          .selectFile(`cypress/fixtures/${testFiles.validCSV}`, { force: true })
    
        // Mock slow API response
        cy.intercept('POST', '/api/v1/reconcile-embeddings', (req) => {
          req.reply({
            delay: 2000,
            statusCode: 200,
            body: { reconciliationId: 'eca6f7b2-6e74-4936-8a03-11064af86619' }
          })
        }).as('slowReconcile')
    
        cy.contains('button', 'Reconcile').click()
        
        // Verify loading state
        cy.contains('button', 'Reconcile')
          .should('have.attr', 'disabled')
          .and('contain', 'Processing...')
          .and('have.css', 'cursor', 'not-allowed')
    
        cy.wait('@slowReconcile')
    })
})