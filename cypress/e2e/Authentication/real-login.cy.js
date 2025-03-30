describe('real google authentication', function () {
    before(function () {
      // cy.task('db:seed')
      // cy.loginByGoogleApi()
     cy.loginEndpoint()
    });

    it('shows dashboard', function () {
      // cy.contains('Get Started').should('be.visible')
      cy.visit('/dashboard');
    });
});
