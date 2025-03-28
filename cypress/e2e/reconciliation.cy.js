// flow of authentication
describe('File Upload & Reconciliation', () => {
    const testFiles = {
      validBank: 'testFiles/test-bank.csv',
      validLedger: 'testFiles/test-ledger.csv',
      invalidFile: 'testFiles/invalid.txt'
    }
  
    beforeEach(() => {
      cy.googleLogin()
      cy.visit('/file-upload')
    })
  
    it('should enable reconcile button only with valid files', () => {
      // Test invalid file types
      cy.get('[data-testid="bank-upload"]').selectFile(`cypress/fixtures/${testFiles.invalidFile}`)
      cy.get('[data-testid="reconcile-button"]').should('be.disabled')
  
      // Test valid files
      cy.get('[data-testid="bank-upload"]').selectFile(`cypress/fixtures/${testFiles.validBank}`)
      cy.get('[data-testid="ledger-upload"]').selectFile(`cypress/fixtures/${testFiles.validLedger}`)
      cy.get('[data-testid="reconcile-button"]').should('be.enabled')
    })
  
    it('should complete reconciliation flow', () => {
      // Upload files
      cy.get('[data-testid="bank-upload"]').selectFile(`cypress/fixtures/${testFiles.validBank}`)
      cy.get('[data-testid="ledger-upload"]').selectFile(`cypress/fixtures/${testFiles.validLedger}`)
      
      // Mock reconciliation API
      cy.intercept('POST', '/api/reconcile', {
        statusCode: 200,
        body: { 
          reconciliationId: '222d684b-a4dc-4afb-bd86-2e75f7b48c3d',
          status: 'pending'
        }
      }).as('reconcileRequest')
  
      cy.get('[data-testid="reconcile-button"]').click()
      cy.wait('@reconcileRequest')
  
      // Verify dashboard update
      cy.url().should('include', '/dashboard')
      cy.get('[data-testid="reconciliation-table"] tr:first-child [data-testid="status"]')
        .should('contain', 'pending')
  
      // Mock completed reconciliation
      cy.intercept('GET', '/api/reconciliations*', {
        statusCode: 200,
        body: [{
          id: '222d684b-a4dc-4afb-bd86-2e75f7b48c3d',
          status: 'completed',
          created_at: new Date().toISOString()
        }]
      }).as('completedReconciliation')
  
      cy.reload()
      cy.get('[data-testid="reconciliation-table"] tr:first-child [data-testid="status"]')
        .should('contain', 'completed')
      
      // Test view results
      cy.get('[data-testid="view-button"]').first().click()
      cy.url().should('include', '/reconciliation/222d684b-a4dc-4afb-bd86-2e75f7b48c3d')
      cy.get('[data-testid="results-table"]').should('be.visible')
    })
  })