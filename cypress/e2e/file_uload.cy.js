// cypress/e2e/file-upload.cy.js
describe('File Upload Page Validation', () => {
    const testFiles = {
      validCSV: 'testFiles/valid.csv',
      invalidTXT: 'testFiles/invalid.txt',
      largeCSV: 'testFiles/large-file.csv' // 3MB file
    }
  
    beforeEach(() => {
      cy.login()
      cy.visit('/file-upload')
    })

    // beforeEach(() => {
    //     // Stub authentication instead of real login
    //     cy.setCookie('auth_token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS1kZXYucmVjb254aS5jb20vYXBpL3YxL2F1dGgvZ29vZ2xlLWxvZ2luIiwiaWF0IjoxNzQzMTc5MTI3LCJleHAiOjE3NDM3ODM5MjcsIm5iZiI6MTc0MzE3OTEyNywianRpIjoiVEZmaWNIUVlnczBzVFI4QSIsInN1YiI6IjQxIiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.WSwvtF5QwJqHgUbDlKVum5B_kANReTcOtMynscEnRyw')
    //     cy.visit('/file-upload')
    //   })

    // context('Unauthenticated user', () => {
    //     it('should redirect to login page', () => {
    //       cy.visit('/file-upload')
    //       cy.url().should('include', 'https://reconxi.com')
    //     })
    // })
  
    it('should validate UI implementation', () => {
      // Verify main page elements
      cy.contains('h2', 'Upload Bank Statement').should('be.visible')
      cy.contains('h2', 'Upload Company Ledger').should('be.visible')
  
      // Bank Statement Section
      cy.get('div[role="presentation"]')
        .should('contain.text', 'Choose file')
        .and('have.css', 'border-color', 'rgba(51, 51, 51, 0.5)');

      
      // Company Ledger Section
      cy.contains('Upload Company Ledger')
        .parent() // gets the parent container
        .find('div[role="presentation"]')
        .should('contain.text', 'Choose file')
        .and('have.css', 'border-color', 'rgba(51, 51, 51, 0.5)');

  
      // Format requirements
      cy.contains('Supported format: CSV').should('have.length', 1)
      cy.contains('Maximum size: 2MB').should('have.length', 1)
    })
  
    it('should handle valid file uploads', () => {
      // Bank Statement upload
      cy.get('[aria-label="Bank upload zone"] input[type="file"]')
        .selectFile(`cypress/fixtures/${testFiles.validCSV}`, { force: true })
      
      // Company Ledger upload
      cy.get('[aria-label="Ledger upload zone"] input[type="file"]')
        .selectFile(`cypress/fixtures/${testFiles.validCSV}`, { force: true })
  
      // Verify upload success
      cy.contains('.text-green-600', 'Upload successful').should('exist')
      cy.get('[data-testid="reconcile-button"]').should('be.enabled')
    })
  
    it('should handle invalid file types', () => {
      cy.get('[aria-label="Bank upload zone"] input[type="file"]')
        .selectFile(`cypress/fixtures/${testFiles.invalidTXT}`, { force: true })
      
      cy.contains('.text-red-600', 'Invalid file type').should('exist')
      cy.get('[data-testid="reconcile-button"]').should('be.disabled')
    })
  
    it('should handle large file uploads', () => {
      cy.get('[aria-label="Bank upload zone"] input[type="file"]')
        .selectFile(`cypress/fixtures/${testFiles.largeCSV}`, { force: true })
      
      cy.contains('.text-red-600', 'File size exceeds 2MB').should('exist')
    })
  
    it('should maintain button state until both files are uploaded', () => {
      // Upload only Bank Statement
      cy.get('[aria-label="Bank upload zone"] input[type="file"]')
        .selectFile(`cypress/fixtures/${testFiles.validCSV}`, { force: true })
      cy.get('[data-testid="reconcile-button"]').should('be.disabled')
  
      // Upload Company Ledger
      cy.get('[aria-label="Ledger upload zone"] input[type="file"]')
        .selectFile(`cypress/fixtures/${testFiles.validCSV}`, { force: true })
      cy.get('[data-testid="reconcile-button"]').should('be.enabled')
    })

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