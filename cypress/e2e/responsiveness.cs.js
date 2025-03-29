it('should validate responsiveness', () => {
    // Mobile view
    cy.viewport('iphone-8')
    cy.get('h2').should('have.css', 'font-size', '16px') // text-base
    
    // Desktop view
    cy.viewport('macbook-15')
    cy.get('h2').should('have.css', 'font-size', '24px') // lg:text-2xl
    cy.contains('Drag & Drop files here or').should('be.visible')
  })
