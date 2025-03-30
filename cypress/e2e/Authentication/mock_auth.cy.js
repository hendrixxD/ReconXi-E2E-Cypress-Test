describe('Google', function () {
    beforeEach(function () {
      // cy.task('db:seed')
      // cy.loginByGoogleApi()
     cy.login()
    })
  
    it('shows dashboard', function () {
      // cy.contains('Get Started').should('be.visible')
      cy.visit('/dashboard');
    });
  })
